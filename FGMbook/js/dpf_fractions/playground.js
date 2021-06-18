
function playgroundSetup(ADT,OBJECT_HEAP,OP_HEAP,OpBox,Box,SIZE_X,SIZE_Y){
	
  var K = 3;
  var i = 0;

/*  
//    console.log( ADT.operators );
	for (var key in ADT.operators){
//        console.log( key , ADT.operators[key] );
		OP_HEAP.push( new OpBox(SIZE_X*((i%K)*3+2),SIZE_Y*(~~(i/K)*3 + 2),
							     SIZE_X,SIZE_Y,
							     ADT.operators[key]) );
        i++;
	}
*/  

    OP_HEAP.push( new OpBox(SIZE_X*1,SIZE_Y*0,
                            SIZE_X,SIZE_Y,
                            ADT.operators['new']) );

    OP_HEAP.push( new OpBox(SIZE_X*7,SIZE_Y*2,
                            SIZE_X,SIZE_Y,
                            ADT.operators['add']) );

    OP_HEAP.push( new OpBox(SIZE_X*10,SIZE_Y*2,
                            SIZE_X,SIZE_Y,
                            ADT.operators['mult']) );

    OP_HEAP.push( new OpBox(SIZE_X*13,SIZE_Y*2,
                            SIZE_X,SIZE_Y,
                            ADT.operators['1/n']) );


    OP_HEAP.push( new OpBox(SIZE_X*3,SIZE_Y*4,
                            SIZE_X,SIZE_Y,
                            ADT.operators['simplify']) );  

   OP_HEAP.push( new OpBox(SIZE_X*4,SIZE_Y*6,
                           SIZE_X,SIZE_Y,
                           ADT.operators['zoom']) );   
	
   OP_HEAP.push( new OpBox(SIZE_X*2,SIZE_Y*2,
                           SIZE_X,SIZE_Y,
                           new Operator('clone',function(inputs,outputs){
                             outputs.push( ADT.clone(inputs[0]) );
                           },  
                           [ADT.type],1,false)
                          ) 
                );

    OP_HEAP.push( new OpBox(SIZE_X*1,SIZE_Y*10,
							              SIZE_X,SIZE_Y,
                            new Operator('bin',function(inputs,outputs){},  
							              ['*'],0,true) // any type of object will be deleted
                           )
                );
   
   // special ENLARGER operator
   OP_HEAP.push( new OpBox(SIZE_X*11,SIZE_Y*8,
                           SIZE_X*3,SIZE_Y*3,
                           new Operator('ENLARGE',function(inputs,outputs){},
                           ['*'],0,false) // any type of object will be deleted
                           )
   );
  
    return 'A playground for the <b>Digital-Playground Factory</b>.';
}
