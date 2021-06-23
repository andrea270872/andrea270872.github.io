// 004_01.js

let prepare_004_01 = (playgroundId)=>{
	let parentDiv = document.getElementById(playgroundId);
	let M = parseFloat(getComputedStyle(parentDiv).fontSize);

	let canvasId = playgroundId+'_1';
	let inputId = playgroundId+'_2';
	let inputId2 = playgroundId+'_3';
		let initialValue = '4';
	let initialValue2 = '2';
	parentDiv.innerHTML += 
	`&nbsp; Divide the rectangle by 
		<input id="${inputId}" type="number" size="3" value="${initialValue}"> and then by 
		<input id="${inputId2}" type="number" size="3" value="${initialValue2}">
	 &nbsp; ... &nbsp; and the other way around:
	<canvas class="playground" id="${canvasId}" width="1024" height="300"></canvas>`;

	let c = document.getElementById(canvasId);
	let W = c.width;
	let H = c.height;
	let cx = c.getContext('2d');
	//cx.resetTransform();
	cx.imageSmoothingEnabled = false;

	cx.font = (2*M)+'px Arial';

	let drawRectangleDivided = (n,m)=>{
		cx.lineWidth = 1;

		cx.fillStyle = 'white';
		cx.fillRect(2*W/12,2*H/25, 8*W/12,8*H/25)
		cx.strokeStyle = 'black';
		cx.strokeRect(2*W/12,2*H/25, 8*W/12,8*H/25)

		cx.fillStyle = 'white';
		cx.fillRect(2*W/12,13*H/25, 8*W/12,8*H/25)
		cx.strokeStyle = 'black';
		cx.strokeRect(2*W/12,13*H/25, 8*W/12,8*H/25)

		let kx = 8*(W/12)/n;
		for (let i=1;i<n;i++){
			cx.beginPath();
			cx.moveTo(2*W/12+i*kx,2*H/25);
			cx.lineTo(2*W/12+i*kx,10*H/25);
			cx.stroke();
		}

		kx2 = 8*(W/12)/(n*m);
		for (let i=1;i<m+1;i++){
			cx.beginPath();
			cx.moveTo(2*W/12+i*kx2,13*H/25);
			cx.lineTo(2*W/12+i*kx2,21*H/25);
			cx.stroke();
		}

		cx.stokeStyle = 'black';
		cx.lineWidth = 4;
		cx.strokeRect(2*W/12,2*H/25, kx,8*H/25);

		cx.fillStyle = 'red';
		cx.fillRect(2*W/12,13*H/25, kx2,8*H/25);
		cx.strokeRect(2*W/12,13*H/25, kx2,8*H/25);
	}

	let draw = (n,m)=>{
		cx.resetTransform();
		cx.clearRect(0,0,W,H);

		cx.setTransform(.6,0,0,.8,-W/12,H/12);
		drawRectangleDivided(n,m);
		
		cx.setTransform(.6,0,0,.8,W/3+W/12,H/12);
		drawRectangleDivided(m,n);
	}

	let n = ~~initialValue;
	let m = ~~initialValue2;
	draw(n,m);

	document.getElementById(inputId).addEventListener("input", ()=>{
		n = ~~(document.getElementById(inputId).value);
		n = ~~Math.abs(n)
		n = ~~Math.min(n,10)
		n = ~~Math.max(n,1)		
		document.getElementById(inputId).value = n;
		draw(n,m);
	});	

	document.getElementById(inputId2).addEventListener("input", ()=>{
		m = ~~(document.getElementById(inputId2).value);
		m = ~~Math.abs(m)
		m = ~~Math.min(m,10)
		m = ~~Math.max(m,1)
		document.getElementById(inputId2).value = m;
		draw(n,m);
	});	
}