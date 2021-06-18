


var Glass = function(){
   ADT_DEF.call(this,'Glass');
   
   this.state = {
     w: 0, // water
     c: 0 // capacity
   };   
      
   this.toString= function(){
      return this.state.w + '|' + this.state.c;
   };
   
   this.operators['new'] = 
        new Operator('new',function(inputs,outputs){
            var items = [];
            var g;
            g = new Glass();
               g.state.w = ~~(Math.random()*(3+1));
               g.state.c = 3;
            items.push( g );

            g = new Glass();
               g.state.w = ~~(Math.random()*(5+1));
               g.state.c = 5;
            items.push( g );

            g = new Glass();
               g.state.w = ~~(Math.random()*(8+1));
               g.state.c = 8;
            items.push( g );
      
            outputs.push( items[~~(Math.random()*items.length)] );
          },[],1, false); // ... 
   
   this.operators['pour'] = 
          new Operator('pour',function(inputs,outputs){
      
			   var freeSpace = inputs[1].state.c - inputs[1].state.w;
               var waterToMove = Math.min(freeSpace, inputs[0].state.w );
      
               inputs[0].state.w = inputs[0].state.w  -waterToMove;
               inputs[0].state.c = inputs[0].state.c;
      
               inputs[1].state.w = inputs[1].state.w  +waterToMove;
               inputs[1].state.c = inputs[1].state.c;
               
			   outputs.push( inputs[0], inputs[1] );
            },
           [this.type,this.type],2, true);
   
   this.operators['=4?'] = 
          new Operator('=4?',function(inputs,outputs){
      
			   if (inputs[0].state.w==4){
                  outputs.push( inputs[0], null );
               } else {
			      outputs.push( null, inputs[0] );
               }
            },
           [this.type],['yes','no'], true);

   
   //this.views = []; // erase default view
   this.views.unshift( function(ctx){
      var w = 100,h = 100;
      ctx.save();	
      // glass shape
      ctx.strokeStyle="black";
      ctx.beginPath();
      ctx.moveTo(0, (8-this.state.c)/8*h);
      ctx.lineTo(w/6,h);
      ctx.lineTo(w-w/6,h);
      ctx.lineTo(w, (8-this.state.c)/8*h);
      ctx.lineTo(0, (8-this.state.c)/8*h);
      ctx.stroke();
      ctx.clip();

      ctx.beginPath();
      ctx.fillStyle="lightblue";
      ctx.fillRect(0,(8-this.state.w)/8 * h, w, h);
      ctx.closePath();

      ctx.strokeStyle = "blue";
      ctx.lineWidth = 1;
      for (var i=0;i<this.state.c;i++){
         ctx.beginPath();
         ctx.moveTo(w/3, (8-i)/8*h);
         ctx.lineTo(w*2/3, (8-i)/8*h);
         ctx.stroke();
         ctx.closePath();
      }

      ctx.restore();
   });
}
   
/*   
   
    return {
      _set: function(water,capacity){
        _water = water;
        _capacity = capacity;
        return this;
      },
      _get: function(){
        return {w: _water, c:_capacity};
      },
	  _clone: function(glass){
		  return new Glass()._set( glass._get().w, glass._get().c );
	  },  
	  _new: function(glass){
		
		var items = [];
		items.push( new Glass()._set( Math.floor(Math.random()*4) ,3) );
		items.push( new Glass()._set( Math.floor(Math.random()*6) ,5) );
		items.push( new Glass()._set( Math.floor(Math.random()*9) ,8) );
		return  items[Math.floor(Math.random()*items.length)];
	  },  
      _update: function(dTime){},       
      toString: function(){
        return _water + '|' + _capacity;
      }, 

      operators: [
          new Operator('pour',function(inputs,outputs){
		  
			   var freeSpace = inputs[1]._get().c - inputs[1]._get().w;
               var waterToMove = Math.min(freeSpace, inputs[0]._get().w );
			   outputs.push( inputs[0]._set(
								inputs[0]._get().w  -waterToMove,
								inputs[0]._get().c
								),
							 inputs[1]._set(
								inputs[1]._get().w  +waterToMove,
								inputs[1]._get().c
								)
							);
            },
           2,2, true),
          new Operator('fill',function(inputs,outputs){
			inputs[0]._set( inputs[0]._get().c , inputs[0]._get().c );
            outputs.push( inputs[0]._clone(inputs[0]) );
          },1,1, true),
          new Operator('empty',function(inputs,outputs){
			inputs[0]._set( 0 , inputs[0]._get().c );
            outputs.push( inputs[0]._clone(inputs[0]) );
          },1,1, true)
      ],
       
      _currentViewIndex: 0, // default view
      nextView: function(){
         this._currentViewIndex = (this._currentViewIndex+1) % this.views.length;
      },
      getCurrentView: function(){
         return this.views[ this._currentViewIndex ];
      },        
      views: [
	  			// add a view where glasses are in scale with one another (assume max capacity is 8)
            function(ctx,w,h){
				ctx.save();				
				// glass shape
				ctx.strokeStyle="black";
				ctx.beginPath();
				ctx.moveTo(0, (8-_capacity)/8*h);
				ctx.lineTo(w/6,h);
				ctx.lineTo(w-w/6,h);
				ctx.lineTo(w, (8-_capacity)/8*h);
				ctx.lineTo(0, (8-_capacity)/8*h);
				ctx.stroke();
				ctx.clip();

                ctx.beginPath();
                ctx.fillStyle="lightblue";
                ctx.fillRect(0,(8-_water)/8 * h, w, h);
                ctx.closePath();
		
				ctx.strokeStyle = "blue";
				ctx.lineWidth = 1;
				for (var i=0;i<_capacity;i++){
					ctx.beginPath();
					ctx.moveTo(w/3, (8-i)/8*h);
					ctx.lineTo(w*2/3, (8-i)/8*h);
					ctx.stroke();
					ctx.closePath();
				}
				
				ctx.restore();
            },
			
			function(ctx,w,h){
                ctx.beginPath();
                ctx.strokeStyle="blue";
                ctx.rect(0,0,w,h);
                ctx.stroke();
                ctx.closePath();

                ctx.beginPath();
                ctx.fillStyle="black";
                ctx.fillText( _water ,w/4,h/3);
                ctx.fillText( _capacity ,w*3/4,h*4/5);
                ctx.closePath();
            }

      ]
    };
}
*/