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

};