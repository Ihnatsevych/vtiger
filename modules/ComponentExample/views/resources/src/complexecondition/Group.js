var ComplexeConditionGroup = function(complexeConditionObj, parentGroup) {
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
};