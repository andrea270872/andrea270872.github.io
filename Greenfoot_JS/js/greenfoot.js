// Greenfoot, World and Actor classes


class Greenfoot {
constructor(){
	throw new Error("Greenfoot class should not be instantiated");
}

static currentWorld;   // :World
static currentSpeed=3; // :Int
static currentClock=null;   // :Timer
static lastKeyPressed=null;  // :String

static _speedToMillisec = {1:500,2:330,3:180,4:70,5:33};

static start(){
	this.currentClock = window.setInterval(
					()=>{
						this.currentWorld._updateAndRepaint();
					}, this._speedToMillisec[this.currentSpeed] ); // 30 FPS
}

static stop(){
	window.clearInterval( this.currentClock );
	this.currentClock = null;
}

static hasStarted(){ // AKA isRunning 
	return this.currentClock!=null;
}

static setWorld(world){
	this.currentWorld = world;
}

static setSpeed(speed){
	this.currentSpeed = speed;
}

// : String
static getKey(){
	let k = this.lastKeyPressed;
	this.lastKeyPressed = null;
	return k;
}

// point px,py :Int
// rect x,y,w,h :Int
// return :Bool
static isPointInsideRect(px,py, x,y,w,h){
	// DEBUG console.log("isPointInsideRect:" , px,py, x,y,w,h);
	if ((px>=x) && (px<=x+w) &&
		(py>=y) && (py<=y+h) )
		return true;
	return false;
}

// Return a random number between 0 (inclusive) and limit (exclusive).
static getRandomNumber(limit){
	return Math.floor(Math.random() * limit);
}
}

document.body.addEventListener("keyup", (e) => {
	//console.log( e.key );
	Greenfoot.lastKeyPressed = e.key;
	//e.preventDefault();
});




class World{
	#width;    // :Int
	#height;   // :Int
	#cellSize; // :Int
	#bounded;  // :Boolean
	#canvas;
	ctx;
	#actors;  // :List<Actor>
	#backgroundImageElement // : ImgElement

	#actOrder;              // :Dict<cls,Int>
	#paintOrder;		    // :Dict<cls,Int>
	constructor(worldWidth,worldHeight,cellSize,bounded=false){
		this.width = worldWidth;
		this.height = worldHeight;
		this.cellSize = cellSize;
		this.bounded = bounded;
		this.actors = [];

		this.canvas = document.querySelector("#main_canvas");
		this.canvas.width=`${this.width*this.cellSize}`;
		this.canvas.height=`${this.height*this.cellSize}`;
		this.ctx = this.canvas.getContext("2d");

		this.backgroundImageElement = null;
		this.actOrder = null;
	}

	getWidth(){
		return this.width;
	}

	getHeight(){
		return this.height;
	}

	getCellSize(){
		return this.cellSize;
	}

	// actor: Actor
	// x,y : Int
	addObject(actor,x,y){
		actor.setLocation(x,y);
		actor.myWorld = this;
		this.actors.push(actor);
	}

	_updateAndRepaint(){
		
		if (this.actOrder!=null){
			// to control the order of actors, sort them according to this.actOrder
			this.actors.sort( 
				(a,b)=> this.actOrder[a.constructor.name]-this.actOrder[b.constructor.name] 
			);
		}


		for (let actor of this.actors){
			actor.act();
		}

		this.repaint();

	}

