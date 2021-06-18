    
var IntegerNumber = function(){
   ADT_DEF.call(this,'IntegerNumber');
   
   this.state = {
     value: 0,
   };
   
   this.toString = function(){
        return this.state.value;
   };

   this.operators['new'] = 
        new Operator('new',function(inputs,outputs){
            var newInt = new IntegerNumber();
            newInt.state.value = 0;
            outputs.push( newInt );
          },[],1, false);

   this.operators['succ'] = 
        new Operator('succ',function(inputs,outputs){
            var newInt = new IntegerNumber();
            newInt.state.value = inputs[0].state.value +1 ;
            outputs.push( newInt );
          },[this.type],1, true);
   
   this.operators['add'] = 
          new Operator('add',function(inputs,outputs){
             var newInt = new IntegerNumber();
             newInt.state.value = inputs[0].state.value + inputs[1].state.value;
               outputs.push( newInt );
             },
           [this.type,this.type],1, false); // 2 inputs, 1 output, do not remove inputs
}
