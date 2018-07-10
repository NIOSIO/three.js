/**
 * @author mrdoob / http://mrdoob.com/
 */

function painterSortStable( a, b ) {

	if ( a.groupOrder !== b.groupOrder ) {

		return a.groupOrder - b.groupOrder;

	} else	if ( a.renderOrder !== b.renderOrder ) {

		return a.renderOrder - b.renderOrder;

	} else if ( a.program && b.program && a.program !== b.program ) {

		return a.program.id - b.program.id;

	} else if ( a.material.id !== b.material.id ) {

		return a.material.id - b.material.id;

	} else if ( a.z !== b.z ) {

		return a.z - b.z;

	} else {

		return a.id - b.id;

	}

}

function reversePainterSortStable( a, b ) {

	if ( a.groupOrder !== b.groupOrder ) {

		return a.groupOrder - b.groupOrder;

	} else	if ( a.renderOrder !== b.renderOrder ) {

		return a.renderOrder - b.renderOrder;

	} if ( a.z !== b.z ) {

		return b.z - a.z;

	} else {

		return a.id - b.id;

	}

}


function painterSortStableSprites( a, b ) {

	if ( a.groupOrder !== b.groupOrder ) {

		return a.groupOrder - b.groupOrder;

	} else	if ( a.renderOrder !== b.renderOrder ) {

	 return a.renderOrder - b.renderOrder;

	} else if ( a.z !== b.z ) {

	 return b.z - a.z;

	} else {

	 return b.id - a.id;

	}

}

function WebGLRenderList() {

	var renderItems = [];
	var renderItemsIndex = 0;

	var opaque = [];
	var transparent = [];
	var sprites = [];

	function init() {

		renderItemsIndex = 0;

		opaque.length = 0;
		transparent.length = 0;
		sprites.length = 0;

	}

	function push( object, geometry, material, z, group ) {

		var renderItem = renderItems[ renderItemsIndex ];

		if ( renderItem === undefined ) {

			renderItem = {
				id: object.id,
				object: object,
				geometry: geometry,
				material: material,
				program: material.program,
				renderOrder: object.renderOrder,
				groupOrder: object.__groupOrder,
				z: z,
				group: group
			};

			renderItems[ renderItemsIndex ] = renderItem;

		} else {

			renderItem.id = object.id;
			renderItem.object = object;
			renderItem.geometry = geometry;
			renderItem.material = material;
			renderItem.program = material.program;
			renderItem.renderOrder = object.renderOrder;
			renderItem.groupOrder = object.__groupOrder;
			renderItem.z = z;
			renderItem.group = group;

		}

		if ( object.isSprite ) {

			sprites.push( renderItem );

		} else {

			( material.transparent === true ? transparent : opaque ).push( renderItem );

		}

		renderItemsIndex ++;

	}

	function sort() {

		if ( opaque.length > 1 ) opaque.sort( painterSortStable );
		if ( transparent.length > 1 ) transparent.sort( reversePainterSortStable );
		if ( sprites.length > 1 ) sprites.sort( painterSortStableSprites );

	}

	return {
		opaque: opaque,
		transparent: transparent,
		sprites: sprites,

		init: init,
		push: push,

		sort: sort
	};

}

function WebGLRenderLists() {

	var lists = {};

	function get( scene, camera ) {

		var hash = scene.id + ',' + camera.id;
		var list = lists[ hash ];

		if ( list === undefined ) {

			// console.log( 'THREE.WebGLRenderLists:', hash );

			list = new WebGLRenderList();
			lists[ hash ] = list;

		}

		return list;

	}

	function dispose() {

		lists = {};

	}

	return {
		get: get,
		dispose: dispose
	};

}


export { WebGLRenderLists };
