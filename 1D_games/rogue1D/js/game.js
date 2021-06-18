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

var canSlide = false;

var gotKey = false;

// Update game objects
var update = function (delta) {
	if ((playerX==15) && (playerY==1)){
		if (gotKey==false){
			gotKey = true;
		}
	}
	
	if ((gotKey==true) && (playerX==19) && (playerY==0)){
		gameOver = true;
		alert("Victory!");
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
		if (playerY==0){
			if (playerX>0){
				playerX -= 1;
			}
		} else if (playerY==1){
			if (playerX>7){
				playerX -= 1;
			}
		} else if (playerY==2){
			if (playerX>16){
				playerX -= 1;
			}
		}
	}

	if ( (rightDown==1) || (lastButtonId==2) ){
		if (playerY==0){
			if (playerX<19){
				playerX += 1;
			}
		} else if (playerY==1){
			if (playerX<16){
				playerX += 1;
			}
		} else if (playerY==2){
			if (playerX<19){
				playerX += 1;
			}
		}

	}
	
	if ((spaceDown==1) || (lastButtonId==1)){
		if ((playerX==9) && (playerY==0)){
			playerY = 1;
		} else if ((playerX==9) && (playerY==1)){
			playerY = 0;
		} else if ((playerX==16) && (playerY==1)){
			playerY = 2;
		} else if ((playerX==16) && (playerY==2)){
			playerY = 1;
		}
	}	
	
	lastButtonId = -1; // reset the lastButtonId
	
};

var playerX = 0;
var playerY = 0;

// Draw everything
var render = function () {
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	for (var i = 0; i < 20; i++){
		var x = 50+i * BLOCK_SIZE;
		
		if (playerY==0){
			if (i==9){
				ctx.beginPath();
				ctx.lineWidth = 3;
				ctx.strokeStyle = 'red';
				ctx.fillStyle = 'brown';
				ctx.rect(x,200, BLOCK_SIZE-1, BLOCK_SIZE-1);
				ctx.fill();
				ctx.stroke();
			}else if(i<10){
				ctx.beginPath();
				ctx.lineWidth = 3;
				ctx.strokeStyle = 'lightgray';
				ctx.fillStyle = 'gray';
				ctx.rect(x,200, BLOCK_SIZE-1, BLOCK_SIZE-1);
				ctx.fill();
				ctx.stroke();
			} else if (i==19){
				ctx.beginPath();
				ctx.lineWidth = 3;
				ctx.strokeStyle = 'yellow';
				ctx.fillStyle = 'gold';
				ctx.rect(x,200, BLOCK_SIZE-1, BLOCK_SIZE-1);
				ctx.fill();
				ctx.stroke();
			} else {
				ctx.beginPath();
				ctx.lineWidth = 3;
				ctx.strokeStyle = 'lightgreen';
				ctx.fillStyle = 'green';
				ctx.rect(x,200, BLOCK_SIZE-1, BLOCK_SIZE-1);
				ctx.fill();
				ctx.stroke();
			}
		} else if (playerY==1){ 
			if (i==9){
				ctx.beginPath();
				ctx.lineWidth = 3;
				ctx.strokeStyle = 'red';
				ctx.fillStyle = 'brown';
				ctx.rect(x,200, BLOCK_SIZE-1, BLOCK_SIZE-1);
				ctx.fill();
				ctx.stroke();
			} else if ( (7<=i) && (i<16) ){
				ctx.beginPath();
				ctx.lineWidth = 3;
				ctx.strokeStyle = 'lightblue';
				ctx.fillStyle = 'blue';
				ctx.rect(x,200, BLOCK_SIZE-1, BLOCK_SIZE-1);
				ctx.fill();
				ctx.stroke();
			} else if (i==16){
				ctx.beginPath();
				ctx.lineWidth = 3;
				ctx.strokeStyle = '#FFB6C1';
				ctx.fillStyle = 'pink';
				ctx.rect(x,200, BLOCK_SIZE-1, BLOCK_SIZE-1);
				ctx.fill();
				ctx.stroke();
			}
			
			if ((i==15) && (gotKey==false)){ // key
				ctx.beginPath();
				ctx.lineWidth = 1;
				ctx.strokeStyle = 'yellow';
				ctx.fillStyle = 'gold';
				ctx.rect(x+5,200+2, 5,BLOCK_SIZE-5);
				ctx.fill();
				ctx.stroke();
			}			
		} else { 
			if (i==16){
				ctx.beginPath();
				ctx.lineWidth = 3;
				ctx.strokeStyle = 'pink';
				ctx.fillStyle = 'pink';
				ctx.rect(x,200, BLOCK_SIZE-1, BLOCK_SIZE-1);
				ctx.fill();
				ctx.stroke();
			} else if ( (17<=i) && (i<28) ){
				ctx.beginPath();
				ctx.lineWidth = 3;
				ctx.strokeStyle = '#00F5FF';
				ctx.fillStyle = '#00C5CD';
				ctx.rect(x,200, BLOCK_SIZE-1, BLOCK_SIZE-1);
				ctx.fill();
				ctx.stroke();
			}
		}
	}

	var x = 50+ playerX * BLOCK_SIZE;
	ctx.beginPath();
	ctx.lineWidth = 1;
	ctx.strokeStyle = 'white';
	ctx.fillStyle = '#D0D0D0';
	ctx.rect(x+2,200+2, BLOCK_SIZE-5, BLOCK_SIZE-5);
	ctx.fill();
	ctx.stroke();

	//true1D.render();
};

