<?php
/**
 * Sofia Medical: one-off importer for the converted static site (Novamira sandbox).
 * Defines functions only; they are called step by step from execute-php.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

function sofia_imp_dir() { return WP_CONTENT_DIR . '/uploads/sofia-import'; }
function sofia_json( $rel ) { return json_decode( file_get_contents( sofia_imp_dir() . '/import/' . $rel ), true ); }

/* 1. unzip: sofia/* -> uploads/sofia, import/* -> uploads/sofia-import/import */
function sofia_imp_unzip() {
	$zip = new ZipArchive();
	if ( true !== $zip->open( sofia_imp_dir() . '/wpimport.zip' ) ) { return 'zip open failed'; }
	$up = WP_CONTENT_DIR . '/uploads';
	$n = 0;
	for ( $i = 0; $i < $zip->numFiles; $i++ ) {
		$name = $zip->getNameIndex( $i );
		if ( substr( $name, -1 ) === '/' ) { continue; }
		$dest = strpos( $name, 'sofia/' ) === 0 ? $up . '/' . $name : sofia_imp_dir() . '/' . $name;
		wp_mkdir_p( dirname( $dest ) );
		file_put_contents( $dest, $zip->getFromIndex( $i ) );
		$n++;
	}
	$zip->close();
	return $n;
}

/* 2. media: attachments for every referenced file, map key -> id */
function sofia_imp_media( $limit = 40 ) {
	require_once ABSPATH . 'wp-admin/includes/image.php';
	$map = get_option( 'sofia_media_map', [] );
	$done = 0;
	foreach ( sofia_json( 'media.json' ) as $m ) {
		if ( isset( $map[ $m['key'] ] ) && get_post( $map[ $m['key'] ] ) ) { continue; }
		if ( $done >= $limit ) { break; }
		$k = $m['key'];
		if ( strpos( $k, 'icon/' ) === 0 ) { $rel = 'icons/' . substr( $k, 5 ) . '.svg'; }
		elseif ( strpos( $k, 'svgx/' ) === 0 ) { $rel = $k . '.svg'; }
		else { $rel = $k; }
		$file = WP_CONTENT_DIR . '/uploads/sofia/' . $rel;
		if ( ! file_exists( $file ) ) { $map[ $k ] = 0; continue; }
		$type = wp_check_filetype( $file );
		$mime = $type['type'] ?: ( substr( $file, -4 ) === '.svg' ? 'image/svg+xml' : 'application/octet-stream' );
		$id = wp_insert_attachment( [
			'post_mime_type' => $mime,
			'post_title'     => preg_replace( '/\.[^.]+$/', '', basename( $file ) ),
			'post_status'    => 'inherit',
			'guid'           => content_url( 'uploads/sofia/' . $rel ),
		], $file );
		if ( is_wp_error( $id ) || ! $id ) { $map[ $k ] = 0; continue; }
		update_attached_file( $id, 'sofia/' . $rel );
		update_post_meta( $id, '_sofia_key', $k );
		if ( $m['alt'] ) { update_post_meta( $id, '_wp_attachment_image_alt', $m['alt'] ); }
		if ( strpos( $mime, 'image/' ) === 0 && $mime !== 'image/svg+xml' ) {
			wp_update_attachment_metadata( $id, wp_generate_attachment_metadata( $id, $file ) );
		}
		$map[ $k ] = $id;
		$done++;
	}
	update_option( 'sofia_media_map', $map, false );
	$left = count( array_filter( sofia_json( 'media.json' ), function ( $m ) use ( $map ) { return ! isset( $map[ $m['key'] ] ); } ) );
	return [ 'done' => $done, 'left' => $left, 'total' => count( $map ) ];
}

