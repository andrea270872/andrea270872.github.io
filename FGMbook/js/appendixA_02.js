// appendixA_02.js

let prepare_appendixA_02 = (playgroundId)=>{

	let parentDiv = document.getElementById(playgroundId);
	let M = parseFloat(getComputedStyle(parentDiv).fontSize)*10/6;

	let outputId = playgroundId+'_1';
	let inputId1 = playgroundId+'_2';
	let inputId2 = playgroundId+'_3';
	let inputId3 = playgroundId+'_4';
	let canvasId = playgroundId+'_11';
	let initialValue1 = '1';
	let initialValue2 = '0';
	let initialValue3 = '0';
	parentDiv.innerHTML += 
	`<b>Plot the results of </b><br>
	&nbsp; &nbsp; <input id="${inputId1}" type="number" step="any" size="4" value="${initialValue1}"> *x<sup>2</sup>
	+ <input id="${inputId2}" type="number" step="any" size="4" value="${initialValue2}"> *x 
	+ <input id="${inputId3}" type="number" step="any" size="4" value="${initialValue3}"> <b>&rarr; y</b>
	
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

	let A,B,C;
	A = ~~initialValue1;
	B = ~~initialValue2;
	C = ~~initialValue3;
	const MAX = 10; // area is [-10,10] x [-10,10]

	const F = (x)=>A*x**2+B*x+C;

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

		{
		cx.font = (M/2)+'px Arial';
		let [x,y] = transf([1,0]);
		cx.strokeStyle = 'green';
		cx.beginPath();
		cx.moveTo(...[x,y-M/3]);
		cx.lineTo(...[x,y+M/3]);
		cx.stroke();			
		x-=M/6;
		cx.fillText('1',x,y-M/2);
		}

		// draw function				
		let step = 0.4;
		cx.strokeStyle = 'blue';
		let x=-MAX;
		let p1;
		p1 = [x,F(x)];
		cx.beginPath();
		cx.moveTo(...transf(p1));
		for (x=-MAX;x<=MAX;x+=step){
			p1 = [x,F(x)];
			cx.lineTo(...transf(p1));
		}
		cx.stroke();
	}
	draw();

	document.getElementById(inputId1).addEventListener("input", (evt)=>{ 
		A = parseFloat(document.getElementById(inputId1).value);
		if (isNaN(A)) A=0;
		draw();		
	});
	document.getElementById(inputId2).addEventListener("input", (evt)=>{ 
		B = parseFloat(document.getElementById(inputId2).value);
		if (isNaN(B)) B=0;
		draw();		
	});
	document.getElementById(inputId3).addEventListener("input", (evt)=>{ 
		C = parseFloat(document.getElementById(inputId3).value);
		if (isNaN(C)) C=0;
		draw();		
	});

}