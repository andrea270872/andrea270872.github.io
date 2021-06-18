// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 400;
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
	return false;	
}

// *******************************************

function pad(number, length) {
    var str = '' + number;
    while (str.length < length) {
		str = '0' + str;
	}
	return str;
} 

// random generator of deltaTable 
var generateDelta = function(N,K){

	var Q = [];
	for (var i=0;i<Math.pow(2,N);i++){
		Q.push( pad(i.toString(2),N) );
	}
	Q.push('SCORE');
	//Q.push('FAIL');
	//console.log( Q );
	
	// Assume q0 = '000'

	var d = {
/*		'000T': ['000','100'] ,
		'000B': ['000','100'] ,

		'100T': ['010'] ,
		'100B': ['010'] ,
		
		'010T': ['001'] ,
		'010B': ['SCORE'] ,

		'001T': ['100'] ,
		'001B': ['100'] ,

		'SCORET': ['001'] ,
		'SCOREB': ['001'] ,
*/
		'FAILT': ['FAIL'] ,
		'FAILB': ['FAIL'] }; 
		
	for (var i=0;i<Q.length;i++){
		d[ Q[i]+'T' ] = []; // TODO -> a random subset of P(Q)
		d[ Q[i]+'B' ] = []; // TODO -> a random subset of P(Q)
	}
	
	console.log( d );
		
	return d;
}
// *******************************************


// State machine for this game ------- [
var N = 3 // number of visible bits in a state
//   K = 0 // number of hidden bits in a state -> N+K is the total bits in a state
// Q = ['FAIL','SCORE', '000','001','010', ... ,'111' ]
// Sigma = [ 'timeout' , 'buttonDown' ]
// q0 = '000';

// D : Q x Sigma -> P(Q)
// F = ['FAIL']

// 000 = state , T = timeout, B = button down
var currentState = '000'; // initial state
var shootTheDuck = { 
	'000T': ['000','100'] ,
	'000B': ['000','100'] ,

	'100T': ['010'] ,
	'100B': ['010'] ,
	
	'010T': ['001'] ,
	'010B': ['SCORE'] ,

	'001T': ['100'] ,
	'001B': ['100'] ,

	'SCORET': ['001'] ,
	'SCOREB': ['001'] ,

	'FAILT': ['FAIL'] ,
	'FAILB': ['FAIL'] }; 

var currentState = '000'; // initial state
var cutTheGrass = { 
	'000T': ['000','100'] ,
	'000B': ['FAIL'] ,

	'100T': ['110'] ,
	'100B': ['SCORE'] ,
	
	'110T': ['111'] ,
	'110B': ['SCORE'] ,

	'111T': ['FAIL'] ,
	'111B': ['100'] ,

	'SCORET': ['000'] ,
	'SCOREB': ['000'] ,

	'FAILT': ['FAIL'] ,
	'FAILB': ['FAIL'] }; 

// K = 1 // there is 1 hidden state
/* var currentState = '0000'; // initial state
var pingPongFor1 = { 
	'0000T': ['0000','1000'] ,
	'0000B': ['FAIL'] ,

	'1000T': ['0100'] ,
	'1000B': ['0100'] ,

	'0100T': ['0010'] ,
	'0100B': ['0010'] ,

	'0010T': ['FAIL'] ,
	'0010B': ['0011'] ,

	'0011T': ['0101'] ,
	'0011B': ['0101'] ,

	'0101T': ['1001'] ,
	'0101B': ['1001'] ,
	
	'1001T': ['FAIL'] ,
	'1001B': ['SCORE'] ,

	'SCORET': ['1000'] ,
	'SCOREB': ['1000'] ,

	'FAILT': ['FAIL'] ,
	'FAILB': ['FAIL'] }; 
*/

// SELECT WHICH GAME
//var deltaTable = shootTheDuck;
var deltaTable = cutTheGrass;
//var deltaTable = pingPongFor1;
// ----------------------------------- ]

var BLOCK_SIZE = 20;
var buttonDown = 0;

var delta = function(deltaT) {

	if (currentState=='SCORE'){
		score += 1;
	} 
	if (currentState=='FAIL'){
		gameOver = true;
	}


	var newStates = [];
	var s = currentState;
	if (lastButtonId==0){ // button is pressed
		s += 'B';
	} else {
		s += 'T';
	}
	newStates = deltaTable[s];
	
	//console.log( currentState , s, newStates );
	
	if (newStates.length==0){
		// TODO stop the game?
	}
	
	if (newStates.length==1){
		currentState = newStates[0];
	} else {
		currentState = newStates[ parseInt(Math.random()*newStates.length) ];
	}
	
	
	lastButtonId = -1; // reset the lastButtonId	
};

var progress = 0;
// Draw everything
var render = function () {
	ctx.fillStyle = "#E0E0FF";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	// progress bar
	progress = (progress+1) % 20;
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, 20+2, 2);
	ctx.fillStyle = 'gray';
	ctx.fillRect(0, 0, progress+2, 2);

	// current state
	if (currentState=='FAIL'){
		ctx.strokeStyle = 'black';
		ctx.strokeText("** FAIL **", 100, canvas.height/2);
		return;
	}
		
	if (currentState=='SCORE'){
		ctx.strokeStyle = 'black';
		ctx.strokeText("** SCORE **", 100, canvas.height/2);
	} else {
		for (var i=0;i<N;i++){
			var x = 50 + i * BLOCK_SIZE;
			if (currentState[i]=='0'){
				ctx.fillStyle = 'black';
			} else {
				ctx.fillStyle = 'white';
			}
			ctx.fillRect(x,200, BLOCK_SIZE-1,BLOCK_SIZE-1);
		}
	}

	// score
	ctx.strokeStyle = 'black';
	ctx.strokeText("SCORE "+score, canvas.width-150, 10);
};

var gameOver = false;
var score = 0;

// The main game loop
var main = function () {

	if (gameOver==false){
		var now = Date.now();
		var dt = now - then;
		delta(dt / 1000.0);
		render();
		then = now;
	}
};

// setup the font and style for text
ctx.fillStyle    = '#00f';
ctx.font         = '16px sans-serif';
ctx.textBaseline = 'top';

// Let's play this game!
alert('ready... STEADY... GO!!');
var then = Date.now();
setInterval(main, 500);