/*
var true1D = {};
true1D.palette = {'.': 'C0C0C0', 'S': 'E0FFE0', '-': '909090',
					'I': '909090','X': 'FF9090',
					'B': 'EEDD82','b': 'C0C0C0',
					'C': 'CCAA40','c': 'black'};
true1D.render = function(){
	var zoom = 4;
	var x = canvas.width - level.length*zoom - 10;
	var y = 10;

	var colors = [];
	for (var i = 0; i < level.length; i++){
		colors.push( this.palette[ level[i] ] );
	}
	
	switch(blox.direction){
		case 0: { // Red-Blue
			colors[ blox.x ] = 'FF0000';
			colors[ blox.x+1 ] = '0000FF';
			break; }
		case 1: { // Blue
				  // Red
			colors[ blox.x ] = 'FF0000';
			break; }
		case 2: { // Blue-Red
			colors[ blox.x ] = '0000FF';
			colors[ blox.x+1 ] = 'FF0000';
			break; }
		case 3: {  // Red
					//Blue
			colors[ blox.x ] = '0000FF';
			break; }
	}
	
	ctx.lineWidth = 1;
	for (var i = 0; i < level.length; i++){
		ctx.beginPath();
		ctx.fillStyle = colors[i];
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

var edit=function(){

	/* VALIDATE THE STRING BEFORE CHANGING THE LEVEL!
		The string should: 
		- contain exactly 1 'I'
		- contain at least 1 'X'
		- contain only characters in '.-IXS' anything else is turned into a '.'
	*/
	var validate = function(str){
		str = str.substring(0,39)
		if (str.indexOf('I')==-1){
			str = 'I'+str.slice(1);
		}
		var tmp = '';
		for (i=0;i<str.length;i++){
			//console.log( str.charAt(i) );
			if ('.-IXSBb'.indexOf(str.charAt(i))==-1 ){
				tmp += '.';
			} else {
				tmp += str.charAt(i);
			}
		}

		//console.log( tmp );
		return tmp;
	};
	
	userInput = prompt('Write the definition of the level:',levelCode);
	if (userInput){
		levelCode = validate( userInput );
		
		// reset level
		levelJustLoaded = true;
		level = levelCode;
		blox.direction = 1;
	}
};

// setup the font and style for text
ctx.fillStyle    = '#00f';
ctx.font         = '16px sans-serif';
ctx.textBaseline = 'top';

// Let's play this game!
var then = Date.now();
setInterval(main, 30);