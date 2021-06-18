
var Fraction = function(){
   ADT_DEF.call(this,'Fraction');
   
   this.state = {
     numerator: 0,
     denumerator: 0
   };

   // optional
   this.clone = function(fraction){
      var f = new Fraction();
      f.state = {
         numerator: fraction.state.numerator,
         denumerator: fraction.state.denumerator
      };
      return f;
   }
   
   this.toString= function(){
      return this.state.numerator + '/' + this.state.denumerator;
   };

   this.operators['add'] = 
          new Operator('add',function(inputs,outputs){
             var newFraction = new Fraction();
              
              if (inputs[0].state.denumerator == inputs[1].state.denumerator){
                   newFraction.state = { 
                    numerator: inputs[0].state.numerator + inputs[1].state.numerator ,
                    denumerator: inputs[0].state.denumerator };
              } else {
                  newFraction.state = { 
                     numerator: inputs[0].state.numerator * inputs[1].state.denumerator + 
                                inputs[1].state.numerator * inputs[0].state.denumerator,
                     denumerator: inputs[0].state.denumerator * inputs[1].state.denumerator 
                  };
              }
              outputs.push( newFraction );    
            },
           [this.type,this.type],1, false);
          // 2 inputs of type 'Fraction', 1 output, do not remove inputs
          // ... type checking on inputs is done by Engine

   this.operators['mult'] = 
          new Operator('mult',function(inputs,outputs){
             var newFraction = new Fraction();
             
              newFraction.state = { 
                 numerator: inputs[0].state.numerator * inputs[1].state.numerator,
                 denumerator: inputs[0].state.denumerator * inputs[1].state.denumerator 
              };
              outputs.push( newFraction );    
            },
           [this.type,this.type],1, false);
          // 2 inputs of type 'Fraction', 1 output, do not remove inputs
          // ... type checking on inputs is done by Engine

   this.operators['new'] = 
        new Operator('new',function(inputs,outputs){
             var n = Math.floor(Math.random()*10)+1;
             var d = Math.floor(Math.random()*10)+1;
            var f = new Fraction();
              f.state = {numerator:n,denumerator:d}
            outputs.push( f );
          },[],1, false); // ... 

   // greatest common divisor
   var _GCD = function(a,b){
      while (b!=0){
         var t = b;
         b = a % b;
         a = t;
      }
      return a;
   }

   this.operators['1/n'] = 
        new Operator('   1/n',function(inputs,outputs){
            inputs[0].state = {numerator: inputs[0].state.denumerator,
                               denumerator: inputs[0].state.numerator}
            outputs.push( inputs[0] );
          },[this.type],1, true);

   
   this.operators['simplify'] = 
        new Operator('simplify',function(inputs,outputs){
            var n = inputs[0].state.numerator;
            var d = inputs[0].state.denumerator;
            var GCD = _GCD(n,d);
            inputs[0].state = {numerator: n/GCD,denumerator: d/GCD}
            outputs.push( inputs[0] );
          },[this.type],1, true);

   this.operators['zoom'] = 
        new Operator('zoom',function(inputs,outputs){
            var n = inputs[0].state.numerator;
            var d = inputs[0].state.denumerator;
            var k = Math.floor(Math.random()*10)+1;
            var GCD = _GCD(n,d);
            inputs[0].state = {numerator: k*n/GCD,denumerator: k*d/GCD}
            outputs.push( inputs[0] );
          },[this.type],1, true);
   
   this.views = []; // erase default view
   this.views.push( function(ctx){
                ctx.beginPath();
                ctx.strokeStyle="blue";
                ctx.rect(0,0,100,100);
                ctx.stroke();
                ctx.closePath();

                if (this.state.denumerator!=1){
                  ctx.beginPath();
                  ctx.fillStyle="black";
                  ctx.fillText( this.state.numerator ,25,33);
                  ctx.fillText( this.state.denumerator ,25,100*4/5);
                  ctx.closePath();

                  ctx.beginPath();
                  ctx.strokeStyle="blue";
                  ctx.moveTo(25-2,     50);
                  ctx.lineTo(100*3/4+2,50);
                  ctx.stroke();
                  ctx.closePath();

                } else { // this fraction is basically a whole number: n/1
                  ctx.beginPath();
                  ctx.fillStyle="black";
                  ctx.fillText( this.state.numerator ,25,50);
                  ctx.closePath();
                }

            });

   // auxiliary function
   this._isImproper = function(){
      return (this.state.numerator > this.state.denumerator);
   };
   
   this.views.push( function(ctx){
                if (this.state.denumerator==1){ 
                // this fraction is basically a whole number: n/1
                  ctx.beginPath();
                  ctx.strokeStyle="blue";
                  ctx.rect(0,0,100,100);
                  ctx.stroke();
                  ctx.closePath();
                  
                  ctx.beginPath();
                  ctx.fillStyle="black";
                  ctx.fillText( this.state.numerator ,25,50);
                  ctx.closePath();
                  return;
                }

                ctx.beginPath();
                ctx.fillStyle="#ffbbff";
                ctx.fillRect(0,0,100,100);
                ctx.strokeStyle="purple";
                ctx.lineWidth = 2;
                ctx.rect(0,0,100,100);
                ctx.stroke();
                ctx.closePath();
                ctx.lineWidth = 1;
      
                if (!this._isImproper()){
                    // n is <= than d
                    ctx.beginPath();
                       var blockWidth = ( 1.0 /this.state.denumerator) * 100;
                       for (var i=0;i<this.state.denumerator;i++){
                        if (i<this.state.numerator) ctx.fillStyle="green";
                        else ctx.fillStyle="white";
                        ctx.fillRect(i*blockWidth,0, blockWidth,100);
                        ctx.strokeStyle="black";
                        ctx.strokeRect(i*blockWidth,0, blockWidth,100);
                       }
                    ctx.closePath();
                } else {
                    // TO DO: draw bars in the denumerator
                    var h2 = 100 * 2/3;
                    var reminder = this.state.numerator % this.state.denumerator;
                    ctx.beginPath();
                    
                    ctx.fillStyle="black";
                    if (reminder!=0){
                       ctx.fillText( ~~(this.state.numerator/this.state.denumerator)+'+' ,25,25);
                    
                       var blockWidth = ( 1.0 /this.state.denumerator) * 100;
                       for (var i=0;i<this.state.denumerator;i++){
                        if (i<reminder) ctx.fillStyle="green";
                        else ctx.fillStyle="white";
                        ctx.fillRect(i*blockWidth,100-h2, blockWidth,h2);
                        ctx.strokeStyle="black";
                        ctx.strokeRect(i*blockWidth,100-h2, blockWidth,h2);
                       }
                       ctx.closePath();
                    } else {
                       ctx.fillText( ~~(this.state.numerator/this.state.denumerator) ,25,50);
                    }
                }
            });
}