class KawaiiEyes{

	constructor(theCanvasContext,position){
		this._cxt = theCanvasContext;
		this._intenseLevel = 1;
		this._cuteLevel = 1;
		this._color = 'rgb(10,150,10)'; // green
		this._childish = false;
		this._happy = true;

		this._pos = position || {x:200,y:150}; // default
		this._distance = 150;
		this._radiusX = 80;
		this._radiusY = 100;
	}

	happy(isHappy){
		//# true
		console.log( 'setting happy');
		this._happy = isHappy;
		return this;
	}

	childish(isOn){
		//# false
		console.log( 'setting childish');
		this._childish = isOn;
		return this;
	}

	moreIntense(){
		console.log( 'moreIntense');
		this._intenseLevel*=1.2;
		return this;
	}

	moreCute(){
		console.log( 'moreCute');
		this._cuteLevel*=1.4;
		return this;
	}

	drawLeftEye(){
		console.log( 'drawLeftEye');
		// iris
		let d1 = this._radiusX*this._intenseLevel*0.8;
		this._cxt.ellipse(this._pos.x-d1, this._pos.y, 
							d1,this._radiusY*this._cuteLevel, 
		{
	  		fill: this._color,
	  		fillWeight: 4, // thicker lines for hachure
	  		hachureGap: (this._childish)?6:0 ,
	  		stroke: "rgb(0,0,0,0)", // transparent
	  		strokeWidth: 1,
	  		roughness: (this._childish)?2:1.0
		});
		this._cxt.ellipse(this._pos.x-d1, this._pos.y, 
							d1,this._radiusY*this._cuteLevel, 
		{
			stroke: 'black',
	  		strokeWidth: 1,
	  		roughness: (this._childish)?2:0.0
		});

		// pupil
		let d2 = this._radiusX*this._intenseLevel*0.6   *0.8;
		let r2 = this._radiusY*this._cuteLevel*0.7      *0.8;
		this._cxt.ellipse(this._pos.x-d1, this._pos.y, 
							d2,r2,  {
	  		fill: 'black',
	  		fillStyle: 'solid',
	  		stroke: "rgb(0,0,0,0)", // transparent
	  		roughness: (this._childish)?2.5:1.5
		});	

		// white sparkle
		let rad = Math.max(d2/4,r2/4)
		this._cxt.ellipse(this._pos.x-d1-d2/4, this._pos.y -r2/5, 
							rad,rad , {
	  		fill: "white",
	  		fillStyle: 'solid',
	  		stroke: "white",
	  		strokeWidth: 1,
	  		roughness: (this._childish)?1:0
		});			

		// smaller, lower white sparkle		
		let radSm = Math.min(d2/4,r2/4);
		this._cxt.ellipse(this._pos.x-d1-d2/7, this._pos.y +r2/3, 
							radSm,radSm*0.8, {
	  		fill: "white",
	  		fillStyle: 'solid',
	  		stroke: "white",
	  		strokeWidth: 1,
	  		roughness: (this._childish)?1:0
		});		

		// sad shadow below eye
		if (!this._happy){
			this._cxt.rectangle(this._pos.x-d1*1.5, this._pos.y +d2*0.8, 
								d1,this._radiusY*this._cuteLevel/2, 
			{
				stroke: 'white',
		  		strokeWidth: 1,
		  		fill: 'white',
		  		fillStyle: 'solid',
		  		roughness: 0
			});
		}

		return this;
	}

	drawRightEye(){
		console.log( 'drawRightEye');
		// iris
		let d1 = this._radiusX*this._intenseLevel*0.8;
		this._cxt.ellipse(this._pos.x+d1, this._pos.y, 
							d1,this._radiusY*this._cuteLevel, 
		{
	  		fill: this._color,
	  		fillWeight: 4, // thicker lines for hachure
	  		hachureGap: (this._childish)?6:0 ,
	  		stroke: "rgb(0,0,0,0)", // transparent
	  		strokeWidth: 1,
	  		roughness: (this._childish)?2:1.0
		});
		this._cxt.ellipse(this._pos.x+d1, this._pos.y, 
							d1,this._radiusY*this._cuteLevel, 
		{
			stroke: 'black', // transparent
	  		strokeWidth: 1,
	  		roughness: (this._childish)?2:0.0
		});

		// pupil
		let d2 = this._radiusX*this._intenseLevel*0.6   *0.8;
		let r2 = this._radiusY*this._cuteLevel*0.7      *0.8;
		this._cxt.ellipse(this._pos.x+d1, this._pos.y, 
							d2,r2,  {

	  		fill: 'black',
	  		fillStyle: 'solid',
	  		stroke: "rgb(0,0,0,0)", // transparent
	  		roughness: (this._childish)?2.5:1.5
		});	

		// white sparkle
		let rad = Math.max(d2/4,r2/4)
		this._cxt.ellipse(this._pos.x+d1-d2/4, this._pos.y -r2/5, 
							rad,rad , {
	  		fill: "white",
	  		fillStyle: 'solid',
	  		stroke: "white",
	  		strokeWidth: 1,
	  		roughness: (this._childish)?1:0
		});			

		// smaller, lower white sparkle		
		let radSm = Math.min(d2/4,r2/4);
		this._cxt.ellipse(this._pos.x+d1-d2/7, this._pos.y +r2/3, 
							radSm,radSm*0.8, {
	  		fill: "white",
	  		fillStyle: 'solid',
	  		stroke: "white",
	  		strokeWidth: 1,
	  		roughness: (this._childish)?1:0
		});		

		// sad shadow below eye
		if (!this._happy){
			this._cxt.rectangle(this._pos.x+d1*0.5, this._pos.y +d2*0.8, 
								d1,this._radiusY*this._cuteLevel/2, 
			{
				stroke: 'white',
		  		strokeWidth: 1,
		  		fill: 'white',
		  		fillStyle: 'solid',
		  		roughness: 0
			});
		}

		return this;
	}

	finishFace(){
		// mouth
		let d2 = this._radiusX*this._intenseLevel*0.6;
		let points;
		if (this._happy)
			points = [ [-2,-0.5],[0,0.5],[2,-0.5] ]; // centered at origin
		else
		   points = [ [-2,0.5],[0,-0.5],[2,0.5] ]; // centered at origin
		points = points.map( coord=>[this._pos.x+coord[0]*d2*2/3,
									 this._pos.y+coord[1]*this._distance/4 +
									 	10+this._radiusY*this._cuteLevel*0.7] );
		this._cxt.curve(points, {
		  stroke: 'black', 
		  strokeWidth: (this._childish)?3:2,
		  roughness: (this._childish)?2.5:1.0
		});

		// nose
		let eyeH = this._radiusY*this._cuteLevel*0.7      *0.8;
		this._cxt.line(this._pos.x-2,this._pos.y+eyeH*0.8,
						this._pos.x,this._pos.y+eyeH*0.8-20,
		{
			stroke: 'black',
			strokeWidth: 1.5,
			bowing: (this._childish)?10:5,
			roughness: (this._childish)?2.5:1.0
		});

	};

	normalIntense(){
		console.log( 'normalIntense');
		this._intenseLevel = 1;
		return this;
	}

	normalCute(){
		console.log( 'normalCute');
		this._cuteLevel = 1;
		return this;
	}

	color(rgbColor){
		//# "blue"
		console.log( 'color');
		this._color = rgbColor;
		return this;
	}
}

if (typeof module!='undefined') module.exports=KawaiiEyes;