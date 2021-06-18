// 006_03.js

let prepare_006_03 = (playgroundId)=>{

	function fix(x,precision=3) {
		let tmp = 10**precision;
		return Math.round(x*tmp)/tmp;
	}

	const balance = (canvasId,data)=>{
		// assert: data is an array of 2 arrys, 
		//			each with few characters per cell
		let c = document.getElementById(canvasId);		
		const L = 12;
		const COLS = 4;
		const ROWS = Math.max( Math.ceil(data[0].length/4) ,  Math.ceil(data[1].length/4) );
		const k = M*1.5;
		
		let W = c.width;
		let H = c.height;
		let cx = c.getContext('2d');
		cx.imageSmoothingEnabled = false;
		cx.clearRect(-10,-2*M,W,H);
		cx.resetTransform();
		cx.translate(+M/2,+M/2);

		cx.lineWidth = 2;

		let l0 = data[0].length;
		if (data[0].length%4==0) l0--;
		if (data[0].length%4==1) data[0].unshift('','','');
		if (data[0].length%4==2) data[0].unshift('','');
		if (data[0].length%4==3) data[0].unshift('');
		let chars,row;
		//console.log( ROWS );
		for (let i=0;i<data[0].length;i++){
			chars = i%4;
			row = ROWS-1 -~~(l0/4) + ~~(i/4);
			//console.log(i,chars,row)

			let l = data[0][i].length;
			if (l!=0){
				cx.font = M+'px Arial';
				if (l!=1) cx.font = (M/l*1.3)+'px Arial';

				cx.fillStyle = 'gold';
				cx.fillRect(chars*k+M/2,0+M/8+k*row, M,M);
				cx.strokeStyle = 'gray';
				cx.strokeRect(chars*k+M/2,0+M/8+k*row, M,M);
				cx.fillStyle = 'gray';
				cx.fillRect(chars*k+M*.9,-2+k*row, 5,4);

				cx.fillStyle = 'black';
				cx.fillText(data[0][i],chars*k+M/2+3,M+k*row);

				chars+=l;		
			}
		}

		//data[1].reverse();
		let l1 = data[1].length;
		if (data[1].length%4==0) l1--;
		if (data[1].length%4==1) data[1].unshift('','','');
		if (data[1].length%4==2) data[1].unshift('','');
		if (data[1].length%4==3) data[1].unshift('');
		for (let i=0;i<data[1].length;i++){
			chars = i%4;
			row = ROWS-1 -~~(l1/4) + ~~(i/4);
			//console.log(i,chars,row)

			let l = data[1][i].length;
			if (l!=0){
				cx.font = M+'px Arial';
				if (l!=1) cx.font = (M/l*1.3)+'px Arial';

				cx.fillStyle = 'gold';
				cx.fillRect(6*k+chars*k+M/2,0+M/8+k*row, M,M);
				cx.strokeStyle = 'gray';
				cx.strokeRect(6*k+chars*k+M/2,0+M/8+k*row, M,M);
				cx.fillStyle = 'gray';
				cx.fillRect(6*k+chars*k+M*.9,-2+k*row, 5,4);

				cx.fillStyle = 'black';
				cx.fillText(data[1][i],6*k+chars*k+M/2+3,M+k*row);

				chars+=l;
			}
		}

		baseY = ROWS*k;

		cx.strokeStyle = 'black';
		cx.beginPath();
		cx.moveTo(0,baseY);
		cx.lineTo(5*k,baseY);
		cx.stroke();
		let midX1 = data[0].length*k/2;

		cx.strokeStyle = 'black';
		cx.beginPath();
		cx.moveTo(6*k,baseY);
		cx.lineTo(6*k+5*k,baseY); //M+M/2);
		cx.stroke();
		
		cx.beginPath();
		cx.moveTo(6*k/2-k/2,baseY+M/2);
		cx.lineTo(6*k/2+5*k+k/4,baseY+M/2);
		cx.stroke();
		cx.beginPath();
		cx.moveTo(6*k/2-k/2,baseY+M/2);
		cx.lineTo(6*k/2-k/2,baseY);

		cx.moveTo(6*k/2+5*k+k/4,baseY+M/2);
		cx.lineTo(6*k/2+5*k+k/4,baseY);
		cx.stroke();	
	}

//////////////////////////////////////////////////////////////////////	

	let parentDiv = document.getElementById(playgroundId);
	let M = parseFloat(getComputedStyle(parentDiv).fontSize)*10/6;

	let outputId = playgroundId+'_1';
	let inputId1 = playgroundId+'_2';
	let inputId2 = playgroundId+'_2_1';
	let inputId3 = playgroundId+'_2_2';
	let btn = playgroundId+'_3';
	let outputId2 = playgroundId+'_4';
	let btn2 = playgroundId+'_5';
	let btn3 = playgroundId+'_6';
	let btn4 = playgroundId+'_7';
	let btn5 = playgroundId+'_8';
	let btn6 = playgroundId+'_9';
	let btn7 = playgroundId+'_10';
	let btn7_2 = playgroundId+'_10_2';
	let btn8 = playgroundId+'_11';
	let btn9 = playgroundId+'_12';	
	let outputId1 = playgroundId+'_13';
	let initialValue1 = '1';
	let initialValue2 = '0';
	let initialValue3 = '5';
	parentDiv.innerHTML += 
	`<span style="display:inline-block;margin-left:1em;height:20em;">
	<b>Build a riddle on a two-pan balance</b><br>
	"<input id="${inputId1}" type="number" step="any" size="3" value="${initialValue1}">
	times <b>x</b> and
	<input id="${inputId2}" type="number" step="any" size="3" value="${initialValue2}">
	is <input id="${inputId3}" type="number" step="any" size="3" value="${initialValue3}">".
	Make this riddle more complex...
	<button id="${btn}" style="background-color:white">START</button>
	<i><div width="100%" id="${outputId1}"></div></i>
	<canvas class="playground" id="${outputId}" width="1024" height="300"></canvas>
	<div width="100%" id="${outputId2}" style="display:none;">
		<button id="${btn2}" style="background-color:white;">&Downarrow;*2</button>
		<button id="${btn3}" style="background-color:white;">&Downarrow;*3</button>
		<button id="${btn7}" style="background-color:white;">&Downarrow;*<span class="frac"><sup>1</sup><sub>2</sub></span></button>
		<button id="${btn7_2}" style="background-color:white;">&Downarrow;*<span class="frac"><sup>1</sup><sub>3</sub></span></button>
		&nbsp;
		<button id="${btn4}" style="background-color:white;">&Downarrow;+1</button>
		<button id="${btn5}" style="background-color:white;">&Downarrow;+5</button>
		<button id="${btn8}" style="background-color:white;">&Downarrow;-1</button>
		&nbsp;
		<button id="${btn6}" style="background-color:white;">&Downarrow;+x</button>
		<button id="${btn9}" style="background-color:white;">&Downarrow;-x</button>
	</div>
	</span>`;

	let div = document.getElementById(outputId1);
	let div2 = document.getElementById(outputId2);
	let draw = ()=>{
		if (steps.length==0){
			div2.style.display="none";
			return;
		}

		let [a,b,c,d] = steps;
		[a,b,c,d] = [a,b,c,d].map(_=>fix(_));

		let textAX = `${a} times x and`;
		if (a==0) textAX = '';
		let textCX = `${c} times x and`;
		if (c==0) textCX = '';
		let text = `&nbsp;"<b>${textAX} ${b}</b> is the same as <b>${textCX} ${d}</b>"`;
		div.innerHTML = text;

		let list;
		let aLargeOrBroken = (a!=~~a) || (Math.abs(a)>15) || (a<0);
		let cLargeOrBroken = (c!=~~c) || (Math.abs(c)>15) || (c<0);
		let leftList;
		let rightList;
		let bText = ''+b;
		if (aLargeOrBroken){
			if (a==0) leftList = [];
			else      leftList = [`${a}*x`];
		} else {
			leftList = 'x'.repeat(~~a).split('');			
		}
		if (b!=0) leftList.push( bText );

		let dText = ''+d;
		if (cLargeOrBroken){
			if (c==0) rightList = [];
			else      rightList = [`${c}*x`];
		} else {
			rightList = 'x'.repeat(~~c).split('');
		}
		if (d!=0) rightList.push( dText );
		list = [leftList,rightList];

		console.log( JSON.stringify(list) );
		balance(outputId,list);
		div2.style.display="block";

	}
	let steps = []; // [a,b,c,d] => a*x+b = c*x+d
	draw();

	document.getElementById(btn).addEventListener("click", (evt)=>{
		let i1 = parseFloat(document.getElementById(inputId1).value);
		let i2 = parseFloat(document.getElementById(inputId2).value);
		let i3 = parseFloat(document.getElementById(inputId3).value);
		steps = [i1,i2,0,i3];
		draw();
	});

	const multK = (k)=>{
		let [a,b,c,d] = steps;
		a*=k; b*=k; c*=k; d*=k;
		steps = [a,b,c,d];
		draw();
	}
	const addN = (n)=>{
		let [a,b,c,d] = steps;
		b+=n; d+=n;
		steps = [a,b,c,d];
		draw();
	}
	const addNtimeX = (n)=>{
		let [a,b,c,d] = steps;
		a+=n; c+=n;
		steps = [a,b,c,d];
		draw();
	}

	// *2
	document.getElementById(btn2).addEventListener("click", (evt)=>{ multK(2); });

	// *3
	document.getElementById(btn3).addEventListener("click", (evt)=>{  multK(3); });

	// +1
	document.getElementById(btn4).addEventListener("click", (evt)=>{ addN(1) });

	// +5
	document.getElementById(btn5).addEventListener("click", (evt)=>{ addN(5) });

	// +x
	document.getElementById(btn6).addEventListener("click", (evt)=>{ addNtimeX(1); });

	// * 1/2
	document.getElementById(btn7).addEventListener("click", (evt)=>{ multK(1/2) });

	// * 1/3
	document.getElementById(btn7_2).addEventListener("click", (evt)=>{ multK(1/3) });

	// -1
	document.getElementById(btn8).addEventListener("click", (evt)=>{ addN(-1) });

	// -x
	document.getElementById(btn9).addEventListener("click", (evt)=>{  addNtimeX(-1); });

}