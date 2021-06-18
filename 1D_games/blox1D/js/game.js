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
              // 0123456789012345678901234567890123456789
var levelCode = "..-I---S-S-S------Bbb----X----.-..-...-";
var level = levelCode;
var levelJustLoaded = true;

// Update game objects
var update = function (delta) {

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
		if (blox.x>0){
			// rotation -90 degrees
			blox.direction = (blox.direction-1+4) % 4;

			blox.x -= blox.getW();
			brickSnd.currentTime = 0.0;
			brickSnd.play();
		}
	}
	if ( (rightDown==1) || (lastButtonId==2) ){
		if (blox.x<level.length-1){
			blox.x += blox.getW();
			brickSnd.currentTime = 0.0;
			brickSnd.play();

			// rotation 90 degrees
			blox.direction = (blox.direction+1) % 4;
		}
	}
	
	if (canSlide){ // can slide and blox is vertical
		document.getElementById("button1").setAttribute("class", "myButton");
		if ((spaceDown==1) || (lastButtonId==1)){
			blox.slide();
			brickSnd.currentTime = 0.0;
			brickSnd.play();
		}
	}else{
		document.getElementById("button1").setAttribute("class", "disabledButton");
	}
	
	lastButtonId = -1; // reset the lastButtonId
	
};

// BLOX CLASS ====================================== 
var blox = new Object();
blox.x = 0;
blox.direction = 1; // 0,1,2,3 <=> up,right,down,left
blox.getW = function(){
	var w = 1;
	switch(this.direction){
		case 0: w = 2; break;
		case 1: w = 1; break;
		case 2: w = 2; break;
		case 3: w = 1; break;
	}
	return w;
};
blox.getH = function(){
	var h = 1;
	switch(this.direction){
		case 0: h = 2; break;
		case 1: h = 1; break;
		case 2: h = 2; break;
		case 3: h = 1; break;
	}
	return h;
};

blox.slide = function(){
	this.x += this.getW();
};

blox.draw = function(){
	var x = 50+ this.x * BLOCK_SIZE;
	var y = 200 -4;
	
	switch(this.direction){
		case 0: { // Red-Blue
			ctx.lineWidth = 1;			
			ctx.beginPath();
			ctx.fillStyle = 'blue';
			ctx.rect(x,y, BLOCK_SIZE-1,BLOCK_SIZE-1);
			ctx.fill();

			ctx.beginPath();
			ctx.fillStyle = 'red';
			ctx.rect(x+BLOCK_SIZE,y, BLOCK_SIZE-1,BLOCK_SIZE-1);
			ctx.fill();

			ctx.beginPath();
			ctx.lineWidth = 1;
			ctx.strokeStyle = 'black';
			ctx.rect(x,y,BLOCK_SIZE*2-1,BLOCK_SIZE-1);
			ctx.stroke();		
			ctx.beginPath();
			ctx.lineWidth = 2;
			ctx.moveTo(x+BLOCK_SIZE,y);
			ctx.lineTo(x+BLOCK_SIZE,y+BLOCK_SIZE-1);
			ctx.stroke();		
		} break;
		case 1: { /* Blue
		             Red */
			ctx.lineWidth = 1;			
			ctx.beginPath();
			ctx.fillStyle = 'blue';
			ctx.rect(x,y-BLOCK_SIZE, BLOCK_SIZE-1,BLOCK_SIZE-1);
			ctx.fill();

			ctx.beginPath();
			ctx.fillStyle = 'red';
			ctx.rect(x,y, BLOCK_SIZE-1,BLOCK_SIZE-1);
			ctx.fill();

			ctx.beginPath();
			ctx.lineWidth = 1;
			ctx.strokeStyle = 'black';
			ctx.rect(x,y-BLOCK_SIZE,BLOCK_SIZE-1,BLOCK_SIZE*2-1);
			ctx.stroke();		
			ctx.beginPath();
			ctx.lineWidth = 2;
			ctx.moveTo(x,y);
			ctx.lineTo(x+BLOCK_SIZE,y);
			ctx.stroke();	
		} break;
		case 2: {
			ctx.lineWidth = 1;			
			ctx.beginPath();
			ctx.fillStyle = 'red';
			ctx.rect(x,y, BLOCK_SIZE-1,BLOCK_SIZE-1);
			ctx.fill();

			ctx.beginPath();
			ctx.fillStyle = 'blue';
			ctx.rect(x+BLOCK_SIZE,y, BLOCK_SIZE-1,BLOCK_SIZE-1);
			ctx.fill();
		
			ctx.beginPath();
			ctx.lineWidth = 1;
			ctx.strokeStyle = 'black';
			ctx.rect(x,y,BLOCK_SIZE*2-1,BLOCK_SIZE-1);
			ctx.stroke();		
			ctx.beginPath();
			ctx.lineWidth = 2;
			ctx.moveTo(x+BLOCK_SIZE,y);
			ctx.lineTo(x+BLOCK_SIZE,y+BLOCK_SIZE-1);
			ctx.stroke();		
		} break;
		case 3: { /* Red
					 Blue	*/
			ctx.lineWidth = 1;			
			ctx.beginPath();
			ctx.fillStyle = 'red';
			ctx.rect(x,y-BLOCK_SIZE, BLOCK_SIZE-1,BLOCK_SIZE-1);
			ctx.fill();

			ctx.beginPath();
			ctx.fillStyle = 'blue';
			ctx.rect(x,y, BLOCK_SIZE-1,BLOCK_SIZE-1);
			ctx.fill();
		
			ctx.beginPath();
			ctx.lineWidth = 1;
			ctx.strokeStyle = 'black';
			ctx.rect(x,y-BLOCK_SIZE,BLOCK_SIZE-1,BLOCK_SIZE*2-1);
			ctx.stroke();		
			ctx.beginPath();
			ctx.lineWidth = 2;
			ctx.moveTo(x,y);
			ctx.lineTo(x+BLOCK_SIZE,y);
			ctx.stroke();			} break;
	}
	
};
// BLOX CLASS ====================================== 


