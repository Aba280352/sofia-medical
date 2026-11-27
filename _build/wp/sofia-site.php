<?php
/**
 * Plugin Name: Sofia Medical site
 * Description: Page titles, meta descriptions, robots, JSON-LD and the site scripts for the Sofia Medical pages (built from the static design). Design CSS lives in Elementor > Site Settings > Custom CSS.
 * Version: 1.0.0
 * Author: TZD SEO
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

function sofia_seo_data() {
	if ( ! is_singular( 'page' ) ) { return null; }
	$raw = get_post_meta( get_queried_object_id(), '_sofia_seo', true );
	return $raw ? json_decode( $raw, true ) : null;
}

/* title */
add_filter( 'pre_get_document_title', function ( $t ) {
	$d = sofia_seo_data();
	return ( $d && ! empty( $d['title'] ) ) ? $d['title'] : $t;
}, 20 );

/* robots: a page marked noindex stays noindex (the site-wide setting still applies on top) */
add_filter( 'wp_robots', function ( $r ) {
	$d = sofia_seo_data();
	if ( $d && ! empty( $d['robots'] ) && stripos( $d['robots'], 'noindex' ) !== false ) { $r['noindex'] = true; $r['nofollow'] = true; }
	return $r;
} );

/* Google tag (Analytics GA4 G-C8CLPB8JRL, account "סופיה מדיקל" under TZD SEO); not inside the Elementor editor */
add_action( 'wp_head', function () {
	if ( isset( $_GET['elementor-preview'] ) || is_preview() ) { return; }
	echo "<script async src=\"https://www.googletagmanager.com/gtm.js?id=GTM-5M3RW5QN\"></script>\n<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());</script>\n";
}, 1 );

/* sitemap: no author sitemap (it exposes the admin username), and no noindex pages (the en/ru/ar landings) */
add_filter( 'wp_sitemaps_add_provider', function ( $provider, $name ) {
	return 'users' === $name ? false : $provider;
}, 10, 2 );
add_filter( 'wp_sitemaps_posts_query_args', function ( $args, $post_type ) {
	if ( 'page' !== $post_type ) { return $args; }
	$ids = get_posts( [ 'post_type' => 'page', 'post_status' => 'publish', 'fields' => 'ids', 'posts_per_page' => -1,
		'meta_query' => [ [ 'key' => '_sofia_seo', 'value' => 'noindex', 'compare' => 'LIKE' ] ] ] );
	if ( $ids ) { $args['post__not_in'] = array_merge( $args['post__not_in'] ?? [], $ids ); }
	return $args;
}, 10, 2 );
/* author archives are not part of the site: send them home */
add_action( 'template_redirect', function () {
	if ( is_author() ) { wp_safe_redirect( home_url( '/' ), 301 ); exit; }
}, 1 );

/* meta description + JSON-LD */
add_action( 'wp_head', function () {
	$d = sofia_seo_data();
	if ( ! $d ) { return; }
	if ( ! empty( $d['description'] ) ) {
		echo '<meta name="description" content="' . esc_attr( $d['description'] ) . "\">\n";
	}
	foreach ( (array) ( $d['jsonld'] ?? [] ) as $j ) {
		$j = str_replace( 'https://www.sofia-medical.com/assets/', content_url( 'uploads/sofia/' ), $j );
		echo '<script type="application/ld+json">' . $j . "</script>\n"; // built by our own build script
	}
}, 2 );

/* the language landing pages (en/ru/ar) */
add_filter( 'language_attributes', function ( $out ) {
	$d = sofia_seo_data();
	if ( ! $d || empty( $d['landing'] ) ) { return $out; }
	return 'lang="' . esc_attr( $d['lang'] ) . '" dir="' . esc_attr( $d['dir'] ) . '"';
} );

/* site scripts (header, drawer, tabs, carousels, arrangements rotator and strip) */
add_action( 'wp_enqueue_scripts', function () {
	$f = WP_CONTENT_DIR . '/uploads/sofia/site.js';
	if ( file_exists( $f ) ) {
		wp_enqueue_script( 'sofia-site', content_url( 'uploads/sofia/site.js' ), [], (string) filemtime( $f ), true );
	}
} );

