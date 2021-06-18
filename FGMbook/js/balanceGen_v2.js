// balanceGen.js

/* usage:

at the top:
  <script src="balanceGen.js"></script>
then in the html:

	<canvas id="canvas1"></canvas>
	<script>balanceGen('canvas1',[ ['x','10'], ['x','x','5'] ])</script>

*/

let balanceGen = (canvasId,data)=>{
	// assert: data is an array of 2 arrys, 
	//			each with few characters per cell
	let myHTML = document.currentScript;
	let parentElement = myHTML.parentElement;
	let M = parseFloat(getComputedStyle(parentElement).fontSize); //*8/10;

	let c = document.getElementById(canvasId);
	const L = 12;
	const COLS = 4;
	const ROWS = Math.max( Math.ceil(data[0].length/4) ,  Math.ceil(data[1].length/4) );
	const k = M*1.5;
	c.width = k*L+M;
	c.height =ROWS*k+M;
	//console.log( c , data);

	let W = c.width;
	let H = c.height;
	let cx = c.getContext('2d');
	cx.imageSmoothingEnabled = false;
	cx.clearRect(0,0,W,H);
	cx.resetTransform();
	cx.translate(+M/2,+M/2);

	cx.lineWidth = 2;

	let l0 = data[0].length;
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