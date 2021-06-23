// 002_03.js

let prepare_002_03 = (playgroundId)=>{

	const justify = (s,k)=>{
		let txt = '00000000'+s;
		return txt.substr(txt.length-k,k);
	}

	let drawAbacus = (nStr,spikes,maxNumBeads,base=10)=>{
		// draw a spikes_ spikes abacus
		let upper = (10-maxNumBeads)*H/12;
		cx.fillStyle = "black";
		for (let i=0;i<spikes;i++){
			cx.fillRect(i*W/spikes,H/12, 5,10*H/12-upper);
		}
		cx.fillRect(-W/24,11*H/12-upper, W-W/24,.5*H/12);

		// draw beads
		let digits = nStr.split('').map(n=>~~n);		
		for (let j=spikes-1;j>=0;j--){
			cx.font = '18px Arial';
			for (let i=0;i<digits[j];i++){
				if (i<5)
					cx.fillStyle = '#F00';
				else
					cx.fillStyle = '#F58';
				cx.fillRect(j*W/spikes-W/10+W/20+2,(10-i)*H/12-upper,W/10,.8*H*1/12);
				cx.lineWidth = 2;
				cx.strokeStyle = 'black';
				cx.strokeRect(j*W/spikes-W/10+W/20+2,(10-i)*H/12-upper,W/10,.8*H*1/12);

			}
			cx.fillStyle = '#FFF';
			cx.fillRect(j*W/spikes-W/48,H*1/24-10,W/24,H*1/12);
			cx.lineWidth = 1;
			cx.strokeStyle = 'black';
			cx.strokeRect(j*W/spikes-W/48,H*1/24-10,W/24,H*1/12);

			cx.fillStyle = 'black';
			cx.fillText(digits[j],j*W/spikes-W/48+16,H*2/24+18/2-10);

			cx.font = '30px Arial';
			cx.fillStyle = 'blue';
			cx.fillText(base**(spikes-j-1),j*W/spikes-W/48+16 -(spikes-j)*3, 0);
		}
	}

	let parentDiv = document.getElementById(playgroundId);
	let canvasId = playgroundId+'_1';
	let inputId1 = playgroundId+'_2';
	let inputId2 = playgroundId+'_3';
	let initialValue1 = '7';
	let initialValue2 = '00000111';
	parentDiv.innerHTML += 
	`The number 
	 	<input id="${inputId2}" type="text" size="8" value="${initialValue2}">
	 in base 2 is the same as 
		<input id="${inputId1}" type="number" size="3" value="${initialValue1}">
	 in base 10.
	<canvas class="playground" id="${canvasId}" width="1024" height="400"></canvas>`;

	let c = document.getElementById(canvasId);
	let W = c.width;
	let H = c.height;
	let cx = c.getContext('2d');
	//cx.resetTransform();
	cx.imageSmoothingEnabled = false;
	
	let draw = (bin,dec)=>{
		cx.resetTransform();
		cx.clearRect(0,0,W,H);

		cx.setTransform(.6,0,0,.6,W/6,H/12);
		drawAbacus(bin,8,2,2);
		cx.setTransform(.6,0,0,.6,W/24+W/6,4.5*H/12);
		drawAbacus(justify(''+dec,3),3,10);

	}
	let n10 = ~~initialValue1;
	let n2 = initialValue2;
	draw(n2,n10);

	document.getElementById(inputId2).addEventListener("input", ()=>{
		let n = justify( document.getElementById(inputId2).value ,8);
		let digits = n.split('');
		for (let i=0;i<8;i++){
			digits[i] = digits[i]==0?0:1;
		}
		n = digits.join('');
		document.getElementById(inputId2).value = n;
		document.getElementById(inputId1).value = parseInt( n, 2 );
		n2 = n;
		n10 = parseInt( n, 2 );
		draw(n2,n10);
	});	

	document.getElementById(inputId1).addEventListener("input", ()=>{
		let n = ~~(document.getElementById(inputId1).value);
		n = ~~Math.abs(n);
		if (n>255) n=255;
		n = ~~((''+n).substr(0,3));
		
		document.getElementById(inputId1).value = n;
		document.getElementById(inputId2).value = justify(n.toString(2),8);
		n2 = justify(n.toString(2),8);
		n10 = n;
		draw(n2,n10);
	});	

}