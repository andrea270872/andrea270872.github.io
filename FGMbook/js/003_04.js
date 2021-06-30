// 003_04.js

let prepare_003_04 = (playgroundId)=>{

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

	let parentDiv = document.getElementById(playgroundId);
	let canvasId = playgroundId+'_1';
	let inputId1 = playgroundId+'_2';
	let inputId3 = playgroundId+'_4';
	let outputId = playgroundId+'_3';
	let initialValue1 = '23';
	parentDiv.innerHTML += 
	`Type a number between 0 and 999: <input id="${inputId1}" type="number" size="3" value="${initialValue1}">
	 divided by [<input type="radio" id="${inputId3+'_1'}" name="${inputId3}" value="1" checked>1,
	 	<input type="radio" id="${inputId3+'_2'}" name="${inputId3}" value="10">10,
	 				  <input type="radio" id="${inputId3+'_3'}" name="${inputId3}" value="100">100] =
		<span id="${outputId}"></span>	 				  
	<canvas class="playground" id="${canvasId}" width="1024" height="400"></canvas>`;

	let c = document.getElementById(canvasId);
	let W = c.width;
	let H = c.height;
	let cx = c.getContext('2d');
	//cx.resetTransform();
	cx.imageSmoothingEnabled = false;
	
	let draw = (a,b)=>{
		//console.log(a,b);

		let result = a/~~b;
		let tmp = (''+result).split('.');
		let n = ~~tmp[0];
		if ((a%10==0) && (a<100)) tmp[1]+='0'; // to fix the strange behaviour for input = 50
		let m = ~~(tmp[1])*(1000/divideBy);
		//console.log(tmp,n,m);

		cx.resetTransform();
		cx.clearRect(0,0,W,H);

		cx.setTransform(.6,0,0,.6,-W/12,H/4);
		drawAbacus(n);
		cx.setTransform(.6,0,0,.6,W/3+W/12,H/4);
		drawAbacus(m);

		cx.resetTransform();
		cx.font = '40px Arial';
		cx.fillStyle = 'green';
		cx.fillText('dot',W*1/2-60,H*4/5); 

		document.getElementById(outputId).innerHTML = 
				`<span style="color:white;background:blue;">${ result }</span>`;
	}
	let n = ~~initialValue1;
	let divideBy = 1;
	draw(n,divideBy);

	document.getElementById(inputId1).addEventListener("input", ()=>{
		n = ~~(document.getElementById(inputId1).value);
		if ((n<0)||(n>999)){
			n = ~~Math.abs(n);
			n = ~~((''+n).substr(0,3));
			document.getElementById(inputId1).value = n;
		}
		draw(n,divideBy);
	});	

	for (let i=1;i<=3;i++){
		document.getElementById(inputId3+'_'+i).addEventListener("input", ()=>{
			divideBy = document.querySelector(`input[name=${inputId3}]:checked`).value;
			//console.log( divideBy );
		draw(n,divideBy);
		});
	}
		

}