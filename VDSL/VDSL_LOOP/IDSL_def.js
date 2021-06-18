// Instructions are simply represented as JS statements! 
// Then executed.

class LoopProgram{

	constructor(){
		/* Instructions
			program := 
					  xi := xj + c
					| xi := xj - c
					| LOOP xi DO P END
					| P1; P2 
		*/
		this._code = [];
		this._verbose = [];
		this._macros = [];
		this._statements = [];
	}

	add(i,j,c){
		//# 1,1,0
		this._code.push( `env[${i}]=env[${j}]+${c};` );
		this._verbose.push( `x${i}:=x${j}+${c}` );
		this._statements.push( {name:'add',vars:[i,j,c]} );
		return this;
	}

	sub(i,j,c){
		//# 1,1,0
		this._code.push( `env[${i}]=env[${j}]-${c};if (env[${i}]<0) env[${i}]=0;` );
		this._verbose.push( `x${i}:=x${j}-${c}` );
		this._statements.push( {name:'sub',vars:[i,j,c]} );
		return this;
	}

	loop(i,P){
		//# 1,{}
		this._code.push( `{ let tmp=env[${i}]; 
for(let i=0;i<tmp;i++){ ${P._code} } }` );

		this._verbose.push( `LOOP x${i} DO 
   ${P._verbose}
END` );

		this._statements.push( {name:'loop',vars:[i,P]} );
		return this;
	}	

	// *****************

	MACRO_1(name,P){
		//# "aMacro",{}
		this._macros[name] = P;

		//this._code.push( 'MACRO_1' );
		this._verbose.push( `MACRO_1 ${name} ${P} END_MACRO_1` );
		//this._statements.push( {name:'DO_1',vars:[name,i]} ); // ???		

		return this;
	}

	DO_1(name,i){
		//# "aMacro",5
		// DEBUG console.log('DO_1 --> MACROS:',this._macros);
		let P = this._macros[name];
		// DEGUB console.log( `... executing ${P} where 1 is substituted by ${i} ...`);
		// TO DO
		// 1. clone P into P'
		let P1 = JSON.parse(JSON.stringify(P));		
		// DEGUB console.log('DO_1 --> P1 is ', P1);
		// 2. substitute 1 into i in P': P'{i/1}
		let newP = new LoopProgram();
		_substitute(P1,1,i,newP);
		// 3. run P'
		// DEGUB console.log('DO_1 --> code is ', newP._code);
		this._code = this._code.concat( newP._code );
		//this._verbose = this._verbose.concat( newP._verbose );
		this._verbose.push( `DO_1 ${name} ${i}` );
		this._statements.push( {name:'DO_1',vars:[name,i]} ); // ???

		return this;
	}	

	//******************

	run(){
		const env = new Array(10).fill(0);
		console.log( env );
		console.log( ''+this );
		eval( this._code.join('') );
		console.log( env );
	}

	stepByStep(){
		// DEBUG 

		const env = new Array(10).fill(0);
		console.log( env + '    |    MACROS: ' + Object.keys(this._macros) );
		for (let i=0;i<this._code.length;i++){
			eval( this._code[i] );
			console.log( `step${(i+1)}: ${this._verbose[i]}\n` );
			console.log( env + '    |    MACROS: ' + Object.keys(this._macros) );
		}	
	}


	toString(){
		return this._verbose.join('\n');
	}
}

// Visit P and build a clone that has b everywhere a is.
_substitute = (P,varI,varJ,newP)=>{
	// todo 
	P._statements.forEach( (e)=>{ 
		// DEBUG console.log('subst:');  // e

		// if (e.name=='DO_1'){ //////???????????

		if (e.name=='add'){
			// DEBUG console.log( 'add ' + e.vars );
			let a,b,c;
			[a,b,c] = e.vars;
			if (a==varI) a=varJ;
			if (b==varI) b=varJ;
			newP.add( a,b,c );
		}
		if (e.name=='sub'){
			// DEBUG console.log( 'sub ' + e.vars );
			let a,b,c;
			[a,b,c] = e.vars;
			if (a==varI) a=varJ;
			if (b==varI) b=varJ;
			newP.sub( a,b,c );
		}
		if (e.name=='loop'){
			// DEBUG console.log( 'loop ' + e.vars[0] );
			let a = e.vars[0];
			if (a==varI) a=varJ;

			let bodyP = new LoopProgram();
			_substitute(e.vars[1],varI,varJ,bodyP);
			newP.loop( a , bodyP);
		}
		
	});
}

if (typeof module!='undefined') module.exports=LoopProgram;