Blockly.Blocks['screeninit'] = {
  init: function() {
        this.appendEndRowInput()
            .appendField("initialize screen");
        this.appendValueInput("width")
            .setCheck("Number")
            .appendField("width");
        this.appendValueInput("height")
            .setCheck("Number")
            .appendField("height");
        this.appendEndRowInput();
        this.appendDummyInput()
            .appendField("orientation")
            .appendField(new Blockly.FieldDropdown([["portrait","1"], ["landscape","2"]]), "landOrPort");
        this.setInputsInline(true);
        this.setNextStatement(true, null);
        this.setColour(245);
     this.setTooltip("");
     this.setHelpUrl("");
    }
};

javascript.javascriptGenerator.forBlock['screeninit'] = function(block, generator) {
  var value_width = generator.valueToCode(block, 'width', javascript.Order.ATOMIC);
  var value_height = generator.valueToCode(block, 'height', javascript.Order.ATOMIC);
  var dropdown_landorport = block.getFieldValue('landOrPort');
  // TODO: Assemble javascript into code variable.
  var code = `init(${value_width},${value_height},${dropdown_landorport});\n`;
  return code;
};

//////////////////////////////////////////////