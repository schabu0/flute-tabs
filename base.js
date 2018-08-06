function $( eAttr ) {
	let elem;
	if ( eAttr[ 'id' ] ) elem = document.getElementById( eAttr.id );
	else if ( eAttr[ 'class' ] ) elem = document.getElementsByClassName( eAttr.class );
	return elem;
}

// elem - element, attr - attribute to anim, end - ending value, iv - interval, sx - sufix
function animation( elem, attr, start, end, iv, sx ) {
	if( iv > 0 ) 
		add();
	if( iv < 0 ) 
		sub();
	else return false;

	function add() {
		let value = start;

		if( value < end-iv )
		requestAnimationFrame( animAdd );

		function animAdd() {
			elem.style[attr] = value + sx;
			console.log( value );

			if( value < end-iv ) {
				value += iv;
				requestAnimationFrame( animAdd );
			}
			else if( value != end ) {
				value = end;
				requestAnimationFrame(animAdd);
			}
		}
	}

	function sub() {
		let value = start;

		if( value > end-iv )
		requestAnimationFrame( animSub );

		function animSub() {
			console.log( value );
			elem.style[attr] = value + sx;

			if( value > end-iv ) {
				value += iv;
				requestAnimationFrame( animSub );
			}
			else if( value != end ) {
				value = end;
				requestAnimationFrame(animSub);
			}
		}
	}
}

function createElement( type, parent, innerValue, className, idName ) {
	let e = document.createElement( type );
	if ( !Array.isArray(className) ) e.classList.add( className );
	else
		for( let i in className ) {
			e.classList.add( className[i] );
		}
	if ( idName ) e.id = idName;
	if ( innerValue ) e.innerHTML = innerValue;
	parent.appendChild( e );
	return e;
}