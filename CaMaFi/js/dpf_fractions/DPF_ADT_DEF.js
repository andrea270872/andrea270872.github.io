
/*
   name: string
   body: function(paramArray,resultArray)
   inputsNum: array of string (aka the names of the types)
   outputsNum: int
   removeInputs: boolean
*/
function Operator(name,body,
                  inputsTypes,outputsNum, removeInputs){
   this.name = name;
   this.body = body;
   this.inputsNum = inputsTypes.length;
   this.inputsTypes = inputsTypes;
   this.outputsNum = outputsNum;
   this.removeInputs = removeInputs;
}

// *************************************************

var ADT_DEF = function(typeName){
   this.type = typeName;
   this.toString = function(){
        return 'a ' + this.type;
   };
   this.state = {};  
   this.clone = undefined; // forces subclasses to define it
   this.update= function(dTime){}; // dummy update
   
   this.operators = {};

   this._currentViewIndex = 0; // default view
   this.nextView = function(){
//      console.log( 'before ' + this._currentViewIndex + ' ' + this.views.length);
      this._currentViewIndex = (this._currentViewIndex+1) % this.views.length;
//      console.log( 'after ' + this._currentViewIndex + ' ' + this.views.length);
   };
   this.getCurrentView = function(){
      return this.views[ this._currentViewIndex ];
   };
   this.views = [
            function(ctx){ // default view; size is always 100x100
                ctx.beginPath();
                ctx.strokeStyle="blue";
                ctx.rect(0,0,100,100);
                ctx.stroke();
               
                ctx.fillStyle="black";
                ctx.fillText( this.toString() ,25,33);
                ctx.closePath();
            }
      ];
}

// *************************************************