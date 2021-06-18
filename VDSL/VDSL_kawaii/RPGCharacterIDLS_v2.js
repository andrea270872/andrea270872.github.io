class RPGCharacter{  

	constructor(){
		this.xp = 0;    	// experience points
		this.health = 100;  // health points
		this.money = 0;
		this.alive = true;
	}

	eat(amountOfEnergy){
		//# 10
		this.health += amountOfEnergy;
		if (this.health>100){
			this.health = 100;
		}
		
		return this; // VERY IMPORTANT WHEN CHAINING!
	}		

	foundCoins(amountOfCoins){
		//# 1500
		this.money += amountOfCoins;

		return this; // VERY IMPORTANT WHEN CHAINING!
	}

	hitEnemy(){
		var p = Math.floor((Math.random() * 10) + 1);
		console.log("Enemy looses "+ p + " health points");
		this.xp += p;

		return this; // VERY IMPORTANT WHEN CHAINING!
	}
	
	getDamage(amountOfDamage){
		//# 50
		this.health -= amountOfDamage;
		console.log("ouch, lost "+amountOfDamage+" HPs!");
		if (this.health<=0){
			this.health = 0;
			this.alive = false;
		}
		
		return this; // VERY IMPORTANT WHEN CHAINING!
	}

	printState(){
		if (this.alive)
			console.log("RPGCharacter, xp="+this.xp
					+" hp="+this.health
					+" money="+this.money);
		else
			console.log("RPGCharacter is dead __+__ ");
		
	}
	
}

/* =============== Example ====================	
var warrior = new RPGCharacter( );   
var mage = new RPGCharacter( ); // init in different way   
warrior
	.printState()
	.eat(10)
	.hitEnemy()
	.getDamage(50)
	.printState()
	.eat(10)
	.foundCoins(1500)
	.printState()
	.getDamage(1000)
	.printState();
//mage. ... 
*/

if (typeof module!='undefined') module.exports=RPGCharacter;