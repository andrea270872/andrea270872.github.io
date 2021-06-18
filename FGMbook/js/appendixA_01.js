// appendixA_01.js

let prepare_appendixA_01 = (playgroundId)=>{

	let parentDiv = document.getElementById(playgroundId);
	let canvasId = playgroundId+'_1';
	let inputId = playgroundId+'_2';
	let outputId1 = playgroundId+'_3';
	let inputId2 = playgroundId+'_4';
	let initialValue = '325';
	let initialValue2 = '10';
	parentDiv.innerHTML += 
	`Type a number between 0 and 999: <input id="${inputId}" type="number" size="3" value="${initialValue}">
	= <span style="display:inline-block;width:6em" id="${outputId1}"></span>
	<i>when <b>x</b> is <input id="${inputId2}" type="number" size="4" step=".5" value="${initialValue2}"></i>
	<canvas class="playground" id="${canvasId}" width="1024" height="400"></canvas>`;

	let c = document.getElementById(canvasId);
	let W = c.width;
	let H = c.height;
	let cx = c.getContext('2d');
	//cx.resetTransform();
	cx.imageSmoothingEnabled = false;
	
	let output1 = document.getElementById(outputId1);

	const threshold = (x)=>{
		if (Math.abs(x)<=12)
			return x;
		return (10+Math.log10(Math.abs(x))*3)*Math.sign(x);
	}

	const brighter = (r,g,b)=>{
		//console.log('=1=>',r,g,b)
		r = Math.min(255, r*1.4);
		g = Math.min(255, g*1.4);
		b = Math.min(255, b*1.4);
		//console.log('=2=>',r,g,b)
		return [r,g,b];
	}
	const softer = (r,g,b)=>{
		r = Math.min(255, r+120);
		g = Math.min(255, g+120);
		b = Math.min(255, b+120);
		return `rgb(${r},${g},${b})`;
	}

	let draw = (n=0)=>{
		cx.resetTransform();
		cx.clearRect(0,0,W,H);
		cx.setTransform(.8,0,0,.8,-W/30,H/8);


		let offsetsX = [-W/48 * (threshold(X)-12), 0, +W/48 * (threshold(X)-12) ];
		// draw a 3 spikes abacus
		cx.fillStyle = "black";
		for (let j=1;j<=3;j++){
			cx.fillRect(offsetsX[j-1]+j * W/4,1*H*1/12,
							5,10*H*1/12);
		}
		cx.fillRect(W/10,11*H*1/12,W*5/6,.5*H*1/12);

		// draw beads
		let nStr = ('000'+n);
		nStr = nStr.substr(nStr.length-3);
		//console.log( nStr );
		let digits = nStr.split('').map(n=>~~n);
		//console.log( digits , typeof digits[0]);

		output1.innerHTML = `${digits[0]*X**2+digits[1]*X+digits[2]}`;
		
		cx.font = '18px Arial';
		let baseColor = [100,70,0];
		for (let j=2;j>=0;j--){ // j is the current spike
			let color1 = `rgb(${baseColor[0]},${baseColor[1]},${baseColor[2]})`;
			let color2 = softer(...baseColor);

			for (let i=0;i<digits[j];i++){
				if (i<5) 
					cx.fillStyle = color1; //'#F00';
				else
					cx.fillStyle = color2; // '#F58';
				cx.fillRect(j*W/30+
						offsetsX[j]+(j+1)*W/4-W/10+W/20+2,(10-i)*H*1/12,
								W/30,.8*H*1/12);
								//W/10,.8*H*1/12);								
				cx.lineWidth = 2;
				cx.strokeStyle = 'black';
				cx.strokeRect(j*W/30+
					offsetsX[j]+(j+1)*W/4-W/10+W/20+2,(10-i)*H*1/12,
								W/30,.8*H*1/12);
			}

			if (Math.abs(X)>=.5){
				cx.fillStyle = '#FFF';
				cx.fillRect(offsetsX[j]+ (j+1)*W/4-W/48,H*1/24-10,W/24,H*1/12);
				cx.lineWidth = 1;
				cx.strokeStyle = 'black';
				cx.strokeRect(offsetsX[j]+ (j+1)*W/4-W/48,H*1/24-10,W/24,H*1/12);

				cx.font = '18px Arial';
				cx.fillStyle = 'black';
				cx.fillText(digits[j],offsetsX[j]+ (j+1)*W/4-W/48+16,H*2/24+18/2-10); 
			}
			
			if (Math.abs(X)>=2){
				cx.font = '30px Arial';
				cx.fillStyle = 'blue';
				cx.fillText(X**(3-j-1),offsetsX[j]+ (j*W/3+W/6)*.8+W/12.5, 0);			
			}
			baseColor = brighter(...baseColor);
		}

		cx.lineWidth = 1;
		cx.font = '30px Arial';
		for (let j=2;j>=0;j--){ // j is the current spike
			if ((j==2) || (X!=0)){
				cx.fillStyle = 'black';
				//console.log(j==0,digits);
				cx.fillText(digits[j]+' *',
					W*14/12 - 45,j*H*1/4 + 25,
					50,30);
				cx.fillText( (j<2?'+':''),
					W*14/12+ Math.abs(threshold(X))*4+5+10,j*H*1/4 + 25,
					50,30);
			}
		}
		cx.fillStyle = 'white';
		cx.strokeStyle = 'green';
		if (X!=0){
			// x^2
			let j=0;
			cx.fillRect(W*14/12,j*H*1/4,
						Math.abs(threshold(X))*4+5,Math.abs(threshold(X))*4+5);
			cx.strokeRect(W*14/12,j*H*1/4,
						Math.abs(threshold(X))*4+5,Math.abs(threshold(X))*4+5);
			// x
			j=1
			cx.fillRect(W*14/12,j*H*1/4,
						threshold(Math.abs(X)**.5)*4+5,threshold(Math.abs(X)**.5)*4+5);
			cx.strokeRect(W*14/12,j*H*1/4,
						threshold(Math.abs(X)**.5)*4+5,threshold(Math.abs(X)**.5)*4+5);
		}
		// const
		j=2
		cx.fillRect(W*14/12,j*H*1/4,
					1*4+5,1*4+5);
		cx.strokeRect(W*14/12,j*H*1/4,
					1*4+5,1*4+5);


	}
	let X = 10;
	let n = ~~initialValue;
	draw(n);

	document.getElementById(inputId2).addEventListener("input", ()=>{
		X = parseFloat(document.getElementById(inputId2).value);
		if (isNaN(X)) X=0;
		document.getElementById(inputId2).value = X;
		draw(n);
	})

	document.getElementById(inputId).addEventListener("input", ()=>{
		n = ~~(document.getElementById(inputId).value);
		if ((n<0)||(n>999)){
			n = ~~Math.abs(n);
			n = ~~((''+n).substr(0,3));
			document.getElementById(inputId).value = n;
		}
		draw(n);
	});	
}