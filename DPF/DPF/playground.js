
function playgroundSetup(ADT,OBJECT_HEAP,OP_HEAP,OpBox,Box,SIZE_X,SIZE_Y){
	
	var K = 3;
    var i = 0;
//    console.log( ADT.operators );
	for (var key in ADT.operators){
//        console.log( key , ADT.operators[key] );
		OP_HEAP.push( new OpBox(SIZE_X*((i%K)*3+2),SIZE_Y*(~~(i/K)*3 + 2),
							     SIZE_X,SIZE_Y,
							     ADT.operators[key]) );
        i++;
	}
	
	// standard operators
    if (ADT.clone){
       OP_HEAP.push( new OpBox(0,2*SIZE_Y,
                               SIZE_X,SIZE_Y,
                               new Operator('clone',function(inputs,outputs){
                                 outputs.push( ADT.clone(inputs[0]) );
                               },  
                               [ADT.type],1,false)
                              ) 
                    );
    }

    OP_HEAP.push( new OpBox(0,6*SIZE_Y,
							SIZE_X,SIZE_Y,
                            new Operator('bin',function(inputs,outputs){},  
							              ['*'],0,true) // any type of object will be deleted
                           )
                );
   
   // special ENLARGER operator
   OP_HEAP.push( new OpBox(SIZE_X*12,SIZE_Y*7,
                           SIZE_X*3,SIZE_Y*3,
                           new Operator('ENLARGE',function(inputs,outputs){},
                           ['*'],0,false) // any type of object will be deleted
                           )
   );

    
    return 'A playground for the <b>Digital-Playground Factory</b>.';
}
