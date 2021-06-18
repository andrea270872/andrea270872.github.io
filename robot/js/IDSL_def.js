/*
Guess what the robot is thinking
- Turn-based 2-player game for algorithm sense making (CT)
- 21-Nov-2020

Implemented: 25 mar 2021

*/

// Instructions are simply represented as JS statements, then executed.


class GuessRobot{

	constructor(){
		/* Instructions
			P := 
				  Forward
				| TurnRight
				| IfThink item TurnRight
				| Repeat2times P
				| Repeat4times P
				| P1; P2
			item := CAKE | FLOWER
		*/
		this._code = [];
	}

	forward(){
		this._code.push( ['forward'] );
		return this;
	}

	turnRight(){
		this._code.push( ['turnright'] );
		return this;
	}

	turnLeft(){
		this._code.push( ['turnleft'] );
		return this;
	}
/*
	ifThink_turnRight(item){
		//# "cake"
		this._code.push( ['ifThink_turnRight', item ] );
		return this;
	}	*/

	repeat2times(P){
		//# {}
		this._code.push( ['repeat2times', P._code ] );
		return this;
	}

	repeat4times(P){
		//# {}
		this._code.push( ['repeat4times', P._code ] );
		return this;
	}

    // ************************************

    _prettyPrint(code,nesting=0){
    	let text = '';
    	for (let instr of code){
			if (instr[0]=='repeat2times'){
				text += ('.'.repeat(nesting*2)) +instr[0]+ '\n';
				let content = this._prettyPrint(instr[1],nesting+1);
				text += ('.'.repeat(nesting*2)) +content;
			} else if (instr[0]=='repeat4times'){
				text += ('.'.repeat(nesting*2)) +instr[0]+ '\n';
				let content = this._prettyPrint(instr[1],nesting+1);
				text += ('.'.repeat(nesting*2)) +content;
			} else if (instr[0]=='forward'){
				text += ('.'.repeat(nesting*2)) +instr[0]+' \n';
			} else if (instr[0]=='turnright'){
				text += ('.'.repeat(nesting*2)) +instr[0]+' \n';
			} else if (instr[0]=='ifThink_turnRight'){
				text += ('.'.repeat(nesting*2)) +'ifThink'+' "'+instr[1]+'" turnRight\n';
			} else {
				text += ('.'.repeat(nesting*2)) +instr[0]+ '\n';
			}
		}		
		return text;	
    }

    generateCode(){   
    	console.log( this._prettyPrint(this._code) );
    	//console.log( ''+this );
    	return this._code;
    }

	toString(){
		let text = '';
		let nesting = 0;		
		for (let instr of this._code){
			//text += instr+ ('~'.repeat(nesting)) + '\n';
			text += instr+ '\n';
		}		
		return text; // this._code.join('\n');
	}
}

if (typeof module!='undefined') module.exports=GuessRobot;