	repaint(){
		if (this.paintOrder!=null){
			// to control the painting order of actors
			this.actors.sort( 
				(a,b)=> this.paintOrder[a.constructor.name]-this.paintOrder[b.constructor.name] 
			);
		}


		for (let row=0;row<this.height;row++){
			// just to DEBUG
			let r = ~~(Math.random() * 10)-5;
			for (let col=0;col<this.width;col++){

				if (this.backgroundImageElement!=null){
					this.ctx.drawImage( this.backgroundImageElement, 
								this.cellSize*col,this.cellSize*row,
								this.cellSize,this.cellSize);
				} else {
					this.ctx.fillStyle = (row+col)%2==0 ? "rgb(255,255,255)" : "rgb(200,200,200)";
					this.ctx.fillRect(col*this.cellSize,row*this.cellSize, 
						this.cellSize+r,this.cellSize+r);
				}

				// draw grid
				this.ctx.strokeStyle = "rgb(180,180,180)";
				this.ctx.strokeRect(
					col*this.cellSize,row*this.cellSize, 
						this.cellSize,this.cellSize);
			}
		}

		for (let actor of this.actors){
			this.ctx.save();
			this.ctx.translate(this.cellSize*(actor.getX()+.5), this.cellSize*(actor.getY()+.5));
			this.ctx.rotate( actor.getRotation()*Math.PI/180 );
			//this.ctx.translate(-this.cellSize*actor.getX(),-this.cellSize*actor.getY());
			//this.ctx.drawImage( actor.getImage(), 0,0, this.cellSize,this.cellSize);
			this.ctx.drawImage( actor.getImage(), 
				this.cellSize*(-.5), this.cellSize*(-.5),
				this.cellSize,this.cellSize);
			this.ctx.restore();

			/*
			// DEBUG 
			console.log( actor.getX(),actor.getY() , 
				"->", this.cellSize*(actor.getX()), this.cellSize*(actor.getY()) );
			*/
		}

	}

	// : ImgElement
	getBackground(){
		return this.backgroundImageElement;
	}

	setBackground(image){ // : ImgElement
		this.backgroundImageElement = image;
	}

	// x :Int  , the column in the world grid
	// y :Int  , the row in the world grid
	// cls :Class
	// return :List<Actor>
	getObjectsAt(x,y, cls){
		let outputList = [];
		for (let actor of this.actors){
			/*
			// Too specific perhaps ...
			console.log(actor.constructor.name , cls.name);
			if (actor.constructor.name == cls.name){ // actor isDirectInstanceOf cls 
			*/
			if (actor instanceof cls){
				let ax = actor.getX();
				let ay = actor.getY();
				if (Greenfoot.isPointInsideRect(x,y, ax,ay,.9,.9)){ // actor selected!
					outputList.push(actor);
				}
			}
		}
		return outputList;	
	}

	removeObject(actor){
		let index = this.actors.indexOf(actor);
		if (index!=-1){
			this.actors.splice(index,1);
		}
	}

	// classes is array of cls
	setActOrder(classes){
		// if classes is [Leaf,Wombat,Rock]
		// this.actOrder {"Leaf":0,"Wombat":1,"Rock":2}
		this.actOrder = {};
		classes.forEach( (cls,index) => this.actOrder[cls.prototype.constructor.name]=index );
	}

	// classes is array of cls
	setPaintOrder(classes){
		// if classes is [Leaf,Wombat,Rock]
		// this.paintOrder {"Leaf":0,"Wombat":1,"Rock":2}
		this.paintOrder = {};
		classes.forEach( (cls,index) => this.paintOrder[cls.prototype.constructor.name]=index );
	}
	}

class Actor{
	#x
	#y
	#rotation
	myWorld

	constructor(){
		this.x = 0;
		this.y = 0;
		this.rotation = 0;
	}

	act(){
		// to do
	}

	// : ImgElement
	getImage(){
		return null;
	}


	setLocation(x,y){
		this.x = x;
		this.y = y;				
	}

	getWorld(){
		return this.myWorld;
	}

	getX(){
		return this.x;
	}
	getY(){
		return this.y;
	}

	// rotation is in degrees
	setRotation(rotation){
		this.rotation = rotation;
	}

	// returns rotation in degrees
	getRotation(){
		return this.rotation;
	}			

	// Move this actor the specified distance in the direction it is currently facing. 
	//    @distance - The distance to move (in cell-size units); a negative value will move backwards
	move(distance){
		let dx = distance * Math.cos(this.rotation*Math.PI/180);
		let dy = distance * Math.sin(this.rotation*Math.PI/180);
		console.log("dx,dy", dx,dy,this.rotation);
		this.setLocation(~~(this.x+dx), ~~(this.y+dy));
	}

	// Return one object that is located at the specified cell (relative to this objects location)
	// If more than one object of the specified class resides at that location, one of them will be chosen and returned.
	// PARAMS:
	// dx :Int  , the column in the world grid
	// dy :Int  , the row in the world grid
	// cls :Class
	// returns   null or :Actor
	getOneObjectAtOffset(dx,dy,cls){				
		let objectsList = this.myWorld.getObjectsAt(
			this.x + dx, this.y+dy,
			cls);
		if (objectsList.length==0)
			return null;
		return objectsList[0];
	}
}
