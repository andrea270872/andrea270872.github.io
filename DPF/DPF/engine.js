

function DPF_Engine(ADT,THE_SIZE,cogIconPath,appId){

// GUI modal element ********************************************

   var APPLICATION_ID = appId;

   // Get the modal
   var GUImodal = document.getElementById('myModal');
   var GUIinfo = document.getElementById('myModalInfo');

   // Get the <span> element that closes the modal
   var GUIspan = document.getElementsByClassName("close")[0];

   // When the user clicks on <span> (x), close the modal
   GUIspan.onclick = function() {
       GUImodal.style.display = "none";
   }


   document.getElementById('btn1').onclick = function(evt) {   // load
      evt.preventDefault();

      /* format: [objs,ops]
         objs is an array of [box.x,box.y , 
         box.obj.state,box.obj._currentViewIndex,box.obj.type]
      */
      var data = JSON.parse( localStorage.getItem('data_'+APPLICATION_ID) );
      var objs = data[0];
      var ops  = data[1];
      
      // restoring Boxes in the ObjectHeap
      OBJECT_HEAP = [];
      objs.forEach(function(obj,index){
         // type
         var outputs = [];
         eval('new '+obj[4]+'()').operators["new"].body([],outputs);
         var newObj = outputs[0];
         newObj.state = obj[2]; // state
         newObj._currentViewIndex = obj[3]; // obj[3] is currentViewIndex
         
         OBJECT_HEAP.push ( new Box(obj[0],obj[1], // x and y of the Box
                           SIZE_X,SIZE_Y, newObj) ); 
      });
      
      // restoring positions of the operators in the OpHeap
      // TO DO proper de-serialization of the opBox list

      
   //   console.log( data );
      console.log( 'data loaded' );
      GUImodal.style.display = "none";
   };

   document.getElementById('btn2').onclick = function(evt) {  // save
      evt.preventDefault();

      var objs = OBJECT_HEAP.map(function(box){
         var dataToSave = [];
         dataToSave.push( box.x,box.y );
         dataToSave.push( box.obj.state,box.obj._currentViewIndex,box.obj.type );
         return dataToSave;
      });
      var ops = OP_HEAP.map(function(opbox){
         var dataToSave = [];
         dataToSave.push( opbox.x,opbox.y,opbox.name );
         return dataToSave;
      });
      // DEBUG 
      console.log( [objs,ops] );
      
      localStorage.setItem('data_'+APPLICATION_ID,
                           JSON.stringify( [objs,ops] )
      );
      
      
      console.log( 'data saved' );
      GUImodal.style.display = "none";
   };

// ************************************************************
   
   
   var _images = {};
   _images['cogIcon'] = new Image();
   _images['cogIcon'].onload = function(){
       _images['cogIcon'].loaded = true;
   };
   _images['cogIcon'].src = cogIconPath;
   
   var cogIconAction = function(){
//      console.log("menu pop-up");
      GUImodal.style.display = "block"; // show modal popup
   }
   
// ********************************************************

   var SIZE_X = THE_SIZE,
       SIZE_Y = THE_SIZE;
   var GRID_SIZE_X = THE_SIZE,
       GRID_SIZE_Y = THE_SIZE;
   var OBJECT_HEAP = []; // array of Boxes
   var OP_HEAP = []; // array of OpBoxes, operators
   var cogIconPos = {x:12*SIZE_X,y:0,w:SIZE_X,h:SIZE_Y};
   
   var canvas = document.getElementById('myCanvas');
   var ctx = canvas.getContext('2d');
   
   function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
   }
   resizeCanvas();
   window.addEventListener('resize', resizeCanvas, false);

   /* ---------------------------------- */  
   var MOUSE_POS = {x:0,y:0};
   var MOUSE_PRESSED = false;
   var SELECTED_BOX = null;
   var SELECTED_BOX_DRAG_FIRST_POS = {x:0,y:0};
   var SELECTED_BOX_DPOS = {x:0,y:0};
   var SELECTED_BOX_IS_OP = false;
   var _DATE = null;

   var MOUSEMOVE_HANDLER = function(evt) {
       evt.preventDefault();

//       console.log( 'MOUSEMOVE' );
       
      var cX,cY;
      if ((evt.clientX)&&(evt.clientY)) { // PC mouse
         cX = evt.clientX;
         cY = evt.clientY;
      } else if (evt.targetTouches) { // touch on mobile
         cX = evt.targetTouches[0].clientX;
         cY = evt.targetTouches[0].clientY;
      }
      
      var rect = canvas.getBoundingClientRect();
      MOUSE_POS.x = cX - rect.left;
      MOUSE_POS.y = cY - rect.top;

      // dragging
      if ((MOUSE_PRESSED) && (SELECTED_BOX!=null)){
         SELECTED_BOX.x = MOUSE_POS.x + SELECTED_BOX_DPOS.x;
         SELECTED_BOX.y = MOUSE_POS.y + SELECTED_BOX_DPOS.y;
      }
   };

   var MOUSEDOWN_HANDLER = function(evt) {
       evt.preventDefault();
       
//       console.log( 'MOUSEDOWN' );
       
       // touch devices need to do this, because touchMove is not triggered as often as mousemove
       var rect = canvas.getBoundingClientRect();
       if (evt.targetTouches) {
           MOUSE_POS.x = evt.targetTouches[0].clientX;
           MOUSE_POS.y = evt.targetTouches[0].clientY;
           MOUSE_POS.x = MOUSE_POS.x - rect.left;
           MOUSE_POS.y = MOUSE_POS.y - rect.top;    
       }       
       
      MOUSE_PRESSED = true;
      _DATE = new Date(); // remembering now!

      SELECTED_BOX_IS_OP = false;
      SELECTED_BOX = findBoxAtPos(MOUSE_POS);
      if (SELECTED_BOX!=null){
         SELECTED_BOX_DPOS.x = SELECTED_BOX.x - MOUSE_POS.x;
         SELECTED_BOX_DPOS.y = SELECTED_BOX.y - MOUSE_POS.y;

         SELECTED_BOX_DRAG_FIRST_POS.x = SELECTED_BOX.x;
         SELECTED_BOX_DRAG_FIRST_POS.y = SELECTED_BOX.y;
      } else { // if you did not click on a Box, perhaps you clicked on an OpBox
           SELECTED_BOX = findOpBoxAtPos(MOUSE_POS);
           if (SELECTED_BOX!=null){
               SELECTED_BOX_IS_OP = true;

               SELECTED_BOX_DPOS.x = SELECTED_BOX.x - MOUSE_POS.x;
               SELECTED_BOX_DPOS.y = SELECTED_BOX.y - MOUSE_POS.y;

               SELECTED_BOX_DRAG_FIRST_POS.x = SELECTED_BOX.x;
               SELECTED_BOX_DRAG_FIRST_POS.y = SELECTED_BOX.y;
           }
      }
   };
      
   var MOUSEUP_HANDLER = function(evt) {       
       evt.preventDefault();
       
//       console.log( 'MOUSEUP' );
      // drop
      if (SELECTED_BOX!=null){ // grid-snap when Box is dropped!
         SELECTED_BOX.x = Math.round(SELECTED_BOX.x / GRID_SIZE_X)*GRID_SIZE_X;
         SELECTED_BOX.y = Math.round(SELECTED_BOX.y / GRID_SIZE_Y)*GRID_SIZE_Y;

         if (!SELECTED_BOX_IS_OP){ // you are dragging a Box (not an OpBox)
             // check if HOLD the button down
             if (SELECTED_BOX_DRAG_FIRST_POS.x-SELECTED_BOX.x + 
                 SELECTED_BOX_DRAG_FIRST_POS.y-SELECTED_BOX.y == 0){ // moved very little, could be HOLD?
                if (new Date().getTime() - _DATE.getTime() >= 600){ // milliseconds
                   //console.log( 'HOLD');
                   SELECTED_BOX.obj.nextView();
                }
             }
         } else {
           _DATE = null;
         }         
      } else {
         
           if ( isPointInRect(MOUSE_POS.x,MOUSE_POS.y,   
                             cogIconPos.x,cogIconPos.y,cogIconPos.w,cogIconPos.h) ){
              // the user released the button on the cogIcon
              cogIconAction();
           }
         
      }

      MOUSE_PRESSED = false;
      _DATE = null;
      MOUSE_MOVED_WHILE_PRESSED = false;
   };
   
   
   canvas.addEventListener('mousemove', MOUSEMOVE_HANDLER, false);   
   canvas.addEventListener('mousedown', MOUSEDOWN_HANDLER, false);
   canvas.addEventListener('mouseup',   MOUSEUP_HANDLER, false);

   // mobile: touch support ===>> TO DO: fix the handlers for touch
   canvas.addEventListener('touchmove',  MOUSEMOVE_HANDLER, false);   
   canvas.addEventListener('touchstart', MOUSEDOWN_HANDLER, false);
   canvas.addEventListener('touchend',   MOUSEUP_HANDLER, false);
   

   /* ---------------------------------- */  

   // box for values
   var Box = function(x,y,width,height, 
                      obj){
       this.obj = obj; // the object that this Box represent
       this.x = x;
       this.y = y;
       this.w = width;
       this.h = height;
   }

   // box for operations
   var OpBox = function(x,y,width,height, 
                        ADTop){
       this.name = ADTop.name;
       this.op = ADTop.body; // the object that this OpBox represent
       this.inNumber = ADTop.inputsNum;  // # of input pads
       this.inTypes = ADTop.inputsTypes;
      
       // # of output pads
       /* could be: 
            (CASE1)a number,
            (CASE2)a list of strings (to write in the output pads)         
       */
       if (isNaN(ADTop.outputsNum)){ // (CASE1)
         this.outNumber = ADTop.outputsNum.length;
         this.outLabels = ADTop.outputsNum;
          console.log( this.outNumber );
       } else {  // (CASE2)
         this.outNumber = ADTop.outputsNum;
         this.outLabels = null;
       }
      
       this._maxPorts = Math.max(this.inNumber,this.outNumber);
       this.removeInputs = (ADTop.removeInputs||false); // default: false
       this.x = x;
       this.y = y;
       this.unitW = SIZE_X; // TO CHECK width;
       this.w = width * this._maxPorts;
       this.h = height;
      
       this._crosses = []; // array of bools, used in typechecking

//       console.log( ADTop );
//       console.log( this );
      
       this.objectToEnlarge = null;
      
       this.draw = function(){
         var w_2 = ~~(this.unitW/2);

         // inputs
         ctx.fillStyle="rgba(128, 128, 128, 0.50)";
         for (var i=0;i<this.inNumber;i++){
            ctx.beginPath();
            ctx.ellipse(w_2+this.unitW*i,0, w_2, SIZE_Y*3/4,  0, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
         }

         // onputs
         for (var i=0;i<this.outNumber;i++){
            ctx.fillStyle="rgba(128, 128, 128, 0.20)";
            ctx.beginPath();
            ctx.ellipse(w_2+this.unitW*i,this.h, w_2, SIZE_Y*3/4,  0, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
            
            if (this.outLabels!=null){
               ctx.beginPath();
               ctx.fillStyle="gray";
               ctx.fillText( this.outLabels[i] ,
                     SIZE_X/3+this.unitW*i,this.h+SIZE_Y/3); // center of this output pad
               ctx.closePath();
            }
         }

         ctx.beginPath();
         ctx.fillStyle="#7600ff";
         ctx.fillRect(0,0,this.w,this.h);
         ctx.closePath();

         ctx.beginPath();
         ctx.fillStyle="white";
         ctx.fillText( this.name ,
               (this.w)/2-20,this.h/2); // center
         ctx.closePath();
          
         //console.log('--->' , this._crosses);
         if (this._crosses.length>0){
            // typecheck: drawing Xs on the input pads with wrong types
            var cX = ~~(SIZE_X/2), cY = ~~(SIZE_Y/4);
            //console.log (cX,cY);
            for (var i=0;i<this.inNumber;i++){
               if (!this._crosses[i]){
                  var x = w_2+this.unitW*i;
                  var y = this.h / 4;

                  ctx.beginPath();
                  ctx.lineWidth = 3;
                  ctx.strokeStyle="red";

                  ctx.moveTo(x - cX, y - cY);
                  ctx.lineTo(x + cX, y + cY);
                  ctx.moveTo(x + cX, y - cY);
                  ctx.lineTo(x - cX, y + cY);

                  ctx.stroke();
               }
            }
            ctx.lineWidth = 1;
         }
          
          if (this.objectToEnlarge){
             console.log( this.objectToEnlarge, this.x,this.y,this.w,this.h );
            var temp = this.objectToEnlarge;
            var dx = this.w/10/2,
                dy = this.h/10/2;
            ctx.save();

               ctx.beginPath();
               ctx.fillStyle="white";
               ctx.fillRect(dx,dy,this.w -dx*2,this.h -dy*2);
               ctx.closePath();

               ctx.transform( 1,0,0,1,0,0 );
               ctx.translate( dx,dy );
               ctx.scale(this.w/110,this.h/110); // 10% smaller
               ctx.font = "16px Arial";
                        // work with a [0,0]-[100,100] area, top-left corner is 0,0
                        temp.getCurrentView().call(temp , ctx);
            ctx.restore();
          }
       };

       // if possible, the operator will execute (with typechecking!)
       this.activate = function(){
          this._crosses = []; // resets crosses on input pads, before typechecing
          this.objectToEnlarge = null; // reset the object in the Enlarger operator
           
          var inputParams = [];
          var isParamTypeOK = []; // array of bools
          var w_2 = ~~(this.unitW/2);
          var h_2 = ~~(SIZE_Y/2);
          for (var i=0;i<this.inNumber;i++){
            var b = findBoxAtPos( {x: (this.x+w_2+this.unitW*i),y: (this.y-h_2) } );
//             // debug
//             ctx.fillStyle = 'green';
//             ctx.fillRect((this.x+w_2+this.unitW*i),(this.y-h_2),
//                              10,10);

            if (b!=null){
               inputParams.push(b);
               
               // type checking
               isParamTypeOK.push( // if '*' then any type matches, else the same type is needed
                  (this.inTypes[i] == '*' ) ||
                  (this.inTypes[i] == b.obj.type)
               );
            }
            
          }
          var areAllParamTypeOK = true;
          isParamTypeOK.forEach(function(value,index){
             areAllParamTypeOK = areAllParamTypeOK && value;
          })

          // DEBUG console.log( inputParams );
          if (inputParams.length==this.inNumber){
             // all inputs are available...

             // DEBUG
             // if (this.inNumber>0) console.log( 'areAllParamTypeOK' , areAllParamTypeOK );

             // are all types OK?
             if (!areAllParamTypeOK){
                // DEBUG console.log( 'type errors ' , isParamTypeOK );

                // draw Xs on the wrong parameters input pads
                this._crosses = isParamTypeOK;
                
             } else  // start ************************************************
             {

                // all output gates empty!
                var anyOccupied = false;
                  for (var i=0;i<this.outNumber;i++){
                      var b = findBoxAtPos( {x: (this.x+w_2+this.unitW*i),y: (this.y+this.h+h_2) } );
//                      // debug
//                      ctx.fillStyle = 'yellow';
//                      ctx.fillRect((this.x+w_2+this.unitW*i),(this.y+this.h+h_2),
//                             10,10);

                      if (b!=null){
                          anyOccupied = true;
                          break;
                      }
                  }

                if (!anyOccupied){
                   // ...and nobody occupies the output gate 

                   // METHOD INVOCATION ... start
                   if (inputParams.length>0){
                       inputParams = inputParams.map(function(element){
                              return element.obj;
                          });
                   }

                   var results = [];
                   var inputsCheckOut = [];
                   if (this.name=='ENLARGE'){
                      this.objectToEnlarge = inputParams[0]; // special method
                   } else {
                     this.op.call( null , inputParams , results , inputsCheckOut);
                   }
                   
                   if ( inputsCheckOut.indexOf(false)!=-1 ){ 
                      // there were errors in the execution: so it did not execute
                      //console.log( 'errors ' , inputsCheckOut);
                   } else {
                      // there were NO errors in the execution

   //                    // DEBUG
   //                    console.log( inputParams, inputParams.length );
   //                    console.log( results, results.length );

                     // ..................... stop
                      if (this.removeInputs){
//                         console.log( ' removing inputs ...' );
//                         console.log( OBJECT_HEAP );
//                         console.log( inputParams );
                         OBJECT_HEAP = OBJECT_HEAP.filter(function(element){
                             return inputParams.indexOf(element.obj)==-1;
                         });
                      }

                      // place all outputs on the right platforms (visually)
                      for (var i=0;i<results.length;i++){
                          if (results[i]!=null){
                             OBJECT_HEAP.push( new Box(this.x +(i*SIZE_X),this.y+this.h,
                                                       SIZE_X,SIZE_Y, results[i]) );
                             // console.log( '1 new object created');
                          }
                      }
                   }

                }
             } // end **************************************************
          } 
       };

   }


   function isPointInRect(pX,pY,
                        rectX,rectY,rectW,rectH){
      return ((pX>=rectX) && (pX<=rectX+rectW)) && 
             ((pY>=rectY) && (pY<=rectY+rectH));
   }

   // pos i {x,y}
   // index in OP_HEAP array represents z-index, search backwards
   function findOpBoxAtPos(pos){
      for (var index=OP_HEAP.length-1;index>=0;index--){
         if (isPointInRect(pos.x,pos.y,
                           OP_HEAP[index].x,OP_HEAP[index].y,
                           OP_HEAP[index].w,OP_HEAP[index].h)){
            return OP_HEAP[index];
         }
      }
      return null;
   }

   // pos i {x,y}
   // index in OBJECT_HEAP array represents z-index, search backwards
   function findBoxAtPos(pos){
      for (var index=OBJECT_HEAP.length-1;index>=0;index--){
         if (isPointInRect(pos.x,pos.y,
                           OBJECT_HEAP[index].x,OBJECT_HEAP[index].y,
                           OBJECT_HEAP[index].w,OBJECT_HEAP[index].h)){
            return OBJECT_HEAP[index];
         }
      }
      return null;
   }

   function gridMe(){
      ctx.save();
      
      ctx.lineWidth = 1; //0.1;
      ctx.strokeStyle = 'rgba(0,0,0, 0.1)';
      for (var i=0; i < canvas.height; i += GRID_SIZE_Y) {
         ctx.beginPath();
         ctx.moveTo(0,i);
         ctx.lineTo(canvas.width,i);
         ctx.stroke();
      }
      for (var i=0; i < canvas.width; i += GRID_SIZE_X) {
         ctx.beginPath();
         ctx.moveTo(i,0);
         ctx.lineTo(i,canvas.height);
         ctx.stroke();
      }
      // DEBUG ctx.fillText( GRID_SIZE_X + '  ' + GRID_SIZE_Y , 10, 10);
      ctx.restore();      
   }       

   var lastTimeStamp = null;          
   function step(timestamp) {
      ctx.font = "11px Arial";


      if (lastTimeStamp==null)
         lastTimeStamp = timestamp;
      var deltaTime = timestamp - lastTimeStamp;

     // refresh all views
     ctx.clearRect(0, 0, canvas.width, canvas.height); // clear
     ctx.fillStyle="black";
     ctx.strokeStyle="black";

     // DEBUG 
     gridMe();

     // draw all OpBoxes -> operators
     for (index in OP_HEAP){
        ctx.save();
        ctx.translate( OP_HEAP[index].x , OP_HEAP[index].y );     
            OP_HEAP[index].draw();
        ctx.restore();
     }

     // draw all Boxes -> objects
     var moveSelectedToTop = false;
     for (index in OBJECT_HEAP){
        OBJECT_HEAP[index].obj.update(deltaTime);

        ctx.save();
        ctx.translate( OBJECT_HEAP[index].x , OBJECT_HEAP[index].y);

        // debugging
        ctx.beginPath();
        ctx.fillStyle = '#F0F0F0';
        ctx.lineWidth = 1;
        ctx.fillRect(0,0,OBJECT_HEAP[index].w,OBJECT_HEAP[index].h);
        ctx.closePath();


         var temp = OBJECT_HEAP[index].obj;
         // DEBUG  console.log( temp._get() );
        
ctx.save();
ctx.scale(SIZE_X/100,SIZE_Y/100);
ctx.font = "16px Arial";        
         // work with a [0,0]-[100,100] area, top-left corner is 0,0
         OBJECT_HEAP[index].obj.getCurrentView().call(temp , ctx);
ctx.restore();        

        if (SELECTED_BOX==OBJECT_HEAP[index]){ // a Box is currently selected
           ctx.beginPath();
           ctx.strokeStyle = 'pink';
           ctx.lineWidth = 10;
           ctx.strokeRect(0,0,OBJECT_HEAP[index].w,OBJECT_HEAP[index].h);
           
           ctx.fillStyle = 'lightgray';
           ctx.fillRect(0, -OBJECT_HEAP[index].h / 4,
                        OBJECT_HEAP[index].w,OBJECT_HEAP[index].h / 3);
           ctx.fillStyle = 'black';
           ctx.fillText( OBJECT_HEAP[index].obj.type ,
                       0, 0);
           ctx.closePath();

           ctx.lineWidth = 1;

           // put selected_box on top
           if (!moveSelectedToTop){
              //console.log("put on top",index);
              OBJECT_HEAP.splice(index, 1);
              OBJECT_HEAP.push(SELECTED_BOX);
           }
        }	 
        ctx.restore();
     }

      if ((SELECTED_BOX!=null) && (SELECTED_BOX_IS_OP)){ // an OpBox is currently selected
       ctx.beginPath();
       ctx.strokeStyle = '#FF69B4';
       ctx.lineWidth = 10;
       ctx.strokeRect(SELECTED_BOX.x,SELECTED_BOX.y,
                       SELECTED_BOX.w,SELECTED_BOX.h);
       ctx.closePath();

       ctx.lineWidth = 1;
    }


      // draw all OpBoxes -> operators
      if (!MOUSE_PRESSED){ // when your are done drag&dropping...
         for (index in OP_HEAP){
           OP_HEAP[index].activate();
         }
      }   
      
      if (_images['cogIcon'].loaded){
         ctx.beginPath();
         ctx.fillStyle="#7600ff";
         ctx.fillRect(cogIconPos.x,cogIconPos.y,
                        cogIconPos.w,cogIconPos.h);
         ctx.closePath();
         ctx.drawImage(_images['cogIcon'],cogIconPos.x,cogIconPos.y,
                        cogIconPos.w,cogIconPos.h);
      }

      // loop -------------------------------
      lastTimeStamp = timestamp;
      window.requestAnimationFrame(step);
   }

   window.requestAnimationFrame(step);
   
   var playgroundInfo = playgroundSetup(ADT,OBJECT_HEAP,OP_HEAP,OpBox,Box,SIZE_X,SIZE_Y);
   if (GUIinfo){
      GUIinfo.innerHTML = playgroundInfo;
   }

}


