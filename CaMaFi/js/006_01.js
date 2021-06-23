// 006_01.js

let prepare_006_01 = (playgroundId)=>{
	let parentDiv = document.getElementById(playgroundId);
	let outputId = playgroundId+'_1';
	let inputId1 = playgroundId+'_2';
	let btn = playgroundId+'_3';
	let outputId2 = playgroundId+'_4';
	let btn2 = playgroundId+'_5';
	let btn3 = playgroundId+'_6';
	let btn4 = playgroundId+'_7';
	let btn5 = playgroundId+'_8';
	let btn6 = playgroundId+'_9';
	let btn7 = playgroundId+'_10';
	let btn8 = playgroundId+'_11';
	let btn9 = playgroundId+'_12';
	let initialValue1 = '5';
	parentDiv.innerHTML += 
	`<span style="display:inline-block;margin-left:1em;height:9em;">
	I have some sheeps. <b>The number of sheeps is
	<input id="${inputId1}" type="number" step="1" size="3" value="${initialValue1}"></b>.
	How many sheeps do I have?
	<button id="${btn}" style="background-color:white">START</button>
	<div width="100%" id="${outputId}"></div>
	<div width="100%" id="${outputId2}" style="display:none;">
		<button id="${btn2}" style="background-color:white;">&Downarrow;*2</button>
		<button id="${btn3}" style="background-color:white;">&Downarrow;*3</button>
		<button id="${btn7}" style="background-color:white;">&Downarrow;*<span class="frac"><sup>1</sup><sub>2</sub></span></button>
		&nbsp;
		<button id="${btn4}" style="background-color:white;">&Downarrow;+1</button>
		<button id="${btn5}" style="background-color:white;">&Downarrow;+5</button>
		<button id="${btn8}" style="background-color:white;">&Downarrow;-1</button>
		&nbsp;
		<button id="${btn6}" style="background-color:white;">&Downarrow;+sheeps</button>
		<button id="${btn9}" style="background-color:white;">&Downarrow;-sheeps</button>
	</div>
	</span>`;

	let div = document.getElementById(outputId);
	let div2 = document.getElementById(outputId2);
	let draw = ()=>{
		if (steps.length==0){
			div2.style.display="none";
			div.innerHTML = '';
			return;
		}

		let [a,b,c] = steps;
		//console.log(a,b,c);
		let text;
		if (b==0) text = `the number of sheeps is ${steps[2]}`;
		else      text = `the number of sheeps and ${steps[1]} is ${steps[2]}`;
		if (a!=1) text = `${a} times ${text}`;

		div.innerHTML = '<br>"' + text +'"';
		div2.style.display="block";

	}
	let sheeps = ~~initialValue1;
	let steps = [];
	draw();

	document.getElementById(inputId1).addEventListener("input", ()=>{
		sheeps = ~~(document.getElementById(inputId1).value);
		draw();
	});

	document.getElementById(btn).addEventListener("click", (evt)=>{
		steps = [1,0,sheeps];
		draw();
	});

	// *2
	document.getElementById(btn2).addEventListener("click", (evt)=>{ 
		let [a,b,c] = steps;
		a*=2; b*=2; c*=2;
		steps = [a,b,c];
		draw();
	});

	// *3
	document.getElementById(btn3).addEventListener("click", (evt)=>{ 
		let [a,b,c] = steps;
		a*=3; b*=3; c*=3;
		steps = [a,b,c];
		draw();
	});

	// +1
	document.getElementById(btn4).addEventListener("click", (evt)=>{ 
		let [a,b,c] = steps;
		b+=1; c+=1;
		steps = [a,b,c];
		draw();
	});

	// +5
	document.getElementById(btn5).addEventListener("click", (evt)=>{ 
		let [a,b,c] = steps;
		b+=5; c+=5;
		steps = [a,b,c];
		draw();
	});

	// +sheeps
	document.getElementById(btn6).addEventListener("click", (evt)=>{ 
		let [a,b,c] = steps;
		a+=1; c+=sheeps;
		steps = [a,b,c];
		draw();
	});

	// * 1/2
	document.getElementById(btn7).addEventListener("click", (evt)=>{ 
		let [a,b,c] = steps;
		a/=2; b/=2; c/=2;
		steps = [a,b,c];
		draw();
	});

	// -1
	document.getElementById(btn8).addEventListener("click", (evt)=>{ 
		let [a,b,c] = steps;
		b+=-1; c+=-1;
		steps = [a,b,c];
		draw();
	});

	// -sheeps
	document.getElementById(btn9).addEventListener("click", (evt)=>{ 
		let [a,b,c] = steps;
		a+=-1; c+=-sheeps;
		steps = [a,b,c];
		draw();
	});

}