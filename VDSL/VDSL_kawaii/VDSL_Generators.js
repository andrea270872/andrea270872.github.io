
Blockly.JavaScript['KawaiiEyes'] = function(block) {  
  let code = `new KawaiiEyes(rc)\n`;
  return code;
};

Blockly.JavaScript['happy'] = function(block) {
   let code = '   .happy(';
   code += block.getFieldValue('isHappy')== 'TRUE'
   code +=    ')';
   return code;
};

Blockly.JavaScript['childish'] = function(block) {
   let code = '   .childish(';
   code += block.getFieldValue('isOn')== 'TRUE'
   code +=    ')';
   return code;
};

Blockly.JavaScript['moreIntense'] = function(block) {
   let code = '   .moreIntense(';
   code +=    ')';
   return code;
};

Blockly.JavaScript['moreCute'] = function(block) {
   let code = '   .moreCute(';
   code +=    ')';
   return code;
};

Blockly.JavaScript['drawLeftEye'] = function(block) {
   let code = '   .drawLeftEye(';
   code +=    ')';
   return code;
};

Blockly.JavaScript['drawRightEye'] = function(block) {
   let code = '   .drawRightEye(';
   code +=    ')';
   return code;
};

Blockly.JavaScript['finishFace'] = function(block) {
   let code = '   .finishFace(';
   code +=    ')';
   return code;
};

Blockly.JavaScript['normalIntense'] = function(block) {
   let code = '   .normalIntense(';
   code +=    ')';
   return code;
};

Blockly.JavaScript['normalCute'] = function(block) {
   let code = '   .normalCute(';
   code +=    ')';
   return code;
};

Blockly.JavaScript['color'] = function(block) {
   let code = '   .color(';
   code += block.getFieldValue('rgbColor')
   code +=    ')';
   return code;
};

