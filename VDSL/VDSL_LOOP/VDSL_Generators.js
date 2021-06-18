Blockly.JavaScript['LoopProgram'] = function(block) {
  let code = 'new LoopProgram()\n';
  return code;
};

Blockly.JavaScript['add'] = function(block) {
   let code = '   .add(';
   code += block.getFieldValue('i')+',';
   code += block.getFieldValue('j')+',';
   code += block.getFieldValue('c')
   code +=    ')';
   return code;
};

Blockly.JavaScript['sub'] = function(block) {
   let code = '   .sub(';
   code += block.getFieldValue('i')+',';
   code += block.getFieldValue('j')+',';
   code += block.getFieldValue('c')
   code +=    ')';
   return code;
};

Blockly.JavaScript['loop'] = function(block) {
   let code = '   .loop(';
   code += block.getFieldValue('i')+',';
   let statements_P = Blockly.JavaScript.statementToCode(block, 'P');
   code += 'new LoopProgram()'+statements_P;
   code +=    ')';
   return code;
};

Blockly.JavaScript['MACRO_1'] = function(block) {
   let code = '   .MACRO_1(';
   code += block.getFieldValue('name')+',';
   let statements_P = Blockly.JavaScript.statementToCode(block, 'P');
   code += 'new LoopProgram()'+statements_P;
   code +=    ')';
   return code;
};

Blockly.JavaScript['DO_1'] = function(block) {
   let code = '   .DO_1(';
   code += block.getFieldValue('name')+',';
   code += block.getFieldValue('i')
   code +=    ')';
   return code;
};

Blockly.JavaScript['run'] = function(block) {
   let code = '   .run(';
   code +=    ')';
   return code;
};

Blockly.JavaScript['stepByStep'] = function(block) {
   let code = '   .stepByStep(';
   code +=    ')';
   return code;
};

