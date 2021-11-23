Blockly.Blocks['start'] = {
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
    this.setColour(200);
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
    this.setColour(200);
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
    this.setColour(200);
    this.setTooltip('turn anticlockwise');
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

Blockly.Blocks['repeatNtimes'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('repeat');

/*        
    this.appendDummyInput()
        .appendField(new Blockly.FieldNumber(4, 2, 10), 'times');
*/        
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
            ['2','2'],['3','3'],['4','4'],['5','5'],['6','6'],['7','7'],['8','8'],['9','9'],['10','10']
          ]), 'times');


    this.appendDummyInput()
        .appendField('times');
    this.appendStatementInput('P');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('repeatNtimes P');
    this.setHelpUrl('');
    }
  };

Blockly.Blocks['untilStepOn'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('untilStepOn');

    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
            ['tomato', '"tomato"'],
            ['salad', '"salad"'],
            ['ham', '"ham"']
        ]), 'item');

    this.appendStatementInput('P');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('untilStepOn ingredient P');
    this.setHelpUrl('');
    }
};
