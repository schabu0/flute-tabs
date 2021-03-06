let _active = 0,
	_actualSong = '',
	_audio,
	_audioTimeout,
	_colorOpen = "#f1f1f1",
	_colorClose = "#30302f",
	_couter = 0,
	_delta,
	_fingerings, // arrays of array of flute fingerings, starts from flute last hole
	_flipped = 0,
	_flute,
	_flutes = [],
	_isPlayed = 0,
	_key,
	_loadingProgress = 0,
	_notes = [],
	_tabs = [],
	_tempo,
	_tempoUnit = 4,
	_track,
	_trans = 0,
	_wav = [];

const _board = document.getElementById('board'), // div element
	_notesStart = 36,
	_notesEnd = 85;

_fingerings = {
	baroque: [
        [1,1,1,1,1,1,1,1],[0.5,1,1,1,1,1,1,1],[0,1,1,1,1,1,1,1],[0,0.5,1,1,1,1,1,1],[0,0,1,1,1,1,1,1],[1,1,0,1,1,1,1,1],[0,1,1,0,1,1,1,1],[0,0,0,0,1,1,1,1],[0,0,1,1,0,1,1,1],[0,0,0,0,0,1,1,1],[0,0,0,1,1,0,1,1],[0,0,0,0,0,0,1,1],[0,0,0,0,0,1,0,1],[0,0,0,0,0,1,1,0],[0,0,0,0,0,1,0,0],[0,1,1,1,1,1,0,0],[0,0,1,1,1,1,1,0.5],[0,1,0,1,1,1,1,0.5],[0,0,1,0,1,1,1,0.5],[0,0,0,0,1,1,1,0.5],[0,0,0,1,0,1,1,0.5],[0,0,0,0,0,1,1,0.75],[0,1,1,1,0,1,1,0.75],[0,0,1,1,0,1,1,0.75],[0,0,1,1,0,0,1,0.75],[1,1,0,1,1,0,1,0.75],[0,1,0,1,1,0,1,0.75],[1,1,0,0,1,0,1,0.75],
    ],
	german: [
        [1,1,1,1,1,1,1,1],[0.5,1,1,1,1,1,1,1],[0,1,1,1,1,1,1,1],[0,0.5,1,1,1,1,1,1],[0,0,1,1,1,1,1,1],[0,0,0,1,1,1,1,1],[1,1,1,0,1,1,1,1],[0,0,0,0,1,1,1,1],[0,0,1,1,0,1,1,1],[0,0,0,0,0,1,1,1],[0,0,0,1,1,0,1,1],[0,0,0,0,0,0,1,1],[0,0,0,0,0,1,0,1],[0,0,0,1,1,0,1,0],[0,0,0,0,0,1,0,0],[0,1,1,1,1,1,0,0],[0,0,1,1,1,1,1,0.5],[0,0,0,1,1,1,1,0.5],[0,0,0,1,0,1,1,0.5],[1,0,1,0,1,1,1,0.5],[0,0,0,0,1,1,1,0.5],[1,1,1,0,1,1,1,0.5],[0,1,1,1,0,1,1,0.75],[0,0,1,1,0,1,1,0.75],[0,0,1,1,0,0,1,0.75],[1,1,0,1,1,0,1,0.75],[0,1,0,1,1,0,1,0.75],[1,1,0,0,1,0,1,0.75],
    ],
}

_key = {
	f: {
		sopranino: 'f5',
		alto: 'f4',
		bass: 'f3',
	},
	c: {
		soprano: 'c5',
		tenor: 'c4',
	}
}

_flute = {
	f: _fingerings.baroque,
	k: _key.c.soprano,
}

_notes = [	'c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b', 
			'c1', 'c1#', 'd1', 'd1#', 'e1', 'f1', 'f1#', 'g1', 'g1#', 'a1', 'a1#', 'b1', 
			'c2', 'c2#', 'd2', 'd2#', 'e2', 'f2', 'f2#', 'g2', 'g2#', 'a2', 'a2#', 'b2', 
			'c3', 'c3#', 'd3', 'd3#', 'e3', 'f3', 'f3#', 'g3', 'g3#', 'a3', 'a3#', 'b3', 
			'c4', 'c4#', 'd4', 'd4#', 'e4', 'f4', 'f4#', 'g4', 'g4#', 'a4', 'a4#', 'b4', 
			'c5', 'c5#', 'd5', 'd5#', 'e5', 'f5', 'f5#', 'g5', 'g5#', 'a5', 'a5#', 'b5', 
			'c6', 'c6#', 'd6', 'd6#', 'e6', 'f6', 'f6#', 'g6', 'g6#', 'a6', 'a6#', 'b6', 
			'c7', 'c7#', 'd7', 'd7#', 'e7', 'f7', 'f7#', 'g7', 'g7#', 'a7', 'a7#', 'b7', ]

