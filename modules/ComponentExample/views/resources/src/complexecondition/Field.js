var ComplexeConditionField = function(complexeConditionObj, parentGroup) {
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
};