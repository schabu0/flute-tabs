window.addEventListener( 'keyup', function(e){
	if( (e.keyCode == 37 || e.keyCode == 81 ) && _active ) {
		changeActive( _active - 1 );
	} else if( ( e.keyCode == 39 || e.keyCode == 69 ) && _active < _flutes.length ) {
		changeActive( Number(_active + 1) );
	} else if( e.keyCode == 87 && _active != _flutes.length ) {
		play( _flutes[ _active ] );
	}
});

document.getElementById('button-tr-up').addEventListener( 'click', function() {
	if( trackRange().max < _flute.f.length - 1 ) {
		_trans++;
		reloadFlutes();
	}

	if( trackRange().max == _flute.f.length - 1 ) {
		this.children[0].style.backgroundColor = "#808080";
	}

	if( trackRange().min > 0 ) {
		$({id: "button-tr-down"}).children[0].style.backgroundColor = "#534B4B";
	}
});

document.getElementById('button-tr-down').addEventListener( 'click', function() {
	if( trackRange().min > 0 ) {
		_trans--;
		reloadFlutes();
	}

	if( trackRange().min == 0 ) {
		this.children[0].style.backgroundColor = "#808080";
	}

	if( trackRange().max < _flute.f.length - 1 ) {
		$({id: "button-tr-up"}).children[0].style.backgroundColor = "#534B4B";
	}
});

$( { id: "open-hole-color" } ).addEventListener( "change", function() {
	_colorOpen = $( { id: "open-hole-color" } ).value;
	$( { id: "open-color-display" } ).style.backgroundColor = _colorOpen;
	$( { id: "open-color-display" } ).style.borderColor = shadeColor( _colorOpen, -23 );
	reloadFlutes();
} );
$( { id: "close-hole-color" } ).addEventListener( "change", function() {
	_colorClose = $( { id: "close-hole-color" } ).value;
	$( { id: "close-color-display" } ).style.backgroundColor = _colorClose;
	$( { id: "close-color-display" } ).style.borderColor = shadeColor( _colorClose, -23 );
	reloadFlutes();
} );

//open settings window on click
let settingsButton = document.getElementsByClassName( 'settings-button' );
for ( let i = 0; i < settingsButton.length; i++ ) {
	settingsButton[ i ].addEventListener( 'click', function( e ) {
		let settings = this.nextElementSibling;
		let leftOffset = Math.round( this.getBoundingClientRect().left );

		if ( settings.id == "settings-flute-choice" ) prepareFluteSettings();

		if ( settings.classList.contains( 'settings-sm' ) ) {
			settings.style.left = leftOffset - 13 + 'px';
		} else if ( settings.classList.contains( 'settings-lg' ) ) {
			let lft = leftOffset - 143 < 0 ? 0 : leftOffset - 143;
			settings.style.left = lft + 'px';
		}

		if ( settings.classList.contains( 'open-settings' ) ) {
			settings.classList.remove( 'open-settings' );
		} else {
			if ( document.getElementsByClassName( 'open-settings' )[ 0 ] ) {
				document.getElementsByClassName( 'open-settings' )[ 0 ].classList.remove( 'open-settings' );
			}

			settings.classList.add( 'open-settings' );
			expandCloseButton( leftOffset );
		}
	} );
}

$({id: "close-button"}).addEventListener( 'click', function() {
	closeSettings();
	$({id: "close-button"}).classList.remove( 'visible' );
});

document.getElementById('button-revert').addEventListener( 'click', function() {
	flipHoles();
});

document.getElementById('button-to-start').addEventListener( 'click', function() {
	changeActive( 0 );
});

document.getElementById('button-prev').addEventListener( 'click', function() {
	changeActive( _active - 1 );
});

document.getElementById('button-play').addEventListener( 'click', function() {
	play( _flutes[ _active ] );
});

document.getElementById('button-next').addEventListener( 'click', function() {
	changeActive( _active + 1 );
});

document.getElementById('button-to-end').addEventListener( 'click', function() {
	changeActive( _flutes.length - 1 );
});

document.getElementById('tempo').addEventListener( 'input', function(e) {
	_tempo = this.value;
});
