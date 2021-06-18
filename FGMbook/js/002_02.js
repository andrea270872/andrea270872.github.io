// 002_02.js

let prepare_002_02 = (playgroundId)=>{
	let parentDiv = document.getElementById(playgroundId);
	let outputId = playgroundId+'_1';
	let inputId = playgroundId+'_2';
	let inputId2 = playgroundId+'_3';
	let inputId3 = playgroundId+'_4';
	let inputId4 = playgroundId+'_5';
	let outputId2 = playgroundId+'_6';
	let initialValue = '7';
	parentDiv.innerHTML += 
	`&nbsp; Linear combination: a * 
	<input id="${inputId}" type="number" size="3" value="${initialValue}">
	+ c <i><span id="${outputId2}"></span></i>
	<div width="100%" id="${outputId}">
		(a)<br><input type="range" id="${inputId2}" orient="vertical" min="0" value="0"/>
		<div id="${inputId4}"></div>
		<br><input type="range" id="${inputId3}" min="0" value="0">(c)</input>
	</div>`;

	let div = document.getElementById(outputId);
	let gridElement = document.getElementById(inputId4);

	let fixSliders = (n)=>{
		m = n<=12?n:Math.min(n*.75,10);

		let vertical = document.getElementById(inputId2);
		vertical.setAttribute("style",
			`vertical-align:top;margin-left:5px;height:${(m+4)*2}em;`);
		vertical.setAttribute('max',`${n+5}`);

		let horizontal = document.getElementById(inputId3);
		horizontal.setAttribute("style",
			`margin-left:4em;width:${m*5}em;`);
		horizontal.setAttribute('max',`${n-1}`);
	}

	let draw = (n)=>{
		//console.log( n )
		gridElement.setAttribute("style",
			'display:inline-block;margin-left:-1em;font-size:'+ (n<=12?80:80-n*1.5) +'%');
		let grid = '';
		for (let a=n+5;a>=0;a--){
			for (let b=0;b<n;b++){
				color= 'blue';
				if ((a==_a) && (b==_b)){
					color= 'red';
				}
				grid += `<span class="noselect" style="text-align:right;
						color:${color};
						display:inline-block;width:4em">${a*n+b} </span>`;
			}
			grid += '<br>'
		}
		grid += '</div>';
		gridElement.innerHTML = grid;

		fixSliders(n);

		document.getElementById(outputId2).innerHTML = `&nbsp; &nbsp; &nbsp; 
		With a=${_a} and c=${_b} gives <span style="color:red">${_a*n+_b}</span>`;
	}
	let n = ~~initialValue;
	let _a = 0, _b = 0;
	draw(n);

	document.getElementById(inputId).addEventListener("input", ()=>{
		n = ~~(document.getElementById(inputId).value);
		if ((n<=0)||(n>30)){
			n = ~~Math.abs(n);
			if (n<=0) n=1
			if (n>30) n=30
			n = ~~((''+n).substr(0,2));
			document.getElementById(inputId).value = n;
		}
		draw(n);
	});

	document.getElementById(outputId).addEventListener("input", (evt)=>{
		//console.log(evt)
		if (evt.target==document.getElementById(inputId2)){ // vertical slider (a)
			//console.log( document.getElementById(inputId2).value );
			_a = ~~document.getElementById(inputId2).value;
			draw(n);
		}
		if (evt.target==document.getElementById(inputId3)){ // horizontal slider (b)
			//console.log( document.getElementById(inputId3).value );
			_b = ~~document.getElementById(inputId3).value;
			draw(n);
		}
	});	
	
}