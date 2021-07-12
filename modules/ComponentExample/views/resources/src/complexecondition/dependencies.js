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
}