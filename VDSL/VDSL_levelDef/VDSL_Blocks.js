Blockly.Blocks['LevelDef'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('create LevelDef');
    this.setNextStatement(true, null);
    this.setColour(330); this.setTooltip('');
 this.setHelpUrl('');
  }
};

Blockly.Blocks['paveFloor'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('paveFloor');
this.appendDummyInput()
   .appendField(new Blockly.FieldNumber(30), 'width');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(100);
    this.setTooltip('paveFloor width');
    this.setHelpUrl('');
	  }
	};

Blockly.Blocks['fillWithWater'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('fillWithWater');
this.appendDummyInput()
	.appendField('from:')
   .appendField(new Blockly.FieldNumber(5), 'atPos');
this.appendDummyInput()
	.appendField('width:')
   .appendField(new Blockly.FieldNumber(3), 'width');
    //this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(100);
    this.setTooltip('fillWithWater atPos width');
    this.setHelpUrl('');
	  }
	};

Blockly.Blocks['bridge'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('bridge');
this.appendDummyInput()
  .appendField('from:')
   .appendField(new Blockly.FieldNumber(5), 'atPos');
this.appendDummyInput()
  .appendField('width:')
   .appendField(new Blockly.FieldNumber(3), 'width');
    //this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(100);
    this.setTooltip('bridge atPos width');
    this.setHelpUrl('');
    }
  };  

Blockly.Blocks['startAt'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('startAt');
this.appendDummyInput()
   .appendField(new Blockly.FieldNumber(3), 'pos');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('startAt pos');
    this.setHelpUrl('');
	  }
	};

Blockly.Blocks['exitAt'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('exitAt');
this.appendDummyInput()
   .appendField(new Blockly.FieldNumber(27), 'pos');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('exitAt pos');
    this.setHelpUrl('');
	  }
	};

Blockly.Blocks['keyAt'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('keyAt');
this.appendDummyInput()
   .appendField(new Blockly.FieldNumber(16), 'pos');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(30);
    this.setTooltip('keyAt pos');
    this.setHelpUrl('');
    }
  };

Blockly.Blocks['doorAt'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('doorAt');
this.appendDummyInput()
   .appendField(new Blockly.FieldNumber(19), 'pos');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(30);
    this.setTooltip('doorAt pos');
    this.setHelpUrl('');
    }
  };

Blockly.Blocks['buttonAt'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('buttonAt');
this.appendDummyInput()
   .appendField(new Blockly.FieldNumber(4), 'pos');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('buttonAt pos');
    this.setHelpUrl('');
	  }
	};

Blockly.Blocks['pressedButtonAt'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('pressedButtonAt');
this.appendDummyInput()
   .appendField(new Blockly.FieldNumber(18), 'pos');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('pressedButtonAt pos');
    this.setHelpUrl('');
    }
  };  

Blockly.Blocks['createTheLevel'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('createTheLevel');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(null, null);
    this.setColour(330);
    this.setTooltip('createTheLevel ');
    this.setHelpUrl('');
	  }
	};

