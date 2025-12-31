///// classes /////////////////////////////////////////////////////////////

class WombatWorld extends World {
	constructor(worldWidth,worldHeight,cellSize){
		super(8,8,60);
        this.setBackground( document.querySelector("#img_sand_tile"));
        this.setPaintOrder( [Leaf,Wombat,Rock] );
	}

	populate(){
        let w1 = new Wombat();
        this.addObject(w1, 3, 3);
        
        let w2 = new Wombat();
        this.addObject(w2, 1, 7);

        let l1 = new Leaf();
        this.addObject(l1, 5, 3);

        let l2 = new Leaf();
        this.addObject(l2, 0, 2);

        let l3 = new Leaf();
        this.addObject(l3, 7, 5);

        let l4 = new Leaf();
        this.addObject(l4, 2, 6);

        let l5 = new Leaf();
        this.addObject(l5, 5, 0);
        
        let l6 = new Leaf();
        this.addObject(l6, 4, 7);

        this.addObject(new Rock(), 0, 4);
    }

	randomLeaves(howMany){
		howMany = parseInt(howMany); // int input!
        for(let i=0; i<howMany; i++) {
            let leaf = new Leaf();
            let x = Greenfoot.getRandomNumber(this.getWidth());
            let y = Greenfoot.getRandomNumber(this.getHeight());
            this.addObject(leaf, x, y);
        }
    }    
}

class Wombat extends Actor {

	static EAST = 0;
    static WEST = 1;
    static NORTH = 2;
    static SOUTH = 3;

    direction;
    leavesEaten;

    constructor(){
    	super();
    	this.setDirection(Wombat.EAST);
        this.leavesEaten = 0;
    }

    setDirection(direction){    	
    	direction = parseInt(direction); // to fix the input
        this.direction = direction;
        switch(this.direction) {
            case Wombat.SOUTH :
                this.setRotation(90);
                break;
            case Wombat.EAST :
                this.setRotation(0);
                break;
            case Wombat.NORTH :
                this.setRotation(270);
                break;
            case Wombat.WEST :
                this.setRotation(180);
                break;
            default :
                break;
        }
    }

	act(){
		/*
		let k = Greenfoot.getKey();
		if (k=="a"){
			this.x += -1;
		}
		if (k=="d"){
			this.x += +1;
		}
		if (k=="w"){
			this.y += -1;
		}
		if (k=="s"){
			this.y += +1;
		}*/

		
		if(this.foundLeaf()) {
            this.eatLeaf();            
        }
        else if(this.canMove()) {
            this.move();
        }
        else {
            //this.turnLeft();
            // IMPROVED
            this.turnRandom();
        }
	}

	move(){
		/*if (!this.canMove()) {
            return;
        }*/
		switch(this.direction) {
            case Wombat.SOUTH :
                this.setLocation(this.getX(), this.getY() + 1);
                break;
            case Wombat.EAST :
                this.setLocation(this.getX() + 1, this.getY());
                break;
            case Wombat.NORTH :
                this.setLocation(this.getX(), this.getY() - 1);
                break;
            case Wombat.WEST :
                this.setLocation(this.getX() - 1, this.getY());
                break;
        }		
	}	

	canMove() {
        let myWorld = this.getWorld();
        let x = this.getX();
        let y = this.getY();
        switch(this.direction) {
            case Wombat.SOUTH :
                y++;
                break;
            case Wombat.EAST :
                x++;
                break;
            case Wombat.NORTH :
                y--;
                break;
            case Wombat.WEST :
                x--;
                break;
        }
        // test for outside border
        if ( (x >= myWorld.getWidth()) || (y >= myWorld.getHeight()) ) {
            return false;
        }
        else if ((x < 0) || (y < 0)) {
            return false;
        }
        
        //return true;
        // IMPROVED
        let rocks = myWorld.getObjectsAt(x, y, Rock);
        if(rocks.length==0) { // if empty...
            return true;
        } else {
            return false;
        }
    }

    turnLeft(){
        switch(this.direction) {
            case Wombat.SOUTH :
                this.setDirection(Wombat.EAST);
                break;
            case Wombat.EAST :
                this.setDirection(Wombat.NORTH);
                break;
            case Wombat.NORTH :
                this.setDirection(Wombat.WEST);
                break;
            case Wombat.WEST :
                this.setDirection(Wombat.SOUTH);
                break;
        }
    }

	foundLeaf(){
        let leaf = this.getOneObjectAtOffset(0, 0, Leaf);
        if(leaf != null) {
            return true;
        }
        else {
            return false;
        }
    }

    eatLeaf(){
        let leaf = this.getOneObjectAtOffset(0, 0, Leaf);
        if(leaf != null) {
            // eat the leaf...
            this.getWorld().removeObject(leaf);
            this.leavesEaten = this.leavesEaten + 1; 
        }
    }
    
    turnRandom(){
        // get a random number between 0 and 3...
        let turns = Greenfoot.getRandomNumber(4);

        // ...an turn left that many times.
        for(let i=0;i<turns;i++) {
            this.turnLeft();
        }
    }



	// : ImgElement
	getImage(){
		return document.querySelector("#img_wombat");
	}

	m(a,b){ console.log(a,b); } // for testing
    n(value){ return value; } // for testing
}

class Rock extends Actor {
	// : ImgElement
	getImage(){
		return document.querySelector("#img_rock");
	}			
}

class Leaf extends Actor {
	// : ImgElement
	getImage(){
		return document.querySelector("#img_leaf");
	}
}

///// declarations /////////////////////////////////////////////////////////////

addClassToExtend(WombatWorld,"World");

addClassToExtend(Wombat,"Actor");
addClassToExtend(Rock,"Actor");
addClassToExtend(Leaf,"Actor");

let mainClass = "WombatWorld";
