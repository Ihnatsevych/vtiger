var AvailableVariables = false;
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

};