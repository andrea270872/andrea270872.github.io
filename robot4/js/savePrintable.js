(()=>{

let button = document.createElement("BUTTON");
button.innerHTML = 'savePrintable';
button.className = 'guiButton';
button.style = 'position:relative;top:-1em;';
document.getElementById('blocklyDiv').parentElement.prepend(button);

button.addEventListener('click' , (e)=>{
	// debug console.log( ROBOT_LEVELS );

	// prepare the page just in case
	let printableCanvas = document.createElement('canvas');
	printableCanvas.width  = 1024;
	printableCanvas.height = 768;
	const pCtx = printableCanvas.getContext('2d');

	pCtx.fillStyle = 'white';
	pCtx.rect(0, 0, printableCanvas.width, printableCanvas.height);
	pCtx.fill();

	let drawPrintableLevel = (robot_level,WHICH_ROBOT_IS_THIS)=>{
	  // degub 
	  console.log("printing robot " + WHICH_ROBOT_IS_THIS)

	  let env = robot_level.ENV;
	  for (let r=0;r<robot_level.ROWS;r++){
	    for (let c=0;c<robot_level.COLS;c++){
	      const tile = robot_level.level[r][c];
	      if (tile!=0){
	        pCtx.drawImage(images[0],
	              c*robot_level.kx+robot_level.dx,r*robot_level.ky+robot_level.dy, 
	            robot_level.kx,robot_level.ky);
	      }
	      pCtx.drawImage(images[tile],
	        c*robot_level.kx+robot_level.dx,r*robot_level.ky+robot_level.dy,
	        robot_level.kx,robot_level.ky);
	    }
	  }

	  // a dot where the robot should start
	  pCtx.beginPath();
	  pCtx.fillStyle = WHICH_ROBOT_IS_THIS?"orange":"cyan";
	  pCtx.arc((.5+robot_level.robotPos[1])*robot_level.kx+robot_level.dx,
	  			(.5+robot_level.robotPos[0])*robot_level.ky+robot_level.dy, 
	  		robot_level.kx/4, 0, Math.PI*2);  
	  pCtx.fill();

	  // draw robot
	  robotImg = images[14 + WHICH_ROBOT_IS_THIS*4]; // facing south
	  //  + WHICH_ROBOT_IS_THIS*4  => blue or orange robot!	
	  pCtx.drawImage(images[5], 	  	
			550+WHICH_ROBOT_IS_THIS*100-5,10+robot_level.ky*3/4,
			robot_level.kx-4,robot_level.ky-4); // arrow
  	  pCtx.drawImage(robotImg,
  	  	550+WHICH_ROBOT_IS_THIS*100,10,
  	  	robot_level.kx*2/3-4,robot_level.ky-4); // robot	 

  	  // bread ...space... bread
	  let down = 32*WHICH_ROBOT_IS_THIS;
	  pCtx.strokeStyle = "black";
	  pCtx.strokeRect(10-2,35-2+down, 26*12+4,24+4);
	  pCtx.drawImage(images[6],10+(0)*26,35+down ,25,24); // breadleft
	  pCtx.drawImage(images[7],10+(11)*26,35+down ,25,24); // breadright 
	}

    // *************************
	let WHICH_ROBOT_IS_THIS = 0;
	for (let robLev of ROBOT_LEVELS){
		drawPrintableLevel(robLev,WHICH_ROBOT_IS_THIS);
		WHICH_ROBOT_IS_THIS++;
	}

	// Draw common parts
	// - ingredients
	for (let i=0;i<6;i++){
		pCtx.drawImage(images[8],800+i*28,10      , 25,24); // slice of tomato
		pCtx.drawImage(images[9],800+i*28,10+28   , 25,24); // leaf of salad
		pCtx.drawImage(images[10],800+i*28,10+28*2, 25,24); // slice of ham
	}
	// - goal
	pCtx.font = "16px Arial";
    pCtx.fillStyle = "black";
    pCtx.fillText("Goal:",20,450+18);
    let goalOffset=-1;
    for(let g of GOAL){
      goalOffset++;
      pCtx.drawImage(images[g],70+goalOffset*25,450,50/2,48/2);
	}
	// - instructions
	pCtx.font = "16px Arial";
	pCtx.strokeStyle = "black";
	for (let i=0;i<4;i++){
		let row = 0;
		// fw
		pCtx.strokeRect(500+i*8*16,150 +32*row, 
						8*16,32);
		pCtx.fillStyle = "black";
	  	pCtx.fillText('forward \u2193',500+i*8*16 +16-5,150 +16+2 +32*row);

		// fw
	  	row++;
		pCtx.strokeRect(500+i*8*16,150 +32*row, 
						8*16,32);
		pCtx.fillStyle = "black";
	  	pCtx.fillText('forward \u2193',500+i*8*16 +16-5,150 +16+2 +32*row);

		// turnCW
	  	row++;
		pCtx.strokeRect(500+i*8*16,150 +32*row, 
						8*16,32);
		pCtx.fillStyle = "black";
	  	pCtx.fillText('turnCW \u21bb',500+i*8*16 +16-5,150 +16+2 +32*row);

		// turnCW
	  	row++;
		pCtx.strokeRect(500+i*8*16,150 +32*row, 
						8*16,32);
		pCtx.fillStyle = "black";
	  	pCtx.fillText('turnCW \u21bb',500+i*8*16 +16-5,150 +16+2 +32*row);

		// turnACW
	  	row++;
		pCtx.strokeRect(500+i*8*16,150 +32*row, 
						8*16,32);
		pCtx.fillStyle = "black";
	  	pCtx.fillText('turnACW \u21ba',500+i*8*16 +16-5,150 +16+2 +32*row);

		// turnACW
	  	row++;
		pCtx.strokeRect(500+i*8*16,150 +32*row, 
						8*16,32);
		pCtx.fillStyle = "black";
	  	pCtx.fillText('turnACW \u21ba',500+i*8*16 +16-5,150 +16+2 +32*row);

		// ifLast_turnCW
	  	row++;
		pCtx.strokeRect(500+i*8*16,150 +32*row, 
						8*16,32);
		pCtx.fillStyle = "blue";
	  	pCtx.fillText('ifLast __ turn\u21ba',500+i*8*16 +16-5,150 +16+2 +32*row);

		// repeat n times
	  	row++;
		pCtx.strokeRect(500+i*8*16,150 +32*row, 
						8*16,32);
		pCtx.strokeRect(500+i*8*16,150 +32*row+32, 
						3*16,16);
		pCtx.fillStyle = "white";
		pCtx.fillRect(500+i*8*16+1,150 +32*row+32-1, 
						3*16-2,2);
		pCtx.fillStyle = "blue";
	  	pCtx.fillText('repeat ___ ',500+i*8*16 +16-5,150 +16+2 +32*row);

		// untilStepOn
	  	row++;
	  	row++;	  		  	
		pCtx.strokeRect(500+i*8*16,150 +32*row, 
						8*16,32);
		pCtx.strokeRect(500+i*8*16,150 +32*row+32, 
						3*16,16);
		pCtx.fillStyle = "white";
		pCtx.fillRect(500+i*8*16+1,150 +32*row+32-1, 
						3*16-2,2);
		pCtx.fillStyle = "blue";
	  	pCtx.fillText('untilStepOn __ ',500+i*8*16 +16-5,150 +16+2 +32*row);
	}

	// DEBUG 	document.body.appendChild(printableCanvas);

	// ************************
	//console.log('!');
	//console.log(printableCanvas.toDataURL());
	const link = document.createElement('a');
	link.download = `printable_${LEVEL_NR}.png`;
	link.href = printableCanvas.toDataURL();
	link.click();
	return false;
});

})(); // run immediately