// 006_05.js

let prepare_006_05 = (playgroundId)=>{

	let parentDiv = document.getElementById(playgroundId);
	let M = parseFloat(getComputedStyle(parentDiv).fontSize)*10/6;

	let outputId = playgroundId+'_1';
	let inputId1 = playgroundId+'_2';
	let inputId2 = playgroundId+'_3';
	let inputId3 = playgroundId+'_4';
	let inputId4 = playgroundId+'_42';
	let btn1 = playgroundId+'_5';
	let btn2 = playgroundId+'_6';
	let btn3 = playgroundId+'_7';
	let btn4 = playgroundId+'_8';
	let btn5 = playgroundId+'_9';
	let btn6 = playgroundId+'_10';
	let canvasId = playgroundId+'_11';
	let initialValue1 = '1';
	let initialValue2 = '0';
	let initialValue3 = '0';
	let initialValue4 = '5';
	parentDiv.innerHTML += 
	`<b>Equation:</b><br>
	<span style="background:#A0A0FF;padding:3px;">
	<input id="${inputId1}" type="number" step="any" size="4" value="${initialValue1}">*x+
	<input id="${inputId2}" type="number" step="any" size="4" value="${initialValue2}"></span> = 
	<span style="background:#FFA0A0;padding:3px;">
	<input id="${inputId3}" type="number" step="any" size="4" value="${initialValue3}">*x+
	<input id="${inputId4}" type="number" step="any" size="4" value="${initialValue4}"></span>

	&nbsp; &nbsp; <button id="${btn5}" style="background-color:white">*2</button>
	<button id="${btn6}" style="background-color:white">*<span class="frac"><sup>1</sup><sub>2</sub></span></button>
	&nbsp; <button id="${btn1}" style="background-color:white">+1</button>
	<button id="${btn2}" style="background-color:white">-1</button>
	&nbsp; <button id="${btn3}" style="background-color:white">+x</button>
	<button id="${btn4}" style="background-color:white">-x</button>

	<span id="${outputId}"></span>
	<canvas class="playground" id="${canvasId}" width="1024" height="500"></canvas>`;

	let c = document.getElementById(canvasId);
	let W = c.width;
	let H = c.height;
	let HH = 9/10*H;
	let cx = c.getContext('2d');

	let div = document.getElementById(outputId);

	const transf = (point)=>{
		let [x,y] = point;
		let kx = ky = HH/(MAX*2);
		//console.log(x,y);
		x = ~~((x+MAX)*kx);
		y = ~~((y+MAX)*ky);
		//console.log(x,y);
		return [x,HH-y];
	}

	const drawLine = (A,B,color)=>{
		let p1 = [-MAX,-MAX*A+B]; // x=-10 -> y = -10a+b
		let p2 = [+MAX,+MAX*A+B]; // x=+10 -> y = +10a+b
		cx.strokeStyle = color;
		cx.beginPath();
		cx.moveTo(...transf(p1));
		cx.lineTo(...transf(p2));
		cx.stroke();
	}

	let A,B,C,D;
	A = ~~initialValue1;
	B = ~~initialValue2;
	C = ~~initialValue3;
	D = ~~initialValue4;
	const MAX = 10; // area is [-10,10] x [-10,10]

	let draw = ()=>{
		//console.log(A,B,C,D);
		cx.resetTransform();
		cx.clearRect(0,0,W,H);
		cx.translate(100,30);

		// draw grid
		cx.strokeStyle = '#E0E0E0';
		for (let i=-MAX;i<=MAX;i+=1){
			cx.beginPath();
			cx.moveTo(...transf([-MAX,i]));
			cx.lineTo(...transf([+MAX,i]));

			cx.moveTo(...transf([i,-MAX]));
			cx.lineTo(...transf([i,+MAX]));
			cx.stroke();
		}

		// draw axes
		cx.strokeStyle = 'black';
		cx.lineWidth = 3;
		cx.beginPath();
		cx.moveTo(...transf([-MAX,0]));
		cx.lineTo(...transf([+MAX,0]));

		cx.moveTo(...transf([0,-MAX]));
		cx.lineTo(...transf([0,+MAX]));
		cx.stroke();
		cx.lineWidth = 1;

		cx.fillStyle = 'black';
		cx.font = (M/2)+'px Arial';
		cx.fillText('X', ...transf([MAX+.2,0]) );
		cx.fillText('Y', ...transf([0,MAX+.1]) );


		cx.strokeStyle = '#EEE'; // background color!
		cx.rect(0,0,HH,HH);
		cx.stroke();
		cx.clip();

		drawLine(A,B,'blue');
		drawLine(C,D,'red');

		// intersection
		if (A-C!=0){
			let xI = (D-B)/(A-C);
			cx.fillStyle = 'green';
			cx.font = (M/2)+'px Arial';
			let [x,y] = transf([xI,0]);

			cx.strokeStyle = 'green';
			cx.beginPath();
			cx.moveTo(...[x,y-M/3]);
			cx.lineTo(...[x,y+M/3]);
			cx.stroke();
			
			x-=M/6;
			cx.fillText(~~xI,x,y-M/2);
		}
		if (A-C==0){
			cx.fillStyle = 'green';
			cx.font = (M/2)+'px Arial';
			if (D-B==0){
				let [x,y] = transf([MAX-3,MAX-1]);
				cx.fillText('∞ sol.',x,y);
			} else {
				let [x,y] = transf([MAX-3,MAX-1]);
				cx.fillText('0 sol.',x,y);
			}
		}

	}
	draw();

	document.getElementById(btn1).addEventListener("click", (evt)=>{ 
		B+=1; document.getElementById(inputId2).value = B;
		D+=1; document.getElementById(inputId4).value = D;
		draw();
	});
	document.getElementById(btn2).addEventListener("click", (evt)=>{ 
		B-=1; document.getElementById(inputId2).value = B;
		D-=1; document.getElementById(inputId4).value = D;
		draw();
	});
	document.getElementById(btn3).addEventListener("click", (evt)=>{ 
		A+=1; document.getElementById(inputId1).value = A;
		C+=1; document.getElementById(inputId3).value = C;
		draw();
	});
	document.getElementById(btn4).addEventListener("click", (evt)=>{ 
		A-=1; document.getElementById(inputId1).value = A;
		C-=1; document.getElementById(inputId3).value = C;
		draw();
	});
	document.getElementById(btn5).addEventListener("click", (evt)=>{ 
		A*=2; document.getElementById(inputId1).value = A;
		B*=2; document.getElementById(inputId2).value = B;
		C*=2; document.getElementById(inputId3).value = C;
		D*=2; document.getElementById(inputId4).value = D;
		draw();
	});
	document.getElementById(btn6).addEventListener("click", (evt)=>{ 
		A/=2; document.getElementById(inputId1).value = A;
		B/=2; document.getElementById(inputId2).value = B;
		C/=2; document.getElementById(inputId3).value = C;
		D/=2; document.getElementById(inputId4).value = D;
		draw();
	});


	document.getElementById(inputId1).addEventListener("input", (evt)=>{ 
		A = ~~document.getElementById(inputId1).value;
		draw();		
	});
	document.getElementById(inputId2).addEventListener("input", (evt)=>{ 
		B = ~~document.getElementById(inputId2).value;
		draw();		
	});
	document.getElementById(inputId3).addEventListener("input", (evt)=>{ 
		C = ~~document.getElementById(inputId3).value;
		draw();		
	});
	document.getElementById(inputId4).addEventListener("input", (evt)=>{ 
		D = ~~document.getElementById(inputId4).value;
		draw();		
	});

}