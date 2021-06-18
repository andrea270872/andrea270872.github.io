Blockly.JavaScript['RPGCharacter'] = function(block) {
  let code = 'new RPGCharacter()\n';
  return code;
};

Blockly.JavaScript['giveName'] = function(block) {
   let code = '   .giveName(';
   code += block.getFieldValue('characterName')
   code +=    ')';
   return code;
};

Blockly.JavaScript['eat'] = function(block) {
   let code = '   .eat(';
   code += block.getFieldValue('amountOfEnergy')
   code +=    ')';
   return code;
};

Blockly.JavaScript['foundCoins'] = function(block) {
   let code = '   .foundCoins(';
   code += block.getFieldValue('amountOfCoins')
   code +=    ')';
   return code;
};

Blockly.JavaScript['hitEnemy'] = function(block) {
   let code = '   .hitEnemy(';
   code +=    ')';
   return code;
};

Blockly.JavaScript['getDamage'] = function(block) {
   let code = '   .getDamage(';
   code += block.getFieldValue('amountOfDamage')
   code +=    ')';
   return code;
};

Blockly.JavaScript['printState'] = function(block) {
   let code = '   .printState(';
   code +=    ')';
   return code;
};