/* 3. global classes: one per static class name; reuse an existing class with the same label */
function sofia_imp_classes() {
	$repo = \Elementor\Modules\GlobalClasses\Global_Classes_Repository::make();
	$all = $repo->all( true )->get();
	$items = $all['items'];
	$order = $all['order'];
	$by_label = [];
	foreach ( $items as $id => $it ) { $by_label[ $it['label'] ] = $id; }
	$remap = [];
	foreach ( sofia_json( 'classes.json' ) as $c ) {
		if ( isset( $by_label[ $c['label'] ] ) ) {
			$eid = $by_label[ $c['label'] ];
			if ( $eid !== $c['id'] ) { $remap[ $c['id'] ] = $eid; }
			$items[ $eid ]['variants'] = []; // styles come from the site CSS
			continue;
		}
		$items[ $c['id'] ] = [ 'id' => $c['id'], 'label' => $c['label'], 'type' => 'class', 'variants' => [] ];
		$order[] = $c['id'];
	}
	$repo->put( $items, $order );
	update_option( 'sofia_class_remap', $remap, false );
	return [ 'count' => count( $items ), 'remap' => $remap ];
}

/* tree helpers: media keys -> attachment ids, remapped class ids */
function sofia_fix_tree( $node ) {
	static $map = null, $remap = null;
	if ( $map === null ) { $map = get_option( 'sofia_media_map', [] ); $remap = get_option( 'sofia_class_remap', [] ); }
	if ( is_array( $node ) ) {
		if ( isset( $node['$$type'] ) && $node['$$type'] === 'classes' && is_array( $node['value'] ) ) {
			$node['value'] = array_map( function ( $id ) use ( $remap ) { return $remap[ $id ] ?? $id; }, $node['value'] );
			return $node;
		}
		if ( isset( $node['$$type'], $node['value'] ) && in_array( $node['$$type'], [ 'image-attachment-id', 'video-attachment-id' ], true ) && is_string( $node['value'] ) && strpos( $node['value'], 'M:' ) === 0 ) {
			$node['value'] = (int) ( $map[ substr( $node['value'], 2 ) ] ?? 0 );
			return $node;
		}
		foreach ( $node as $k => $v ) { $node[ $k ] = sofia_fix_tree( $v ); }
	}
	return $node;
}
function sofia_save_doc( $post_id, $tree, $settings = [] ) {
	update_post_meta( $post_id, '_elementor_edit_mode', 'builder' );
	$doc = \Elementor\Plugin::$instance->documents->get( $post_id, false );
	return $doc->save( [ 'elements' => sofia_fix_tree( $tree ), 'settings' => $settings ] );
}

/* 4. pages: one WordPress page per static URL, same hierarchy */
function sofia_imp_pages( $offset = 0, $limit = 10 ) {
	$man = sofia_json( 'manifest.json' );
	usort( $man, function ( $a, $b ) { return substr_count( $a['url'], '/' ) <=> substr_count( $b['url'], '/' ) ?: strcmp( $a['url'], $b['url'] ); } );
	$ids = get_option( 'sofia_page_ids', [] );
	$out = [];
	foreach ( array_slice( $man, $offset, $limit ) as $p ) {
		$url = $p['url'];
		$segs = array_values( array_filter( explode( '/', $url ) ) );
		$slug = $url === '/' ? 'home' : end( $segs );
		$parent_url = $url === '/' || count( $segs ) < 2 ? '/' : '/' . implode( '/', array_slice( $segs, 0, -1 ) ) . '/';
		$parent = ( $parent_url !== '/' && isset( $ids[ $parent_url ] ) ) ? $ids[ $parent_url ] : 0;
		$title = $p['h1'] ?: preg_replace( '/\s*\|.*$/', '', $p['title'] );
		if ( $url === '/' ) { $title = 'בית'; }
		$data = [ 'post_type' => 'page', 'post_status' => 'publish', 'post_title' => $title, 'post_name' => $slug, 'post_parent' => $parent ];
		if ( isset( $ids[ $url ] ) && get_post( $ids[ $url ] ) ) { $data['ID'] = $ids[ $url ]; $id = wp_update_post( $data ); }
		else { $id = wp_insert_post( $data ); }
		$ids[ $url ] = $id;
		update_post_meta( $id, '_wp_page_template', 'elementor_header_footer' );
		update_post_meta( $id, '_sofia_url', $url );
		update_post_meta( $id, '_sofia_seo', wp_slash( wp_json_encode( [ 'title' => $p['title'], 'description' => $p['description'], 'robots' => $p['robots'], 'jsonld' => $p['jsonld'], 'lang' => $p['lang'], 'dir' => $p['dir'], 'landing' => $p['landing'], 'css' => $p['css'] ?? [] ] ) ) );
		$tree = sofia_json( 'pages/' . $p['slug'] . '.json' );
		if ( $p['landing'] ) { // own header + footer inside the page
			$tree = array_merge( $p['header'] ?: [], $tree, $p['footer'] ?: [] );
		}
		$ok = sofia_save_doc( $id, $tree, [ 'hide_title' => 'yes' ] );
		$out[] = $url . ' => ' . $id . ( $ok ? '' : ' SAVE FAILED' ) . ' ' . get_permalink( $id );
	}
	update_option( 'sofia_page_ids', $ids, false );
	if ( isset( $ids['/'] ) ) { update_option( 'show_on_front', 'page' ); update_option( 'page_on_front', $ids['/'] ); }
	return [ 'count' => count( $man ), 'out' => $out ];
}

