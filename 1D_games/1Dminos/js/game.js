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

		if (buttonId==0){ // SWAP
			/* should swap the last element of the currentBlock with
			   the first element of the pile
			*/
			if (pile.length>=1){
				var tmp1 = pile.shift();
				var tmp2 = currentBlock.colors.pop();
				pile.unshift(tmp2);
				currentBlock.colors.push(tmp1);
			}
		}

		if (buttonId==2){ // REVERSE
			currentBlock.colors.reverse();
		}
	}
	return false;	
}

function mouseUpOn(obj){
	//console.log("mouseDownOn" , obj.name );
	fallButtonDown = false;
}

var PALETTE = ["#FF0000","#00FF00","#0000FF","#FF00FF","#FFFFFF","#000000"];

// LEVELS [
var Level = function(speed,bkColor){
	this.speed = speed;
	this.background = bkColor;
};

var _levels = [new Level(85,"white"),new Level(90,"pink"),new Level(200,"#70D070")];
var _currentLevel = 0;
// ] LEVELS

var BLOCK_TYPES = [ [0],[1],[2],[0,1],[1,2],[0,1,2],[0,0,1] ];
var Block = function(){
	this.type = parseInt(Math.random()*BLOCK_TYPES.length);
	this.colors = BLOCK_TYPES[this.type].slice(0); // clone the structure of the colors
	this.getColors = function(){
		return this.colors;
	};
	this.getWidth = function(){
		return this.colors.length;
	};
}

var score = 0;
var pile = [] // contains indexes of colors from the palette
var currentBlock = new Block();
var currentBlockX = 50;
var nextBlock = new Block();
var block_speed = _levels[_currentLevel].speed;
var BLOCK_SIZE = 15;
var HALF_BLOCK_SIZE = Math.ceil(BLOCK_SIZE/2);
var END_POS = canvas.width;

var spaceDown = 0;
var leftDown = 0;
var rightDown = 0;
var R_Down = 0;

// Update game objects
var update = function (delta) {
	currentBlockX += block_speed * delta; // FPS?

	var stopAt = END_POS - pile.length*BLOCK_SIZE;

	if (currentBlockX+currentBlock.getWidth()*BLOCK_SIZE >= stopAt){
		pile = currentBlock.getColors().concat(pile);

		currentBlockX = 50;
		currentBlock = nextBlock;
		
		nextBlock = new Block();
    }

	
	if (stopAt<=60){
		alert("game over!");
		gameOver = true;
	}


	// READ KEYS
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

	if ((spaceDown>=1) || (fallButtonDown)){
		block_speed += 10.0;
	} else {
		block_speed = _levels[_currentLevel].speed;
	}	

	
	if (leftDown==1){ // REV
		currentBlock.colors.reverse();
	}
	
	if (rightDown==1){ // SWAP
		if (pile.length>=1){
			var tmp1 = pile.shift();
			var tmp2 = currentBlock.colors.pop();
			pile.unshift(tmp2);
			currentBlock.colors.push(tmp1);
		}
	}
	

	if (R_Down>5)  // repetition
		R_Down = 0;
		
	// compress the stack
	matchAndCompact();	

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

var matchAndCompact = function(){
	if (pile.length<=1){
		return;
	}

	// count occurrences
	var counters = [];
	var counter = 1;
	for (var i=1;i<pile.length;i++){
		if (pile[i-1]==pile[i]){
			counter++;
		} else {
			counters.push([counter,pile[i-1]]);
			counter = 1;
		}
	}
	counters.push([counter,pile[i-1]]);
	//console.log(counters);
	
	// expand all elements with less than 3 occurrences
	var newPile = [];
	for (var i=0;i<counters.length;i++){
		if (counters[i][0]==1){
			newPile.push( counters[i][1] );
		} else if (counters[i][0]==2){
			newPile.push( counters[i][1] );
			newPile.push( counters[i][1] );
		} else {
			score += 100*(counters[i][0]-2);
			successSnd.play();
		}
	}
	pile = newPile;
}

var drawBlock = function(xPos,yPos,colorIndex){
	var blockCX = xPos;
	var blockCY = yPos-HALF_BLOCK_SIZE+1;
	
	ctx.beginPath();	
	ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
	ctx.fillStyle = PALETTE[colorIndex];
	ctx.rect(blockCX,blockCY,BLOCK_SIZE-1,BLOCK_SIZE-1);
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

	// draw the pile of blocks
	var x = END_POS - pile.length*BLOCK_SIZE;
	for (var i = 0; i < pile.length; i++){
		drawBlock(x,200,pile[i]);
		x += BLOCK_SIZE;
	}

	// CURRENT BLOCK
	var x = currentBlockX;
	var colors = currentBlock.getColors();
	for (var i = 0; i < colors.length; i++){
		drawBlock(x,200,colors[i]);
		x += BLOCK_SIZE;
	}
	
	// NEXT BLOCK
	var x = 10;
	var colors = nextBlock.getColors();
	for (var i = 0; i < colors.length; i++){
		drawBlock(x,10,colors[i]);
		x += BLOCK_SIZE;
	}
	
	ctx.strokeStyle = 'black';
	ctx.strokeText(""+score, canvas.width-50, 10);

	//true1D.render();
};

/*
var true1D = {};
true1D.palette = {'.': 'C0C0C0', 'S': 'E0FFE0', '-': '909090','I': '909090','X': 'FF9090'};
true1D.render = function(){
	var zoom = 2;
	var x = canvas.width-10 -pile.length*zoom;
	var y = 80;

	ctx.lineWidth = 1;
	for (var i = 0; i < pile.length; i++){
		ctx.beginPath();
		ctx.fillStyle = PALETTE[ pile[i] ];
		ctx.rect(x+i*zoom,y,zoom,zoom);
		ctx.fill();
	}

	var x = canvas.width-10 -48*zoom  +
				parseInt(((currentBlockX-50)/(BLOCK_SIZE-1))*zoom);
	var colors = currentBlock.getColors();
	for (var i = 0; i < colors.length; i++){
		ctx.beginPath();
		ctx.fillStyle = PALETTE[ colors[i] ];
		ctx.rect(x+i*zoom,y,zoom,zoom);
		ctx.fill();
	}
};
*/

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