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

Blockly.Blocks['turnCW'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('turnCW \u21bb');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('turn clockwise');
    this.setHelpUrl('');
	  }
	};

Blockly.Blocks['turnACW'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('turnACW \u21ba');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('turn anticlockwise');
    this.setHelpUrl('');
      }
    };    

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

Blockly.Blocks['ifLast_turnCW'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('ifLast');

    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
            ['tomato', '"tomato"'],
            ['salad', '"salad"'],
            ['ham', '"ham"']
        ]), 'item');

    this.appendDummyInput()
        .appendField('turnCW \u21bb');

    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('ifLast item turnCW \u21bb');
    this.setHelpUrl('');
    }
  };