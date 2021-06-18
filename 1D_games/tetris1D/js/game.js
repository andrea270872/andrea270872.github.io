// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 700;
canvas.height = 250;
document.body.appendChild(canvas);

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

var fallButtonDown = false;

function mouseDownOn(obj){
	//console.log("mouseDownOn" , obj.name );

	var buttonId = parseInt(obj.name);
	if (buttonId!=-1){
		if (buttonId==1){ // FALL
			fallButtonDown = true;
		}

		if (blocks.length>=1){
			if (buttonId==0){ // SWAP
				var topBlock = blocks[blocks.length-1];
				var tmp = topBlock.color;
				topBlock.color = currentBlock.color;
				currentBlock.color = tmp;
				currentBlock.activeFor = 15;
			}
		}

			
		if (blocks.length>=2){
			if (buttonId==2) // REVERSE
				reversing = 10;
		}
	}
	return false;	
}

function mouseUpOn(obj){
	//console.log("mouseDownOn" , obj.name );
	fallButtonDown = false;
}

var palette = ["#FF0000","#00FF00","#0000FF","#FF00FF","#FFFFFF","#000000"];

// LEVELS [
var Level = function(speed,bkColor){
	this.speed = speed;
	this.background = bkColor;
};

var _levels = [new Level(35,"white"),new Level(90,"pink"),new Level(200,"#70D070")];
var _currentLevel = 0;
// ] LEVELS

var Block = function(initialX){
	this.x = initialX;
	this.color = parseInt(Math.random()*palette.length);
	this.activeFor = 0;
	this.toString = function(){
		return this.x+","+this.color;
	};
	this.setColor = function(color){
		this.color = color;
		return this;
	};
}


var score = 0;
var blocks = []
var currentBlock = new Block(50);
var nextBlock = new Block(50);
var block_speed = _levels[_currentLevel].speed;
var BLOCK_SIZE = 15;
var HALF_BLOCK_SIZE = Math.ceil(BLOCK_SIZE/2);

var spaceDown = 0;
var leftDown = 0;
var rightDown = 0;
var R_Down = 0;

var reversing = 0;

// Update game objects
var update = function (delta) {
	currentBlock.x += block_speed * delta; // FPS?
	
	var stopAt = canvas.width-BLOCK_SIZE;
	var topBlock = null;
	if (blocks.length>=1){
		topBlock = blocks[blocks.length-1];
		stopAt = canvas.width - (blocks.length+1)*BLOCK_SIZE;
	}
	
	if (currentBlock.x >= stopAt){
		currentBlock.x = stopAt;
		blocks.push(currentBlock);
		currentBlock = nextBlock;
		nextBlock = new Block(50);
    }

	if (stopAt<=60){
		alert("game over!");
		gameOver = true;
	}

	if (37 in keysDown) // Player holding LEFT
		leftDown += 1;
	else
		leftDown = 0;
	if (39 in keysDown) // Player holding RIGHT
		rightDown += 1;
	else
		rightDown = 0;

	if (32 in keysDown) { // Player holding SPACE
		spaceDown += 1;
	} else {
		spaceDown = 0;
	}
	
	if (82 in keysDown) { // Player holding >R<
		R_Down += 1;
	} else {
		R_Down = 0;
	}
	
	if (leftDown==1){
		if (blocks.length>=2){
			reversing = 10;
		}		
	}
	
	if (rightDown==1){
		if (topBlock!=null){ // SWAP
			var tmp = topBlock.color;
			topBlock.color = currentBlock.color;
			currentBlock.color = tmp;
			currentBlock.activeFor = 15;
		}
	}
	
	if (R_Down==1){
			//console.log(blocks.toString());
			randomize();
			//console.log(blocks.toString());
	} 
	if (R_Down>5)  // repetition
		R_Down = 0;
	
	//console.log(fallingFor);
	if ((spaceDown>=1) || (fallButtonDown)){
		block_speed += 10.0;
	} else {
		block_speed = _levels[_currentLevel].speed;
	}	
	
	// compress the stack
	blocks = matchAndCompact(blocks);	
	if (currentBlock.activeFor>0){
		if (blocks.length>=1){
			blocks[blocks.length-1].activeFor = currentBlock.activeFor;
		}
	}

	// go to next level?
	if (score>=500){
		if (_currentLevel>=_levels.length-1){
			win = true;
			gameOver = true;
			alert("You win!");
		} else {
			// show splash screen for a while, then ...
			// ???
			// load the new level
			score = 0;
			_currentLevel++;
			startupSnd.play();
		}
	}
};