/* 5. header (existing template 43) and footer template */
function sofia_imp_theme() {
	$res = [];
	if ( ! get_post_meta( 43, '_sofia_old_header', true ) ) {
		update_post_meta( 43, '_sofia_old_header', wp_slash( get_post_meta( 43, '_elementor_data', true ) ) );
		update_post_meta( 43, '_sofia_old_header_settings', get_post_meta( 43, '_elementor_page_settings', true ) );
	}
	$res['header'] = sofia_save_doc( 43, sofia_json( 'header.json' ), [ 'custom_css' => '' ] );
	$fid = (int) get_option( 'sofia_footer_id' );
	if ( ! $fid || ! get_post( $fid ) ) {
		$fid = wp_insert_post( [ 'post_type' => 'elementor_library', 'post_status' => 'publish', 'post_title' => 'פוטר האתר' ] );
		update_post_meta( $fid, '_elementor_template_type', 'footer' );
		wp_set_object_terms( $fid, 'footer', 'elementor_library_type' );
		update_option( 'sofia_footer_id', $fid, false );
	}
	$res['footer'] = sofia_save_doc( $fid, sofia_json( 'footer.json' ) );
	$ids = get_option( 'sofia_page_ids', [] );
	$ex = [];
	foreach ( sofia_json( 'manifest.json' ) as $p ) { if ( $p['landing'] && isset( $ids[ $p['url'] ] ) ) { $ex[] = 'exclude/singular/page/' . $ids[ $p['url'] ]; } }
	$cm = \ElementorPro\Modules\ThemeBuilder\Module::instance()->get_conditions_manager();
	update_post_meta( 43, '_elementor_conditions', array_merge( [ 'include/general' ], $ex ) );
	update_post_meta( $fid, '_elementor_conditions', array_merge( [ 'include/general' ], $ex ) );
	$cm->get_cache()->regenerate();
	$res['footer_id'] = $fid;
	return $res;
}

/* 6. site CSS into the kit (Site Settings > Custom CSS) */
function sofia_imp_css() {
	$css = file_get_contents( sofia_imp_dir() . '/import/site.css' );
	$kit = \Elementor\Plugin::$instance->kits_manager->get_active_kit();
	$settings = $kit->get_settings();
	$settings['custom_css'] = $css;
	$kit->save( [ 'settings' => $settings ] );
	\Elementor\Plugin::$instance->files_manager->clear_cache();
	return strlen( $css );
}

/* refresh: unpack a new import.tar (converter output) over import/ */
function sofia_imp_refresh() {
	$d = sofia_imp_dir();
	$p = new PharData( $d . '/import.tar' );
	$p->extractTo( $d . '/import', null, true );
	copy( $d . '/import/site.js', WP_CONTENT_DIR . '/uploads/sofia/site.js' );
	return count( glob( $d . '/import/pages/*.json' ) );
}
