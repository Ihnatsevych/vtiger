class ComplexConditionComponent extends HTMLElement {
    // A getter/setter for an open property.
    get fieldname() {
        return this.getAttribute('name');
    }
    get mode() {
        return this.hasAttribute('mode') ? 'field' : this.getAttribute('mode');
    }
    get scopeName() {
        return this.hasAttribute('scopename') ? this.getAttribute('scopename') : this.module;
    }
    get module() {
        return this.getAttribute('module');
    }

    set module(val) {
        console.log('set module', val);
        // Reflect the value of the open property as an HTML attribute.
        if (val) {
            this.setAttribute('module', '');
        } else {
            this.removeAttribute('module');
        }
        this.toggleDrawer();
    }

    constructor() {
        super();

        var shadowRoot = this.attachShadow({mode: 'open'});

        shadowRoot.innerHTML = '<style type="text/css">' + CSS + `</style><div class="ReportConditionContainer">ASD</div>`;
    }

    connectedCallback() {

        var objCondition = new ComplexeCondition(
            this.shadowRoot.querySelector('.ReportConditionContainer'),
            this.fieldname
        );

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

        objCondition.setMainCheckModule(this.module);

        objCondition.setConditionMode(this.mode);

        objCondition.setScopeName(this.scopeName);

        objCondition.init();
    }
}

window.customElements.define('flex-complexe-condition', ComplexConditionComponent);