/**
 *
 * @param FieldSetterObj LocalFlexFieldSetter
 * @param fieldnamePrefix
 * @param counter
 * @constructor
 */
var FieldSetterRow = function(FieldSetterObj, fieldnamePrefix, counter) {
    this.FieldSetterObj = FieldSetterObj;

    // FieldCoutner used for field IDs
    this.FieldCounter = counter;

    // FieldNamePrefix already contain FieldCounter
    this.fieldNamePrefix = fieldnamePrefix;
    this.row = null;

    this.setData = function(data) {
        if(typeof data.field === 'undefined') data.field = '';
        if(typeof data.mode === 'undefined') data.mode = 'value';
        if(typeof data.value === 'undefined') data.value = '';

        this.row.find('[rel="field"]').select2('val', data.field);
        this.row.find('[rel="mode"]').select2('val', data.mode);

        this.updateField(data.value);
    };

    this.addHTML = function() {
        this.row = $('<div style="margin:10px;" class="FlexFieldSetterRow" id="setterRow_' + this.FieldCounter + '"></div>');

        // row.append('<select rel="field" class="FieldSetterField" style="height:29px;vertical-align:top;" name="' + this.fieldNamePrefix + '[field]" id=\'setter_' + this.FieldCounter + '_field\'>' + this.FieldSetterObj.getFieldOptions() + '</select>');

        if(this.FieldSetterObj.IsDynamicFieldLoader() === false) {
            this.row.append("<select class='FieldSetterField MakeSelect2' rel='field' name='" + this.fieldNamePrefix + "[field]' id='" + this.FieldCounter + "_field'>" + this.FieldSetterObj.getFieldOptions() + "</select>");
        } else {
            this.row.append("<input type='hidden' class='FieldSetterField MakeHiddenSelect2' rel='field' name='" + this.fieldNamePrefix + "[field]'  id='" + this.FieldCounter + "_field' />");
        }

        this.row.append('<select class="FieldSetterMode select2" style="height:29px;vertical-align:top;" rel="mode" name="' + this.fieldNamePrefix + '[mode]" id="setter_' + this.FieldCounter + '_mode">\n' +
            '            <option value="value">Text</option>\n' +
            // '            <option value="field">{vtranslate("LBL_FIELD_VALUE", "Settings:Workflow2")}</option>\n' +
            // '            <option value="formula">{vtranslate("Formula Result", "Settings:Workflow2")}</option>\n' +
            // '            <option value="function">{vtranslate("LBL_FUNCTION_VALUE", "Settings:Workflow2")}</option>\n' +
            '        </select>');

        this.row.append('<div id=\'value_' + this.FieldCounter + '_container\' class="FieldSetterValueContainer"></div>');

        this.FieldSetterObj.fieldContainer.append(this.row);

        this.registerEvents();

        return this.row;
    };

    this.registerEvents = function(row) {
        this.row.find('.FieldSetterMode').on('change', $.proxy(function() {
            this.updateField();
        }, this));

        this.row.find('.FieldSetterField').on('change', $.proxy(function() {
            this.updateField();
        }, this));

        this.row.find('.FieldSetterField').trigger('change');

        this.FieldSetterObj.InitSelect2();
    };


    this.updateField = function(currentValue) {
        if(typeof currentValue === 'undefined') currentValue = '';

        this.row.find('.FieldSetterValueContainer').html(this.getValueInput(currentValue));

        this.FieldSetterObj.InitSelect2();
    };

    this.getValueInput = function(currentValue) {
        var field = this.row.find('.FieldSetterField').select2('val');
        var mode = this.row.find('.FieldSetterMode').val();

        if(typeof currentValue === 'undefined' && this.row.find('.FieldSetterValue').length > 0) {
            currentValue = this.row.find('.FieldSetterValue').val();
        }
        if(typeof currentValue === 'undefined') { currentValue = ''; }

        var fieldId = "setter_" + this.FieldCounter + "_value";
        var fieldName = this.fieldNamePrefix + "[value]";

        if(typeof this.FieldSetterObj.fieldData[field] != 'undefined') {
            var fieldTypeName = this.FieldSetterObj.fieldData[field].type["name"];
        } else {
            return '<em style="line-height:28px;color:#777777;">-' + app.vtranslate('TXT_CHOOSE_VALID_FIELD') + ' -</em>';
        }

        var optionTemplates = {};

        switch(fieldTypeName) {
            case "owner":
                var html = "<select style='width:100%;' class='MakeSelect2 condition_value select' name='" + fieldName + "' id='" + fieldId + "'>";
                html += "<option " + (currentValue ==  "$current_user_id" ? "selected='selected'" : "") + " value=''>$current_user_id</option>";

                jQuery.each(this.FieldSetterObj.availableUsers, function(index, value) {
                    html += "<option " + (currentValue ==  index ? "selected='selected'" : "") + " value='" + index + "'>" + value + "</option>";
                });
                html += "</select>";
                return html;
            case "picklist":
                var html = "<select style='width:100%;' class='MakeSelect2 condition_value select' " + (fieldTypeName == "multipicklist"?"multiple='multiple'":"") + " name='" + fieldName + "' id='" + fieldId + "'>";
                var options = this.FieldSetterObj.cbGetPicklistValues(field);
                jQuery.each(options, function(index, value) {

                    html += "<option " + ((index != "" && currentValue.indexOf(index) != -1) || (index == "" && index == currentValue) ? "selected='selected'" : "") + " value='" + index + "'>" + value + "</option>";
                });
/*
                if(typeof envVars != 'undefined' && envVars.length > 0) {
                    html += "<optgroup label='" + app.vtranslate('LBL_GET_KNOWN_ENVVARS') + "'>";
                    jQuery.each(envVars, function(index, value) {
                        html += "<option " + (currentValue == value ? "selected='selected'" : "") + " value='" + value + "'>" + value + "</option>";
                    })
                    html += '</optgroup>';
                }
*/
                html += "</select>";

                return html;
                break;
            case "multipicklist":

                var html = "<select style='width:100%;' class='select2 condition_value select' " + (fieldTypeName == "multipicklist"?"multiple='multiple'":"") + " name='" + fieldName + "[]' id='" + fieldId + "'>";

                var options = this.FieldSetterObj.cbGetPicklistValues(field);

                jQuery.each(options, function(index, value) {
                    html += "<option " + (currentValue.indexOf(index) != -1 ? "selected='selected'" : "") + " value='" + index + "'>" + value + "</option>";
                });

                html += "</select>";

                return html;
                break;
            case "boolean":
                var html = '<input name="' + fieldName + '" value="1" id="' + fieldId + '" type="checkbox" ' + (currentValue == "1"?"checked='checked'":"") + '>';
                return html;
                break;
            case "reference":
                var referTo = this.complexeConditionObj.fieldData[field].type.refersTo[0];
                /*
                if(referTo == "Currency" && typeof availCurrency !== "undefined") {
                    var html = "<select style='width:100%;' class='select2 condition_value select'  name='" + fieldName + "' id='" + fieldId + "'>";

                    for(var a = 0;a < availCurrency.length; a++) {
                        html += "<option " + (currentValue ==  availCurrency[a].curid ? "selected='selected'" : "") + " value='" + availCurrency[a].curid + "'>" + availCurrency[a].currencylabel + "</option>";
                    }

                    html += "</select>";

                    return html;
                }
                */
                optionTemplates["refFields"] = true;

                var html = createTemplateTextfield(fieldName, fieldId, currentValue, optionTemplates, {module:this.FieldSetterObj.mainSourceModule});

                return html;
                break;
            case "date":
            case "datetime":
                return createTemplateTextfield(fieldName, fieldId, currentValue, {module: this.FieldSetterObj.mainSourceModule, refFields: false,});
            //return createTemplateDatefield(fieldName, fieldId, currentValue);
            //break;
            case "text":
                var html = createTemplateTextarea(fieldName, fieldId, currentValue, {height:'80px',width:'100%',module: this.FieldSetterObj.mainSourceModule, refFields: false});
                return html;

                break;
            default:
                return createTemplateTextfield(fieldName, fieldId, currentValue, {module: this.FieldSetterObj.mainSourceModule, refFields: false});
                break;
        }
    }

};