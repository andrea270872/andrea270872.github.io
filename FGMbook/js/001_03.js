// 001_03.js

let prepare_001_03 = (playgroundId)=>{

	let drawAbacus = (n)=>{
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

	let drawWrongAbacus = (n,m)=>{

		// draw a 3 spikes abacus
		cx.fillStyle = "black";
		cx.fillRect(W/4,1*H*1/12,5,10*H*1/12);
		cx.fillRect(2*W/4,1*H*1/12,5,10*H*1/12);
		cx.fillRect(3*W/4,1*H*1/12,5,10*H*1/12);

		cx.fillRect(W/6,11*H*1/12,W*4/6,.5*H*1/12);


		let nStr = ('000'+n);
		nStr = nStr.substr(nStr.length-3);
		let digits1 = nStr.split('').map(n=>~~n);
		let mStr = ('000'+m);
		mStr = mStr.substr(mStr.length-3);
		let digits2 = mStr.split('').map(n=>~~n);

		let digits3 = digits1.map( (v,i)=> v+digits2[i] );

		cx.font = '18px Arial';
		for (let j=2;j>=0;j--){
			for (let i=0;i<digits3[j];i++){
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
			cx.fillText(digits3[j],(j+1)*W/4-W/48+16,H*2/24+18/2-10); 
		}

	}

	let parentDiv = document.getElementById(playgroundId);
	let canvasId = playgroundId+'_1';
	let inputId1 = playgroundId+'_2';
	let inputId2 = playgroundId+'_3';
	let inputId3 = playgroundId+'_4';
	let initialValue1 = '13';
	let initialValue2 = '8';
	parentDiv.innerHTML += 
	`Type a number between 0 and 999: <input id="${inputId1}" type="number" size="3" value="${initialValue1}">
	 And another number: <input id="${inputId2}" type="number" size="3" value="${initialValue2}">
	 &nbsp Normal form?<input type="checkbox" id="${inputId3}">
	<canvas class="playground" id="${canvasId}" width="1024" height="400"></canvas>`;

	let c = document.getElementById(canvasId);
	let W = c.width;
	let H = c.height;
	let cx = c.getContext('2d');
	//cx.resetTransform();
	cx.imageSmoothingEnabled = false;
	
	let draw = (n=0,m=0)=>{
		cx.resetTransform();
		cx.clearRect(0,0,W,H);

		cx.setTransform(.5,0,0,.5,0,0);
		drawAbacus(n);
		cx.setTransform(.5,0,0,.5,0,H/2);
		drawAbacus(m);

		cx.resetTransform();
		cx.font = '50px Arial';
		cx.fillStyle = 'black';
		cx.fillText('=',W/2,H/2); 

		cx.setTransform(.5,0,0,.5,W/2,H/3);
		if (document.getElementById(inputId3).checked){
			drawAbacus(n+m);
		} else {
			drawWrongAbacus(n,m);
		}
	}
	let n = ~~initialValue1;
	let m = ~~initialValue2;
	draw(n,m);

	document.getElementById(inputId1).addEventListener("input", ()=>{
		n = ~~(document.getElementById(inputId1).value);
		if ((n<0)||(n>999)){
			n = ~~Math.abs(n);
			n = ~~((''+n).substr(0,3));
			document.getElementById(inputId1).value = n;
		}
		draw(n,m);
	});	

	document.getElementById(inputId2).addEventListener("input", ()=>{
		m = ~~(document.getElementById(inputId2).value);
		if ((m<0)||(m>999)){
			m = ~~Math.abs(m);
			m = ~~((''+m).substr(0,3));
			document.getElementById(inputId2).value = m;
		}
		draw(n,m);
	});	

	document.getElementById(inputId3).addEventListener("input", ()=>{
		draw(n,m);
	});
}