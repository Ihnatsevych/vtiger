jQuery(function() {
    var ModuleName = 'Accounts';
    var SourceModule = 'Contacts';

    // This ModuleName is used to load additional data from ComplexConditions, like the ModuleFields Action
    var ScopeName = 'ComponentExample';

    var objCondition = new ComplexeCondition('.ReportConditionContainer', 'settings[condition]');

    objCondition.setTranslation({
        'LBL_STATIC_VALUE' : 'static value',
        'LBL_FUNCTION_VALUE' : 'function',
        'LBL_EMPTY_VALUE' : 'empty value',
        'LBL_VALUES' : 'values',
        'LBL_ADD_GROUP' : 'add Group',
        'LBL_ADD_CONDITION' : 'add Condition',
        'LBL_REMOVE_GROUP' : 'remove Group',
        'LBL_NOT' : 'NOT',
        'LBL_AND' : 'AND',
        'LBL_OR' : 'OR',
        'LBL_COND_EQUAL' : 'LBL_COND_EQUAL',
        'LBL_COND_IS_CHECKED' : 'LBL_COND_IS_CHECKED',
        'LBL_COND_CONTAINS' : 'LBL_COND_CONTAINS',
        'LBL_COND_BIGGER' : 'LBL_COND_BIGGER',
        'LBL_COND_DATE_EMPTY' : 'LBL_COND_DATE_EMPTY',
        'LBL_COND_LOWER' : 'LBL_COND_LOWER',
        'LBL_COND_STARTS_WITH' : 'LBL_COND_STARTS_WITH',
        'LBL_COND_ENDS_WITH' : 'LBL_COND_ENDS_WITH',
        'LBL_COND_IS_EMPTY' : 'LBL_COND_IS_EMPTY',
        'LBL_CANCEL' : 'LBL_CANCEL',
        'LBL_SAVE': 'LBL_SAVE'
    });

    objCondition.setEnabledTemplateFields(true);

    /**
     * This define the module, which should be checked
     */
    objCondition.setMainCheckModule(ModuleName);

    /**
     * This define the module, which provide variables.
     * If not set only functions will be shown as template selection
     */
    objCondition.setMainSourceModule(SourceModule);

    // We use the condition to execute ConditionCheck
    // mode = "mysql" would open opportunity to generate mysql query
    objCondition.setConditionMode('field');

    /*
        This call define the scope, where all resources should be loaded from
        Must be a valid ModuleName
     */
    objCondition.setScopeName(ScopeName);

    // You can define your own image path for images used in conditions
    // Per default this is also set by ComplexeCondition.setCopeName to "modules/<Scope-Name>/views/resources/img/"
    // objCondition.setImagePath("modules/RedooReports/views/img/");

    //objCondition.enableValueModifier();

    objCondition.disableConditionMode();

    // Has to return an Promise or array
    // Promise must resolve also with array
    // array structure:
    // { picklistValue1: label1, picklistValue2: label2, ... }
    // This allow to pass custom fields as picklists

    /*
    objCondition.setPicklistCallback($.proxy(function(field, callback) {
        // For example:
            var aDeferred = $.Deferred();

            RedooAjax('ScopeName').postAction('LoadPicklist', {
                fieldname: field,
            }, 'json').then($.proxy(function (response) {
                aDeferred.resolveWith({}, [ response ]);
            }, this));
            return aDeferred.promise();

        // Other example:
            return {'picklistValue':'option Label1', 'picklistValue1':'option Label 2'};
    }, this));
    */

    /**
     * When you use custom fields, you need also to define a function to return field type
     * Parameter field contains the fieldname
     * Must return one of the following options:
     *      multipicklist
     *      picklist
     *      owner
     *      boolean
     *      date
     *      datetime
     *      reference
     */
    /*
    objCondition.setFieldTypeCallback(function(field) {
        if(typeof field === 'undefined') return 'string';
        if(field == '') return 'string';

        return 'picklist';
    });
    */

    /**
     * You can load operators manually and push them
     * Must be result of ConditionPlugin::getAvailableOperators("moduleName", "conditionMode");
     *
     * If not set, the Action ComplexeCondtion must be available
     */
    /*
        objCondition.setConditionOperators(AvailableConditionOperators);
    */

    /**
     * This function define the prefix of input names
     */
    objCondition.setFieldnamePrefix("fieldconfig");

    /**
     * You are able to set a custom field selection or define preloaded fields
     * If not set, fields are loaded from ComplexeCondition action, which must be available
     *
     * You can set an object, which must match result of VtUtils::getFieldsWithBlocksForModule("moduleName") function
     *
     * You can also define a function, which must return an array of fields. This return value is pushed into select query functions callback. (Check Select2 docu "Loading Data")
     *      Every index of this returned array must have an "id" and a "text" key
     * This case also require you implement the search for yourself. So please only return value, which match the user input in "term" parameter
     * Because in case of initialization a field must also be loaded, the second parameter is given.
     * If this is true, please return only an object with "id" and "text", which match term parameter
     *
     */
    /*
    objCondition.setModuleFields(function (term, loadSingleField) {
        if(typeof loadSingleField === 'undefined') loadSingleField = false;

        if(loadSingleField === false) {

            $.each(rawData, function (blockLabel, fields) {
                data.results.push({
                    'text': blockLabel,
                    'children': fields
                });
            });

        } else {
            if(term == '') return {};

            return {
                'id': term,
                'text': "FieldLabel"
            };

        }

        return data;
    });
    */

    // This define the initialized condition
    objCondition.setCondition(InitReportCondition);

    // THis call start the complete ComplexeCondition initialization
    objCondition.init();
});