var matchAndCompact = function(blocks){
	if (blocks.length<=1){
		return blocks;
	}
		
	var newBlocks = [];
	var lastColor = blocks[0].color;
	var counter = 0;

	//console.log( blocks );
	var i=0;
	while (i<blocks.length){
		if (lastColor == blocks[i].color){
			counter++;
		} else {
			if (counter==1){
				newBlocks[newBlocks.length] = new Block(0).setColor(lastColor);
			} else if (counter==2){
				newBlocks[newBlocks.length] = new Block(0).setColor(lastColor);
				newBlocks[newBlocks.length] = new Block(0).setColor(lastColor);
			} else if (counter>=3){
				score += 100;
				successSnd.play();
			}
			lastColor = blocks[i].color;
			counter = 1;
		}
		i++;
	}
	if (counter==1){
		newBlocks[newBlocks.length] = new Block(0).setColor(lastColor);
	} else if (counter==2){
		newBlocks[newBlocks.length] = new Block(0).setColor(lastColor);
		newBlocks[newBlocks.length] = new Block(0).setColor(lastColor);	
	} else if (counter>=3){
		score += 100;
		successSnd.play();
	}
	
	return reAllign(newBlocks);
}

var reAllign = function(blocks){
	// re-allign blocks
	lastBlockX = canvas.width;
	for (var i=0;i<blocks.length;i++){
		lastBlockX -= BLOCK_SIZE;
		blocks[i].x = lastBlockX;
	}
	return blocks;
}

var randomize = function(){
	for (var i=0;i<20;i++){
		var a = parseInt( Math.random() * blocks.length );
		var b = parseInt( Math.random() * blocks.length );
		var tmp = blocks[a].color;
		blocks[a].color = blocks[b].color;
		blocks[b].color = tmp;
	}
}

var drawBlock = function(block){
	var blockCX = block.x + HALF_BLOCK_SIZE-1;
	var blockCY = 200-HALF_BLOCK_SIZE+1 + HALF_BLOCK_SIZE-1;
	
	ctx.save();
	if (block.activeFor>0){
		block.activeFor--;
		ctx.translate(blockCX,blockCY);
		var degrees = 90-6 * block.activeFor; //block.x % 180;
		ctx.rotate( degrees * (Math.PI / 180) );
		ctx.translate(-blockCX,-blockCY);
	}
	
	ctx.beginPath();	
	ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
	ctx.fillStyle = palette[block.color];
	ctx.rect(block.x,200-HALF_BLOCK_SIZE+1,BLOCK_SIZE-1,BLOCK_SIZE-1);
	ctx.fill();
	ctx.stroke();

	ctx.restore();

};

var drawNextBlock = function(block){
	ctx.beginPath();	
	ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
	ctx.fillStyle = palette[block.color];
	ctx.rect(10,10,BLOCK_SIZE-1,BLOCK_SIZE-1);
	ctx.fill();
	ctx.stroke();
};

// Draw everything
var render = function () {
	ctx.fillStyle = _levels[_currentLevel].background;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// axis	
	ctx.beginPath();
	ctx.strokeStyle = 'gray';
	ctx.lineWidth = 1;
	ctx.moveTo(0,200);
	ctx.lineTo(canvas.width,200);

	ctx.moveTo(60-HALF_BLOCK_SIZE,200-10);
	ctx.lineTo(60-HALF_BLOCK_SIZE,200+10);

	ctx.moveTo(canvas.width-HALF_BLOCK_SIZE,200-10);
	ctx.lineTo(canvas.width-HALF_BLOCK_SIZE,200+10);
	ctx.stroke();

	// draw all blocks already stacked
	for (var i = 0; i < blocks.length; i++){
		ctx.save();	
		if (reversing>0){
			/*var centeredIndex = (blocks.length/2-i);
			ctx.translate(0,blocks.length/4-centeredIndex*centeredIndex/(blocks.length/2));
			*/
			ctx.translate(0,Math.sin(Math.PI/6*i)*4);
		}
		drawBlock(blocks[i]);
		ctx.restore();
	}
	if (reversing>0){
		reversing--;
		if (reversing==5)
			blocks.reverse();
	}
	
	drawBlock(currentBlock);
	drawNextBlock(nextBlock);

	ctx.strokeStyle = 'black';
	ctx.strokeText(""+score, canvas.width-50, 10);

};

var gameOver = false;
var win = false;

// The main game loop
var main = function () {

	if (gameOver==false){
		var now = Date.now();
		var delta = now - then;


		update(delta / 1000.0);
		render();

		then = now;
	}
};

// setup the font and style for text
ctx.fillStyle    = '#00f';
ctx.font         = '16px sans-serif';
ctx.textBaseline = 'top';

var successSnd = new Audio('audio/success.wav');
var startupSnd = new Audio('audio/startup.wav');
startupSnd.play();

// Let's play this game!
var then = Date.now();
setInterval(main, 30);