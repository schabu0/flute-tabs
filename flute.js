function Flute( pitch, duration, fingering, note ) {
	this.p = pitch;
	this.d = duration;
	this.f = fingering;
	this.n = note;
	this.id = _couter++;

	this.e = document.createElement('div');
	this.e.id = this.id;
	this.e.classList.add("flute");
	this.e.style.width = this.d * 40 + 'px';
	this.e.addEventListener( 'click', function(){
		changeActive(this.id);
	});

	_board.appendChild(this.e);

	this.h = [];
	this.f.forEach( (e, i) => {
		this.h[i] = new Hole( this.id, e );
		this.e.appendChild(this.h[i].e);
	});
}

function Pause( duration ) {
	this.d = duration;
	this.id = _couter++;

	this.e = this.e = document.createElement('div');
	this.e.id = this.id;
	this.e.classList.add("pause");
	this.e.style.width = this.d * 29 + 'px';
	
	this.e.addEventListener( 'click', function(){
		changeActive(this.id);
	});

	_board.appendChild(this.e);
}

function Hole( fluteId, status ) {
	let j = 0;

	this.fId = fluteId;
	this.id = j++;
	this.s = status == 0.5 ? 2 : status == 0.75 ? 4 : status;

	this.e = document.createElement('div');
	this.e.classList.add('hole');
	this.e.classList.add('normal');
	this.e.classList.add('hole-'+this.id);
	this.e.classList.add('hole-status-'+this.s);
	this.e.id = this.fId + "," + this.id;
	this.e.style.background = colors( this.s );
}