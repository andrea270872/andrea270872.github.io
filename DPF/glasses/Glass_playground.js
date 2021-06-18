
function playgroundSetup(ADT,OBJECT_HEAP,OP_HEAP,OpBox,Box,SIZE_X,SIZE_Y){

   OP_HEAP.push( new OpBox(SIZE_X*1,SIZE_Y*2,
                           SIZE_X,SIZE_Y,
                           ADT.operators['pour']) );

   OP_HEAP.push( new OpBox(SIZE_X*9,SIZE_Y*5,
                           SIZE_X,SIZE_Y,
                           ADT.operators['=4?']) );
   
   
    OP_HEAP.push( new OpBox(0,6*SIZE_Y,
							SIZE_X,SIZE_Y,
                            new Operator('bin',function(inputs,outputs){},  
							              ['*'],0,true) // any type of object will be deleted
                           )
                );
   
   // individual Glasses
   var outputs;

   outputs = [];
   ADT.operators['new'].body([],outputs);
   outputs[0].state.w = 8;
   outputs[0].state.c = 8;
   OBJECT_HEAP.push ( new Box(SIZE_X*4,SIZE_Y*2,
								SIZE_X,SIZE_Y, outputs[0]) );
   
   outputs = [];
   ADT.operators['new'].body([],outputs);
   outputs[0].state.w = 0;
   outputs[0].state.c = 5;
   OBJECT_HEAP.push ( new Box(SIZE_X*5,SIZE_Y*2,
								SIZE_X,SIZE_Y, outputs[0]) );
   
   outputs = [];
   ADT.operators['new'].body([],outputs);
   outputs[0].state.w = 0;
   outputs[0].state.c = 3;
   OBJECT_HEAP.push ( new Box(SIZE_X*6,SIZE_Y*2,
								SIZE_X,SIZE_Y, outputs[0]) );
   
   
   // special ENLARGER operator
   OP_HEAP.push( new OpBox(SIZE_X*12,SIZE_Y*7,
                           SIZE_X*3,SIZE_Y*3,
                           new Operator('ENLARGE',function(inputs,outputs){},
                           ['*'],0,false) // any type of object will be deleted
                           )
   );
   
    
   return 'A playground to practice with water glasses.<br/>'+
          'Try pouring water from one glass to another until you get exactly 4 cl in 1 glass.<br/>'+
          'You can use the <i>tester</i> operator <b>[=4?]</b> to check your glasses.'
}
