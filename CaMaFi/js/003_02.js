// 003_02.js

let prepare_003_02 = (playgroundId)=>{
	let parentDiv = document.getElementById(playgroundId);
	let outputId = playgroundId+'_1';
	let inputId = playgroundId+'_2';
	let initialValue = '7';
	parentDiv.innerHTML += 
	`Type a number between 1 and 50: <input id="${inputId}" type="number" size="3" value="${initialValue}">
	<div width="100%" id="${outputId}"></div>`;

	let div = document.getElementById(outputId);
	let draw = (n)=>{
		let text = `${n} &nbsp;&nbsp; = ${'I'.repeat(n).replace(/(.{5})/g,"$1 ")} <br>`;

		for(let i=2;i<=12;i++){
			let a = ''+'\u2022'.repeat(n).match(new RegExp('.{1,'+i+'}', 'g')).join('<br>');
			text += `${n}:${(i<=9)?'0'+i:i} = <div style="text-align:center;width:10em;font-size:1.5em;display:inline-block;letter-spacing:-.2em;line-height:.3em;">${a}</div>`;
			text += ` = ${~~(n/i)} + ${n%i}<br>`;
		}

		div.innerHTML = text;
	}
	draw(~~initialValue);

	document.getElementById(inputId).addEventListener("input", ()=>{
		let n = ~~(document.getElementById(inputId).value);
		if ((n<=0)||(n>50)){
			n = ~~Math.abs(n);
			n = ~~((''+Math.min(n,50)).substr(0,2));
			if (~~n==0) n=1;
			document.getElementById(inputId).value = n;
		}
		draw(n);
	});	
}