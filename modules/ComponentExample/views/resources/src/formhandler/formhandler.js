    window.FORMGeneratorInstance = function() {
        this.storage = {
            'setter': {},
            'oninit': {},
            'config': {},
            'getter': {}
        };
        this.container = null;
        this.validators = {};

        this.setContainer = function(container) {
            this.container = $(container);
        };

        this.registerGetter = function(name, callback) {
            this.storage['getter'][name] = callback;
        };

        this.registerInit = function(name, callback) {
            if($('.FORMHANDLERSTYLES').length === 0) {
                $('body').append('<style type="text/css" class="FORMHANDLERSTYLES">' + CSS + '</style>');
            }

            this.storage['oninit'][name] = callback;
        };

        this.setValidators = function(validators) {
            this.validators = validators;
        };

        this.isValid = function() {
            var data = this.getValues();

            var validateResult = validate(
                data,
                this.validators,
                {
                    fullMessages: false
                }
            );

            this.container.find('.errorMsg').hide();
            this.container.find('.validate-error').removeClass('validate-error');

            if(typeof validateResult === 'undefined') {
                return true;
            } else {
                jQuery.each(validateResult, $.proxy(function(fieldName, errors) {
                    this.getInput(fieldName).addClass('validate-error');
                    this.getInput(fieldName).find('.errorMsg').html('<i class="fa fa-exclamation-triangle" aria-hidden="true"></i>&nbsp;' + errors.join('<br/><i class="fa fa-exclamation-triangle" aria-hidden="true"></i>&nbsp;')).show();
                }, this));

                return false;
            }
        };

        this.registerSetter = function(name, callback) {
            this.storage['setter'][name] = callback;
        };

        this.init = function(values) {

            $.each(this.storage['oninit'], $.proxy(function(index, ele) {
                var INPUT = $('.FormGenField[data-fieldname="' + index + '"]', this.container);

                ele(INPUT);
            }, this));

            $('.FormGenTabBtn ', this.container).on('click', $.proxy(function($event) {
                var targetEle = $($event.currentTarget);

                $('li.ActiveFormTab').removeClass('ActiveFormTab');
                targetEle.addClass('ActiveFormTab');

                var target = targetEle.data('target');

                $('.FormGenTab.ActiveFormGenTab').removeClass('ActiveFormGenTab');
                $('.FormGenTab#' + target).addClass('ActiveFormGenTab');

                if ($('.FormGenTabBtn', this.container).length > 0) {
                    var tabs = $('.FormGenTabBtn', this.container);

                    if ($('.ActiveFormTab', tabs).length == 0) {
                        tabs.find('.FormGenTabBtn ').first().trigger('click');
                    }
                }
            }, this));

            $('.materialstyle input, .materialstyle select, .materialstyle textarea', this.container).off('blur').on('blur', $.proxy(function($event) {
                // check if the input has any value (if we've typed into it)
                var target = $($event.currentTarget);

                if ($(target).val()) {
                    $(target).addClass('used');
                } else {
                    $(target).removeClass('used');
                }

            }, this));

            if(typeof values !== 'undefined') {
                $.each(values, $.proxy(function (field, value) {
                    this.setValue(field, value);
                }, this));
            }

            if(typeof tippy !== 'undefined') {
                tippy('.CC_helpText', { zIndex: 99999, theme: 'flexsuite', maxWidth: 500 });
            }
        };

        this.setValue = function(name, value) {
            if(typeof this.storage['setter'][name] !== 'undefined') {
                var INPUT = $('.FormGenField[data-fieldname="' + name + '"]', this.container);

                this.storage['setter'][name](INPUT, value);
            }
        };

        this.getInput = function(fieldName) {
            return $('.FormGenField[data-fieldname="' + fieldName + '"]', this.container);
        };

        this.getValues = function() {
            var data = {};
            $.each(this.storage.getter, $.proxy(function(name, ele) {
                var INPUT = $('.FormGenField[data-fieldname="' + name + '"]', this.container);

                data[name] = ele(INPUT)
            }, this));

            return data;
        };
    };

    window.FORMGenerator = {
        instance: null,
        start: function() {
            FORMGenerator.instance = new FORMGeneratorInstance();

            return FORMGenerator.instance;
        },

        registerGetter: function(name, callback) {
            FORMGenerator.instance.registerGetter(name, callback);
        },

        registerInit: function(name, callback) {
            FORMGenerator.instance.registerInit(name, callback);
        },

        registerSetter: function(name, callback) {
            FORMGenerator.instance.registerSetter(name, callback);
        },

        init: function(values) {

            FORMGenerator.instance.init(values);
        },

        setValue:function(name, value) {
            FORMGenerator.instance.setValue(name, value);
        }
    };

    window.EditorHandler = {
        storage: {
            'setter': {},
            'oninit': {},
            'config': {}
        },
        _getInput:function(name) {
            return $('.EventEditorInputField[data-field="' + name + '"]');
        },
        setter:function(name, callback) {
            window.EditorHandler['storage']['setter'][name] = callback;
        },
        config:function(name, config) {
            if(typeof config === 'undefined' && typeof window.EditorHandler['storage']['config'][name] != 'undefined') {
                return window.EditorHandler['storage']['config'][name];
            }

            window.EditorHandler['storage']['config'][name] = config;
        },
        oninit:function(name, callback) {
            window.EditorHandler['storage']['oninit'][name] = callback;
        },
        clear:function() {
            EditorHandler.storage = {
                'setter': {},
                'oninit': {},
                'config': {}
            };
        },
        init:function() {
            $.each(EditorHandler.storage.oninit, function(index, ele) {
                ele(index);
            });
        },
        setValue:function(name, value) {
            if(typeof window.EditorHandler['storage']['setter'][name] != 'undefined') {
                window.EditorHandler['storage']['setter'][name](name, value);
            }
        },
        setText:function(name, value) {
            var input = EditorHandler._getInput(name);

            input.val(value).trigger('blur');
        },
        setSelect2:function(name, value) {
            var input = EditorHandler._getInput(name);

            input.select2('val', value).trigger('blur');
        },
        setDate:function(name, value) {
            var input = EditorHandler._getInput(name);

            input.data('mydatepicker').setDate(new Date(value));
            input.val(input.data('mydatepicker').getFormatedDate()).trigger('blur');
        },
        initRecordlist:function(name) {
            var input = EditorHandler._getInput(name);
            var config = EditorHandler.config(name);

            input.select2({
                placeholder: "Enter text to search Records",
                width:'100%',
                minimumInputLength: 1,
                multiple:true,
                separator: ";#;",
                initSelection: function (element, callback) {
                    var parts = jQuery(element).val().split(',');
                    var data = [];

                    jQuery.each(parts, function(index, id) {
                        data.push({
                            id: id,
                            text: productCache[id]['label']
                        });
                    });

                    callback(data);
                },
                query: function (query) {
                    var data = {
                        query: query.term,
                        page: query.page,
                        pageLimit: 25,
                        fieldtype:config.fieldtype
                    };

                    jQuery.post("index.php?module=RedooMessaging&action=RecordList", data, function (results) {
                        query.callback(results);
                    }, 'json');

                }
            });
        },
        enableCKEditor:function(name) {
            var input = EditorHandler._getInput(name);

            CKEDITOR.addCss( 'body { margin:8px; } p { margin:0;}' );

            input.ckeditor({
                // basePath: 'modules/RedooMessaging/views/resources/ckeditor-4.7.3/',
                skin: 'moono-lisa',
                toolbar: [
                    { name: 'document', items: [ 'Source' ] },
                    { name: 'clipboard', items: [ 'Undo', 'Redo' ] },

                    { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'RemoveFormat' ] },
                    { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ] },
                    { name: 'links', items: [ 'Link', 'Unlink' ] },
                    { name: 'insert', items: [ 'Image', 'Table', 'HorizontalRule' ] },
                    { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
                    { name: 'about', items: [ 'About' ] }
                ]
            });
        },
        enableTimepicker:function(name) {
            var input = EditorHandler._getInput(name);

            var Timepicker = input.timepicker({
                className:'RedooCalendarTimepicker',
                timeFormat: CurrentUserHourFormat == '12' ? 'g:i A' : 'G:i',
                step:15,
                relationField: typeof window.EditorHandler['storage']['config'][name]['relation'] != '' ? window.EditorHandler['storage']['config'][name]['relation'] : '',
                showDuration: false,
                lang: {
                    'am': 'am',
                    'pm': 'pm',
                    'AM': 'AM',
                    'PM': 'PM',
                    'decimal': '.',
                    'mins': 'mins',
                    'hr': 'hr',
                    'hrs': 'hrs'
                },
                durationTime:function() {
                    if(this.relationField != '') {
                        var value = EditorHandler._getInput(this.relationField).val();

                        if(value == '') return false;

                        return value;
                    }

                    return false;
                }
            });

            if(typeof window.EditorHandler['storage']['config'][name]['relation'] != '') {
                Timepicker.on('changeTime', function(e) {
                    var field = $(this).data('field');
                    var relationField = window.EditorHandler['storage']['config'][field]['relation'];

                    var input = EditorHandler._getInput(relationField);

                    if(input.val() == '') {
                        input.val($(this).val()).trigger('blur');
                    }
                    input.timepicker('option', 'showDuration', true);
                    // console.log(this);
                });
            }
        },
        enableDatepicker:function(name) {
            return;
            var input = EditorHandler._getInput(name);

            myCalendar = new dhtmlXCalendarObject([input[0]]);
            myCalendar.hideTime();
            myCalendar.setDateFormat(CurrentUserDatePickerFormat);

            input.data('mydatepicker', myCalendar);
        }
    };

