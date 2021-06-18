Blockly.Blocks['GuessRobot'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Start');
    this.setNextStatement(true, null);
    this.setColour(330); this.setTooltip('');
 this.setHelpUrl('');
  }
};

Blockly.Blocks['forward'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('forward  \u2193');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('forward ');
    this.setHelpUrl('');
	  }
	};

Blockly.Blocks['turnRight'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('turnRight \u2936');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('turnRight ');
    this.setHelpUrl('');
	  }
	};

Blockly.Blocks['turnLeft'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('turnLeft \u2937');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('turnLeft ');
    this.setHelpUrl('');
      }
    };    
/*
Blockly.Blocks['ifThink_turnRight'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('ifThink');

    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
            ['cake', '"cake"'],
            ['flower', '"flower"']
        ]), 'item');

    this.appendDummyInput()
        .appendField('turnRight');

    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('ifThink item turnRight');
    this.setHelpUrl('');
	  }
	};
*/
Blockly.Blocks['repeat2times'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('repeat2times');this.appendStatementInput('P');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('repeat2times P');
    this.setHelpUrl('');
	  }
	};

Blockly.Blocks['repeat4times'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('repeat4times');this.appendStatementInput('P');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('repeat4times P');
    this.setHelpUrl('');
	  }
	};
