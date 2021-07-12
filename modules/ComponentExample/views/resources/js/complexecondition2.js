/**
 * Complexe Condition Component
 *
 * Version 3.1.0
 *
 * Changelog
 * 3.1 - Standalone development
 *     - JS Strict Mode
 *     - Gulp Scripts
 * 3.0 - Compatibility to Reports functions
 * 2.3 - Rework for Standalone task
 * 2.3.1 - 2017-08-17
 *       - Add option to set fieldname prefix
 *       - Make InitAutocompleteText optional
 *
 * Handling
 * Require FlexTranslate in current Scope
 * Require set of ConditionScopeModule to current Module
 * Require jquery.form.min.js inside views/resources of ConditionScopeModule
 * Condition Popup needs "ComplexeCondition" action in ConditionScopeModule/action
 * Condition Popup needs "ComplexeCondition" view in ConditionScopeModule/views
 * Condition Popup needs "ConditionPopup.tpl" Template in ConditionScopeModule
 *
 * Usage
 */
(function($) {
 'use strict'; var CSS = ':host{border:2px solid #00f;display:block}.ConditionContainer>span:first-of-type:nth-last-of-type(1),.ConditionContainer>span:first-of-type:nth-last-of-type(1)~span{width:100%;display:block}.ConditionContainer>span:first-of-type:nth-last-of-type(2),.ConditionContainer>span:first-of-type:nth-last-of-type(2)~span{display:inline-block}.ConditionalRecord{padding:2px 3px;display:flex;flex-direction:row;width:100%;box-sizing:border-box}.ConditionalRecord select{margin-bottom:1px;width:100%;height:29px}.ConditionalRecord[data-columns="1"] .select2-container.ConditionValue{width:100%}.ConditionalRecord[data-columns="0"] .ConditionContainer,.ConditionalRecord[data-columns="0"] .ConditionMode{display:none}.ConditionalGroupHover{border:2px solid red!important}.ConditionalRecordHover{background-color:#eee}.ConditionalGroup[data-parentgroup=root]{margin-left:0}.ConditionalGroup[data-nestedlevel="0"]{border-top-color:#ccc;margin-top:-1px;margin-left:10px}.ConditionalGroup{border:2px solid #777;padding:3px 3px 5px 3px;background-color:#eee;margin:0;margin-left:3px;margin-bottom:10px;border-radius:2px;margin-top:5px}.ConditionOperation{flex:0 0 100px;box-sizing:border-box}.joinSelector{margin-bottom:5px}.ConditionField{flex:0 0 30%;box-sizing:border-box}.ConditionNot{flex:0 0 60px;margin-left:3px;box-sizing:border-box}.ConditionMode{flex:0 0 80px;box-sizing:border-box}.ConditionValue.select{width:200px}.ConditionMode,.ConditionNot,.ConditionOperation,.ConditionValue.select{font-size:11px;padding:2px;margin-right:3px;vertical-align:top}.ConditionValue.text{vertical-align:top;width:300px}.ConditionCollapseJoins .conditionFooterToolbar .ConditionalSubJoin{display:inline!important;line-height:26px}.ConditionCollapseJoins .ConditionalSubJoin{display:none!important}.ConditionExpandJoins .ConditionalMasterJoin{display:none!important}.ConditionalJoin select{width:80px;font-size:11px;text-transform:uppercase;letter-spacing:2px;padding:0;height:20px;margin:0 0 2px 40px;font-weight:700}img.ConditionRemove{margin-bottom:-4px;margin-right:4px;vertical-align:top;margin-top:5px;cursor:pointer;width:16px;height:16px}span.group_remove{float:right}.ConditionContainer{flex:2 0 30%;box-sizing:border-box;display:flex}.NewConditionalGroup,.NewConditionalRecord{display:none}.ConditionContainer span{flex-grow:1}.ConditionContainer span.short input,.ConditionContainer span.short select{width:140px}.ConditionControlPanel{background-color:#eee;padding:5px;border-top:2px solid #777;border-right:2px solid #777;border-left:2px solid #777;border-bottom:0 solid #777;margin-left:10px}.ConditionControlPanel label{display:inline-block;margin-bottom:0}.ConditionalGroup[data-recordindex="0"]{margin-left:0;margin-right:0;border-bottom:2px solid #777;border-radius:0}.ConditionContainer .condLabel{display:inline-block;margin-left:10px;margin-right:10px}span.templateFieldBtn img{vertical-align:middle}span.templateFieldBtn{width:28px;box-sizing:border-box;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;display:inline-block;line-height:20px;border:1px solid #a0a0a0;cursor:pointer;background:#f6f6f6}span.templateFieldSpan{display:flex;width:100%;position:relative;vertical-align:middle;box-sizing:border-box}span.templateTextareaSpan{display:flex;width:100%;position:relative;vertical-align:middle;border:1px solid #c4c4c4;border-radius:4px;-moz-border-radius:4px;-webkit-border-radius:4px;box-sizing:border-box;background-color:#f6f6f6}span.templateTextareaSpan textarea{border:none;border-right:1px solid #c4c4c4;border-top-left-radius:4px;margin-bottom:0;box-shadow:none}input.templateField{margin-bottom:0;border:1px solid #a0a0a0;flex-grow:1;border-right:0;height:29px;box-sizing:border-box}span.templateFieldBtn{-moz-border-radius-bottomright:4px;-moz-border-radius-topright:4px;border-top-right-radius:4px;border-bottom-right-radius:4px;flex-grow:0;text-align:center}span.templateFieldMidButton{-moz-border-radius-bottomright:0!important;-moz-border-radius-topright:0!important;border-top-right-radius:0!important;border-bottom-right-radius:0!important}span.calendarFieldButton:hover,span.templateFieldButton:hover,span.templateFieldMidButton:hover,span.templateFieldResetButton:hover{background:#e5e5e5}span.calendarFieldButton:active,span.templateFieldButton:active,span.templateFieldResetButton:active{background:0 0;background-color:#eee}span.calendarFieldButton,span.templateFieldResetButton{padding:0 5px}span.templateFieldResetButton{padding:0 2px}input.textfield:focus,textarea.textfield:focus{outline:0}ul.textcomplete-dropdown{width:450px}.textcomplete-header{background-color:#ccc;color:#444;line-heigh:25px}.textcomplete-dropdown{overflow:auto}div.FieldSetterValueContainer img.exclamation{display:inline;margin:0 5px -5px 0}.btn{padding:5px 12px;font-size:13px;font-weight:700;line-height:18px;cursor:default;-webkit-background-clip:border-box;background-clip:border-box;border-radius:2px;-webkit-box-shadow:none;box-shadow:none}.btn-primary{color:#fff;text-shadow:0 1px rgba(0,0,0,.1);background-image:-webkit-linear-gradient(top,#4d90fe 0,#4787ed 100%);background-image:-o-linear-gradient(top,#4d90fe 0,#4787ed 100%);background-image:-webkit-gradient(linear,left top,left bottom,from(#4d90fe),to(#4787ed));background-image:linear-gradient(to bottom,#4d90fe 0,#4787ed 100%);background-repeat:repeat-x;border:1px solid #3079ed}.btn{border-radius:0;font-weight:100;cursor:pointer}.btn-info{color:#fff;text-shadow:0 1px rgba(0,0,0,.1);background-image:-webkit-linear-gradient(top,#5bc0de 0,#5bc0de 100%);background-image:-o-linear-gradient(top,#5bc0de 0,#5bc0de 100%);background-image:-webkit-gradient(linear,left top,left bottom,from(#5bc0de),to(#5bc0de));background-image:linear-gradient(to bottom,#5bc0de 0,#5bc0de 100%);background-repeat:repeat-x;border:1px solid #46b8da}.btn-danger{color:#fff;text-shadow:0 1px rgba(0,0,0,.1);background-image:-webkit-linear-gradient(top,#dd4b39 0,#d14836 100%);background-image:-o-linear-gradient(top,#dd4b39 0,#d14836 100%);background-image:-webkit-gradient(linear,left top,left bottom,from(#dd4b39),to(#d14836));background-image:linear-gradient(to bottom,#dd4b39 0,#d14836 100%);background-repeat:repeat-x;border:1px solid #c6322a}.pull-right{float:right}.btn-group,.btn-group-vertical{position:relative;display:inline-block;vertical-align:middle}';
Array.prototype.last = function () {
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
        jQuery("#insertTemplateFieldContainer").load("index.php?module=" + ConditionScopeModule + "&action=TemplateVariables&mode=templateFields", {
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
};var AvailableVariables = false;
var ConditionScopeModule = '';
var VERSION = '3.1.0';

var LocalComplexCondition = function(parentEle, fieldname_prefix) {
    this.initialized = false;
    this.conditionOperators = null;
    this.operationOptions = {
        "picklist": [],
        "multipicklist": [],
        "boolean": [],
        "number": [],
        "date": [],
        "text": [],
        "crmid": []
    };
    this.hasChanged = false;
    this.moduleFields = null;

    this.available_currencies = [];
    this.available_users = [];

    this.parentEle = jQuery(parentEle);

    this.fieldOptionsHTMLCache = null;

    this.fieldNamePrefix = fieldname_prefix;

    this.conditionMode = 'field';

    this.requiredOnInit = [];

    this.condition = {};

    /**
     * Flat Field structure
     * @type {Array}
     */
    this.fieldData = {};

    /**
     * Variables within field are enabled?
     * @type {boolean}
     */
    this.enableTemplateFields = true;

    /**
     *
     * @type {Array}
     */
    this.environmentVariables = [];

    /**
     * is static value, function, formula selection invisible
     * @type {boolean}
     */
    this.DisabledConditionMode = false;

    /**
     * Are fielddata loaded by callback function
     * @type {boolean}
     */
    this.dynamicFieldMode = false;

    /**
     * Show fieldvalue modifier picklist
     * @type {boolean}
     */
    this.enableValueModifier = false;

    if(typeof MOD === 'undefined') {
        var MOD = {};
    }

    this.columnsRewrites = {
        "assigned_user_id": "smownerid"
    };

    /** Callback function START **/
    this.cbGetFieldTypeName = function(field) {
        var fieldTypeName;

        if (typeof this.fieldData[field] !== 'undefined') {
            fieldTypeName = this.fieldData[field].type["name"];
        } else {
            fieldTypeName = "text";
        }

        return fieldTypeName;
    };
    this.cbGetPicklistValues = function(field) {
        return this.fieldData[field].type.picklistValues;
    };
    /** Callback function END **/

    /**
     Should the join selects created visibly
     */

    this.mainCheckModule = null; // Which module should be checked
    this.mainSourceModule = null; // From which module the variables should taken
    this.imagePath = ''; // URL to folder, images are loaded

    this.mainGroup = false;

    /** SETTER **/
    this.setFieldnamePrefix = function(fieldNamePrefix) {
        this.fieldNamePrefix = fieldNamePrefix;
    };

    this.setTranslation = function(translations) {
        MOD = translations;
    };

    this.setEnabledTemplateFields = function(status) {
        this.enableTemplateFields = (status == true);
    };

    this.disableConditionMode = function() {
        this.DisabledConditionMode = true;
    };

    this.enableValueModifier = function() {
        this.enableValueModifier = true;
    };

    this.setImagePath = function (path) {
        this.imagePath = path;
    };

    this.setScopeName = function(scopeName) {
        ConditionScopeModule = scopeName;

        if(this.imagePath === '') {
            this.setImagePath('modules/' + ConditionScopeModule + '/views/resources/img/');
        }
    };

    /**
     * Define the result you will generate from condition
     * The different is importent, when you don't define available operators
     * Some operators are only available in specific mode
     *
     * Either field or mysql
     *  field - Condition should be processed by ConditionCheck class
     *  mysql - Condition should be processed by ConditionMySQL class
     * @param conditionMode
     */
    this.setConditionMode = function(conditionMode) {
        this.conditionMode = conditionMode == 'field' ? 'field' : 'mysql';
    };

    /**
     * Set the left module, which will be checked
     * @param moduleName
     */
    this.setMainCheckModule = function (moduleName) {
        this.mainCheckModule = moduleName;
    };
    /**
     * Set the right module, which will be used to load variables from
     * @param moduleName
     */
    this.setMainSourceModule = function (moduleName) {
        this.mainSourceModule = moduleName;
    };

    /**
     * Enable has changed operator
     * @param value
     */
    this.enableHasChange = function (value) {
        this.hasChanged = (value == true);
    };

    this.setFieldTypeCallback = function(callback) {
        if(typeof callback !== 'function') {
            console.error('Field type callback must be function');
        }
        this.cbGetFieldTypeName = callback;
    };

    this.setAvailableVariables = function(availableVariablesParameter) {

        if(availableVariablesParameter !== false) {

            this.setEnabledTemplateFields(true);
            AvailableVariables = availableVariablesParameter;

        } else {

            this.setEnabledTemplateFields(false);

        }

    };

    this.setPicklistCallback = function(callback) {
        if(typeof callback !== 'function') {
            console.error('Picklist callback must be function');
        }

        this.cbGetPicklistValues = callback;
    };

    this.setAvailableCurrencies = function (currencies) {
        this.available_currencies = currencies;
    };

    this.setAvailableUser = function (users) {
        this.available_users = users;
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
                    if (typeof this.columnsRewrites[fieldValue.name] != 'undefined') {
                        fieldValue.name = this.columnsRewrites[fieldValue.name];
                    }
                    if (typeof fieldValue.type == 'string') {
                        fieldValue.type = {'name': fieldValue.type};
                    }
                    if (fieldValue.name == 'crmid' || fieldValue.name.indexOf(' crmid)') !== -1) {
                        fieldValue.type = { 'name': 'crmid' };
                    }

                    this.fieldData[fieldValue.name] = fieldValue;

                }, this));

            }, this));

            this.fieldData["smownerid"]["type"]["picklistValues"] = {};

            this.fieldData["smownerid"]["type"]["name"] = "picklist";
            this.fieldData["smownerid"]["type"]["picklistValues"] = {};

            this.fieldData["smownerid"]["type"]["picklistValues"]['$current_user_id'] = '$currentUser';

        }
    };
    this.setEnvironmentVariables = function (value) {
        this.environmentVariables = value;
    };
    this.setCondition = function (value) {
        if(typeof value != 'undefined') {
            if(typeof value.childs === 'undefined') {
                var childs = [];

                $.each(value, function(index, condition) {
                    if(typeof condition !== 'object' || condition.operator === '' || typeof condition.field === 'undefined' || condition.field == '') return;

                    condition.field = JSON.parse(condition.field);

                    if(typeof condition.field == 'string') {
                        condition.field = JSON.parse(condition.field);
                    }

                    childs.push({
                        'field': condition.field.fieldkeyid,
                        'mod': condition.mod,
                        'operation': condition.operator,
                        'not': condition.not,
                        'mode': 'value',
                        'rawvalue': condition.config
                    });
                });

                value = {
                    'join': 'and',
                    'childs':childs
                };
            }

            this.condition = value;
        }
    };

    this.setConditionOperators = function (operators) {
        this.conditionOperators = operators;
        $.each(operators, $.proxy(function (OperatorIndex, OperatorConfig) {

            if (OperatorConfig.fieldtypes === 'all') {
                $.each(this.operationOptions, $.proxy(function (index, value) {
                    this.operationOptions[index].push(OperatorIndex);
                }, this));
            } else {
                $.each(OperatorConfig.fieldtypes, $.proxy(function (index, value) {
                    if (typeof this.operationOptions[value] !== 'undefined') {
                        this.operationOptions[value].push(OperatorIndex);
                    }
                }, this));
            }

        }, this));

        this.operationOptions["owner"] = this.operationOptions["picklist"];
        this.operationOptions["crmid"] = jQuery.merge(jQuery.extend([], this.operationOptions["number"]), jQuery.extend([], this.operationOptions["crmid"]));
        this.operationOptions['crmid'] = jQuery.grep(this.operationOptions['crmid'], jQuery.proxy(function (itm, i) {
            return i == this.operationOptions['crmid'].indexOf(itm);
        }, this));
    };


    /** SETTER END **/

    /** GETTER **/

    /**
     * @returns {boolean}
     */
    this.isInitialized = function() {
        return this.initialized;
    };

    /**
     * @returns {boolean}
     */
    this.IsTemplateFieldsEnabled = function() {
        return this.enableTemplateFields;
    };

    /**
     * @returns {*}
     */
    this.getFieldnamePrefix = function() {
        return this.fieldNamePrefix;
    };
    this.getMainSourceModule = function() {
        return this.mainSourceModule;
    };
    this.getMainCheckModule = function() {
        return this.mainCheckModule;
    };

    this.getFieldOptions = function () {

        if (this.fieldOptionsHTMLCache === null) {
            var fieldOptions = '';

            jQuery.each(this.moduleFields, jQuery.proxy(function (key, value) {
                fieldOptions += "<optgroup label='" + key + "'>";
                for (var i = 0; i < this.moduleFields[key].length; i++) {
                    if (this.columnsRewrites[this.moduleFields[key][i].name] !== undefined) {
                        this.moduleFields[key][i].name = this.columnsRewrites[this.moduleFields[key][i].name];
                    }

                    fieldOptions += "<option value='" + this.moduleFields[key][i].name + "'>" + this.moduleFields[key][i].label + "</option>";
                }
                fieldOptions += "</optgroup>";
            }, this));

            if (typeof this.environmentVariables == 'object' && this.environmentVariables.length > 0) {
                fieldOptions += "<optgroup label='Environment Variables'>";

                jQuery.each(this.environmentVariables, function (key, value) {
                    fieldOptions += "<option value='" + value + "'>" + value + "</option>";
                });

                fieldOptions += "</optgroup>"
            }
            this.fieldOptionsHTMLCache = fieldOptions;
        }

        return this.fieldOptionsHTMLCache;
    };

    this.IsConditionModeVisible = function() {
        return this.DisabledConditionMode === false;
    };
    this.IsValueModifiersVisible = function() {
        return this.enableValueModifier === true;
    };
    this.IsDynamicFieldLoader = function() {
        return this.dynamicFieldMode;
    };

    /** GETTER END **/

    /** CALLBACKS **/

    /** CALLBACKS END **/

    /** Private function **/
    var thiss = this;

    var __ = function(key) {

        if(typeof MOD[key] !== 'undefined') {

            return MOD[key];

        } else if(typeof FlexTranslate !== 'undefined') {

            var obj = null;
            try {
                obj = FlexTranslate(ConditionScopeModule)
            } catch(exception) {
                return key;
            }

            if(typeof obj !== 'undefined') {
                return obj.__(key);
            }

            return key;

        } else {

            return key;

        }

    };

    var _AfterLoadFields = function() {
        thiss.parentEle.hide();

        thiss.currentParentGroupId = 'root';
        thiss.initValues = [];

        _PrepareParentEle();

        thiss.mainGroup = new ComplexeConditionGroup(thiss, false);
        thiss.mainGroup.appendTo(thiss.parentEle);
        thiss.mainGroup.initialize(thiss.condition);

        /** At the end: show condition box **/
        thiss.parentEle.fadeIn('fast', function () {
            thiss.InitSelect2();
        });

        thiss.initialized = true;

        if(thiss.enableTemplateFields && typeof InitAutocompleteText !== 'undefined') {
            InitAutocompleteText();
        }

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
        //this.initGroupEvents();
        //this.initConditionEvents();

    };

    var _RequireOnInit = function(component) {
        thiss.requiredOnInit.push(component);
    };

    var _PrepareParentEle = function() {
        var html = '<div class="ConditionControlPanel"><strong>Options:&nbsp;&nbsp;</strong>';
        html += '<label><input type="checkbox" class="ConditionJoinCollapse" checked="checked" /> ' + __('Collapse logical operators')+ '</label>';
        html += '</div>';

        thiss.parentEle.html(html);

        $('.ConditionJoinCollapse', thiss.parentEle).on('change', function (e) {
            if ($(e.target).prop('checked') == true) {
                $(thiss.parentEle).addClass('ConditionCollapseJoins').removeClass('ConditionExpandJoins');
            } else {
                $(thiss.parentEle).removeClass('ConditionCollapseJoins').addClass('ConditionExpandJoins');
            }
        }).trigger('change');

    };

    /** Functions **/
    this.__ = __;

    this.ChangeJoin = function(e) {
        var target = jQuery(e.target);
        var conditionRecordEle = jQuery(target).closest('.ConditionalGroup');

        conditionRecordEle.children('.CondContainer').children('.ConditionalJoin').find('select').val(target.val());
        jQuery('> .btn-toolbar .ConditionalMasterJoin select', conditionRecordEle).val(target.val());

    };

    this.InitSelect2 = function() {
        // return;
        var elements = $('.MakeSelect2', this.parentEle);
        elements.removeClass('MakeSelect2');
        elements.each(function(index, ele) {
            $(ele).select2({
                closeOnSelect: $(ele).data('closeonselect') == '0' ? false : true
            });
        });

        if(this.dynamicFieldMode === true) {
            var elements = $('.MakeHiddenSelect2.ConditionField', this.parentEle);
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

    /**
     * This function initiate the condition component
     * Next Step: AfterLoadFields
     */
    this.init = function () {
        if($('.CONDITIONSTYLES').length == 0) {
            $('body').append('<style type="text/css" class="CONDITIONSTYLES">' + CSS + '</style>')
        }

        var d = document.documentElement.style
        if (('flexWrap' in d) || ('WebkitFlexWrap' in d) || ('msFlexWrap' in d)) {
            jQuery(this.parentEle).addClass('supportFlexbox')
        }

        if(this.conditionOperators === null) {
            _RequireOnInit('operators');
        }
        if(this.moduleFields === null) {
            _RequireOnInit('fields');
        }

        if(this.requiredOnInit.length > 0) {
            $.post(
                'index.php?module=' + ConditionScopeModule + '&action=ComplexeCondition&mode=init',
                {
                    mainModule: this.mainCheckModule,
                    conditionMode: this.conditionMode,
                    required:this.requiredOnInit
                },
                $.proxy(function(response) {

                    if(typeof response.operators !== 'undefined') {
                        this.setConditionOperators(response.operators);
                    }

                    if(typeof response.fields !== 'undefined') {
                        this.setModuleFields(response.fields);
                    }

                    _AfterLoadFields();
                }, this),
                'json'
            );

        } else {
            if(typeof this.moduleFields !== 'function') {
                this.LoadFields()
                    .then(
                        jQuery.proxy(_AfterLoadFields, this)
                    );
            } else {
                _AfterLoadFields();
            }

        }

    };


    this.generateJOINSelect = function(prefix, isMaster) {
        if(typeof isMaster === 'undefined') isMaster = false;

        var html = "<div class='ConditionalJoin ConditionalSubJoin " + (isMaster === true ? 'ConditionalMasterJoin' : '') + "'>";

        if (isMaster === true) {
            html += "<select class='joinSelector' disabled='disabled' name='" + prefix + "[join]'>";
        } else {
            html += "<select class='joinSelector' disabled='disabled' >";
        }

        html += "<option value='and'>" + __("LBL_AND") + "</option>";
        html += "<option value='or'>" +__("LBL_OR") + "</option>";

        html += '</select>';
        html += '</div>';

        return html;
    };

};;var ComplexeConditionField = function(complexeConditionObj, parentGroup) {
    this.complexeConditionObj = complexeConditionObj;
    if(typeof parentGroup == 'undefined') parentGroup = false;

    this.parentGroup = parentGroup;

    this.elementIndex = this.parentGroup.getFreeElementIndex();

    this.fieldNamePrefix = this.parentGroup.getGroupPrefix() + '[' + this.elementIndex + ']';
    this.fieldIdPrefix = this.parentGroup.getGroupIdPrefix() + '_' + this.elementIndex;
    this.container = null;

    var thiss = this;
    /**
     * @var LocalComplexCondition
     */
    this.appendTo = function(dom_element) {
        var tmpHtml = "";

        tmpHtml += "<div class='ConditionalRecord " + (this.complexeConditionObj.isInitialized() === true ? 'NewConditionalRecord' : '') + "'>";
        tmpHtml += "<img class='ConditionRemove' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfjBA4NCASON889AAAAUElEQVQoz2NgSGZ4z/AfB3zPkMTI8J6BleEGA3agwfCbgeE/wzEGXOA4w38mBgKAjgpSGZ6gwVSIBAtc6X9cZgwBbxKKrF8MDEl4ovsdQyIAAmIzIBOr6dYAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTktMDQtMTRUMTE6MDg6MDQrMDI6MDBj5QO2AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE5LTA0LTE0VDExOjA4OjA0KzAyOjAwEri7CgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAASUVORK5CYII=' alt='delete'>";


        var fieldId = 'f_' + this.fieldIdPrefix;

        if(this.complexeConditionObj.IsDynamicFieldLoader() === false) {
            tmpHtml += "<select class='ConditionField MakeSelect2' name='" + this.fieldNamePrefix + "[field]' id='" + fieldId + "_field'>" + this.complexeConditionObj.getFieldOptions() + "</select>";
        } else {
            tmpHtml += "<input type='hidden' class='ConditionField MakeHiddenSelect2' name='" + this.fieldNamePrefix + "[field]'  id='" + fieldId + "_field' />";
        }

        if(this.complexeConditionObj.IsValueModifiersVisible() === true) {
            tmpHtml += "<select class='ConditionMod' name='" + this.fieldNamePrefix + "[mod]' id='" + fieldId + "_modification'></select><br/>";
        }
        tmpHtml += "<select class='ConditionNot' name='" + this.fieldNamePrefix + "[not]' id='" + fieldId + "_not'><option value='0'>-</option><option value='1'>" + this.complexeConditionObj.__("LBL_NOT") + "</option></select>";

        tmpHtml += "<select class='ConditionOperation' name='" + this.fieldNamePrefix + "[operation]' id='" + fieldId + "_operation'><option value=''>_</option></select>";

        tmpHtml += '<select class="ConditionMode" ' + (this.complexeConditionObj.IsConditionModeVisible() === false ? 'style="display:none;"': '') + ' name="' + this.fieldNamePrefix + '[mode]" id="' + fieldId + '_mode"><option value="value">' + this.complexeConditionObj.__("LBL_STATIC_VALUE") + '</option><option value="function">' + this.complexeConditionObj.__("LBL_FUNCTION_VALUE") + '</option></select>';

        tmpHtml += "<div class='ConditionContainer'></div>";

        tmpHtml += "</div>";

        tmpHtml += this.complexeConditionObj.generateJOINSelect('', false);

        this.container = $(tmpHtml);

        $(dom_element).append(this.container);

        this.parentGroup.checkJoinDisabled();

        jQuery('.NewConditionalRecord', dom_element).css('display', 'flex');
        //jQuery('.NewConditionalRecord').slideDown('fast');
        jQuery('.NewConditionalRecord', dom_element).removeClass('NewConditionalRecord');

        /** EVENTS **/
        jQuery('.ConditionField', this.container).on('change', jQuery.proxy(this.updateSelectedField, this));
        jQuery('.ConditionMod', this.container).on('change', jQuery.proxy(this.updateSelectedField, this));
        jQuery('.ConditionOperation', this.container).on('change', jQuery.proxy(this.updateOperationField, this));
        jQuery('.ConditionMode', this.container).on('change', jQuery.proxy(this.updateOperationField, this));

        jQuery('.ConditionRemove', this.container).on('click', jQuery.proxy(this.removeCondition, this));
        jQuery('.ConditionalJoin').off('change').on('change', this.complexeConditionObj.ChangeJoin);

        jQuery('.ConditionalRecord', this.container).on('mouseover', jQuery.proxy(function (e) {
            // Hover the backgorund Color
            var target = e.target;
            if (!jQuery(target).hasClass('ConditionalRecord')) {
                target = jQuery(target).closest('.ConditionalRecord');
            }

            jQuery('.ConditionalRecordHover', this.parentEle).removeClass('ConditionalRecordHover');
            jQuery(target).addClass('ConditionalRecordHover');
        }, this));

        jQuery('.ConditionalGroup', this.container).on('mouseover', jQuery.proxy(function (e) {
            var target = e.target;
            if (!jQuery(target).hasClass('ConditionalGroup')) {
                target = jQuery(target).closest('.ConditionalGroup');
            }

            jQuery('.ConditionalGroupHover', this.parentEle).removeClass('ConditionalGroupHover');
            jQuery(target).addClass('ConditionalGroupHover');
        }, this));

        jQuery('.ConditionField', this.container).trigger('change')

        this.complexeConditionObj.InitSelect2();
    };

    this.initializeConditionValues = {};

    this.initialize = function(init_field) {
        if(init_field.field === null || typeof init_field.field == 'undefined') {
            return;
        }

        if(typeof init_field === 'undefined') return;

        if(typeof init_field.rawvalue !== 'undefined' && init_field.rawvalue !== null) {
            this.initializeConditionValues = init_field.rawvalue;
        }

        $('.ConditionNot', this.container).val(init_field.not);
        $('.ConditionMode', this.container).val(init_field.mode);

        $('.ConditionField', this.container).val(init_field.field).trigger('change');
        $('.ConditionMod', this.container).val(init_field.mod).trigger('change');

        $('.ConditionOperation', this.container).val(init_field.operation).trigger('change');
        $('.ConditionMode', this.container).val(init_field.mode).trigger('change');


        this.initializeConditionValues = {};
    };

    this.removeCondition = function(e) {
        var thiss = this;

        this.container.slideUp('fast', function() {
            jQuery(this).remove();

            thiss.parentGroup.checkJoinDisabled();
        });
    };

    this.updateOperationField = function (e) {
        var selOperator = this.getSelectedOperator();
        var selField = this.getSelectedField();
        var selMode = this.getSelectedMode();

        if (selOperator.indexOf('/') == -1 && selOperator != '') {
            if (selOperator == 'bigger') {
                selOperator = 'after';
            }
            if (selOperator == 'lower') {
                selOperator = 'before';
            }

            selOperator = 'core/' + selOperator;
        }

        var fieldTypeName = this.complexeConditionObj.cbGetFieldTypeName(selField);

        var currentValue = this.initializeConditionValues;
        //console.log(currentValue);
        jQuery('.ConditionValue', this.container).each(function (index, value) {
            var ConfigIndex = $(value).data('name');
            if (ConfigIndex === undefined || typeof currentValue[ConfigIndex] != 'undefined') return;

            currentValue[ConfigIndex] = $(value).val();
        });

        var html = '';
        var currentValueString;

        if (selMode === 'function') {
            if (typeof currentValue === 'object') {
                if (typeof currentValue.value === 'undefined' || currentValue.value.indexOf('return') == -1) {
                    currentValueString = '$value = array();' + "\n";
                    jQuery.each(currentValue, function (index, value) {
                        currentValueString += "$value['" + index + "'] = '" + value + "';\n";
                    });
                    currentValueString += 'return $value;';
                    currentValue = currentValueString;
                } else {
                    currentValue = currentValue.value;
                }
            }
            var lines = (currentValue.match(/\n/g) || []).length;
            if (lines < 4) {
                lines = 4;
            }
            if (lines > 15) {
                lines = 15;
            }
            html += "<span class='customFunctionSpan'><textarea class='customFunction' style='width:100%;height:" + ((lines + 1) * 19) + "px;' name='" + this.fieldNamePrefix + '[rawvalue]' + "' id='" + this.fieldIdPrefix + "_rawvalue'>" + currentValue + "</textarea></span>";
            html += "<label style='display:inline-block;'><img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAHtQTFRFAAAAAIUEAIUEAIUEAIUEAIUEAIUEAIUEAIUEAIUEAIUEAIUEAIUEAIUEAIUEAIUEAIUEAIUEAIUEAIUEAIUEAIUEAIUEAIUEAIUEAIUEAIUEAIUEAIUEAIUEAIUEAIUEAIUEAIUEAIUEAIUEAIUEAIUEAIUEAIUEAIUEIHjORgAAACl0Uk5TAGDm5Foc+//5FjgxB9TOBA9ubA0sKqCYLiYtJZ+XKykQcA76+F/l41l7yLOFAAAAZ0lEQVR4nGWPRxKDUAxDTRUQCPyEXgKBUO5/wlA2+sNbWRpbI4ucGKZlC+G4gOeTEWDnQUYYAc+YbxL1eotGmuk6BwrW5RFakVEfRsMrLdDpIZ9e18NXjaxvxW7VnQn48XMyL+t2TX/hiwRcoSKPsQAAAABJRU5ErkJggg==' style='margin-bottom:-2px;cursor:pointer;' onclick=\"insertTemplateField('" + this.fieldIdPrefix + "_rawvalue" + "', '[source]->[module]->[destination]', false)\"></label>";
        }  else if (selMode === 'value') {

            jQuery.each(this.complexeConditionObj.conditionOperators[selOperator].config, jQuery.proxy(function (ConfigIndex, Config) {
                var fieldName = this.fieldNamePrefix + '[rawvalue][' + ConfigIndex + ']';
                var fieldId = this.fieldIdPrefix + '_' + ConfigIndex;

                if (typeof currentValue[ConfigIndex] == 'undefined') currentValue[ConfigIndex] = '';
                if (typeof Config.label != 'undefined') html += '<label class="condLabel">' + Config.label + '</label>';

                html += '<span class="' + (typeof Config.length != 'undefined' ? Config.length : '') + '">';

                var CondigFieldType = Config.type;
                if(this.getSelectedFieldmodifier() !== 'raw') {
                    CondigFieldType = 'textfield';
                }

                if(CondigFieldType === 'default') {
                    switch (fieldTypeName) {
                        case "multipicklist":
                        case "picklist":
                        case "owner":
                            CondigFieldType = 'picklist';
                            break;
                        case "boolean":
                            CondigFieldType = 'checkbox';
                            break;
                        case "date":
                        case "datetime":
                            CondigFieldType = 'datefield';
                            break;
                        case "reference":
                            CondigFieldType = 'textfield';
                            break;
                        default:
                            CondigFieldType = 'textfield';
                            break;
                    }
                }

                console.log('Draw Config Field', CondigFieldType);

                switch(CondigFieldType) {
                    case 'picklist':
                        var ExtraAttributes = '';
                        var MultipleMode = false;
                        if(typeof Config.multiple != 'undefined' && Config.multiple == true) {
                            ExtraAttributes = 'multiple="multiple" data-closeonselect="0"';
                            fieldName += '[]';
                            MultipleMode = true;
                        }

                        html += "<select class='ConditionValue MakeSelect2' data-name='" + ConfigIndex + "' name='" + fieldName + "' id='" + fieldId + "' " + ExtraAttributes + ">";
                        if(typeof Config.options !== "undefined") {
                            var picklistValues = Config.options;
                        } else {
                            var picklistValues = this.complexeConditionObj.cbGetPicklistValues(selField);
                        }

                        var generatePicklistOptions = function(picklistValues) {
                            var html = '';

                            html += "<option value=''>&nbsp;&nbsp;&nbsp;&nbsp;&raquo;&nbsp;&nbsp;" + thiss.complexeConditionObj.__('LBL_EMPTY_VALUE') + "</option>";

                            html += "<optgroup label='" + thiss.complexeConditionObj.__('LBL_VALUES') + "'>";

                            jQuery.each(picklistValues, function (index, value) {

                                if(MultipleMode === false) {
                                    var selected = currentValue[ConfigIndex] == index ? "selected='selected'" : "";
                                } else {
                                    var selected = $.inArray(index, currentValue[ConfigIndex]) !== -1 ? "selected='selected'" : "";
                                }

                                html += "<option value='" + index + "' " + selected + ">" + value + "</option>";
                            });

                            return html;
                        };

                        if(typeof picklistValues.then != 'undefined' && jQuery.isFunction(picklistValues.then)) {
                            picklistValues.then($.proxy(function(response) {
                                var htmlOptions = $.proxy(generatePicklistOptions, this)(response);
                                jQuery('#' + this.id).html(htmlOptions).select2('val', currentValue[ConfigIndex]);
                            }, { id:fieldId }));
                        } else {
                            var htmlOptions = $.proxy(generatePicklistOptions, this)(picklistValues);
                            html += htmlOptions;
                        }

                        html += "</optgroup>";

                        html += "</select>";
                        break;
                    case 'datefield':

                        html += createTemplateDatefield(
                            fieldName,
                            fieldId,
                            currentValue[ConfigIndex],
                            {
                                "showTime": fieldTypeName === "datetime",
                                "format": '%Y-%m-%d',
                                module: this.complexeConditionObj.getMainSourceModule(),
                                'fieldType':'text',
                                dataAttr: {
                                    'name': ConfigIndex
                                },
                                'class': 'ConditionValue',
                                'variables': this.complexeConditionObj.IsTemplateFieldsEnabled()
                            }
                        );

                        break;
                    case 'reference':
                        var referTo = this.complexeConditionObj.fieldData[selField].type.refersTo[0];
                        if (referTo == "Currency" && typeof this.complexeConditionObj.available_currencies !== "undefined") {
                            html += "<select class='condition_value select' name='" + fieldName + "' id='" + fieldId + "'>";

                            for (var a = 0; a < this.complexeConditionObj.available_currencies.length; a++) {
                                html += "<option " + (currentValue == this.complexeConditionObj.available_currencies[a].curid ? "selected='selected'" : "") + " value='" + this.complexeConditionObj.available_currencies[a].curid + "'>" + this.complexeConditionObj.available_currencies[a].currencylabel + "</option>";
                            }

                            html += "</select>";
                        } else {
                            html += createTemplateTextfield(
                                fieldName,
                                fieldId,
                                currentValue[ConfigIndex],
                                {
                                    refFields: true,
                                    module: this.complexeConditionObj.getMainSourceModule(),
                                    dataAttr: {
                                        'name': ConfigIndex
                                    },
                                    'class': 'ConditionValue',
                                    'variables': this.complexeConditionObj.IsTemplateFieldsEnabled()
                                }
                            );
                        }
                        break;
                    case 'productid':
                        html += createProductChooser(
                            fieldName,
                            fieldId,
                            currentValue[ConfigIndex],
                            {
                                'class': 'ConditionValue'
                            }
                        );


                        break;
                    default:
                        if (typeof Config['default'] != 'undefined' && currentValue[ConfigIndex] == '' && this.initialized == true) {
                            currentValue[ConfigIndex] = Config['default'];
                        }

                        html += createTemplateTextfield(
                            fieldName,
                            fieldId,
                            currentValue[ConfigIndex],
                            {
                                refFields: true,
                                module: this.complexeConditionObj.getMainSourceModule(),
                                dataAttr: {
                                    'name': ConfigIndex
                                },
                                'class': 'ConditionValue',
                                'variables': this.complexeConditionObj.IsTemplateFieldsEnabled()
                            }
                        );


                        break;
                }
                html += '</span>';
            }, this));

            this.container.attr('data-columns', jQuery.assocArraySize(this.complexeConditionObj.conditionOperators[selOperator].config));

        }

        jQuery('.ConditionContainer', this.container).html(html);
        this.complexeConditionObj.InitSelect2();

        jQuery('body').trigger('InitComponents');
    };

    this.updateSelectedField = function (e) {
        var target = jQuery(e.target);

        var conditionRecordEle = jQuery(target).closest('.ConditionalRecord');

        this.reloadOperations(conditionRecordEle);
        this.updateValueModifier(conditionRecordEle);
    };

    this.getSelectedField = function() {
        return $('select.ConditionField, input.ConditionField', this.container).val();
    };

    this.getSelectedFieldmodifier = function() {
        if($('select.ConditionMod', this.container).length == 0) return 'raw';

        return $('select.ConditionMod', this.container).val();
    };

    this.getSelectedOperator = function() {
        return $('select.ConditionOperation', this.container).val();
    };

    this.getSelectedMode = function() {
        return $('select.ConditionMode', this.container).val();
    };

    this.updateValueModifier = function() {
        var fieldType = this.getSelectedFieldType();
        var selectedModified = this.getSelectedFieldmodifier();

        switch(fieldType) {
            case 'date':
            case 'datetime':
                var modificators = { 'dayofmonth' : 'Day of month', 'month' : 'Month', 'dayofyear' : 'Day of year' };
                break;
            case 'number':
            case 'integer':
            case 'decimal':
            case 'currency':
            default:
                var modificators = { 'sum' : 'Summarize', 'avg' : 'Average', 'max' : 'Maximum', 'min' : 'Minimum', 'count' : 'Count', 'count_unique' : 'Count Unique' };
        }

        var html = '<option value="raw">raw</option>';
        $.each(modificators, function(index, mod) {
            html += '<option value="' + index + '" ' + (selectedModified === index ? 'selected="selected"':'') + '>' + mod + '</option>';
        });


        $('.ConditionMod', this.container).html(html);

    };

    this.getSelectedFieldType = function() {
        var selField = this.getSelectedField();
        return this.complexeConditionObj.cbGetFieldTypeName(selField);
    };

    this.reloadOperations = function () {
        var selOperation = this.getSelectedOperator();
        var selField = this.getSelectedField();

        var fieldTypeName = this.getSelectedFieldType();
        var recordOperationOptions = [];

        if(this.getSelectedFieldmodifier() !== 'raw') {
            fieldTypeName = 'string';
        }

        console.log('Changed field to', fieldTypeName, selField);
        console.log(this.complexeConditionObj.operationOptions);

        switch (fieldTypeName) {
            case "integer":
            case "currency":
                recordOperationOptions = this.complexeConditionObj.operationOptions["number"];
                break;
            case "date":
            case "datetime":
                recordOperationOptions = this.complexeConditionObj.operationOptions["date"];
                break;
            case "multipicklist":
            case "crmid":
            case "picklist":
            case "boolean":
                recordOperationOptions = this.complexeConditionObj.operationOptions[fieldTypeName];
                break;
            default:
                recordOperationOptions = this.complexeConditionObj.operationOptions["text"];
                break;
        }

        var operationHtml = '';
        for (var i = 0; i < recordOperationOptions.length; i++) {
            var title;

            if (typeof this.complexeConditionObj.conditionOperators[recordOperationOptions[i]] != 'undefined') {
                title = this.complexeConditionObj.conditionOperators[recordOperationOptions[i]].label;
            } else {
                title = recordOperationOptions[i];
            }

            title = this.complexeConditionObj.__(title);

            operationHtml += "<option value='" + recordOperationOptions[i] + "' " + (typeof selOperation !== 'undefined' && selOperation == recordOperationOptions[i] ? 'selected="selected"' : '') + ">" + title + "</option>";
        }

        jQuery('.ConditionOperation', this.container).html(operationHtml).trigger('change');
    };
};;var ComplexeConditionGroup = function(complexeConditionObj, parentGroup) {
    if(typeof parentGroup == 'undefined') parentGroup = false;

    this.ownElementIndex = 0;
    this.elementIndex = 0;
    this.parentGroup = parentGroup;
    /**
     * @var LocalComplexCondition
     */
    this.complexeConditionObj = complexeConditionObj;

    this.backgroundColors = ['f9f9f9', 'e7f4fe', 'd9d9d9', 'e7f4fe', 'b9b9b9', 'd9d9d9', 'e9e9e9', 'f9f9f9'];

    this.container = null;

    if(this.parentGroup !== false) {
        this.ownElementIndex = this.parentGroup.getFreeElementIndex();
        this.nestedLevel = this.parentGroup.getNestedLevel() + 1;
        this.fieldPrefix = this.parentGroup.getGroupPrefix() + '[' + this.ownElementIndex + ']';
        this.fieldIdPrefix = this.parentGroup.getGroupIdPrefix() + '_' + this.ownElementIndex + '';
    } else {
        this.nestedLevel = 0;
        this.fieldPrefix = this.complexeConditionObj.getFieldnamePrefix();
        this.fieldIdPrefix = 'root';
    }

    this.getFreeElementIndex = function() {
        return this.elementIndex++;
    };

    this.getBackgroundColor = function() {
        return '#' + this.backgroundColors[this.nestedLevel % this.backgroundColors.length];
    };

    this.checkJoinDisabled = function() {
        if($('.ConditionalRecord', this.container).length == 0) {
            $('> .btn-toolbar .joinSelector', this.container).prop('disabled', true);
        } else {
            $('> .btn-toolbar .joinSelector', this.container).prop('disabled', false);
        }

        if(this.parentGroup !== false) {
            this.parentGroup.checkJoinDisabled();
        }
    };

    this.getNestedLevel = function() {
        return this.nestedLevel;
    };

    this.initialize = function(init_group) {
        if(typeof init_group === 'undefined') return;

        if(typeof init_group.childs !== 'undefined') {
            $.each(init_group.childs, $.proxy(function(index, data) {
                if(typeof data.childs !== 'undefined') {
                    var group = new ComplexeConditionGroup(this.complexeConditionObj, this);
                    group.appendTo($('> .CondContainer', this.container));
                    group.initialize(data);
                } else {
                    //consolelog(typeof data.field);
                    if(typeof data.field !== 'undefined') {
                        var field = new ComplexeConditionField(this.complexeConditionObj, this);
                        field.appendTo($('> .CondContainer', this.container));
                        field.initialize(data);
                    }
                }

            }, this));

            this.setJoin(init_group.join);
        }

    };

    this.setJoin = function(value) {
        $('> .btn-toolbar .ConditionalMasterJoin', this.container).val(value).trigger('change');
    };

    this.appendTo = function(dom_element) {
        var html = '';
        html += "<div class='ConditionalGroup " + (this.complexeConditionObj.isInitialized() ? 'NewConditionalGroup' : '') + "' data-nestedlevel='" + this.nestedLevel + "' style='background-color:" + this.getBackgroundColor() + "'>";

        html += "<div class='CondContainer'></div>";
        html += "<div class='btn-toolbar' style='margin: 5px 0 0 0;'>";
        html += "<div class='btn-group conditionFooterToolbar'>";
        html += "<button type='button' class='btn btn-info addGroupBtn'><i class='icon-folder-open icon-white'></i>&nbsp;&nbsp;" + this.complexeConditionObj.__("LBL_ADD_GROUP") + "</button>";
        html += "<button type='button' class='btn btn-primary addConditionBtn'><i class='icon-plus-sign icon-white'></i>&nbsp;&nbsp;" + this.complexeConditionObj.__("LBL_ADD_CONDITION") + "</button>";

        html += this.complexeConditionObj.generateJOINSelect(this.getGroupPrefix(true), true);

        html += "</div>";

        if (this.nestedLevel > 0) {
            html += "<div class='btn-group pull-right'><button type='button' class='btn btn-danger groupRemoveBtn'><i class='icon-remove icon-white'></i>&nbsp;&nbsp;" + this.complexeConditionObj.__("LBL_REMOVE_GROUP") + "</button></div>";
        }
        html += "</div>";

        html += "</div>";
        html += this.complexeConditionObj.generateJOINSelect('', false);

        this.container = $(html);

        $(dom_element).append(this.container);

        this.checkJoinDisabled();

        var toolbar = $('> .btn-toolbar', this.container);
        $('.addGroupBtn', toolbar).on('click', $.proxy(this.BtnClickAddGroup, this))
        $('.addConditionBtn', toolbar).on('click', $.proxy(this.BtnClickAddCondition, this));

        $('.ConditionalMasterJoin', toolbar).on('change', $.proxy(this.ChangeMasterJoin, this));
        $('.groupRemoveBtn', toolbar).on('click', $.proxy(this.BtnClickRemoveGroup, this));

        $('.ConditionalSubJoin', dom_element).off('change').on('change', this.complexeConditionObj.ChangeJoin);

        $('.NewConditionalGroup', dom_element)
            .slideDown('fast')
            .removeClass('NewConditionalGroup');
    };

    this.ChangeMasterJoin = function(e) {
        var target = $(e.target);
        var conditionRecordEle = $(target).closest('.ConditionalGroup');

        $('> .CondContainer > .ConditionalJoin select', this.container).val(target.val());
    };

    this.BtnClickAddCondition = function(e) {
        var field = new ComplexeConditionField(this.complexeConditionObj, this);
        field.appendTo($('> .CondContainer', this.container));
    };

    this.BtnClickAddGroup = function(e) {
        var group = new ComplexeConditionGroup(this.complexeConditionObj, this);
        group.appendTo($('> .CondContainer', this.container));
    };

    this.BtnClickRemoveGroup = function() {
        var thiss = this;
        this.container.slideUp('slideUp', function() {
            jQuery(this).remove();
            thiss.checkJoinDisabled();
        });
    };

    this.getGroupIdPrefix = function() {
        return this.fieldIdPrefix;
    };

    this.getGroupPrefix = function(skipLastChilds) {
        if(typeof skipLastChilds === 'undefined') skipLastChilds = false;

        if(skipLastChilds === false) {
            var prefix =  this.fieldPrefix + '[childs]';
        } else {
            var prefix =  this.fieldPrefix;
        }


        /*
                    if(skipLastChilds === true && prefix.substr(-8) === '[childs]') {
                        prefix = prefix.substr(0, prefix.length - 8);
                    }
        */
        return prefix;
        /*
        if(this.parentGroup !== false) {
            return this.parentGroup.getGroupPrefix() + '[' + this.parentGroup.getFreeElementIndex() + '][childs]';
        } else {
            return this.complexeConditionObj.getFieldnamePrefix();
        }*/
    };
};;window.ComplexeCondition = LocalComplexCondition;})(jQuery);