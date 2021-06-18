// 002_01.js

let prepare_002_01 = (playgroundId)=>{
	let parentDiv = document.getElementById(playgroundId);
	let outputId = playgroundId+'_1';
	let inputId = playgroundId+'_2';
	let inputId2 = playgroundId+'_3';
	let initialValue = '0';
	let initialValue2 = '1';
	parentDiv.innerHTML += 
	`Type two numbers between 0 and 999, 
	a = <input id="${inputId}" type="number" size="3" value="${initialValue}">
	and c = <input id="${inputId2}" type="number" size="3" value="${initialValue2}">
	<div width="100%" id="${outputId}"></div>`;

	let div = document.getElementById(outputId);
	let draw = (n,m)=>{
		div.innerHTML = `<span style="background:blue;color:white;">
				${n} * 
				<b><span style="background:blue;color:black;">7</span></b>
				+ ${m} = <span style="color:#FFF700">${n*7+m}&nbsp;</span>
			</span>`;

		// examples
		let examples = '<br>-Examples-<div style="font-size:80%">';
		for (let a=0;a<2;a++){
			for (let b=0;b<10;b++){
				examples += `<div style="width:25%;display:inline-block;">${a} * <b>7</b> + ${b} =
				<span style="color:blue;">${a*7+b}</span></div>`;
			}
		}
		examples += '</div>';
		div.innerHTML += examples;

	}
	let n = ~~initialValue;
	let m = ~~initialValue2;
	draw(n,m);

	document.getElementById(inputId).addEventListener("input", ()=>{
		n = ~~(document.getElementById(inputId).value);
		if ((n<0)||(n>999)){
			n = ~~Math.abs(n);
			n = ~~((''+n).substr(0,3));
			document.getElementById(inputId).value = n;
		}
		draw(n,m);
	});	

	document.getElementById(inputId2).addEventListener("input", ()=>{
		m = ~~(document.getElementById(inputId2).value);
		if ((m<0)||(m>999)){
			m = ~~Math.abs(m);
			m = ~~((''+m).substr(0,3));
			document.getElementById(inputId2).value = m;
		}
		draw(n,m);
	});	
}