/**
 * Flex Field Setter component
 *
 * Version 1.0.1
 *
 * Changelog
 *  1.0.0 - First implementation
 *  1.0.1 - Fix Textarea fields
 *
 * Usage
 */
(function($) {
 'use strict';  var CSS = '.FlexFieldSetterRow{display:flex;flex-direction:row}.FlexFieldSetterRow .FieldSetterField{width:40%;min-width:350px;flex-grow:0;flex-shrink:0}.FlexFieldSetterRow .FieldSetterMode{width:100px;margin:0 5px;flex-grow:0;flex-shrink:0}.FlexFieldSetterRow .FieldSetterValueContainer{flex-grow:1;flex-shrink:0;width:40%}.FlexFieldSetterRow .FieldSetterValueContainer textarea{flex-grow:1}.FlexFieldSetterRow .templateFieldSpan textarea{border-right:none}';
var FieldSetScopeModule = '';

var LocalFlexFieldSetter  = function(parentEle, fieldNamePrefix) {
    this.dynamicFieldMode = false;
    this.moduleFields = null;
    this.configuration = [];

    this.parentEle = $(parentEle);
    this.fieldContainer = null;
    this.addFieldBtn = null;

    this.fieldCounter = 0;
    this.fieldOptionsHTMLCache = null;

    this.mainTargetModule = null;
    this.mainSourceModule = null;

    this.requiredOnInit = [];
    this.fieldData = {};
    this.availableUsers = null;

    var thiss = this;

    if(typeof fieldNamePrefix === 'undefined') {
        this.fieldNamePrefix = 'fieldsetter';
    } else {
        this.fieldNamePrefix = fieldNamePrefix;
    }

    var _RequireOnInit = function(component) {
        thiss.requiredOnInit.push(component);
    };

    this.setScopeName = function(scopeName) {
        FieldSetScopeModule = scopeName;
    };
    this.setMainTargetModule = function(moduleName) {
        this.mainTargetModule = moduleName;
    };
    this.setMainSourceModule = function(moduleName) {
        this.mainSourceModule = moduleName;
    };

    this.setConfiguration = function(configuration) {
        this.configuration = configuration;
    };

    this.IsDynamicFieldLoader = function() {
        return (this.dynamicFieldMode == true);
    };

    this.cbGetPicklistValues = function(field) {
        return this.fieldData[field].type.picklistValues;
    };

    this.setAvailableUser = function (users) {
        this.availableUsers = users;
    };

    this.setModuleFields = function (fields) {
        if(typeof fields === 'function') {
            this.dynamicFieldMode = true;
        }

        this.moduleFields = fields;

        if(typeof fields == 'object') {
            this.fieldData = {};

            jQuery.each(this.moduleFields, jQuery.proxy(function (blockLabel, fieldList) {

                jQuery.each(fieldList, jQuery.proxy(function (fieldIndex, fieldValue) {
                    if (typeof fieldValue.type == 'string') {
                        fieldValue.type = {'name': fieldValue.type};
                    }
                    if (fieldValue.name == 'crmid' || fieldValue.name.indexOf(' crmid)') !== -1) {
                        fieldValue.type = { 'name': 'crmid' };
                    }

                    this.fieldData[fieldValue.name] = fieldValue;

                }, this));

            }, this));
/*
            this.fieldData["assigned_user_id"]["type"]["picklistValues"] = {};

            this.fieldData["assigned_user_id"]["type"]["name"] = "picklist";
            this.fieldData["assigned_user_id"]["type"]["picklistValues"] = {};

            this.fieldData["assigned_user_id"]["type"]["picklistValues"]['$current_user_id'] = '$currentUser';
 */
        }
    };

    this.init = function() {
        if($('.FIELDSETTERSTYLES').length == 0) {
            $('body').append('<style type="text/css" class="FIELDSETTERSTYLES">' + CSS + '</style>')
        }

        if(this.moduleFields === null) {
            _RequireOnInit('fields');
        }

        if(this.availableUsers === null) {
            _RequireOnInit('users');
        }

        if(this.moduleFields === null) {
            $.post(
                'index.php?module=' + FieldSetScopeModule + '&action=FieldSetter&mode=init',
                {
                    mainModule: this.mainTargetModule,
                    required: this.requiredOnInit
                },
                $.proxy(function(response) {

                    if(typeof response.fields !== 'undefined') {
                        this.setModuleFields(response.fields);
                    }
                    if(typeof response.users !== 'undefined') {
                        this.setAvailableUser(response.users);
                    }

                    this.afterLoadFields();
                }, this),
                'json'
            );

        } else {
            this.afterLoadFields();
        }
    };

    this.afterLoadFields = function () {
        this.fieldContainer = $('<div></div>');

        this.parentEle.html('<button type="button" class="btn btn-primary addFieldSetterValueBtn">Add Field</button>');
        this.parentEle.append(this.fieldContainer);

        this.addFieldBtn = $('.addFieldSetterValueBtn', this.parentEle);

        this.addFieldBtn.on('click', $.proxy(function(e) {
            this.addRow();
        }, this));

        thiss.parentEle.on('click', '.templateFieldButton', $.proxy(function(e) {
            var ele = jQuery(e.currentTarget);
            var input = ele.closest('.templateFieldSpan,.templateTextareaSpan').find('.templateField');
            var fieldId = input.attr('id');

            var options = ele.data('options');

            insertTemplateVariable(
                input,
                ele.data('references'),
                ele.data('functions') === true,
                ele.data('replace') === true,
                options
            );
        }, thiss));

        if(this.configuration.length > 0) {
            $.each(this.configuration, $.proxy(function(index, data) {
                var row = this.addRow();

                row.setData(data);
            }, this));
        }

    };

    this.getFieldOptions = function () {

        if (this.fieldOptionsHTMLCache === null) {
            var fieldOptions = '';

            jQuery.each(this.moduleFields, jQuery.proxy(function (key, value) {
                fieldOptions += "<optgroup label='" + key + "'>";
                for (var i = 0; i < this.moduleFields[key].length; i++) {
                    /*
                    if (this.columnsRewrites[this.moduleFields[key][i].name] !== undefined) {
                        this.moduleFields[key][i].name = this.columnsRewrites[this.moduleFields[key][i].name];
                    }
                    */
                    fieldOptions += "<option value='" + this.moduleFields[key][i].name + "'>" + this.moduleFields[key][i].label + "</option>";
                }
                fieldOptions += "</optgroup>";
            }, this));

            this.fieldOptionsHTMLCache = fieldOptions;
        }

        return this.fieldOptionsHTMLCache;
    };

    this.addRow = function() {
        var row = new FieldSetterRow(this, this.fieldNamePrefix + '[' + this.fieldCounter + ']', this.fieldCounter);
        row.addHTML();

        this.fieldCounter++;

        return row;
    };

    this.InitSelect2 = function() {
        var elements = $('.MakeSelect2', this.parentEle);
        elements.removeClass('MakeSelect2');
        elements.each(function(index, ele) {
            $(ele).select2({
                closeOnSelect: $(ele).data('closeonselect') == '0' ? false : true
            });
        });

        if(this.dynamicFieldMode === true) {
            var elements = $('.MakeHiddenSelect2.FieldSetterField', this.parentEle);
            elements.removeClass('MakeHiddenSelect2');
            elements.each($.proxy(function (index, ele) {
                $(ele).select2({
                    closeOnSelect: $(ele).data('closeonselect') == '0' ? false : true,
                    initSelection : $.proxy(function (element, callback) {
                        var fields = this.moduleFields(element.val(), true);

                        if(typeof fields.id !== 'undefined') {
                            callback(fields);
                        }
                    }, this),
                    query:$.proxy(function(query) {
                        var fields = this.moduleFields(query.term, false);

                        query.callback(fields);
                    }, this)
                });
            }, this));
        }

    };

};;/**
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

};;Array.prototype.last = function () {
    return this[this.length - 1];
};
if (typeof jQuery.assocArraySize == 'undefined') {
    jQuery.assocArraySize = function (obj) {
        // http://stackoverflow.com/a/6700/11236
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };
}

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function createTemplateDatefield(fieldName, fieldId, currentValue, options) {
    if(typeof currentValue == "undefined" || currentValue == null) {
        currentValue = "";
    }

    if(fieldId == false) {
        fieldId = fieldName.replace(/[^a-zA-Z0-9_]+/g, "_");
    }
    if(typeof options == 'undefined') {
        options = {};
    }

    if(options["refFields"] === undefined)  options["refFields"] = false;
    if(options["class"] === undefined)  options["class"] = "";
    if(options["uitype"] === undefined) options["uitype"] = [];
    if(options["style"] === undefined)  options["style"] = "";
    if(options["disabled"] === undefined || options["disabled"] == false) { options["disabled"] = ""; } else { options["disabled"] = "disabled='disabled'" }
    if(options["type"] === undefined)  options["type"] = "0";
    if(options["delimiter"] === undefined)  options["delimiter"] = "";
    if(options["title"] === undefined)  options["title"] = "";
    if(options["datalist"] === undefined)  options["datalist"] = "";
    if(options["fieldType"] === undefined)  options["fieldType"] = "text";
    if(options["readonly"] === undefined)  options["readonly"] = false;
    if(options["placeholder"] === undefined)  options["placeholder"] = '';
    if(options["variables"] === undefined)  options["variables"] = true;
    if(options["format"] === undefined)  options["format"] = "%Y-%m-%d";
    if(options["showTime"] === undefined)  options["showTime"] = false;
    if(typeof options["dataAttr"] === 'undefined')  options["dataAttr"] = false;

    options["class"] += " condition_value text textfield dateField templateField form-control";

    var uitypes = options["uitype"].join(',');

    var dataHtml = '';
    jQuery.each(options['dataAttr'], function(index, value) {
        dataHtml += ' data-' + index + '="' + value + '"';
    });

    var html = "<input autocomplete='false' type='" + options["fieldType"] + "' " + dataHtml + " data-currentvalue='"+htmlEntities(currentValue)+"' " + ( options['datalist'] !== '' ? 'list="' + options['datalist'] + '"' : '' ) + " title='"+options["title"]+"' placeholder='" + options["placeholder"] + "'  alt='"+options["title"]+"' data-delimiter='"+options["delimiter"]+"' ondblclick='dblClickTextfield(\"" + fieldId + "\");' " + options["disabled"] + "style='width:100% !important;float:left;" + options["style"] + "' data-module='" + options["module"] + "' class='" + options["class"] + "' name='" + fieldName + "' id='" + fieldId + "' " + (options['readonly']===true?'readonly="readonly"':'') + " value=\"" + (currentValue != false ? htmlEntities(currentValue) : "") + "\">";
    if(options["variables"] == true) {
        if(options["mode"] != 'expression') {
            html += "<span class='templateFieldBtn templateFieldButton' data-references='([source]: ([module]) [destination])' data-functions='true' data-replace='false' data-options='{\"refFields\":\"" + options["refFields"] + "\", \"module\": \"" + options["module"] + "\", \"uitypes\": \"" + uitypes + "\", \"type\":\"" + options["type"] + "\"}' ><img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfjBA8CIxxYy4paAAAAnElEQVQoz5WRsQ4BQRRFDzaUVBpbS0Qi0fkBH0Gz/ooOP6RSa9b4ACKxJHs1GztPZiTONPPunLzkvQGfFRfOLImQ8kKIgn4dNo2QANBmEO7Q4YgQh0oEoGGULhkle2511DJCwZ0Tjig7hNjEnieoOsPwFArcvtgixJofjBnZIDFVjzkljusfi/KZfaaYhoWUJ0I8/M+yZDhyFn70BtrhMDokCc6yAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE5LTA0LTE1VDAwOjM1OjI4KzAyOjAwZI0qbAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOS0wNC0xNVQwMDozNToyOCswMjowMBXQktAAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC' id='templateIcon_" + fieldId + "'  style='margin-bottom:-5px;cursor:pointer;'></span>";
        } else {
            html += "<span class='templateFieldBtn templateFieldButton' data-references='[source]->[module]->[destination]' data-functions='false' data-replace='false' data-options='{\"module\": \"" + options["module"] + "\"}'  id='task_condition_iconspan'><img src='modules/Workflow2/icons/templatefieldPHP.png' style='margin-bottom:-2px;cursor:pointer;'>";
        }
    } else {
        //html += "<span class='templateFieldBtn templateFieldResetButton' style='position: absolute;top:0;right: 25px;'><img src='modules/Workflow2/icons/reset.png'  alt='" + MOD.LBL_VALUE_RESET + "' title='" + MOD.LBL_VALUE_RESET + "' style='margin-bottom:-5px;cursor:pointer;'></span>";
        html += "<span class='templateFieldBtn templateFieldResetButton' style='position: absolute;top:0;right: 0px;'><img src='modules/Workflow2/icons/clear.png' alt='" + MOD.LBL_VALUE_CLEAR + "' title='" + MOD.LBL_VALUE_CLEAR + "' style='margin-bottom:-5px;cursor:pointer;'></span>";
    }

    //addToAutoCompleter(fieldId);

    return "<span class='templateFieldSpan'>" + html + "</span>"; //  style='max-width:" + options["width"] + ";'

}

function createTemplateTextarea(fieldName, fieldId, currentValue, options, withTemplateButton) {
    if(typeof currentValue == "undefined" || currentValue == null) {
        currentValue = "";
    }
    if(fieldId == false) {
        fieldId = fieldName.replace(/[^a-zA-Z0-9_]+/g, "_");
    }
    if(options === undefined) {
        options = {};
    }

    if(withTemplateButton === undefined) {
        withTemplateButton = true;
    }
    if(typeof options['module'] == 'undefined' && typeof moduleName != 'undefined') {
        options['module'] = moduleName;
    }


    if(options["style"] === undefined)  options["style"] = "";
    //if(options["width"] === undefined)  options["width"] = "350px";
    if(options["module"] === undefined)  options["module"] = '';
    if(options["mode"] === undefined)  options["mode"] = "";
    if(options["class"] === undefined)  options["class"] = "";
    if(options["placeholder"] === undefined)  options["placeholder"] = "";
    if(options["height"] === undefined)  options["height"] = "150px";
    if(options["type"] === undefined)  options["type"] = "0";
    if(options["refFields"] === undefined)  options["refFields"] = false;

    var html = "<span class='templateFieldSpan' style='display:flex;'>";

    html += "<textarea id='" + fieldId + "' placeholder='" + options["placeholder"] + "' style='height: " + options["height"] + "; " + options["style"] + "' name='" + fieldName + "' style='' class='templateField " + options["class"] + ' ' + (options['mode'] == 'expression' ? ' customFunction ' : '') + "'>" + htmlEntities(currentValue) + "</textarea>";

    if(withTemplateButton) {
        html += '<span class=\'templateFieldBtn templateFieldButton\' >';
        if(options["mode"] != 'expression') {
            html += "<img class='templateFieldButton' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfjBA8CIxxYy4paAAAAnElEQVQoz5WRsQ4BQRRFDzaUVBpbS0Qi0fkBH0Gz/ooOP6RSa9b4ACKxJHs1GztPZiTONPPunLzkvQGfFRfOLImQ8kKIgn4dNo2QANBmEO7Q4YgQh0oEoGGULhkle2511DJCwZ0Tjig7hNjEnieoOsPwFArcvtgixJofjBnZIDFVjzkljusfi/KZfaaYhoWUJ0I8/M+yZDhyFn70BtrhMDokCc6yAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE5LTA0LTE1VDAwOjM1OjI4KzAyOjAwZI0qbAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOS0wNC0xNVQwMDozNToyOCswMjowMBXQktAAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC' data-references='([source]: ([module]) [destination])' data-functions='true' data-replace='false' data-options='{\"refFields\":\"" + options["refFields"] + "\", \"module\": \"" + options["module"] + "\", \"type\":\"" + options["type"] + "\"}' id='templateIcon_" + fieldId + "'  style='margin-bottom:-5px;cursor:pointer;'>";
        } else {
            html += "<img class='templateFieldButton'  src='modules/Workflow2/icons/templatefieldPHP.png' id='templateIcon_" + fieldId + "'  data-references='[source]->[module]->[destination]' data-functions='true' data-replace='false' data-options='{\"refFields\":\"" + options["refFields"] + "\", \"module\": \"" + options["module"] + "\", \"type\":\"" + options["type"] + "\"}'  style='margin-bottom:-5px;width:24px;height:24px;cursor:pointer;'>";
        }
        html += '</span>';


    }

    html += '</span>';

    return html;
}
function createTemplateTextfield(fieldName, fieldId, currentValue, options) {
    if (typeof currentValue == "undefined" || currentValue === null) {
        currentValue = "";
    }

    if (fieldId == false) {
        fieldId = fieldName.replace(/[^a-zA-Z0-9_]+/g, "_");
    }
    if (typeof options == 'undefined') {
        options = {};
    }

    if (typeof options['module'] == 'undefined' && typeof moduleName != 'undefined') {
        options['module'] = moduleName;
    }

    if (options["refFields"] === undefined) options["refFields"] = false;
    if (options["mode"] === undefined) options["mode"] = "";
    if (options["class"] === undefined) options["class"] = "";
    if (options["style"] === undefined) options["style"] = "";
    if (options["disabled"] === undefined || options["disabled"] == false) {
        options["disabled"] = "";
    } else {
        options["disabled"] = "disabled='disabled'"
    }
    if (options["type"] === undefined) options["type"] = "0";
    if (options["uitype"] === undefined) options["uitype"] = [];
    if (options["delimiter"] === undefined) options["delimiter"] = "";
    if (options["title"] === undefined) options["title"] = "";
    if (options["datalist"] === undefined) options["datalist"] = "";
    if (options["fieldType"] === undefined) options["fieldType"] = "text";
    if (options["readonly"] === undefined) options["readonly"] = false;
    if (options["placeholder"] === undefined) options["placeholder"] = '';
    if (options["variables"] === undefined) options["variables"] = true;
    if (options["width"] === undefined) options["width"] = '600px';
    if (options["module"] === undefined) options["module"] = '';
    if (typeof options["dataAttr"] === 'undefined') options["dataAttr"] = false;

    options["class"] += " condition_value text textfield templateField initAutocomplete form-control";

    var dataHtml = '';
    jQuery.each(options['dataAttr'], function (index, value) {
        dataHtml += ' data-' + index + '="' + value + '"';
    });

    var uitypes = options["uitype"].join(',');

    var html = "<input autocomplete='false' type='" + options["fieldType"] + "' data-currentvalue='"+htmlEntities(currentValue)+"' " + dataHtml + " " + ( options['datalist'] !== '' ? 'list="' + options['datalist'] + '"' : '' ) + " title='"+options["title"]+"' placeholder='" + options["placeholder"] + "'  alt='"+options["title"]+"' data-delimiter='"+options["delimiter"]+"' ondblclick='dblClickTextfield(\"" + fieldId + "\");' " + options["disabled"] + "style='width:100% !important;float:left;" + options["style"] + "' data-module='" + options["module"] + "' class='" + options["class"] + "' name='" + fieldName + "' id='" + fieldId + "' " + (options['readonly']===true?'readonly="readonly"':'') + " value=\"" + (currentValue !== false ? htmlEntities(currentValue) : "") + "\">";

    if(options["variables"] == true) {
        //html += "<span class='templateFieldBtn templateFieldResetButton' style='position: absolute;top:0;right: 50px;'><img src='modules/Workflow2/icons/reset.png'  alt='" + MOD.LBL_VALUE_RESET + "' title='" + MOD.LBL_VALUE_RESET + "' style='margin-bottom:-5px;cursor:pointer;' onclick=\"\"></span>";
        //html += "<span class='templateFieldBtn templateFieldResetButton' style='position: absolute;top:0;right: 25px;'><img src='modules/Workflow2/icons/clear.png' alt='" + MOD.LBL_VALUE_CLEAR + "' title='" + MOD.LBL_VALUE_CLEAR + "' style='margin-bottom:-5px;cursor:pointer;' onclick=\"\"></span>";
        if(options["mode"] != 'expression') {
            html += "<span class='templateFieldBtn templateFieldButton' data-references='([source]: ([module]) [destination])' data-functions='true' data-replace='false' data-options='{\"refFields\":\"" + options["refFields"] + "\", \"module\": \"" + options["module"] + "\", \"uitypes\": \"" + uitypes + "\", \"type\":\"" + options["type"] + "\"}' ><img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfjBA8CIxxYy4paAAAAnElEQVQoz5WRsQ4BQRRFDzaUVBpbS0Qi0fkBH0Gz/ooOP6RSa9b4ACKxJHs1GztPZiTONPPunLzkvQGfFRfOLImQ8kKIgn4dNo2QANBmEO7Q4YgQh0oEoGGULhkle2511DJCwZ0Tjig7hNjEnieoOsPwFArcvtgixJofjBnZIDFVjzkljusfi/KZfaaYhoWUJ0I8/M+yZDhyFn70BtrhMDokCc6yAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE5LTA0LTE1VDAwOjM1OjI4KzAyOjAwZI0qbAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOS0wNC0xNVQwMDozNToyOCswMjowMBXQktAAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC' id='templateIcon_" + fieldId + "'  style='margin-bottom:-5px;cursor:pointer;'></span>";
        } else {
            html += "<span class='templateFieldBtn templateFieldButton' data-references='[source]->[module]->[destination]' data-functions='false' data-replace='false' data-options='{\"module\": \"" + options["module"] + "\"}'  id='task_condition_iconspan'><img src='modules/Workflow2/icons/templatefieldPHP.png' style='margin-bottom:-2px;cursor:pointer;'>";
        }
    } else {
        //html += "<span class='templateFieldBtn templateFieldResetButton' style='position: absolute;top:0;right: 25px;'><img src='modules/Workflow2/icons/reset.png'  alt='" + MOD.LBL_VALUE_RESET + "' title='" + MOD.LBL_VALUE_RESET + "' style='margin-bottom:-5px;cursor:pointer;'></span>";
        html += "<span class='templateFieldBtn templateFieldResetButton' style='position: absolute;top:0;right: 0px;'><img src='modules/Workflow2/icons/clear.png' alt='" + MOD.LBL_VALUE_CLEAR + "' title='" + MOD.LBL_VALUE_CLEAR + "' style='margin-bottom:-5px;cursor:pointer;'></span>";
    }

    //addToAutoCompleter(fieldId);

    return "<span class='templateFieldSpan'>" + html + "</span>"; //  style='max-width:" + options["width"] + ";'
}

var insertTemplateFieldId = false;
var insertTemplateFieldCache = {};
var workflowModuleName;
var insertVariableCallback = null;

function insertTemplateVariable(targetEle, format, functions, replace, options) {
    if(jQuery(targetEle).attr('readonly')) {
        return;
    }
    var templateModule = workflowModuleName;

    if(typeof options != "undefined" && options["module"] !== undefined && options["module"] != "undefined") {
        templateModule = options["module"];
    }

    if(typeof templateModule == "undefined") {
        templateModule = moduleName;
    }
    if(typeof templateModule == "undefined") {
        return;
    }

    if(options === undefined) {
        options = {};
    }

    if(typeof options.callback == 'function') {
        insertVariableCallback = options.callback;
    } else {
        insertVariableCallback = null;
    }

    if(format == undefined) {
        format = "[source]->[module]->[destination]";
    }
    if(functions == undefined) {
        functions = false;
    }
    if(replace == undefined) {
        replace = false;
    }
    if(functions == false) {
        functions = 0;
    } else {
        functions = 1;
    }

    if(typeof options["type"] === 'undefined')  options["type"] = "0";
    if(typeof options["refFields"] === 'undefined')  options["refFields"] = "false";
    if(typeof options["uitypes"] === 'undefined')  options["uitypes"] = '';

    var uitypes = options["uitypes"].split(',');

    var cacheKey = format + ";;" + templateModule + ";;" + options["type"] + ";;" + options["uitypes"] + ";;" + options["refFields"] + ";;functions" + functions;

//    insertTemplateFieldId = id;

    if(jQuery("#insertTemplateFieldContainer").length == 0) {
        jQuery("body").append("<div id='insertTemplateFieldContainer' style='display:none;'></div>");
    }

    if(typeof insertTemplateFieldCache[cacheKey] === 'undefined') {
        jQuery.ajaxSetup({async:false});
        jQuery("#insertTemplateFieldContainer").load("index.php?module=" + FieldSetScopeModule + "&action=TemplateVariables&mode=templateFields", {
            functions: functions,
            // workflowID:workflowID,
            uitypes:uitypes,
            type:options["type"],
            refFields:options["refFields"],
            reftemplate: format,
            mainModule: templateModule
        });
        jQuery.ajaxSetup({async:true});
        insertTemplateFieldCache[cacheKey] = jQuery("#insertTemplateFieldContainer").html();
    }

    jQuery("#insertTemplateFieldContainer").html(insertTemplateFieldCache[cacheKey]);

    openModalOverlay(
        jQuery("#insertTemplateFieldContainer").html(),
        {
            'ok' :'OK',
            'cancel' : "abbrechen"
        },
        500,
        targetEle.parent().find('.templateFieldButton'),
        targetEle
    ).then(function(text) {
        // Cancel was pressed
        if(text === false) return;

        var delimiter = targetEle.data("delimiter");

        if(typeof insertVariableCallback == 'function') {
            var returnVar = insertVariableCallback(text, { field: targetEle.attr('id'), replace:replace });
            if(returnVar === false) {
                return;
            }
        }

        if(replace == true) {
            targetEle.val(text);
        } else {
            var oldVal = targetEle.val();
            if(delimiter !== undefined && oldVal.length > 0) {
                oldVal = oldVal + delimiter;
            }
            targetEle.val(oldVal + text);
        }

        targetEle.trigger("insertText", [text]);
        targetEle.trigger("change");
        targetEle.trigger("blur");

    });

    jQuery("#pageOverlayContent select.chzn-select").select2();
    jQuery("#pageOverlayContent").on("click", function(e) {
        e.stopPropagation();
    });
}

function closePageOverlay(button, instant) {
    if(typeof instant === "undefined") {
        var instant = false;
    }

    if(typeof button == "undefined" || jQuery("#" + button).length == 0) {
        jQuery("#pageOverlay").hide("fast");
        return;
    }

    var ele = jQuery("#pageOverlay");
    var eleContent = jQuery("#pageOverlayContent");

    if(instant == true) {
        ele.hide();
        return;
    }

    ele.animate({ opacity:0 });
}

function openModalOverlay(html, buttons, width, effectInputSource, effectOutputSource) {
    var dfd2 = jQuery.Deferred();

    var ele = jQuery("#pageOverlay");
    if(ele.length == 0) {
        var htmlOverlay = $("<div id='pageOverlay' style='cursor:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAV1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOl5NtAAAAHXRSTlP+APnw7+XGwJNGQCZ4tZ6dnFgaGAjR0M97WlfSdwzyPaoAAACHSURBVBjTZU9bEoQgDAsF5KWIILqv+59zi7ozy5ivTNqmCQTD2ypltb5xFnLUBAbpmJuQJ4kLaiosRAk6NwgqCXgNmscBGMaZoD0sgR7hZcwzjEwt3uDhEpwLy8B0w+Fo3Lo6c/jehdqf7P+mn2Z6fyui6oNxdNVHFyX9yqUixFV/k3I/638BJxkF+5eYS7cAAAAASUVORK5CYII=), auto;position:fixed;z-index:1500;top:0;left:0;display:none;height:100%;width:100%;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWBAMAAADOL2zRAAAAElBMVEXCw8TT09PPz8/FxcbLy8zIyMmv866aAAAABnRSTlOwsLCwsLCTI7FOAAAETUlEQVRo3u1ZQZLiMAxUVcgDQvGBeLL3qQ08IENxT0H+/5YdTKCtakv23s0plOy4LSnqli2zPH/3cfj9XePzJT6fvp/P3c/z+fiIhnM0fEVDH5JB9+E1+0/8e1me/6YHTMdrMn8fFF8cXoO2OOj2jdUnOT0ATM9nYFs03BJgUzpIjvuaMNnAuhTYe3UAk2Fa498dczJ/ygHDoP7llhWD5NdnL8yJx+WezD+kwF6D9njtHv/MFjiTME96YwCGUCi3SNaZolMBwPpo4HhF9ELO5FDQi3W85vdsQZaYOcbApmyOCTvTz7G/0aDjtQ8Sy5kqeYMelI9XkNSZyvRjADunyZ+uvilndjDhxYgxJ7+c00H7ZiaV19aOH/tmMEiF4o35+l4TyZ/O73UoEK8zilU0jYQ5CwyDArllFoFpuEmCeeVQ7B7D6qeVPvdPlBhzTzumAqvcAsw3CmXnA5s4lHg1Rxk5hjqk0evV8cEWgNGgYAOb2JmXhSp3Op/ita/JzgRbZJL/nosXk4JK/tGiFK4JD7HYirnWL7Dg2lmx1ZAkv0FJHYCBa00aBVthY37lF12ikONgK5dSvpKwCNiKKr/vca788olySDCn8w9+5b+h8gswU5R9dcGJJLuJyk21ukDyiy/V+KvmHX/UoChnslSrVxfLIMmad1OqjUbyB5VjEmCa4Qyqg1lK6rQCjWC8SuIXWBUvVUmE2YoLrFr9kBKiZiuunVN2xxh0RyieJqZRa8eYn1UX2pm2unA9BmDMVmF3ZgCwvLoAiYsI57VZ+UldUPLDmR6NltUFPOazFQHjeIHS2BRWJvFgciU8Bsxk8pP/SKsbzrST346XhRmfO9qBQakLzrGqPuVW1VcK83P3xkwNs24mqFiJ06ewuvArv7jtAFKhpvJLjka7hdWF31eeNdcyZlYXvuwRr/s3zi6svlLIZDUza7GvFMOZdi9st2+Sd2Z3Hkiqza7smZdBVMtp5JhKfouEt1HojIekGgosh0Lt2GugAMwrsFidaJSS36CkB2v+LL8zjZaBFTAjx+rUBdIHmFlao8DS5+4AU2wTato3+LvMVifymKEuYGIaBVf66gLo66VaXSj7saoXZmlNs20axY7LyR/IY6ZUAzDaMeKVqyQsrbH+4PSVcc1in6J6YauvlEIv3AWq/CY9SIGtuq26fTsK5tefgjpcy8CW9MUDgPUjA8MgcZp0v/JzvEQ36ba6uJb7SgFbaWdYfaVzOCyVUo0LrM+1nPxK9swl2SMGjfaKRoPOMQBL3LIFoT6lpC42ltb7oLpT0EtGWnOxqj0FHehwmIuVyVbl9o2+Kr1m/Skon1obfcpkqguu/Fj9/45nfXXBznR74YGS3wRW7oUn93CYMfskzurCAza46mJlYAsGVWpITn4GxlLNbTlP9ql1u2Ntd6ztjrXdsbY71nbH2u5Y2x1ru2Ntd6ztjrXdsbY71nbH2u5YX8n/D4wVYjMqONy+AAAAAElFTkSuQmCC);'><div id='pageOverlayContent' style='position:fixed;cursor:default;top:100px;margin:auto;left:50%;padding:10px;background-color:#ffffff;'>&nbsp;</div></div>");
        htmlOverlay.on('click', function() { closePageOverlay(); });
        jQuery('body').append(htmlOverlay);
    }

    //  onclick="insertTextIntoField(\''+id+'\',\'$\' + jQuery(\'#insertTemplateField_Select\',\'#pageOverlayContent\').val(),' + (replace?"true":"false") + ', true);"

    if(typeof effectSource === "undefined") {
        var effectSource = false;
    }

    html += '<br>';

    html += '<div class="btn-group pull-right" style="text-align:center;margin-top:5px;padding:0 10px 10px;">';
    html += '<button class="btn btn-warning BtnCancel" onclick="">' + buttons.cancel + '</button>';
    html += '<button class="btn btn-success BtnOk">' + buttons.ok + '</button>'
    html += '</div>';

    var ele = jQuery("#pageOverlay");
    var eleContent = jQuery("#pageOverlayContent");
    html = '<img class="closePageOverlay" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAV1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOl5NtAAAAHXRSTlP+APnw7+XGwJNGQCZ4tZ6dnFgaGAjR0M97WlfSdwzyPaoAAACHSURBVBjTZU9bEoQgDAsF5KWIILqv+59zi7ozy5ivTNqmCQTD2ypltb5xFnLUBAbpmJuQJ4kLaiosRAk6NwgqCXgNmscBGMaZoD0sgR7hZcwzjEwt3uDhEpwLy8B0w+Fo3Lo6c/jehdqf7P+mn2Z6fyui6oNxdNVHFyX9yqUixFV/k3I/638BJxkF+5eYS7cAAAAASUVORK5CYII=" style="position:absolute;right:-5px;top:-5px;cursor:pointer;">' + html;

    if(ele.css('display') == 'none') {
        eleContent.css("width", width + "px");
        eleContent.css("marginLeft", (-1 * (width / 2)) + "px");

        eleContent.css('visibility', 'hidden');
        ele.css('opacity', '0');

        eleContent.show();
        ele.show();

        eleContent.html(html);
        //eleContent.slideDown("fast");

        if(effectSource != false && jQuery(effectSource).length > 0) {
            ele.animate({ opacity:1 });
            jQuery(effectSource).effect( "transfer", { to: eleContent }, 250, function() {
                eleContent.css('visibility', 'visible');
                // ele.css('visibility', 'visible');
            });
        } else {
            eleContent.css('visibility', 'visible');
            ele.css('opacity', '1');

            ele.show();
        }

    } else {
        eleContent.html(html);
        eleContent.animate({
            width:width + "px",
            marginLeft: (-1 * (width / 2)) + "px"
        }, "fast", function() {

        });
    }

    eleContent.find('.closePageOverlay').on('click', function() { closePageOverlay(); })

    jQuery('.BtnCancel').on('click', function(e) {
        closePageOverlay();

        dfd2.resolve(false);
    });

    jQuery('.BtnOk').on('click', function(e) {
        if(jQuery('.ModalResultValue', '#pageOverlayContent').hasClass('chzn-select')) {
            dfd2.resolve('$' + jQuery('.ModalResultValue', '#pageOverlayContent').select2('val'));
        } else {
            dfd2.resolve('$' + jQuery('.ModalResultValue', '#pageOverlayContent').val());
        }

        closePageOverlay();
    });

    jQuery('#pageOverlayContent').on('click.select2', function(e) {
        e.preventDefault();
        e.stopPropagation();
    });
    jQuery('#pageOverlayContent').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
    });

    return dfd2.promise();
};window.FlexFieldSetter = LocalFlexFieldSetter;})(jQuery);