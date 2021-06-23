// 001_01.js

let prepare_001_01 = (playgroundId)=>{
	let parentDiv = document.getElementById(playgroundId);
	let canvasId = playgroundId+'_1';
	let inputId = playgroundId+'_2';
	let initialValue = '23';
	parentDiv.innerHTML += 
	`Scrivi un numero tra 0 e 999: <input id="${inputId}" type="number" size="3" value="${initialValue}">
	<canvas class="playground" id="${canvasId}" width="1024" height="400"></canvas>`;

	let c = document.getElementById(canvasId);
	let W = c.width;
	let H = c.height;
	let cx = c.getContext('2d');
	//cx.resetTransform();
	cx.imageSmoothingEnabled = false;
	
	let draw = (n=0)=>{
		cx.clearRect(0,0,W,H);

		// draw a 3 spikes abacus
		cx.fillStyle = "black";
		cx.fillRect(W/4,1*H*1/12,5,10*H*1/12);
		cx.fillRect(2*W/4,1*H*1/12,5,10*H*1/12);
		cx.fillRect(3*W/4,1*H*1/12,5,10*H*1/12);

		cx.fillRect(W/6,11*H*1/12,W*4/6,.5*H*1/12);

		// draw beads
		let nStr = ('000'+n);
		nStr = nStr.substr(nStr.length-3);
		//console.log( nStr );
		let digits = nStr.split('').map(n=>~~n);
		//console.log( digits , typeof digits[0]);
		
		cx.font = '18px Arial';
		for (let j=2;j>=0;j--){
			for (let i=0;i<digits[j];i++){
				if (i<5) 
					cx.fillStyle = '#F00';
				else
					cx.fillStyle = '#F58';
				cx.fillRect((j+1)*W/4-W/10+W/20+2,(10-i)*H*1/12,W/10,.8*H*1/12);
				cx.lineWidth = 2;
				cx.strokeStyle = 'black';
				cx.strokeRect((j+1)*W/4-W/10+W/20+2,(10-i)*H*1/12,W/10,.8*H*1/12);

			}
			cx.fillStyle = '#FFF';
			cx.fillRect((j+1)*W/4-W/48,H*1/24-10,W/24,H*1/12);
			cx.lineWidth = 1;
			cx.strokeStyle = 'black';
			cx.strokeRect((j+1)*W/4-W/48,H*1/24-10,W/24,H*1/12);

			cx.fillStyle = 'black';
			cx.fillText(digits[j],(j+1)*W/4-W/48+16,H*2/24+18/2-10); 
		}

	}
	draw(~~initialValue);

	document.getElementById(inputId).addEventListener("input", ()=>{
		let n = ~~(document.getElementById(inputId).value);
		if ((n<0)||(n>999)){
			n = ~~Math.abs(n);
			n = ~~((''+n).substr(0,3));
			document.getElementById(inputId).value = n;
		}
		draw(n);
	});	
}