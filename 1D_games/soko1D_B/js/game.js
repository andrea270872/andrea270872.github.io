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

var lastButtonId = -1;
function mouseDownOn(obj){
	//console.log("mouseDownOn" , obj.name );
	lastButtonId = parseInt(obj.name);
	return false;	
}

function mouseUpOn(obj){
	//console.log("mouseDownOn" , obj.name );
	return false;	
}

var score = 0;
var BLOCK_SIZE = 15;
var HALF_BLOCK_SIZE = Math.ceil(BLOCK_SIZE/2);

var spaceDown = 0;
var leftDown = 0;
var rightDown = 0;
var R_Down = 0;

// L ->  position of the player going towards right
// R ->  position of the player going towards left
// P -> platform to place a box
// B -> a box on a platform
// W -> wall
// . -> empty space
// The level is represented as 2 levels: 
//           ground with platforms, and objects, where player, walls and boxes are
var levelCode = '.W .W .> .. .. .. P. P. P. .. .. .B .. .B .B .W .W';
var levelCode = levelCode.split(' ');
for (var i=0;i<levelCode.length;i++){
	levelCode[i] = levelCode[i].split('');
}

var level = levelCode;
var levelJustLoaded = true;

// Update game objects
var collision = function(direction){
	if (level[playerX+direction][1]=='W'){
		return true;
	} else 	if (level[playerX+direction][1]=='B'){
		// TODO 
		// 1- check if the block is free
		if (level[playerX+direction*2][1]=='.'){
			// 2- Move the block
			level[playerX+direction*2][1] = 'B';
			return false;
		} else {
			return true;
		}
	}
	
	return false;
};

var movePlayer = function(direction){
	if (level[playerX][1]=='>'){
		if (direction==+1){
			if (!collision(direction)){				
				level[playerX][1] = '.';
				level[playerX+1][1] = '>';
				playerX += 1;
			}
		} else {
			playerFacing = -1;
			level[playerX][1] = '<';
		}
	} else if (level[playerX][1]=='<'){
		if (direction==-1){
			if (!collision(direction)){			
				level[playerX][1] = '.';
				level[playerX-1][1] = '<';		
				playerX -= 1;
			}
		} else {
			playerFacing = +1;
			level[playerX][1] = '>';
		}
	}

};

var update = function (delta) {

	var allBoxesOnPlatform = true;
	for (var i = 0; i < level.length; i++){
		if ((levelCode[i][0]=='P') && (levelCode[i][1]!='B')){
			allBoxesOnPlatform = false;
			break;
		}
	}
	if (allBoxesOnPlatform==true){
		alert("Victory!");
		gameOver = true;
		return;
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
	
	// key repeat
	if (rightDown>15) rightDown -= 15;
	if (leftDown>15) leftDown -= 15;
	if (spaceDown>15) spaceDown -= 15;
	
	if ( (leftDown==1) || (lastButtonId==0) ){
		movePlayer(-1);
	}
	if ( (rightDown==1) || (lastButtonId==2) ){
		movePlayer(+1);
	}

	if ( (spaceDown==1) || (lastButtonId==1) ){
		// swap left and right cells
		var nextIndex = playerX+playerFacing;
		if (level[nextIndex][1]=='B'){
			level[nextIndex][1] = level[playerX][1];
			level[playerX][1] = 'B';
			playerX += playerFacing;
		}
	}
	
	lastButtonId = -1; // reset the lastButtonId
	
};

var playerX = 0;
var playerFacing = +1; 

var PALETTE = {'>':'#0000D0', '<':'#5050FF',
				'P':'brown',
				'B':'cyan',
				'W':'purple'
				};

// Draw everything
var render = function () {
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	for (var i = 0; i < level.length; i++){
		if (levelJustLoaded && (levelCode[i][1]=='>')){
			level = levelCode.slice(0); // clone the array
			playerX = i;
			levelJustLoaded = false;
		}
		
		var x = 50+i * BLOCK_SIZE;
		ctx.lineWidth = 1;

		ctx.beginPath();
		ctx.fillStyle = '#F0F0F0';
		ctx.fillStyle = PALETTE[ level[i][1] ];
		ctx.rect( x,200,              BLOCK_SIZE-1,BLOCK_SIZE-4 );
		ctx.fill();

		ctx.beginPath();
		ctx.fillStyle = '#F0F0F0';
		ctx.fillStyle = PALETTE[ level[i][0] ];
		ctx.rect( x,200+BLOCK_SIZE-3, BLOCK_SIZE-1,           3 );
		ctx.fill();

		/*
		ctx.beginPath();
		ctx.strokeStyle = "white";
		ctx.strokeText(level[i], x, 200-2);
		*/
	}
};

var gameOver = false;
var win = false;

// The main game loop
var main = function () {

	if (gameOver==false){
		var now = Date.now();
		var delta = now - then;

		if (!levelJustLoaded)
			update(delta / 1000.0);
		render();

		then = now;
	}
};

// setup the font and style for text
ctx.fillStyle    = '#00f';
ctx.font         = '12px sans-serif';
ctx.textBaseline = 'top';

// Let's play this game!
var then = Date.now();
setInterval(main, 30);