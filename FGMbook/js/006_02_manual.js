// 006_02.js

let prepare_006_02 = (playgroundId)=>{
	let parentDiv = document.getElementById(playgroundId);
	let outputId = playgroundId+'_1';
	let inputId1 = playgroundId+'_2';
		let initialValue1 = '1';
	let btn = playgroundId+'_3';
	let outputId2 = playgroundId+'_4';
	let down_arrow = playgroundId+'_5';
	let btn2 = playgroundId+'_6';
	let btn10 = playgroundId+'_7';
	let inputId2 = playgroundId+'_8';
	let inputId3 = playgroundId+'_9';
	let radioButtonId = playgroundId+'_10';
	parentDiv.innerHTML += 
	`<span style="display:inline-block;margin-left:1em;height:9em;position:relative;">
	<b>Now I will create a riddle, and you will try to answer it</b>.
	<button id="${btn}" style="background-color:white">START</button>
	<div width="100%" id="${outputId}"></div>
	<div width="100%" id="${outputId2}" style="display:none;">
		<span id="${down_arrow}" style="background-color:white;">
			&Downarrow; <input type="radio" id="${inputId2}" name="${radioButtonId}" value="1" checked>/k
			<input type="radio" id="${inputId3}" name="${radioButtonId}" value="1">+n
			&nbsp; <input id="${inputId1}" type="number" step=".1" size="3" value="${initialValue1}"></b>
		</span>&nbsp;
		<button id="${btn2}" style="background-color:white;">apply</button>
	</div>
	<div style="position:absolute;right:.5em;bottom:.5em;">
	<i><button id="${btn10}" 
		style="display:none;position:absolute;right:-15em;
		bottom:.5em;background-color:green;color:gold;">solution</button></i>
	</span>`;

	function randInt(min, max) {
	  min = Math.ceil(min);
	  max = Math.floor(max);
	  return Math.floor(Math.random() * (max - min + 1)) + min;
	}	

	let div = document.getElementById(outputId);
	let div2 = document.getElementById(outputId2);
	let btn10Elem = document.getElementById(btn10);

	let draw = ()=>{
		if (attempts>4){
			btn10Elem.style.display="block";
		} else {
			btn10Elem.style.display="none";
		}

		if (steps.length==0){
			div2.style.display="none";
			div.innerHTML = '';
			return;
		}

		let [a,b,c] = steps;
		//console.log(a,b,c);

		//document.getElementById(btn3).innerHTML = `&Downarrow;${b>=0?'-'+b:'+'+(-b)}`;

		let text;
		if (b==0) text = `the number of sheeps is ${steps[2]}`;
		else      text = `the number of sheeps and ${steps[1]} is ${steps[2]}`;
		if (a!=1) text = `${a} times ${text}`;

		div.innerHTML = '<br>"' + text +'"';
		div2.style.display="block";

	}
	let transfType;
	let _k, _n;
	let attempts = 0;
	let ics;	
	let steps = [];	
	draw();

/*
	document.getElementById(inputId1).addEventListener("input", ()=>{
		sheeps = ~~(document.getElementById(inputId1).value);
		draw();
	});
*/

	document.getElementById(btn).addEventListener("click", (evt)=>{
		//steps = [1,0,sheeps];
		// a*x+b=c -> rnd x,rnd a and rnd b => c = a*x+b !
		let a,x,b,c;
		x = randInt(-2,12);
		a = randInt(-2,15);
		if (a==0) a=1;
		b = randInt(-4,100);
		c = a*x+b;
		//console.log( a,x,b,'=',c);
		ics = x;
		attempts = 0;
		transfType = '';
		steps = [a,b,c];
		draw();
	});

	document.getElementById(btn10).addEventListener("click", (evt)=>{
		alert('I have '+ics+' sheeps.');
	});

	// *1/(a) or +(-b)
	document.getElementById(btn2).addEventListener("click", (evt)=>{ 

		let radio = document.getElementsByName(radioButtonId);
		if (radio[1].checked) transfType = 'add';
		else 				  transfType = 'divide';
		_k = _n = parseFloat(document.getElementById(inputId1).value);
		//console.log( transfType , _k , _n );

		attempts++;
		let [a,b,c] = steps;

		if (transfType=='divide'){
			let k = 1/_k;
			a*=k; b*=k; c*=k;
		} else if (transfType=='add'){
			let n = _n;
			b+=n; c+=n;
		}
		steps = [a,b,c];
		draw();
	});
}