preloadWav();
setSettings();

function main( song ) {

	init( song );
	
	tunePitch();

	fluteNotes();

	createFlutes();

	flipCheck();

	changeActive(_active);
}

main( songs("imagine") );