// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 700;
canvas.height = 200;
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
var BLOCK_SIZE = 18;
var HALF_BLOCK_SIZE = Math.ceil(BLOCK_SIZE/2);

var spaceDown = 0;
var leftDown = 0;
var rightDown = 0;
var R_Down = 0;

// floor in {'.','X'}
// content in {'.','W','>','<','B'}
// openClose in {'.','O','C'}
var Cell = function(floorContent,openClose){

	// default argument
	openClose = typeof openClose!=='undefined' ? openClose : '.';

	this.openClose = openClose;
    this.floor = floorContent[0];
	this.content = floorContent[1];
	
    this.next = [ null,null ];
    this.prev = [ null,null ];
	
	this.isFoldPrev = function(){
		return this.prev[0] != this.prev[1];
	};

	this.isFoldNext = function(){
		return this.next[0] != this.next[1];
	};
	
	this.toString = function(){
		var s = ''+this.floor+this.content;
		if (this.openClose=='O'){
			s = '['+s+']';
		}
		if (this.openClose=='C'){
			s = '('+s+')';
		}
		return s;
	};

	this.drawAt = function(pos){
		var x = 50+pos * BLOCK_SIZE;	
		var y = 100;
		
		// outline the cell
		ctx.lineWidth = 1;
		ctx.beginPath();		
		if ( this.openClose=='O' ){
			ctx.fillStyle = '#FFD0D0';
			y -= HALF_BLOCK_SIZE;
		} else if ( this.openClose=='C' ){
			ctx.fillStyle = '#D0D0FF';
			y += HALF_BLOCK_SIZE;
		} else {
			ctx.fillStyle = '#D0D0D0';
		}
		ctx.rect( x,y, BLOCK_SIZE-1,BLOCK_SIZE-1 );
		ctx.fill();
		
		// make OPEN folds visible when collapsed
		if ((folded==1) && (this.next[0]!=null)){
			if ( (this.openClose=='.') && (this.next[0].openClose=='O')){
				ctx.lineWidth = 1;
				ctx.strokeStyle = 'red';
				ctx.beginPath();
				ctx.moveTo( x+BLOCK_SIZE-1,y-5 );
				ctx.lineTo( x+BLOCK_SIZE-1,y+BLOCK_SIZE+5 );
				ctx.stroke();
			}
		}

		// make CLOSE folds visible when collapsed
		if ((folded==0) && (this.next[1]!=null)){
			if ( (this.openClose=='.') && (this.next[1].openClose=='C')){
				ctx.lineWidth = 1;
				ctx.strokeStyle = 'blue';
				ctx.beginPath();
				ctx.moveTo( x+BLOCK_SIZE-1,y-5 );
				ctx.lineTo( x+BLOCK_SIZE-1,y+BLOCK_SIZE+5 );
				ctx.stroke();
			}
		}
		
		ctx.strokeStyle = 'black';
		if (this.floor=='X'){
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.strokeStyle = 'black';
			ctx.moveTo( x,y+BLOCK_SIZE+HALF_BLOCK_SIZE );
			ctx.lineTo( x+BLOCK_SIZE,y+BLOCK_SIZE );
			ctx.moveTo( x,y+BLOCK_SIZE );
			ctx.lineTo( x+BLOCK_SIZE,y+BLOCK_SIZE+HALF_BLOCK_SIZE );
			ctx.stroke();
		}

		if (this.content=='W'){
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.strokeStyle = 'black';
			ctx.rect( x,y, BLOCK_SIZE-1,BLOCK_SIZE-1 );
			ctx.stroke();
			
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo( x+HALF_BLOCK_SIZE,y );
			ctx.lineTo( x,y+HALF_BLOCK_SIZE );
			
			ctx.moveTo( x+BLOCK_SIZE-1,y-1 );
			ctx.lineTo( x,y+BLOCK_SIZE-1 );
			
			ctx.moveTo( x+BLOCK_SIZE-1,y+HALF_BLOCK_SIZE-1 );
			ctx.lineTo( x+HALF_BLOCK_SIZE-1,y+BLOCK_SIZE-1 );
			ctx.stroke();
		}
		if (this.content=='B'){
			if (this.floor=='X'){
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.fillStyle = 'gray';
				ctx.rect( x+4,y+4, BLOCK_SIZE-9,BLOCK_SIZE-9 );
				ctx.fill();
			}
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.strokeStyle = 'black';
			ctx.rect( x+4,y+4, BLOCK_SIZE-9,BLOCK_SIZE-9 );
			ctx.stroke();
		}		
		if (this.content=='>'){
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.moveTo( x+2,y+2 );
			ctx.lineTo( x+BLOCK_SIZE-3,y+HALF_BLOCK_SIZE );

			ctx.moveTo( x+2,y+BLOCK_SIZE-3 );
			ctx.lineTo( x+BLOCK_SIZE-3, y+HALF_BLOCK_SIZE);
			ctx.stroke();
		}
		if (this.content=='<'){
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.moveTo( x+BLOCK_SIZE-3,y+2 );
			ctx.lineTo( x+2,y+HALF_BLOCK_SIZE );

			ctx.moveTo( x+BLOCK_SIZE-3,y+BLOCK_SIZE-3 );
			ctx.lineTo( x+2, y+HALF_BLOCK_SIZE);
			ctx.stroke();
		}
	};

	this.append = function(nextCell){
		this.next[1] = this.next[0] = nextCell;
		nextCell.prev[0] = nextCell.prev[1] = this;
		return nextCell;
	};

	this.appendOpen = function(nextCell){
		this.next[0] = nextCell;
		nextCell.prev[0] = this;
		return nextCell;
	};

	this.appendClose = function(nextCell){
		this.next[1] = nextCell;
		nextCell.prev[1] = this;
		return nextCell;
	};
	
	return this;
};

