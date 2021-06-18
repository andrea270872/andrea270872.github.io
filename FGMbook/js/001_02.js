// 001_02.js

let prepare_001_02 = (playgroundId)=>{
	let parentDiv = document.getElementById(playgroundId);
	let outputId = playgroundId+'_1';
	let inputId = playgroundId+'_2';
	let initialValue = '12';
	parentDiv.innerHTML += 
	`Type a number between 0 and 999: <input id="${inputId}" type="number" size="3" value="${initialValue}">
	<div style="background: " width="100%" id="${outputId}"></div>`;

	let div = document.getElementById(outputId);
	let draw = (n)=>{
		div.innerHTML = `${'I'.repeat(n).replace(/(.{5})/g,"$1 ")}`;	
	}
	draw(~~initialValue);

	document.getElementById(inputId).addEventListener("input", ()=>{
		let n = ~~(document.getElementById(inputId).value);
		if ((n<0)||(n>999)){
			n = ~~Math.abs(n);
			n = ~~((''+n).substr(0,3));
			document.getElementById(inputId).value = n;
		}
		draw(n);
	});	
}