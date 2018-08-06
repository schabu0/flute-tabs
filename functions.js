//change active flute
function changeActive( fluteId ) {
	if ( fluteId > _flutes.length - 1 ) return false;
	_flutes[ _active ].e.classList.remove( 'active' );
	_flutes[ fluteId ].e.classList.add( 'active' );
	_active = fluteId;
	return true;
}

function changeFLuteType( key, fingering ) {
	if ( key ) _flute.k = key;
	if ( fingering ) _flute.f = fingering;
}

function clearBoard() {
	while ( _board.firstChild ) {
		_board.removeChild( _board.firstChild );
	}

	let first = function() {
		_board.removeChild( _board.firstChild );

		for( let i = 0; i < _flutes.length - 2; i++ ) {
			_flutes[i] = _flutes[i+1];
		}
	}

	_flutes = [];
	_tabs = [];
	_track = null;
	_couter = 0;
	_loadingProgress = 0;
}

function closeSettings() {
	if ( $( { class: "open-settings" } )[ 0 ] )
		$( { class: "open-settings" } )[ 0 ].classList.remove( 'open-settings' );
	if ( document.querySelector( ".close-button.visible" ) )
		document.querySelector( ".close-button.visible" ).classList.remove( 'visible' );
}

function colors( status ) {
	if ( status == 1 || status == 'close' ) return _colorClose;
	if ( status == 0 || status == 'open' ) return _colorOpen;
	if ( status == 2 || status == 'half' ) return gradient( 2 );
	if ( status == 4 || status == 'open' ) return gradient( 4 );

}

//for each note in _track create flute/pause object in _flutes
function createFlutes() {
	for ( let i = 0; i < _track.p.length; i++ ) {
		let pitch = _track.p[ i ];
		if ( isNaN( pitch ) ) {
			_flutes[ i ] = new Pause( _track.d[ i ] );
		} else {
			console.log(pitch);
			_flutes[ i ] = new Flute( pitch, _track.d[ i ], _tabs[ pitch ].f, _tabs[ pitch ].n );
		}
	}


}

function expandCloseButton( left ) {
	let elem = $( { id: "close-button" } );
	elem.children[ 0 ].style.marginLeft = left + "px";
	elem.classList.add( 'visible' );
}

function flipCheck() {
	if ( _flipped && !document.querySelector( '.flute.flip' ) ) {
		flipHoles();
		_flipped = 1;
	}
}

//flip flute on board horizontally
function flipHoles() {
	if ( document.querySelector( '.flute.flip' ) ) {
		_flutes.forEach( e => {
			e.e.classList.remove( 'flip' );
		} );

		_flipped = _flipped == 0 ? 1 : 0;
		return false;
	}
	_flutes.forEach( e => {
		e.e.classList.add( 'flip' );
	} );

	_flipped = _flipped == 0 ? 1 : 0;
}

// create _tabs array, based on the selection of the flute in the _flute variable, append to each pitch appropriate fingerings
function fluteNotes() {
	let keyIndex = _notes.findIndex( e => {
		return e == _flute.k;
	} );

	_flute.f.forEach( e => {
		_tabs.push( {
			n: _notes[ keyIndex ],
			f: e,
		} );
		keyIndex++;
	} );
}

// return array's max value
function getMaxOfArray( numArray ) {
	return Math.max.apply( null, numArray );
}

//initiate some variables
function init( song ) {
	_track = [];
	_track = song;
	document.getElementById( 'tempo' ).value = _track.t;
	_tempo = _track.t;
}

function gradient( part ) {
	if ( part == 2 ) return "linear-gradient(to right, " + _colorOpen + " 50%," + _colorClose + " 50%)";
	if ( part == 4 ) return "linear-gradient(to right, " + _colorOpen + " 75%," + _colorClose + " 25%)";
}

function preloadWav() {
	for ( let i = _notesStart; i < _notesEnd; i++ ) load( _notes[ i ].replace( "#", "k" ), );

	function load( name, index ) {
		_wav[ index ] = new Audio( 'mp3/' + name + '.mp3' );
		_wav[ index ].onloadeddata = function() {
			_loadingProgress += ( 100 - _loadingProgress ) / 15;
		}
	}
}

