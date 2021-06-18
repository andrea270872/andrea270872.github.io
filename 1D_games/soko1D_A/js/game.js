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

              // 0123456789012345678901234567890123456789
var levelCode = 'I.......213';
levelCode = levelCode.split('');

var level = levelCode;
var levelJustLoaded = true;

// Update game objects
var update = function (delta) {

/*
	if ((level[blox.x]=='X') && (blox.direction==1)) {	// win!
		successSnd.play();
		alert("You win!");		
		// reset level ...
		gameOver = true;
	}
	
	if (blox.getW()==1){ // blox is vertical
		if ((level[blox.x]=='.')||(level[blox.x]=='b')){ // falling down
			alert("You fell!");		
			// reset level ...
			gameOver = true;
		}
	} else { // blox is horizontal
		if ( (level[blox.x]=='.') || (level[blox.x+1]=='.')||
			(level[blox.x]=='b') || (level[blox.x+1]=='b')){ // falling down
			alert("You fell!");		
			// reset level ...
			gameOver = true;
		}
	}

	if ( (level[blox.x]=='S') && (blox.getW()==1) ){
		canSlide = true;
	} else {
		canSlide = false;
	}

	if ( (level[blox.x]=='B') && (blox.getW()==1) ){ // button pressed!
		level = level.substr(0, blox.x) + 'C' + level.substr(blox.x+1);
		level = level.replace(/b/g, 'c');
	}
*/	

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
		if (playerX>0){
			playerX -= 1;
		}
	}
	if ( (rightDown==1) || (lastButtonId==2) ){
		if (playerX<level.length-1){
			playerX += 1;
		}
	}

	if ( (spaceDown==1) || (lastButtonId==1) ){
		var leftIndex = (playerX-1 +level.length) % level.length;
		var rightIndex = (playerX+1) % level.length;
		console.log( leftIndex + " "+ rightIndex);
		// swap left and right cells
		var tmp = level[leftIndex];
		level[leftIndex] = level[rightIndex];
		level[rightIndex] = tmp;
	}
	
	
	lastButtonId = -1; // reset the lastButtonId
	
};

var playerX = 0;

var PALETTE = {'I':'pink',
				'1':'#FF0000','2':'#00FF00','3':'#0000FF',
				'.':'gray'
				};

// Draw everything
var render = function () {
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	for (var i = 0; i < level.length; i++){
		if (levelJustLoaded && (level[i]=='I')){
			level = levelCode.slice(0); // clone the array
			level[i] = '.';
			playerX = i;
			levelJustLoaded = false;
		}
		
		var x = 50+i * BLOCK_SIZE;
		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.fillStyle = 'gray';
		ctx.fillStyle = PALETTE[ level[i] ];
		ctx.rect( x,200,BLOCK_SIZE,BLOCK_SIZE );
		ctx.fill();
		if (parseInt(level[i])>0){
			ctx.strokeStyle = "white";
			ctx.strokeText(level[i], x+3, 200-2);
		}
	}

	// draw player
	var x = 50+ playerX * BLOCK_SIZE;
	ctx.beginPath();
	ctx.lineWidth = 1;
	//ctx.strokeStyle = 'white';
	ctx.fillStyle = 'black';
	ctx.rect( x,200,BLOCK_SIZE,BLOCK_SIZE );
	ctx.fill();
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
ctx.font         = '16px sans-serif';
ctx.textBaseline = 'top';

// Let's play this game!
var then = Date.now();
setInterval(main, 30);