// ========================================================

var playerCell =  null;
var playerFacing = +1;
var folded = 0; // can be 0 or 1
var levelJustLoaded = true;

// Update game objects
var collision = function(next,nextNext){
	if (next.content=='W'){
		return true;
	} else if (next.content=='B'){
		// 1- check if the block is free to move
		if (nextNext.content=='.'){
			// 2- Move the block
			nextNext.content = 'B';
			return false;
		} else {
			return true;
		}
	}

	return false;
};

var movePlayer = function(direction){
	if (playerCell.content=='>'){
		if (direction==+1){
			var next = playerCell.next[folded];
			var nextNext = playerCell.next[folded].next[folded];
			if (collision(next,nextNext)==false){
				playerCell.content = '.';
				playerCell.next[folded].content = '>';
				playerCell = playerCell.next[folded];
				moves++;
			}
		} else {
			playerFacing = -1;
			playerCell.content = '<';
		}
	} else if (playerCell.content=='<'){
		if (direction==-1){
			var prev = playerCell.prev[folded];
			var prevPrev = playerCell.prev[folded].prev[folded];
			if (collision(prev,prevPrev)==false){
				playerCell.content = '.';
				playerCell.prev[folded].content = '<';
				playerCell = playerCell.prev[folded];
				moves++;
			}
		} else {
			playerFacing = +1;
			playerCell.content = '>';
		}
	}
};

var moves = 0;
var update = function (delta) {

	var allBoxesOnPlatform = true;
	// double check, both open and closed subgraphs
	for (var foldingIndex=0;foldingIndex<2;foldingIndex++){ 
		var currentNode = levelCode;
		while (currentNode!=null){
			if ((currentNode.floor=='X') && (currentNode.content!='B')){
				allBoxesOnPlatform = false;
				break;
			}
			currentNode = currentNode.next[foldingIndex];
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
		if (playerCell.openClose!='.'){
			alert('Cannot fold - it would squeeze you!');
			// TODO gameOver = true; return;
		} else {
			folded = (folded+1) % 2;
			moves++;
		}
		
	}
	
	lastButtonId = -1; // reset the lastButtonId
};

var render = function () {
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	var currentNode = levelCode;	
	var i=0;
	while (currentNode!=null){
		currentNode.drawAt(i);
		
		if ( (levelJustLoaded==true) && (currentNode.content=='>') ){
				playerCell = currentNode;
				playerFacing = +1; 
				levelJustLoaded = false;
		}
		if ( (levelJustLoaded==true) && (currentNode.content=='<') ){
				playerCell = currentNode;
				playerFacing = -1; 
				levelJustLoaded = false;
		}
		
		currentNode = currentNode.next[folded];
		i++;
	}

	ctx.fillStyle = "gray";
	ctx.lineWidth = 1;
	ctx.fillText('Moves:'+moves, canvas.width/2, 0);
};

var gameOver = false;
var win = false;

// The main game loop
var main = function () {

	if (gameOver==false){
		var now = Date.now();
		var delta = now - then;

		if (!levelJustLoaded){
			update(delta / 1000.0);
		}
		render();

		then = now;
	}
};

// setup the font and style for text
ctx.fillStyle    = '#00f';
ctx.font         = '12px sans-serif';
ctx.textBaseline = 'top';