// set flute choice settings, add proper key and names on click
function prepareFluteSettings() {
	for ( fingering in _fingerings ) {

	}

	for ( let notes in _key ) {
		if ( !$( { id: 'category-' + notes } ) ) createElmts( notes );
		else {
			for ( let types in _key[ notes ] ) {
				if ( !$( { id: 'option-' + notes + '-' + types } ) ) {
					let n = createElement( 'div', $( { id: 'category-wide-' + notes } ), name, 'option', 'option-' + notes + '-' + types );
				}
			}
		}
	}

	function createElmts( value ) {
		let e = createElement( 'div', document.getElementById( 'settings-flute-choice' ), null, 'category', 'category-' + value );

		let f = createElement( 'div', e, null, 'category-narrow' );

		let s = createElement( 'span', f, value );

		let g = createElement( 'div', e, null, 'category-wide', 'category-wide-' + value );

		for ( let name in _key[ value ] ) {
			let h = createElement( 'div', g, name, [ 'option', 'button' ], 'option-' + value + '-' + name );
			h.addEventListener( 'click', function( e ) {
				closeSettings();
				let idArray = this.id.split( "-" );
				changeFLuteType( _key[ idArray[ 1 ] ][ idArray[ 2 ] ] );
				reloadFlutes();
			} );
		}
	}
}

function pushPause( arr ) {
	arr.p.push(0);
	arr.d.push(1);
	return arr;
}

function reloadFlutes() {
	clearBoard();
	main( songs( _actualSong ) );
}

// add event listener to all settings buttons
function setSettings() {
	let colorOpenInput = $( { id: "open-hole-color" } );
	let colorCloseInput = $( { id: "close-hole-color" } );

	colorOpenInput.value = _colorOpen;
	colorCloseInput.value = _colorClose;
	$( { id: "open-color-display" } ).style.backgroundColor = _colorOpen;
	$( { id: "open-color-display" } ).style.borderColor = shadeColor( _colorOpen, -16.18 );
	$( { id: "close-color-display" } ).style.backgroundColor = _colorClose;
	$( { id: "close-color-display" } ).style.borderColor = shadeColor( _colorClose, -16.18 );
}

function shadeColor( color, percent ) { // deprecated. See below.
	var num = parseInt( color.slice( 1 ), 16 ),
		amt = Math.round( 2.55 * percent ),
		R = ( num >> 16 ) + amt,
		G = ( num >> 8 & 0x00FF ) + amt,
		B = ( num & 0x0000FF ) + amt;
	return "#" + ( 0x1000000 + ( R < 255 ? R < 1 ? 0 : R : 255 ) * 0x10000 + ( G < 255 ? G < 1 ? 0 : G : 255 ) * 0x100 + ( B < 255 ? B < 1 ? 0 : B : 255 ) ).toString( 16 ).slice( 1 );
}

// return min and max pitch from song/track
function trackRange() {
	let trackFilter = 0;
	if ( _track.p.findIndex( e => { return e == "p"; } ) != -1 ) trackFilter = "p";
	console.log(trackFilter);
	return {
		min: Math.min.apply( null, _track.p.filter( e => {
			return e != trackFilter;
		} ) ),
		max: Math.max.apply( null, _track.p.filter( e => {
			return e != trackFilter;
		} ) ),
	};
}

//based on trackRange() assigns to the lowest pitch value 0 and further respectively 1, 2, 3... 
function tunePitch() {
	let deltaMin = trackRange().min;
	let deltaMax = trackRange().max;
	_delta = deltaMin - _trans <= deltaMax ? deltaMin - _trans : deltaMax;
	//deltaLower = delta - (delta % 12);
	//delta = (delta - deltaLower) >= 7 ? deltaLower + 7 : (delta - deltaLower) >= 5 ? deltaLower + 5 : deltaLower;
	for ( let i = 0; i < _track.p.length; i++ ) {
		_track.p[ i ] = _track.p[ i ] == 0 ? "p" : _track.p[ i ] - _delta;
	}

	//set transpose's up arrow disable if track range >= flute range
	if( trackRange().max == _flute.f.length - 1 ) {
		$({id: "button-tr-down"}).children[0].style.backgroundColor = "#808080";
	}
}