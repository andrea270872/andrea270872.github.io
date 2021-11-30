// 003_01.js

let prepare_003_01 = (playgroundId,sheepId)=>{
	let parentDiv = document.getElementById(playgroundId);
	let M = parseFloat(getComputedStyle(parentDiv).fontSize);
	let canvasId = playgroundId+'_1';
	let inputId1 = playgroundId+'_2';
	let inputId2 = playgroundId+'_3';
	let inputId3 = playgroundId+'_4';
	let outputId = playgroundId+'_5';
	let initialValue1 = '13';
	let initialValue2 = '4';
	parentDiv.innerHTML += 
	`Il risultato di <input id="${inputId1}" type="number" size="3" value="${initialValue1}">
	diviso <input id="${inputId2}" type="number" size="2" value="${initialValue2}"> e'...
	<button id="${inputId3}" style="color:white;background:black;height:2EM;" type="button">go</button>
	&nbsp; <span id="${outputId}"></span>
	<canvas class="playground" id="${canvasId}" width="1024" height="400"></canvas>`;

	let c = document.getElementById(canvasId);
	let W = c.width;
	let H = c.height;
	let cx = c.getContext('2d');
	//cx.resetTransform();
	cx.imageSmoothingEnabled = false;
	let sheepImg = document.getElementById(sheepId);
	
	let draw = (n,m)=>{
		cx.clearRect(0,0,W,H);

		for (let i=0;i<n;i++){
			if (n<=15) {
				cx.drawImage(sheepImg,W/3+i%5*45,H/10+~~(i/5)*60,40,55);
			} else {
				let kx = 15*40/n;
				let ky = 15*55/n;
				cx.drawImage(sheepImg,W/3+i%5*(kx+2),H/10+~~(i/5)*(ky+2),kx,ky);
			}
		}

		cx.fillStyle = "black";
		let centerX = W/2-20;
		let centerY = H/3-50;
		let radiusX = W/2.5;
		let radiusY = W/6;
		for (let i=0;i<m;i++){
			let angle;
			if (m==1) angle= 90/180*Math.PI;
			else angle = (180*(i/(m-1)))/180*Math.PI;
			//console.log(angle);
			cx.fillRect(centerX+Math.cos(angle)*radiusX,
						centerY+Math.sin(angle)*radiusY,3,15);
			//console.log( Math.cos(angle)*radius , Math.sin(angle)*radius );
		}
	}
	let n = ~~initialValue1;
	let m = ~~initialValue2;
	draw(n,m);

	document.getElementById(inputId1).addEventListener("input", ()=>{
		document.getElementById(outputId).innerHTML = '';
		n = ~~(document.getElementById(inputId1).value);
		if ((n<0)||(n>50)){
			n = ~~Math.abs(n);
			n = ~~((''+Math.min(n,50)).substr(0,2));
			document.getElementById(inputId1).value = n;
		}		
		draw(n,m);
	});	
	document.getElementById(inputId2).addEventListener("input", ()=>{
		document.getElementById(outputId).innerHTML = '';
		m = ~~(document.getElementById(inputId2).value);
		if ((m<0)||(m>12)){
			m = ~~Math.abs(m);
			m = ~~((''+Math.min(m,12)).substr(0,2));
			document.getElementById(inputId2).value = m;
		}		
		draw(n,m);
	});	


	let interval;
	let time=0; // initial delay
	let sheepsNow;
	let sheepsPerFriendNow = 0;
	let animationDone = false;
	let animate = (t)=>{
		if (animationDone){
			start_pause();
			return;
		}
		if (sheepsNow<m) animationDone=true;

		cx.clearRect(0,0,W,H);

		for (let i=0;i<sheepsNow;i++){
			if (sheepsNow<=15) {
				cx.drawImage(sheepImg,W/3+i%5*45,H/10+~~(i/5)*60,40,55);
			} else {
				let kx = 15*40/sheepsNow;
				let ky = 15*55/sheepsNow;
				cx.drawImage(sheepImg,W/3+i%5*(kx+2),H/10+~~(i/5)*(ky+2),kx,ky);
			}
		}
		cx.fillStyle = "black";
		let poles = [];
		let centerX = W/2-20;
		let centerY = H/3-50;
		let radiusX = W/2.5;
		let radiusY = W/6;
		for (let i=0;i<m;i++){
			let angle;
			if (m==1) angle= 90/180*Math.PI;
			else angle = (180*(i/(m-1)))/180*Math.PI;
			let A,B;
			cx.fillRect(A=centerX+Math.cos(angle)*radiusX,
						B=centerY+Math.sin(angle)*radiusY,3,15);

			// sheeps already a friend position
			for (let j=0;j<sheepsPerFriendNow;j++){
				if (sheepsPerFriendNow<=15) {
					cx.drawImage(sheepImg,A+j%5*32 -70,B+20+~~(j/5)*42,30,40);
				} else {
					let kx = 15*30/sheepsPerFriendNow;
					let ky = 15*40/sheepsPerFriendNow;
					cx.drawImage(sheepImg,A+j%5*(kx+2) -70,B+20+~~(j/5)*(ky+2),kx,ky);
				}
			}
		}

		if (t%10==0){
			sheepsNow -= m;
			sheepsPerFriendNow += 1;
		}
	}

	let start_pause = ()=>{
		if (interval==null){
			if (m==0) {
				draw(n,m);
				cx.font = M+'px Arial';
				cx.fillText('Come faccio a dividere le mie pecore tra 0 amici?',W/4,H*3/4);
				return;
			}

			sheepsNow = n;
			document.getElementById(outputId).innerHTML = '';
			draw(n,m);
			interval = setInterval( ()=>animate(time++) ,100);
			document.getElementById(inputId3).textContent = "stop";
			document.getElementById(inputId3).style.background="#8b0000";
			// to do : freeze/disable n and m inputs
			document.getElementById(inputId1).disabled = true;
			document.getElementById(inputId2).disabled = true;
		}
		else {
			clearInterval(interval);
			document.getElementById(outputId).innerHTML = `<b>${n}</b> = ${~~(n/m)} * <b>${m}</b> + ${n%m}`;
			interval = null;
			time=0;
			animationDone = false;
			sheepsPerFriendNow = 0;
			document.getElementById(inputId3).textContent = "go";
			document.getElementById(inputId3).style.background="black";
			// to do : enable n and m inputs
			document.getElementById(inputId1).disabled = false;
			document.getElementById(inputId2).disabled = false;
		}
	}
	document.getElementById(inputId3).addEventListener("click", start_pause);


}