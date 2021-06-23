// 003_03.js

let prepare_003_03 = (playgroundId,spikes)=>{
	let parentDiv = document.getElementById(playgroundId);
	let canvasId = playgroundId+'_1';
	let inputId = playgroundId+'_2';
	let inputId2 = playgroundId+'_3';
	let initialValue = '23';
	parentDiv.innerHTML += 
	`Type a number between 0 and 9999: <input id="${inputId}" type="number" size="4" value="${initialValue}">
	<canvas class="playground" id="${canvasId}" width="1024" height="400"></canvas>`;

	let c = document.getElementById(canvasId);
	let W = c.width;
	let H = c.height;
	let cx = c.getContext('2d');
	//cx.resetTransform();
	cx.imageSmoothingEnabled = false;
	
	let draw = (n=0)=>{
		cx.resetTransform();
		cx.clearRect(0,0,W,H);
		cx.setTransform(.8,0,0,.8,W/6,H/10);

		// draw a spikes_ spikes abacus
		cx.fillStyle = "black";
		for (let i=0;i<spikes;i++){
			cx.fillRect(i*W/spikes,1*H*1/12,5,10*H*1/12);
		}
		cx.fillRect(-W/12,11*H*1/12,W,.5*H*1/12);

		// draw beads
		let nStr = ('0'.repeat(spikes+1)+n);
		nStr = nStr.substr(nStr.length-spikes);
		//console.log( nStr );
		let digits = nStr.split('').map(n=>~~n);
		//console.log( digits , typeof digits[0]);
		
		cx.font = '18px Arial';
		for (let j=spikes-1;j>=0;j--){
			for (let i=0;i<digits[j];i++){
				if (i<5)
					cx.fillStyle = '#F00';
				else
					cx.fillStyle = '#F58';
				cx.fillRect(j*W/spikes-W/10+W/20+2,(10-i)*H*1/12,W/10,.8*H*1/12);
				cx.lineWidth = 2;
				cx.strokeStyle = 'black';
				cx.strokeRect(j*W/spikes-W/10+W/20+2,(10-i)*H*1/12,W/10,.8*H*1/12);

			}
			cx.fillStyle = '#FFF';
			cx.fillRect(j*W/spikes-W/48,H*1/24-10,W/24,H*1/12);
			cx.lineWidth = 1;
			cx.strokeStyle = 'black';
			cx.strokeRect(j*W/spikes-W/48,H*1/24-10,W/24,H*1/12);

			cx.fillStyle = 'black';
			cx.fillText(digits[j],j*W/spikes-W/48+16,H*2/24+18/2-10); 
		}

	}
	draw(~~initialValue);

	document.getElementById(inputId).addEventListener("input", ()=>{
		let n = ~~(document.getElementById(inputId).value);
		if ((n<0)||(n>9999)){
			console.log(n)
			n = ''+(~~Math.abs(n));
			n = n.substr(n.length-4,4);
			n = ~~n;
			console.log(n)
			document.getElementById(inputId).value = n;
		}
		draw(n);
	});	
}