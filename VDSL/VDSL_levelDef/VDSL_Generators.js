Blockly.JavaScript['LevelDef'] = function(block) {
  let code = 'new LevelDef()\n';
  return code;
};

Blockly.JavaScript['paveFloor'] = function(block) {
   let code = '   .paveFloor(';
   code += block.getFieldValue('width')
   code +=    ')';
   return code;
};

Blockly.JavaScript['fillWithWater'] = function(block) {
   let code = '   .fillWithWater(';
   code += block.getFieldValue('atPos')+',';
   code += block.getFieldValue('width')
   code +=    ')';
   return code;
};

Blockly.JavaScript['bridge'] = function(block) {
   let code = '   .bridge(';
   code += block.getFieldValue('atPos')+',';
   code += block.getFieldValue('width')
   code +=    ')';
   return code;
};

Blockly.JavaScript['startAt'] = function(block) {
   let code = '   .startAt(';
   code += block.getFieldValue('pos')
   code +=    ')';
   return code;
};

Blockly.JavaScript['exitAt'] = function(block) {
   let code = '   .exitAt(';
   code += block.getFieldValue('pos')
   code +=    ')';
   return code;
};

Blockly.JavaScript['keyAt'] = function(block) {
   let code = '   .keyAt(';
   code += block.getFieldValue('pos')
   code +=    ')';
   return code;
};

Blockly.JavaScript['doorAt'] = function(block) {
   let code = '   .doorAt(';
   code += block.getFieldValue('pos')
   code +=    ')';
   return code;
};

Blockly.JavaScript['buttonAt'] = function(block) {
   let code = '   .buttonAt(';
   code += block.getFieldValue('pos')
   code +=    ')';
   return code;
};

Blockly.JavaScript['pressedButtonAt'] = function(block) {
   let code = '   .pressedButtonAt(';
   code += block.getFieldValue('pos')
   code +=    ')';
   return code;
};

Blockly.JavaScript['createTheLevel'] = function(block) {
   let code = '   .createTheLevel(';
   code +=    ')';
   return code;
};

