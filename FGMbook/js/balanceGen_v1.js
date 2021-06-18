// balanceGen.js

/* usage:

at the top:
  <script src="balanceGen.js"></script>
then in the html:

	<canvas id="canvas1"></canvas>
	<script>balanceGen('canvas1',[ ['x','10'], ['x','x','5'] ])</script>

*/

let balanceGen = (canvasId,data)=>{
	let myHTML = document.currentScript;
	let parentElement = myHTML.parentElement;
	let M = parseFloat(getComputedStyle(parentElement).fontSize); //*8/10;

	let c = document.getElementById(canvasId);
	let totL = data[0].length + data[1].length;
	c.width = M*(totL+4)+M;
	c.height =M*2+M;
	//console.log( c , data);

	let W = c.width;
	let H = c.height;
	let cx = c.getContext('2d');
	cx.imageSmoothingEnabled = false;
	cx.clearRect(0,0,W,H);
	cx.resetTransform();
	cx.translate(+M/2,+M/2);

	cx.font = M+'px Arial';
	cx.lineWidth = 2;

	let k = M*1.2;
	for (let i=0;i<data[0].length;i++){
		let l = data[0][i].length;
		cx.fillStyle = 'gold';
		cx.fillRect(i*k-M/4,0+M/8,M*l,M);		
		cx.strokeStyle = 'gray';
		cx.strokeRect(i*k-M/4,0+M/8,M*l,M);
		cx.fillStyle = 'gray';
		cx.fillRect(i*k-M/3+(l/2)*M,-2,4,4);

		cx.fillStyle = 'black';
		cx.fillText(data[0][i],i*k,M);
	}
	cx.strokeStyle = 'black';
	cx.beginPath();
	cx.moveTo(0,M+M/2);
	cx.lineTo(data[0].length*k,M+M/2);
	cx.stroke();
	let midX1 = data[0].length*k/2;

	for (let i=0;i<data[1].length;i++){
		let l = data[1][i].length;
		cx.fillStyle = 'gold';
		cx.fillRect(i*k + M*(data[0].length+3)-M/4,0+M/8,M+l,M);
		cx.strokeStyle = 'gray';
		cx.strokeRect(i*k + M*(data[0].length+3)-M/4,0+M/8,M+l,M);
		cx.fillStyle = 'gray';
		cx.fillRect(i*k + M*(data[0].length+3)-M/3+(l/2)*M,-2,4,4);

		cx.fillStyle = 'black';
		cx.fillText(data[1][i],i*k + M*(data[0].length+3),M);
	}
	cx.strokeStyle = 'black';
	cx.beginPath();
	cx.moveTo(M*(data[0].length+3) - k/3,M+M/2);
	cx.lineTo(M*(data[0].length+3) - k/3 + data[1].length*k,M+M/2);
	cx.stroke();
	let midX2 = (data[1].length*k)/2 + (M*(data[0].length+3) - k/3);

	cx.beginPath();
	cx.moveTo(midX1,M+M);
	cx.lineTo(midX2,M+M);
	cx.stroke();
	cx.beginPath();
	cx.moveTo(midX1,M+M);
	cx.lineTo(midX1,M+M/2);
	cx.moveTo(midX2,M+M);
	cx.lineTo(midX2,M+M/2);
	cx.stroke();	


	/*
	for (let i=0;i<data.size[0];i++){
		for (let j=0;j<data.size[1];j++){
			cx.lineWidth = 1;
			cx.strokeStyle = '#CCC';
			cx.strokeRect( i*M, j*M, M,M);

			cx.fillStyle = 'black';
			cx.beginPath();
			cx.arc(i*M+M/2, j*M+M/2, M/8, 0, 2 * Math.PI);
			cx.fill(); 
		}
	}

	if (data.borders){
		for (let brdr of data.borders){
			[r1,c1,r2,c2,color,lineThickness] = brdr;
			cx.lineWidth = lineThickness;
			cx.strokeStyle = color;
			cx.strokeRect( c1*M, r1*M, (c2-c1)*M,(r2-r1)*M);
		}
	}*/
}