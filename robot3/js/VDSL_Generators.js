Blockly.JavaScript['GuessRobot'] = function(block) {
  let code = 'new GuessRobot()\n';
  return code;
};

Blockly.JavaScript['forward'] = function(block) {
   let code = '   .forward(';
   code +=    ')';
   return code;
};

Blockly.JavaScript['turnCW'] = function(block) {
   let code = '   .turnCW(';
   code +=    ')';
   return code;
};

Blockly.JavaScript['turnACW'] = function(block) {
   let code = '   .turnACW(';
   code +=    ')';
   return code;
};

Blockly.JavaScript['repeat2times'] = function(block) {
   let code = '   .repeat2times(';
   let statements_P = Blockly.JavaScript.statementToCode(block, 'P');
   code += 'new GuessRobot()'+statements_P
   code +=    ')';
   return code;
};

Blockly.JavaScript['repeat4times'] = function(block) {
   let code = '   .repeat4times(';
   let statements_P = Blockly.JavaScript.statementToCode(block, 'P');
   code += 'new GuessRobot()'+statements_P
   code +=    ')';
   return code;
};