/* fonts preload */
add_action( 'wp_head', function () {
	foreach ( [ 'Polin-Regular', 'Polin-Medium' ] as $f ) {
		echo '<link rel="preload" href="' . esc_url( content_url( 'uploads/sofia/fonts/' . $f . '.woff2' ) ) . '" as="font" type="font/woff2" crossorigin>' . "\n";
	}
}, 1 );

/* ---------- exact old URLs ----------
   WordPress cuts Hebrew slugs at 200 encoded characters, so long article/service URLs
   would change. Every page keeps its original path in _sofia_url; requests for that
   path are served by the page, and the page's links use it. */
function sofia_url_map() {
	$map = get_transient( 'sofia_url_map' );
	if ( false === $map ) {
		global $wpdb;
		$map = [];
		foreach ( $wpdb->get_results( "SELECT post_id, meta_value FROM {$wpdb->postmeta} WHERE meta_key = '_sofia_url'" ) as $r ) {
			if ( get_post_status( $r->post_id ) === 'publish' ) { $map[ $r->meta_value ] = (int) $r->post_id; }
		}
		set_transient( 'sofia_url_map', $map, DAY_IN_SECONDS );
	}
	return $map;
}
add_action( 'save_post_page', function () { delete_transient( 'sofia_url_map' ); } );

add_filter( 'request', function ( $vars ) {
	if ( is_admin() ) { return $vars; }
	$path = rawurldecode( (string) parse_url( $_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH ) );
	$home = rtrim( (string) parse_url( home_url( '/' ), PHP_URL_PATH ), '/' );
	if ( $home && strpos( $path, $home ) === 0 ) { $path = substr( $path, strlen( $home ) ); }
	$path = '/' . trim( $path, '/' ) . '/';
	if ( $path === '//' ) { return $vars; }
	$map = sofia_url_map();
	if ( isset( $map[ $path ] ) && $path !== '/' ) {
		return [ 'page_id' => $map[ $path ] ];
	}
	return $vars;
} );

add_filter( 'page_link', function ( $link, $id ) {
	$url = get_post_meta( $id, '_sofia_url', true );
	if ( ! $url || $url === '/' ) { return $link; }
	$enc = implode( '/', array_map( 'rawurlencode', explode( '/', $url ) ) );
	return home_url( $enc );
}, 10, 2 );

add_filter( 'redirect_canonical', function ( $redirect ) {
	if ( is_page() && get_post_meta( get_queried_object_id(), '_sofia_url', true ) ) { return false; }
	return $redirect;
} );

/* The static design has its own base CSS: Hello's reset.css and theme.css only add differences. */
add_filter( 'hello_elementor_enqueue_style', '__return_false' );
add_filter( 'hello_elementor_enqueue_theme_style', '__return_false' );

/* 301: www and the old temporary address -> the main domain (front end only; REST, admin and login are untouched) */
add_action( 'template_redirect', function () {
	$main = parse_url( home_url(), PHP_URL_HOST );
	$host = strtolower( (string) ( $_SERVER['HTTP_HOST'] ?? '' ) );
	if ( ! $main || ! $host || $host === $main || is_preview() ) { return; }
	wp_redirect( 'https://' . $main . ( $_SERVER['REQUEST_URI'] ?? '/' ), 301, 'Sofia Medical' );
	exit;
}, 0 );

/* 301s for removed pages (team members, /promo-4, /logo-footer) live in the Redirection plugin (Tools > Redirection) */

/* language landing pages carry their own header and footer inside the page */
add_filter( 'hello_elementor_header_footer', function ( $show ) {
	$d = sofia_seo_data();
	return ( $d && ! empty( $d['landing'] ) ) ? false : $show;
} );

/* the header template has its own skip link to #main */
add_filter( 'hello_elementor_enable_skip_link', '__return_false' );