// Draw everything
var render = function () {
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	for (var i = 0; i < level.length; i++){
		if (levelJustLoaded && (level[i]=='I')){
			level = levelCode;
			blox.x = i;
			levelJustLoaded = false;
		}
	
		var x = 50+i * BLOCK_SIZE;
		ctx.beginPath();
		ctx.lineWidth = 3;
		ctx.strokeStyle = 'lightgray';
		
		if (level[i]=='X'){ // exit
			ctx.lineWidth = 5;
			ctx.strokeStyle = '#FF0000'; //'FF4040';
		}
		
		if (level[i]=='B'){ // button
			ctx.lineWidth = 10;
			ctx.strokeStyle = '#EEDD82'; // gold
			ctx.moveTo(x +3, 200 +1 + BLOCK_SIZE-1-2);
			ctx.lineTo(x  +BLOCK_SIZE-1-2,  200 +1 + BLOCK_SIZE-1-2);
			ctx.stroke();
			continue;
		}
		
		if (level[i]=='C'){ // button pressed
			ctx.lineWidth = 2;
			ctx.strokeStyle = '#CCAA40'; // darker gold
			ctx.moveTo(x +3, 200 +1 + BLOCK_SIZE-1-2);
			ctx.lineTo(x  +BLOCK_SIZE-1-2,  200 +1 + BLOCK_SIZE-1-2);
			ctx.stroke();
			continue;
		}
		
		if (level[i]=='S'){ // slide tile
			ctx.lineWidth = 1;
			ctx.strokeStyle = 'green';
			ctx.fillStyle = '#00FF00';
			
			// Filled triangle
			ctx.beginPath();
			ctx.moveTo(x +1, 200 +1 + BLOCK_SIZE-1-2 -4);
			ctx.lineTo(x +1 +BLOCK_SIZE-1-2,  200 +1 + BLOCK_SIZE-1-2);
			ctx.lineTo(x +1, 200 +1 + BLOCK_SIZE-1-2);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();
			continue;
		}

		if ( (level[i]=='.')||(level[i]=='b')){ // empty or openBridge
			ctx.lineWidth = 1;
			ctx.strokeStyle = 'gray';
			ctx.moveTo(x +HALF_BLOCK_SIZE-1,  200 +1 + BLOCK_SIZE-1-2);
			ctx.lineTo(x +HALF_BLOCK_SIZE+1,200 +1 + BLOCK_SIZE-1-2);
			ctx.stroke();
			continue;
		}
		
		if (level[i]=='c'){ // closed bridge
			ctx.strokeStyle = 'black';
		}
		
		ctx.moveTo(x +1, 200 +1 + BLOCK_SIZE-1-2);
		ctx.lineTo(x +1 +BLOCK_SIZE-1-2,  200 +1 + BLOCK_SIZE-1-2);
		ctx.stroke();
	}

	// CURRENT BLOCK
	blox.draw();
	

	true1D.render();
};

var true1D = {};
true1D.palette = {'.': '#C0C0C0', 'S': '#E0FFE0', '-': '#909090',
					'I': '#909090','X': '#FF9090',
					'B': '#EEDD82','b': '#C0C0C0',
					'C': '#CCAA40','c': 'black'};
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
			colors[ blox.x ] = '#FF0000';
			colors[ blox.x+1 ] = '#0000FF';
			break; }
		case 1: { // Blue
				  // Red
			colors[ blox.x ] = '#FF0000';
			break; }
		case 2: { // Blue-Red
			colors[ blox.x ] = '#0000FF';
			colors[ blox.x+1 ] = '#FF0000';
			break; }
		case 3: {  // Red
				   // Blue
			colors[ blox.x ] = '#0000FF';
			break; }
	}
	
	ctx.lineWidth = 1;
	for (var i = 0; i < level.length; i++){
		ctx.beginPath();
		ctx.fillStyle =  colors[i];
		ctx.rect(x+i*zoom,y,zoom,zoom);
		ctx.fill();
	}
	console.log( colors );
	
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

var successSnd = new Audio('audio/success.wav');
var startupSnd = new Audio('audio/startup.wav');
var brickSnd = new Audio('audio/brick.wav');
startupSnd.play();

// Let's play this game!
var then = Date.now();
setInterval(main, 30);