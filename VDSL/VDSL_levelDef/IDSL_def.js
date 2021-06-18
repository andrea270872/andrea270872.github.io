class LevelDef{
	// e.g. 'x--------T------********-----E-x' , startPos=3
	constructor(){
		this._level = "----";
		this._startPos = 1;
	}

	paveFloor(width){
		//# 30
		this._level = 'x'+ '-'.repeat(width-2) +'x';
		return this;
	}

	fillWithWater(atPos,width){
		//# 5,3
		atPos-=1;
		this._level = this._level.substr(0,atPos)+
						'*'.repeat(width)+
						this._level.substr(atPos+width,this._level.length);
		return this;
	}

	bridge(atPos,width){
		//# 5,3
		atPos-=1;
		this._level = this._level.substr(0,atPos)+
						'='.repeat(width)+
						this._level.substr(atPos+width,this._level.length);
		return this;
	}

	startAt(pos){
		//# 3
		pos-=1;
		this._startPos = pos;
		return this;
	}
	
	exitAt(pos){
		//# 27
		pos-=1;
		this._level = this._level.substr(0,pos)+
						'E'+
						this._level.substr(pos+1,this._level.length);
		return this;
	}

	keyAt(pos){
		//# 16
		pos-=1;
		this._level = this._level.substr(0,pos)+
						'F'+
						this._level.substr(pos+1,this._level.length);
		return this;
	}

	doorAt(pos){
		//# 19
		pos-=1;
		this._level = this._level.substr(0,pos)+
						'#'+
						this._level.substr(pos+1,this._level.length);
		return this;
	}

	buttonAt(pos){
		//# 4
		pos-=1;
		this._level = this._level.substr(0,pos)+
						'T'+
						this._level.substr(pos+1,this._level.length);

		return this;
	}
	pressedButtonAt(pos){
		//# 18
		pos-=1;
		this._level = this._level.substr(0,pos)+
						'_'+
						this._level.substr(pos+1,this._level.length);

		return this;
	}

	createTheLevel(){
		return [this._level,this._startPos];
	}

}

if (typeof module!='undefined') module.exports=LevelDef;