/* body classes for the page-specific design CSS (sm-css-<file>), as the static pages loaded them */
add_filter( 'body_class', function ( $classes ) {
	$d = sofia_seo_data();
	foreach ( (array) ( $d['css'] ?? [] ) as $c ) { $classes[] = 'sm-css-' . sanitize_html_class( $c ); }
	return $classes;
} );

/* ---------- element attributes without Elementor Pro ----------
   The pages keep role / aria-* / hidden / dir / data-* (used by site.js) on their elements.
   Elementor core does not print them, and Pro only prints them while its license is active,
   so the site prints them itself: every Elementor document that renders (page, header, footer)
   adds its elements' attributes to a map, and the final HTML gets them on the tag with the
   matching data-interaction-id / data-id. Attributes a tag already has are left as they are,
   so nothing is doubled when Pro prints them too.
   Option sofia_attrs_mode: "on" = every visitor, "test" = only with ?sofia_attr=1, "off" = never. */
$GLOBALS['sofia_attr_map'] = [];

function sofia_attr_collect( $elements ) {
	foreach ( (array) $elements as $el ) {
		if ( ! is_array( $el ) ) { continue; }
		$list = $el['settings']['attributes']['value'] ?? null;
		if ( ! empty( $el['id'] ) && is_array( $list ) ) {
			$pairs = [];
			foreach ( $list as $item ) {
				$k = $item['value']['key']['value'] ?? '';
				$v = $item['value']['value']['value'] ?? '';
				if ( ! is_string( $k ) || ! is_string( $v ) || '' === $v ) { continue; }
				if ( ! preg_match( '/^[a-zA-Z_:][-a-zA-Z0-9_:.]*$/', $k ) || stripos( $k, 'on' ) === 0 ) { continue; }
				$pairs[ strtolower( $k ) ] = html_entity_decode( $v, ENT_QUOTES | ENT_HTML5, 'UTF-8' );
			}
			if ( $pairs ) { $GLOBALS['sofia_attr_map'][ (string) $el['id'] ] = $pairs; }
		}
		if ( ! empty( $el['elements'] ) ) { sofia_attr_collect( $el['elements'] ); }
	}
}

function sofia_attr_inject( $html ) {
	if ( empty( $GLOBALS['sofia_attr_map'] ) || strpos( $html, 'data-' ) === false ) { return $html; }
	$map = $GLOBALS['sofia_attr_map'];
	$out = preg_replace_callback(
		'/<([a-zA-Z][a-zA-Z0-9-]*)(\s(?:[^>]*?\s)?data-(?:interaction-)?id="([0-9a-zA-Z]+)"[^>]*)>/',
		function ( $m ) use ( $map ) {
			if ( ! isset( $map[ $m[3] ] ) ) { return $m[0]; }
			$tag = $m[2];
			preg_match_all( '/\s([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:"[^"]*"|\'[^\']*\'|[^\s>]+))?/', $tag, $names );
			$has = array_flip( array_map( 'strtolower', $names[1] ) );
			$add = '';
			foreach ( $map[ $m[3] ] as $k => $v ) {
				if ( isset( $has[ $k ] ) ) { continue; }
				$add .= ' ' . $k . '="' . esc_attr( $v ) . '"';
			}
			return '' === $add ? $m[0] : '<' . $m[1] . $add . $tag . '>';
		},
		$html
	);
	return null === $out ? $html : $out;
}

function sofia_attr_enabled() {
	$mode = get_option( 'sofia_attrs_mode', 'off' );
	if ( 'on' === $mode ) { return true; }
	return 'test' === $mode && isset( $_GET['sofia_attr'] );
}

add_filter( 'elementor/frontend/builder_content_data', function ( $data ) {
	if ( sofia_attr_enabled() ) { sofia_attr_collect( $data ); }
	return $data;
}, 10, 1 );

add_action( 'template_redirect', function () {
	if ( ! sofia_attr_enabled() ) { return; }
	if ( is_admin() || wp_doing_ajax() || is_feed() || ( defined( 'REST_REQUEST' ) && REST_REQUEST ) ) { return; }
	if ( isset( $_GET['elementor-preview'] ) || is_preview() ) { return; }
	ob_start( 'sofia_attr_inject' );
}, 99 );