function songs( title ) {
	let list = {
		iphone: {
			p: [ 48, 46, 43,  0, 48,  0, 41, 48, 46, 48, 41, 0, 43, 43, 46, 48, 48, 46, 43,  0, 48, 41, 48, 46, 48, 41,  0, 43, 43, 46],
			d: [ 1,  1,  1,  1,  1,  1,  2,  2,  2,  2,  4, 5,  4,  2,  2,  2,  1,  1,  1,  1,  2,  2,  2,  2,  2,  3,  6,  4,  2,  2 ],
			t: 120,
		},

		hobbajt: {
			p: [58, 60, 62, 65, 62, 60, 62, 60, 58,  0, 62, 65, 67, 70, 69, 65, 62, 63, 62, 60, 58, 60, 62, 65, 62, 60, 58, 60, 58,  0, 62, 65, 67, 65, 62, 62, 60, 58, 60, 58, 58,  0,  0, 70, 72, 74,  0,  0, 74,  0, 74, 77, 79, 77, 72, 70, 72,  0, 65, 67, 69,  0, 69, 70,  0, 67, 62, 65, 60,  0,  0, 65, 69, 70, 72, 74,  0, 74,  0,  0, 77, 74, 75, 74, 72,  0, 70, 72, 69, 69, 70, 69, 67, 67,  0, 62, 67, 69, 70, 69, 65, 62, 63, 62, 60, 58, 58, 58,  0, 0 ],
			d: [ 2,  2,  8,  8,  6,  2,  2,  2, 16,  4,  8,  4, 12,  4, 12,  4, 12,  2,  2, 12,  2,  2,  8,  8,  2,  6,  6,  2, 16,  4,  8,  4, 16,  8,  8, 16, 16,  2,  2, 28, 16,  8,  8,  2,  2,  4,  8,  4,  4,  4,  4,  1,  1,  2,  4,  4,  4, 16,  2,  2,  4,  4,  8,  4,  4,  4, 12,  4, 12,  4,  8,  4,  4,  2,  2,  4,  4,  4,  8,  4,  4,  1,  1,  2,  4,  4,  4,  4,  8,  1,  1,  2, 16,  8,  2,  2,  2,  2, 16,  8,  8, 12,  2,  2, 12,  4, 16, 16, 16, 0 ],
			t: 180,
		},

		notes: {
			p: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
			d: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
			t: 90,
		},

		imagine: {
			p: [ 43, 43, 43, 43, 47, 47, 45,  0,  0,  0, 43, 43, 43, 43, 47, 47, 45,  0,  0,  0, 43, 43, 43, 47, 47, 45,  0,  0,  0,  0, 43, 43, 43, 47, 47, 45,  0,  0,  0, 45, 48, 45, 48, 52, 52, 50, 45, 45,  0, 47, 47, 47, 48, 50, 50, 52, 55, 55, 52, 50,  0, 43, 43, 43, 43, 47, 47, 45,  0,  0,  0, 43, 43, 43, 43, 47, 47, 45,  0,  0,  0, 43, 43, 43, 47, 47, 45,  0,  0,  0,  0, 43, 43, 43, 47, 47, 45,  0,  0,  0, 45, 48, 45, 48, 52, 52, 50, 45, 45,  0, 47, 47, 47, 48, 50, 50, 52, 55, 55, 52, 50, 48,  0, 45, 48, 47, 48, 47, 45, 45, 47, 48, 48, 48,  0,  0,  0, 45, 48, 47, 47, 45, 45, 45, 40, 40,  0,  0,  0, 45, 45, 48, 47, 48, 47, 45, 47, 48, 48, 45, 43,  0,  0,  0, 48, 48, 50, 52, 50, 48, 50, 52, 48, 48, 48,  0, 0 ],
			d: [ 2,  2,  2,  4,  2,  2,  4,  4,  8,  2,  2,  2,  2,  2,  4,  2,  4,  4,  8,  4,  2,  2,  4,  2,  2,  4,  4,  8,  4,  3,  1,  1,  3,  2,  2,  4,  4,  8,  2,  2,  2,  2,  4,  2,  2,  2,  2,  4,  8,  2,  6,  4,  2,  2,  8,  2,  2,  2,  1,  1,  2,  2,  2,  2,  4,  2,  2,  4,  4,  8,  2,  2,  2,  2,  2,  4,  2,  4,  4,  8,  4,  2,  2,  4,  2,  2,  4,  4,  8,  4,  3,  1,  1,  3,  2,  2,  4,  4,  8,  2,  2,  2,  2,  4,  2,  2,  2,  2,  4,  8,  2,  6,  4,  2,  2,  8,  2,  2,  2,  1,  1,  4,  1,  1,  2,  2,  1,  1,  2,  1,  1,  2,  2,  4,  8,  4,  1,  1,  2,  2,  1,  1,  1,  1,  2,  4,  4,  8,  3,  1,  2,  2,  2,  1,  1,  2,  2,  2,  1,  1,  4,  8,  4,  2,  1,  1,  2,  1,  1,  2,  2,  1,  1,  2,  4,  8, 0 ],
			t: 90,
		},
	}
	_actualSong = title;

	let withPause = pushPause(list[title]);

	return withPause;

}
