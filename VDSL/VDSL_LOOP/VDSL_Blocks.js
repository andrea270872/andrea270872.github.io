Blockly.Blocks['LoopProgram'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('create LoopProgram');
    this.setNextStatement(true, null);
    this.setColour(330); this.setTooltip('');
 this.setHelpUrl('');
  }
};

Blockly.Blocks['add'] = {
  init: function() {
this.appendDummyInput()
   .appendField('x')
   .appendField(new Blockly.FieldNumber(1), 'i');
this.appendDummyInput()
   .appendField(':=x')
   .appendField(new Blockly.FieldNumber(1), 'j');
this.appendDummyInput()
   .appendField('+')
   .appendField(new Blockly.FieldNumber(0), 'c');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('add i j c');
    this.setHelpUrl('');
	  }
	};

Blockly.Blocks['sub'] = {
  init: function() {
this.appendDummyInput()
   .appendField('x')
   .appendField(new Blockly.FieldNumber(1), 'i');
this.appendDummyInput()
   .appendField(':=x')
   .appendField(new Blockly.FieldNumber(1), 'j');
this.appendDummyInput()
   .appendField('-')
   .appendField(new Blockly.FieldNumber(0), 'c');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('sub i j c');
    this.setHelpUrl('');
	  }
	};

Blockly.Blocks['loop'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('LOOP x');
this.appendDummyInput()
   .appendField(new Blockly.FieldNumber(1), 'i')
        .appendField('DO');
   this.appendStatementInput('P');
    this.appendDummyInput()
        .appendField('END');

    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(100);
    this.setTooltip('loop i P');
    this.setHelpUrl('');
	  }
	};

Blockly.Blocks['MACRO_1'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('DEF')
        .appendField(new Blockly.FieldTextInput('aMacro'), 'name')
        .appendField('(x1)');
    this.appendStatementInput('P');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(60);
    this.setTooltip('MACRO_1 name P');
    this.setHelpUrl('');
	  }
	};

Blockly.Blocks['DO_1'] = {
  init: function() {
    this.appendDummyInput()
      .appendField(new Blockly.FieldTextInput('aMacro'), 'name')
      .appendField('(x')
      .appendField(new Blockly.FieldNumber(5), 'i')
      .appendField(')');

    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(60);
    this.setTooltip('DO_1 name i');
    this.setHelpUrl('');
	  }
	};

Blockly.Blocks['run'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('run');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(null, null);
    this.setColour(20);
    this.setTooltip('run ');
    this.setHelpUrl('');
	  }
	};

Blockly.Blocks['stepByStep'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('stepByStep');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(null, null);
    this.setColour(20);
    this.setTooltip('stepByStep ');
    this.setHelpUrl('');
	  }
	};

