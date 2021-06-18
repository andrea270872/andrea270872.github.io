// 007_01.js

let prepare_007_01 = (playgroundId)=>{
	let parentDiv = document.getElementById(playgroundId);
	let M = parseFloat(getComputedStyle(parentDiv).fontSize);

	let canvasId = playgroundId+'_1';
	let inputId = playgroundId+'_2';
	let outputId = playgroundId+'_3';
	let initialValue = '05';
	parentDiv.innerHTML += 
	`The value of n is <input id="${inputId}" type="number" size="3" value="${initialValue}">
	<span id="${outputId}"></span>
	<canvas class="playground" id="${canvasId}" width="1024" height="400"></canvas>`;

	let c = document.getElementById(canvasId);
	let W = c.width;
	let H = c.height;
	let cx = c.getContext('2d');
	//cx.resetTransform();
	cx.imageSmoothingEnabled = false;

	let n = ~~initialValue;
	cx.font = (2*M)+'px Arial';

	let calculateOutput = ()=>{
		document.getElementById(outputId).innerHTML = `&nbsp &nbsp ${n**2} = ${(n-1)**2} + ${n} + ${n-1} &rarr; true`
	}
	
	let draw = (M)=>{
		cx.resetTransform();
		cx.clearRect(0,0,W,H);
		cx.translate(M,M);

		if (n<0) {
			cx.rotate(-.1,0);
			cx.fillStyle = 'black';
			cx.fillText('What does it mean?',5*M, 5*M); 
			document.getElementById(outputId).innerHTML = '???'
			return;
		}

		let borders = [ [0,0,n,n,"black",1],
						[0,0,n,1,"green",3],
						[(n-1),1,n,n,"blue",3],
						[0,1,(n-1),n,"red",3] ];
	
		for (let i=0;i<n;i++){
			for (let j=0;j<n;j++){
				cx.lineWidth = 1;
				cx.strokeStyle = '#CCC';
				cx.strokeRect( i*M, j*M, M,M);

				cx.fillStyle = 'black';
				cx.beginPath();
				cx.arc(i*M+M/2, j*M+M/2, M/8, 0, 2 * Math.PI);
				cx.fill(); 
			}
		}	

		if (borders){
			for (let brdr of borders){
				[r1,c1,r2,c2,color,lineThickness] = brdr;
				cx.lineWidth = lineThickness;
				cx.strokeStyle = color;
				cx.strokeRect( c1*M, r1*M, (c2-c1)*M,(r2-r1)*M);
			}
		}

		calculateOutput();
	}
	draw( n>18?M/3:M );

	document.getElementById(inputId).addEventListener("input", ()=>{
		n = ~~(document.getElementById(inputId).value);
		if (n>50){
			n=50;
			document.getElementById(inputId).value = n;
		}
		draw( n>18?M/3:M );
	});	
}