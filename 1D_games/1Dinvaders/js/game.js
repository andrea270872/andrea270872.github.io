// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 100;
canvas.height = 400;
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
	lastButtonId = parseInt(obj.name);
	return false;	
}

function mouseUpOn(obj){
	//console.log("mouseDownOn" , obj.name );
	lastButtonId = -1; // reset the lastButtonId
	return false;	
}

var BLOCK_SIZE = 15;
var HALF_BLOCK_SIZE = Math.ceil(BLOCK_SIZE/2);

var spaceDown = 0;
var upDown = 0;

var shield = false;
var shieldHealth = 10;
var invadersPos = 1;
var invadersSpeed = 0.05;

// Update game objects
var update = function (delta) {
	var prev = parseInt(invadersPos);
	invadersPos += invadersSpeed * delta;
	invadersSpeed += 0.01 * delta;
	var next = parseInt(invadersPos);
	if (prev<next){
		sounds[3].play();
	}
	
	if (invadersPos>7){
		alert("game over!");
		gameOver = true;
		return;
	}

	
	
	
	
	// READ KEYS
	if (38 in keysDown) // Player holding UP
		upDown += 1;
	else
		upDown = 0;

	if (32 in keysDown) { // Player holding SPACE
		spaceDown += 1;
	} else {
		spaceDown = 0;
	}
	
	if ( (spaceDown>=1) || (lastButtonId==0)){
		// SHIELD
		shield = !shield;
	}

	if ((upDown==1) || (lastButtonId==1) ){
		// TODO FIRE
		sounds[2].play();
	}		
	
	lastButtonId = -1;
};

var invadersTimer = 0;
// Draw everything
var render = function () {
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// tank
	var x = canvas.width / 2 - HALF_BLOCK_SIZE; // centered
	var y = 23 * BLOCK_SIZE + 10;
	ctx.beginPath();
	ctx.fillStyle = '#20ff20';
	ctx.rect(x+HALF_BLOCK_SIZE-3,y, 4,4);
	ctx.rect(x,y+3, BLOCK_SIZE-1,BLOCK_SIZE-1 -3);
	ctx.fill();
	
	// shield aka bunker
	if ((shield==true) && (shieldHealth>0)){
		var x = canvas.width / 2 - HALF_BLOCK_SIZE; // centered
		var y = 21 * BLOCK_SIZE + 10;
		ctx.beginPath();
		ctx.fillStyle = '#20ff20';
		ctx.rect(x,y, BLOCK_SIZE-1,BLOCK_SIZE-1);
		ctx.fill();
		ctx.beginPath();
		ctx.fillStyle = 'black';
		ctx.rect(x+3,y+BLOCK_SIZE-4, BLOCK_SIZE-1 -3*2,3);
		ctx.fill();
	}
	
	// invaders
	for (var i=0;i<5;i++){
		ctx.fillStyle = 'white';
		
		invadersTimer ++;
		if (invadersTimer>200){
			invadersTimer=0;
		}
		if (invadersTimer>150){
			ctx.fillStyle = 'gray';
		}
		var x = canvas.width / 2 - HALF_BLOCK_SIZE; // centered
		var y = (i+parseInt(invadersPos))*2 * BLOCK_SIZE + 10;
		ctx.beginPath();
		ctx.rect(x,y, BLOCK_SIZE-1,BLOCK_SIZE-1);
		ctx.fill();
	}
	
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

var sounds = [ new Audio('audio/explosion.wav'),
               new Audio('audio/invaderkilled.wav'),
			   new Audio('audio/shoot.wav'),
			   new Audio('audio/fastinvader2.wav') ]
var startupSnd = new Audio('audio/startup.wav');
startupSnd.play();

// Let's play this game!
var then = Date.now();
setInterval(main, 30);