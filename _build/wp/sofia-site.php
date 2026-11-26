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

/* 301s: team members removed from the new site -> the team page */
add_action( 'template_redirect', function () {
	if ( ! is_404() ) { return; }
	$path = '/' . trim( rawurldecode( (string) parse_url( $_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH ) ), '/' );
	$map = [
		'/הצוות/אפנאן-מוהנא' => '/הצוות/',
		'/הצוות/ד-ר-מוסטפא-ח-לאילה' => '/הצוות/',
		'/הצוות/d7-93-d7-a8-d7-a1-d7-a8-d7-92-d7-99-d7-99-d7-a7-d7-95-d7-98-d7-99-d7-a7-d7-95-d7-91' => '/הצוות/',
	];
	if ( isset( $map[ $path ] ) ) {
		wp_safe_redirect( home_url( implode( '/', array_map( 'rawurlencode', explode( '/', $map[ $path ] ) ) ) ), 301 );
		exit;
	}
} );

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
