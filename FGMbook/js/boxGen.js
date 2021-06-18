// boxGen.js

/* usage:

at the top:
  <script src="boxGen.js"></script>
then in the html:

	<canvas id="canvas1"></canvas>
	<script>boxGen('canvas1',{size:[4,4],borders:[
		[0,0,4,4,"black",1],
		[0,1,3,4,"red",3]
	]})</script>

*/

let boxGen = (canvasId,data)=>{
	let myHTML = document.currentScript;
	let parentElement = myHTML.parentElement;
	let M = parseFloat(getComputedStyle(parentElement).fontSize);

	let c = document.getElementById(canvasId);
	c.width= M*data.size[0]+M;
	c.height=M*data.size[1]+M

	//console.log( c , data);

	let W = c.width;
	let H = c.height;
	let cx = c.getContext('2d');
	cx.imageSmoothingEnabled = false;
	cx.clearRect(0,0,W,H);
	cx.resetTransform();
	cx.translate(+M/2,+M/2);

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
	}
}