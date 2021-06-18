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

var balls = 3;

var ball = new Object();
ball.init = function(){
	this.y = 10;
	this.speed = 30;
	this.rad = 5;
	return this;
};
ball.draw = function(x,y){	
	ctx.beginPath();
	ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
	ctx.fillStyle = 'silver';
	ctx.arc(x, y, ball.rad, 0 , 2 * Math.PI, false);
	ctx.fill();
	ctx.stroke();
	
	ctx.beginPath();
	ctx.lineWidth = 1;
    ctx.strokeStyle = 'white';
	ctx.fillStyle = 'white';
	ctx.arc(x-ball.rad/2, y-ball.rad/2, ball.rad/4, 0 , 2 * Math.PI, false);
	ctx.fill();
	ctx.stroke();
};
ball.init();

var bumpersY = [80,160];
var bumpersTouched = [false,false];

var paddle = false;
var spaceDown = 0;
var upDown = 0;

// Update game objects
var update = function (delta) {
	ball.y += ball.speed * delta;
	ball.speed += 100.0 * delta;
	
	if (ball.y < 10){
		ball.y = 10;
		ball.speed = ball.speed/10.;
	}

	if (balls == 0){
		alert("game over!");
		gameOver = true;
	}
	
	if (ball.y >= canvas.height-20){
		// ball lost
		balls -= 1;
		ball.init();
    }

	// collision with 
	if (paddle==true){
		if ((ball.y>=360) && (ball.y<=380)){
			// bounce - dumpening x %
			ball.speed = -ball.speed * ( 100-(Math.random()*10) )/100.;
			sounds[2].play();
			// TODO if the paddle stays longer, it "charges" and the bounce is higher
			// also: if you leave the paddle ON too long, it should retract by itself
		}
	}

	// collision with bumper
	for (var i=0;i<bumpersY.length;i++){
		bumpersTouched[i] = false; // reset
		if ( (ball.y>=bumpersY[i]-2) && (ball.y<=bumpersY[i]+2)){
			if (Math.random()<0.4){
				ball.speed = -ball.speed + 0.5;
				sounds[ parseInt(Math.random()*2) ].play();
				bumpersTouched[i] = true;
			}
		}
	}
	
	// READ KEYS
	if (38 in keysDown) // Player holding UP
		upDown += 1;
	else
		upDown = 0;
	if (39 in keysDown) // Player holding RIGHT
		rightDown += 1;
	else
		rightDown = 0;

	if (32 in keysDown) { // Player holding SPACE
		spaceDown += 1;
	} else {
		spaceDown = 0;
	}
	
	if ( (spaceDown>=1) || (lastButtonId==0)){
		paddle = true;
	} else {
		paddle = false;
	}

	
	if ((upDown==1) || (lastButtonId==1) ){ // TILT
		// TODO should kick the ball randomly upwards
		ball.speed -= Math.random()*50+100;
		// TODO - pressing tilt too many times in a row will jam the game!
	}		
};

var drawBumper = function(x,y,touched){
	ctx.beginPath();
	ctx.lineWidth = 2;
	ctx.strokeStyle = 'red';

	ctx.save();
	if (touched==true){
		ctx.translate( Math.random()*2+1, Math.random()*4+2);
	}
	ctx.moveTo(x,y-5);
	ctx.lineTo(x+5,y+5);
	ctx.lineTo(x+10,y-5);
	ctx.lineTo(x+15,y+5);
	ctx.lineTo(x+20,y-5);
	ctx.lineTo(x+25,y+5);
	ctx.lineTo(x+30,y-5);
	ctx.stroke();
	ctx.restore();
};

// Draw everything
var render = function () {
	ctx.fillStyle = 'pink';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// axis	
	ctx.beginPath();
	ctx.strokeStyle = 'gray';
	ctx.lineWidth = 1;
	ctx.moveTo(50,0);
	ctx.lineTo(50,canvas.height);
	ctx.stroke();

	// draw all bumpers
	for (var i = 0; i < bumpersY.length; i++){
		drawBumper(50-15,bumpersY[i], bumpersTouched[i]);
	}

	if (paddle==true){
		ctx.beginPath();
		ctx.strokeStyle = 'black';
		ctx.fillStyle = 'gray';
		ctx.rect(50-12,370, 24,10);
		ctx.fill();		
		ctx.stroke();		
	}
	
	ball.draw(50,ball.y);
	
	// remaining balls
	for (var i=0;i<balls;i++){
		ball.draw(10+i*10,10);
	}

	//true1D.render();
};

/* TODO
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

var sounds = [ new Audio('audio/bumper1.wav'),
               new Audio('audio/bumper2.wav'),
			   new Audio('audio/paddle.wav') ]
var startupSnd = new Audio('audio/startup.wav');
startupSnd.play();

// Let's play this game!
var then = Date.now();
setInterval(main, 30);