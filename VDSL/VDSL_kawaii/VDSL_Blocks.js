Blockly.Blocks['KawaiiEyes'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('create KawaiiEyes');
    this.setNextStatement(true, null);
    this.setColour(330);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['happy'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('happy');
this.appendDummyInput()
   .appendField(new Blockly.FieldCheckbox("TRUE"), 'isHappy');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('happy isHappy');
    this.setHelpUrl('');
	  }
	};

Blockly.Blocks['childish'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('childish');
this.appendDummyInput()
   .appendField(new Blockly.FieldCheckbox("FALSE"), 'isOn');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('childish isOn');
    this.setHelpUrl('');
	  }
	};

Blockly.Blocks['moreIntense'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('moreIntense');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('moreIntense ');
    this.setHelpUrl('');
	  }
	};

Blockly.Blocks['moreCute'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('moreCute');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('moreCute ');
    this.setHelpUrl('');
	  }
	};

Blockly.Blocks['drawLeftEye'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('drawLeftEye');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(130);
    this.setTooltip('drawLeftEye ');
    this.setHelpUrl('');
	  }
	};

Blockly.Blocks['drawRightEye'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('drawRightEye');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(130);
    this.setTooltip('drawRightEye ');
    this.setHelpUrl('');
	  }
	};

Blockly.Blocks['finishFace'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('finishFace');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(null, null);
    this.setColour(20);
    this.setTooltip('finishFace ');
    this.setHelpUrl('');
	  }
	};

Blockly.Blocks['normalIntense'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('normalIntense');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('normalIntense ');
    this.setHelpUrl('');
	  }
	};

Blockly.Blocks['normalCute'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('normalCute');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('normalCute ');
    this.setHelpUrl('');
	  }
	};

Blockly.Blocks['color'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('color');
this.appendDummyInput()
   .appendField(new Blockly.FieldTextInput('blue'), 'rgbColor');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('color rgbColor');
    this.setHelpUrl('');
	  }
	};

