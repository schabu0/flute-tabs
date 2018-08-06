function sound( flute ) {
	let d = flute.d;
	if( flute.constructor.name == "Pause" ) {
		_audioTimeout = setTimeout( function(){
			changeActive( _active + 1 );
			sound( _flutes[_active] );// naprawić f5 na f2 lub 2
		}, d * 60000 / _tempoUnit / _tempo );
		return false;
	}
	let n = flute.n;

	_audio = new Audio('mp3/'+n.replace("#","k")+'.mp3');
	_audio.play();
	_audioTimeout = setTimeout( function(){
		_audio.pause();
		if( !changeActive( _active + 1 ) ) changeActive(15);
		sound( _flutes[_active] );
	}, d * 60000 / _tempoUnit / _tempo );
}

function play() {
	if( _isPlayed ) {
		_audio.pause();
		clearTimeout( _audioTimeout );
		_isPlayed = 0;
		document.getElementById('button-play').children[0].classList.add('icon-play');
		document.getElementById('button-play').children[0].classList.remove('icon-pause');
	} else if( _active < _flutes.length ){
		_isPlayed = 1;
		sound( _flutes[ _active ] );
		document.getElementById('button-play').children[0].classList.remove('icon-play');
		document.getElementById('button-play').children[0].classList.add('icon-pause');
	}
}