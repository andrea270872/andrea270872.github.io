Blockly.Blocks['RPGCharacter'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('create RPGCharacter');
    this.setNextStatement(true, null);
    this.setColour(330); this.setTooltip('');
 this.setHelpUrl('');
  }
};

Blockly.Blocks['giveName'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('giveName');
this.appendDummyInput()
   .appendField(new Blockly.FieldTextInput('Borth'), 'characterName');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('giveName characterName');
    this.setHelpUrl('');
	  }
	};

Blockly.Blocks['eat'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('eat');
this.appendDummyInput()
   .appendField(new Blockly.FieldNumber(10), 'amountOfEnergy');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('eat amountOfEnergy');
    this.setHelpUrl('');
	  }
	};

Blockly.Blocks['foundCoins'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('foundCoins');
this.appendDummyInput()
   .appendField(new Blockly.FieldNumber(1500), 'amountOfCoins');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('foundCoins amountOfCoins');
    this.setHelpUrl('');
	  }
	};

Blockly.Blocks['hitEnemy'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('hitEnemy');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('hitEnemy ');
    this.setHelpUrl('');
	  }
	};

Blockly.Blocks['getDamage'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('getDamage');
this.appendDummyInput()
   .appendField(new Blockly.FieldNumber(50), 'amountOfDamage');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('getDamage amountOfDamage');
    this.setHelpUrl('');
	  }
	};

Blockly.Blocks['printState'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('printState');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(60);
    this.setTooltip('printState ');
    this.setHelpUrl('');
	  }
	};

