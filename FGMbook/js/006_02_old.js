// 006_02.js

let prepare_006_02 = (playgroundId)=>{
	let parentDiv = document.getElementById(playgroundId);
	let outputId = playgroundId+'_1';
	let inputId1 = playgroundId+'_2';
	let inputId2 = playgroundId+'_3';
	let inputId3 = playgroundId+'_4';
	let inputId4 = playgroundId+'_5';
	let initialValue1 = '5';
	let initialValue2 = '-8';
	let initialValue3 = '2';
	parentDiv.innerHTML += 
	`Type an equation of the form a*x+b=c 
	<br> 
	<input id="${inputId1}" type="number" step="0.01" size="3" value="${initialValue1}">* x 
	+ <input id="${inputId2}" type="number" step="0.01" size="3" value="${initialValue2}"> = 
	<input id="${inputId3}" type="number" step="0.01" size="3" value="${initialValue3}">
	&nbsp &nbsp Solution steps?<input type="checkbox" id="${inputId4}">
	<div style="background: " width="100%" id="${outputId}"></div>`;

	let div = document.getElementById(outputId);
	let a = ~~initialValue1;
	let b = ~~initialValue2;
	let c = ~~initialValue3;
	let draw = (n)=>{
		let finished = false;

		let text = 
		`<div style="font-size: .8em; margin: 5px"><i>I have many sheeps.
			<br>If I have ${a} times that many, 
			<br>and	I ${b>=0?"add "+b:"remove "+(-b)} sheeps,
			<br>I get ${c} sheeps.
			<br>Do you know how many sheeps I have?</i>`;


		if (document.getElementById(inputId4).checked){
			text += 
			`<br><br>${a}*x${b>=0?'+'+b:b}=${c}	&rarr; ${a} * x = ${-b+c}			
			<br><i>I have many sheeps.
			<br>If I have ${a} times that many, 
			<br>I get ${-b+c} sheeps.`;

			if (a==0){
				if (-b+c==0){ 
					// 0x=0
					text += `<br>(Me) ... wait a second... that means you can have any number of sheeps you like.
					<br>So, x is undefined!`;
					finished = true;
				} else {
					// 0x=n
					text += `<br>(Me) ... wait a second... that is impossible!
					<br>So there is no value of x that will satisfy this equation.`;
					finished = true;
				}
			}

			if (!finished){
				let result = (-b+c)/a;

				text += 
				`<br><br> ${a}*x=${-b+c} &rarr; x = <span class="frac"><sup>${-b+c}</sup><sub>${a}</sub></span> = ${result}
				<br><i>I have many sheeps.
				<br>When I count them, 
				<br>I get ${result} sheeps.
				<br>Do you know how many sheeps I have? 
				<br><br><u>(Me) Dah! You have ${result} sheeps :D </u>`;

				if (result<0){
					text += '<br>... so I guess you owed sheeps to somebody else or what?!';
				}				
				if (result!=~~result){
					let tmp = (''+result).split('.');
					text += `<br>... and I wonder how that 0.${tmp[1]} sheep looked like??`;
				}
			}


		}
		div.innerHTML = text+'</div>';
	}
	draw();

	document.getElementById(inputId1).addEventListener("input", ()=>{
		a = ~~(document.getElementById(inputId1).value);
		draw();
	});	

	document.getElementById(inputId2).addEventListener("input", ()=>{
		b = ~~(document.getElementById(inputId2).value);
		draw();
	});	

	document.getElementById(inputId3).addEventListener("input", ()=>{
		c = ~~(document.getElementById(inputId3).value);
		draw();
	});	

	document.getElementById(inputId4).addEventListener("input", ()=>{
		draw();
	});
}