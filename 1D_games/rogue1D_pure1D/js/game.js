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

// classes ------------------------------------------
var Room = function(width,color){
	this.width = width;
	this.color = color;
	this.doors =  [];
	
	this.addDoor = function(otherRoom,fromX,toX){
		this.doors.push( [fromX,otherRoom,toX] );
		otherRoom.doors.push( [toX,this,fromX] );
	};
	this.draw = function(){
		for (var i=0;i<this.width;i++){
			var x = 50 + i*BLOCK_SIZE;
			ctx.beginPath();
			ctx.lineWidth = 2;
			ctx.strokeStyle = 'gray';
			ctx.fillStyle = this.color;
			ctx.rect(x,200, BLOCK_SIZE-1, BLOCK_SIZE-1);
			ctx.fill();
			ctx.stroke();
		}
		for (var i=0;i<this.doors.length;i++){
			var doorX = this.doors[i][0];
			var x = 50 + doorX*BLOCK_SIZE;
			ctx.beginPath();
			ctx.lineWidth = 2;
			ctx.strokeStyle = 'gray';
			ctx.fillStyle = '#00FF00';
			ctx.rect(x,200, BLOCK_SIZE-1, BLOCK_SIZE-1);
			ctx.fill();
			ctx.stroke();
		}
	};
	this.whichDoor = function(){
		for (var i=0;i<this.doors.length;i++){
			var doorX = this.doors[i][0];
			if (doorX==playerX){
			   return this.doors[i];
			}
		}
		return null;
	};
	return this;
};

var rooms = [ new Room(5,'red') , new Room(8,'blue') , new Room(12,'green') ];
rooms[0].addDoor( rooms[1], 0 , 1 );
rooms[0].addDoor( rooms[2], 3 , 11 );
rooms[2].addDoor( rooms[1], 5 , 5 );

var currentRoom = rooms[0];

// classes ------------------------------------------

var score = 0;
var BLOCK_SIZE = 15;
var HALF_BLOCK_SIZE = Math.ceil(BLOCK_SIZE/2);

var spaceDown = 0;
var leftDown = 0;
var rightDown = 0;
var R_Down = 0;

var canSlide = false;

var gotKey = false;

// Update game objects
var update = function (delta) {
/*	if ((playerX==15) && (playerY==1)){
		if (gotKey==false){
			gotKey = true;
		}
	}
	
	if ((gotKey==true) && (playerX==19) && (playerY==0)){
		gameOver = true;
		alert("Victory!");
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
		if (playerX<currentRoom.width-1){
			playerX += 1;
		}
	}
	
	if ((spaceDown==1) || (lastButtonId==1)){
		var door = currentRoom.whichDoor();
		if (door!=null){
			currentRoom = door[1];
			playerX = door[2];
		}
	}	
	
	lastButtonId = -1; // reset the lastButtonId
	
};

var playerX = 0;

// Draw everything
var render = function () {
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	currentRoom.draw();
	
	var x = 50+ playerX * BLOCK_SIZE;
	ctx.beginPath();
	ctx.lineWidth = 1;
	ctx.fillStyle = 'white';
	ctx.rect(x+4,200+4, BLOCK_SIZE-9, BLOCK_SIZE-9);
	ctx.fill();
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

// Let's play this game!
var then = Date.now();
setInterval(main, 30);