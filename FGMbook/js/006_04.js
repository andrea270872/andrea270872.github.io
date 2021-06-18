// 006_04.js

let prepare_006_04 = (playgroundId)=>{

	let parentDiv = document.getElementById(playgroundId);
	let M = parseFloat(getComputedStyle(parentDiv).fontSize)*10/6;

	let outputId = playgroundId+'_1';
	let inputId1 = playgroundId+'_2';
	let initialValue1 = '1';
	parentDiv.innerHTML += 
	`<span style="display:inline-block;margin-left:1em;height:20em;">
	<b>1*x+5 = 2*x+3</b><br>
	Try substituting a few numbers around 
	<input id="${inputId1}" type="number" step="1" size="3" value="${initialValue1}">.	
	<div width="100%" id="${outputId}"></div>
	</span>`;

	let div = document.getElementById(outputId);
	let draw = ()=>{

		let min = center-2.5;
		let max = center+2.5;
		let text = '<table cols="3" style="margin-left:3em;width:25em;">';
		let style,A,B;
		text += `<tr><th style="width:5em;">x</th>
					<th style="width:5em;">1*x+5</th>
					<th style="width:5em;">2*x+3</th>
					<th style="width:5em;">Equal?</th></tr>`;
		for (let i=min,j=0;i<=max;i+=.5,j++){
			let t = (j/10);
			let J = 2*(t<.5?t:1-t);

			A = 1*i+5;
			B = 2*i+3
			style = `text-align:center;font-size:${J*1.8}em;`;
			//if (center==i) style+='color:blue;';
			style+='color:blue;';
			if (A==B) style+='color:firebrick;text-decoration:underline;';
			text += `<tr style="${style}"><td>${i}</td><td>${A}</td>
						<td>${B}</td><td>${A==B}</td></tr>`;
		}
		text += '</table>';
		div.innerHTML = text;
	}
	let center = ~~initialValue1;
	draw();

	document.getElementById(inputId1).addEventListener("input", (evt)=>{ 
		center = ~~document.getElementById(inputId1).value;
		draw();
	});

}