/**
 * RedooUtils V2.1.01
 * 2.0.01 - VT7 Compatibility
 *        - add RedooUtils.onFieldChange method
 *        - add RedooUtils.onRelatedListChange method
 *        - add RedooUtils.isVT7 method
 *        - add RedooUtils.Signal Implementation
 *        - add global RedooEvents
 * 1.0.11 - Make postAction / postView settings flag optional
 *          Add wrong Ajax Response error output
 * 1.0.10 - Add getRecordLabels function
 * 1.0.9  - Add fillFieldSelect, loadStyles functions
 * 1.0.8  - Add returnInput Parameter to getFieldElement function
 * 1.0.7  - Add RedooUtils.loadScript
 */
(function($) {
    var ScopeName = 'ComponentExample';
    var Version = '2.0.01';

    var _RedooCache = {
        'FieldCache': {},
        'FieldLoadQueue': {},
        'viewMode':false,
        'popUp':false
    };
    var RedooCache = {
        get: function(key, defaultValue) {
            if(typeof _RedooCache[key] != 'undefined') {
                return _RedooCache[key];
            }
            return defaultValue;
        },
        set: function(key, value) {
            _RedooCache[key] = value;
        }
    };

    var RedooUtils = {
        layout:'vlayout',
        currentLVRow:null,
        isVT7:function() {
            return typeof app.helper !== 'undefined';
        },
        onRelatedListChange: function() {
            if(RedooCache.get('__onRelatedListChangeSignal', false) == false) {
                var aSignal = new RedooUtils.Signal();

                app.event.on("post.relatedListLoad.click",function(e, container) {
                    aSignal.dispatch(container);
                });

                RedooCache.set('__onRelatedListChangeSignal', aSignal);
            }

            return RedooCache.get('__onRelatedListChangeSignal');
        },
        // Will register an event, when a field is changed
        onFieldChange: function(parentEle) {
            // Only register one signal for FieldChanges

            if(RedooCache.get('__onFieldChangeSignal', false) == false) {
                var aSignal = new RedooUtils.Signal();

                if (RedooUtils.isVT7()) {
                    app.event.on(Vtiger_Detail_Js.PostAjaxSaveEvent, function (e, fieldBasicData, postSaveRecordDetails, contentHolder) {
                        aSignal.dispatch(
                            {
                                name: fieldBasicData.data('name'),
                                new: postSaveRecordDetails[fieldBasicData.data('name')].value
                            },
                            fieldBasicData,
                            postSaveRecordDetails,
                            contentHolder
                        );
                    });
                } else {
                    if (typeof parentEle == 'undefined') parentEle = RedooUtils._getDefaultParentEle();

                    var thisInstance = Vtiger_Detail_Js.getInstance();
                    var ele = RedooUtils.getFieldElement(fieldName, parentEle, true);

                    parentEle.on(thisInstance.fieldUpdatedEvent, function (e, params) {
                        params.name = jQuery(e.target).attr("name");

                        a.aSignal.dispatch(params);
                    });
                }
                RedooCache.set('__onFieldChangeSignal', aSignal);
            } else {
                aSignal = RedooCache.get('__onFieldChangeSignal');
            }

            return aSignal;
        },
        getRecordLabels: function(ids) {
            var aDeferred = jQuery.Deferred();

            var newIds = [];
            var LabelCache = RedooCache.get('LabelCache', {});
            jQuery.each(ids, function(index, value) {
                if(typeof LabelCache[value] == 'undefined') {
                    newIds.push(value);
                }
            });

            if(newIds.length > 0) {
                RedooAjax.postAction('RecordLabel', {
                    ids         : newIds,
                    'dataType'  :'json'
                }).then(function(response) {
                    jQuery.each(response.result, function(id, value) {
                        LabelCache[id] = value;
                    });
                    RedooCache.set('LabelCache', LabelCache);

                    aDeferred.resolveWith({}, [LabelCache]);
                });
            } else {
                aDeferred.resolveWith({}, [LabelCache]);
            }


            return aDeferred.promise();
        },
        getFieldList: function (moduleName) {
            if(typeof fieldtype == 'undefined') fieldtype = '';
            var aDeferred = jQuery.Deferred();

            if(typeof _RedooCache['FieldLoadQueue'][moduleName] != 'undefined') {
                return _RedooCache['FieldLoadQueue'][moduleName];
            }

            _RedooCache['FieldLoadQueue'][moduleName] = aDeferred;

            if(typeof _RedooCache.FieldCache[moduleName] != 'undefined') {
                aDeferred.resolve(_RedooCache.FieldCache[moduleName]);
                return aDeferred.promise();
            }
            console.log('fieldtype', fieldtype);

            RedooAjax.post('index.php', {
                'module': ScopeName,
                'parent': 'Settings',
                'action': 'GetFieldList',
                'module_name': moduleName
            }, 'json').then(function (data) {
                _RedooCache.FieldCache[moduleName] = data;
                aDeferred.resolve(data.fields);
            });

            return aDeferred.promise();
        },
        filterFieldListByFieldtype: function(fields, fieldtype) {
            var result = {};

            jQuery.each(fields, function(blockLabel, fields) {
                var block = [];

                jQuery.each(fields, function(fieldName, fieldData) {
                    if(fieldData.type == fieldtype) {
                        block.push(fieldData)
                    }
                });
                if(block.length > 0) {
                    result[blockLabel] = block;
                }
            });

            return result;
        },
        fillFieldSelect:function(fieldId, selected, module, fieldtype) {
            if(typeof fieldtype == 'undefined') fieldtype = '';
            if(typeof module == 'undefined') module = moduleName;
            if(typeof selected == 'string') selected = [selected];

            RedooUtils.getFieldList(module, fieldtype).then(function(fields) {
                if(fieldtype != '') {
                    fields = RedooUtils.filterFieldListByFieldtype(fields, fieldtype);
                }
                var html = '';
                jQuery.each(fields, function(blockLabel, fields) {
                    html += '<optgroup label="' + blockLabel + '">';
                    jQuery.each(fields, function(index, field) {

                        html += '<option value="' + field.name + '" ' + (jQuery.inArray(field.name, selected) != -1 ? 'selected="selected"' : '') + '>' + field.label + '</option>';
                    });
                    html += '</optgroup>';

                    jQuery('#' + fieldId).html(html);
                    if(jQuery('#' + fieldId).hasClass('select2')) {
                        jQuery('#' + fieldId).select2('val', selected);
                    }
                    jQuery('#' + fieldId).trigger('FieldsLoaded');
                });
            });
        },
        _getDefaultParentEle: function() {
            return 'div#page';
        },
        getMainModule:function (parentEle) {
            if(RedooUtils.isVT7()) {
                return RedooUtils._getMainModuleVT7(parentEle);
            } else {
                return RedooUtils._getMainModuleVT6(parentEle);
            }
        },
        _getMainModuleVT6 : function (parentEle) {
            if(typeof parentEle == 'undefined') parentEle = RedooUtils._getDefaultParentEle();
            var viewMode = RedooUtils.getViewMode(parentEle);

            if (viewMode == 'detailview' || viewMode == 'summaryview') {
                return $('#module', parentEle).val();
            } else if (viewMode == 'editview' || viewMode == 'quickcreate') {
                return $('[name="module"]', parentEle).val();
            } else if (viewMode == 'listview') {
                return $('#module', parentEle).val();
            } else if (viewMode == 'relatedview') {
                if ($('[name="relatedModuleName"]', parentEle).length > 0) {
                    return $('[name="relatedModuleName"]', parentEle).val();
                }
                if ($('#module', parentEle).length > 0) {
                    return $('#module', parentEle).val();
                }
            }
            return '';
        },
        _getMainModuleVT7 : function (parentEle) {
            if(typeof parentEle == 'undefined') parentEle = RedooUtils._getDefaultParentEle();
            var viewMode = RedooUtils.getViewMode(parentEle);

            if(
                typeof _META != 'undefined' &&
                (
                    viewMode == 'detailview' ||
                    viewMode == 'summaryview' ||
                    viewMode == 'commentview' ||
                    viewMode == 'historyview' ||
                    viewMode == 'editview'
                ) &&
                (
                    typeof parentEle == 'string' &&
                    parentEle == RedooUtils._getDefaultParentEle()
                ) ||
                (
                    typeof parentEle == 'object' &&
                    parentEle.attr('id') == 'page'
                )
            ) {
                return _META.module;
            } else {
                if (viewMode == 'detailview' || viewMode == 'summaryview' || viewMode == 'editview') {
                    return $('#module', parentEle).val();
                } else if (viewMode == 'editview' || viewMode == 'quickcreate') {
                    return $('[name="module"]', parentEle).val();
                } else if (viewMode == 'listview') {
                    return $('#module', parentEle).val();
                } else if (viewMode == 'relatedview') {
                    if ($('[name="relatedModuleName"]', parentEle).length > 0) {
                        return $('[name="relatedModuleName"]', parentEle).val();
                    }
                    if ($('#module', parentEle).length > 0) {
                        return $('#module', parentEle).val();
                    }
                }
            }
            return '';
        },
        getRecordIds: function(parentEle) {
            if(typeof parentEle == 'undefined') parentEle = RedooUtils._getDefaultParentEle();
            var recordIds = [];
            var viewMode = RedooUtils.getViewMode(parentEle);

            if(viewMode == 'detailview' || viewMode == 'summaryview') {
                recordIds.push($('#recordId', parentEle).val());
            } else if(viewMode == 'quickcreate') {
                // do nothing
            } else if(viewMode == 'editview') {
                recordIds.push($('[name="record"]').val());
            } else if(viewMode == 'listview') {
                $('.listViewEntries').each(function(index, value) {
                    recordIds.push($(value).data('id'));
                });
            } else if(viewMode == 'relatedview'){
                $('.listViewEntries').each(function(index, value) {
                    recordIds.push($(value).data('id'));
                });
            }

            return recordIds;
        },
        getViewMode:function (parentEle) {
            if(RedooUtils.isVT7()) {
                return RedooUtils._getViewModeVT7(parentEle);
            } else {
                return RedooUtils._getViewModeVT6(parentEle);
            }
        },

        _getViewModeVT6: function(parentEle) {
            if(typeof parentEle == 'undefined') parentEle = RedooUtils._getDefaultParentEle();

            var viewEle = $("#view", parentEle);

            _RedooCache.viewMode = false;

            if(viewEle.length > 0 && viewEle[0].value == "List") {
                _RedooCache.viewMode = "listview";
            }

            if($(".detailview-table", parentEle).length > 0) {
                _RedooCache.viewMode = "detailview";
            } else if($(".summaryView", parentEle).length > 0) {
                _RedooCache.viewMode = "summaryview";
            } else if($(".recordEditView", parentEle).length > 0) {
                if($('.quickCreateContent', parentEle).length == 0) {
                    _RedooCache.viewMode = "editview";
                } else {
                    _RedooCache.viewMode = "quickcreate";
                }
            }

            if($('.relatedContents', parentEle).length > 0) {
                _RedooCache.viewMode = "relatedview";

                if($('td[data-field-type]', parentEle).length > 0) {
                    _RedooCache.popUp = false;
                } else {
                    _RedooCache.popUp = true;
                }
            }

            if(_RedooCache.viewMode === false) {
                if($('#view', parentEle).length > 0) {
                    if($('#view', parentEle).val() == 'Detail') {
                        _RedooCache.viewMode = 'detailview';
                    }
                }
            }

            return _RedooCache.viewMode;
        },
        _getViewModeVT7: function(parentEle) {
            if(typeof parentEle == 'undefined') parentEle = RedooUtils._getDefaultParentEle();

            _RedooCache.viewMode = false;

            if ($(".detailview-table", parentEle).length > 0) {
                _RedooCache.viewMode = "detailview";
            } else if ($(".summaryView", parentEle).length > 0) {
                _RedooCache.viewMode = "summaryview";
            } else if ($(".recordEditView", parentEle).length > 0) {
                if ($('.quickCreateContent', parentEle).length == 0) {
                    _RedooCache.viewMode = "editview";
                } else {
                    _RedooCache.viewMode = "quickcreate";
                }
            } else if($(".commentsRelatedContainer", parentEle).length > 0) {
                _RedooCache.viewMode = "commentview";
            } else if($(".HistoryContainer", parentEle).length > 0) {
                _RedooCache.viewMode = "historyview";
            } else if (jQuery('.relatedContainer', parentEle).find('.relatedModuleName').length > 0) {
                _RedooCache.viewMode = "relatedview";
            } else if (jQuery('.listViewContentHeader', parentEle).length > 0 && typeof _META != 'undefined' && _META.view == 'List') {
                _RedooCache.viewMode = "listview";
            }


            if (_RedooCache.viewMode === false) {
                if ($('#view', parentEle).length > 0) {
                    if ($('#view', parentEle).val() == 'Detail') {
                        _RedooCache.viewMode = 'detailview';
                    }
                }
            }

            return _RedooCache.viewMode;
        },
        showModalBox:function(content) {
            var aDeferred = jQuery.Deferred();

            app.showModalWindow(content, function(data) {
                aDeferred.resolveWith(window, data);
            });

            return aDeferred.promise();
        },
        getFieldElement:  function(fieldName, parentEle, returnInput) {
            if(typeof parentEle == 'undefined' || parentEle == null) parentEle = RedooUtils._getDefaultParentEle();
            if(typeof returnInput == 'undefined') returnInput = false;

            if(typeof fieldName == "object") {
                return fieldName;
            }
            var fieldElement = false;

            if(RedooUtils.getViewMode(parentEle) == "detailview") {
                if($('#' + RedooUtils.getMainModule(parentEle) + '_detailView_fieldValue_' + fieldName, parentEle).length > 0 || $('#Events_detailView_fieldValue_' + fieldName, parentEle).length > 0) {
                    fieldElement = $('#' + RedooUtils.getMainModule(parentEle) + '_detailView_fieldValue_' + fieldName);

                    if(RedooUtils.getMainModule(parentEle) == 'Calendar' && fieldElement.length == 0) {
                        fieldElement = $('#Events_detailView_fieldValue_' + fieldName, parentEle);
                    }
                } else if($('#_detailView_fieldValue_' + fieldName, parentEle).length > 0) {
                    fieldElement = $('#_detailView_fieldValue_' + fieldName, parentEle);
                }
            } else if(RedooUtils.getViewMode(parentEle) == "summaryview") {
                var ele = $('[name="'+fieldName+'"]', parentEle);

                /*if(ele.length == 0) {
                 if(typeof this.summaryFields[fieldName] != 'undefined') {
                 fieldElement = $($(RedooUtils.layout == 'vlayout' ? '.summary-table td.fieldValue' : '.summary-table div.mycdivfield')[this.summaryFields[fieldName] - 1]);
                 } else {
                 return false;
                 }
                 } else {*/
                fieldElement = $(ele[0]).closest(RedooUtils.layout == 'vlayout' ? 'td' : 'div.mycdivfield');
                //}
            } else if(RedooUtils.getViewMode(parentEle) == "editview" || RedooUtils.getViewMode(parentEle) == 'quickcreate') {
                var ele = $('[name="' + fieldName + '"]', parentEle);

                if(ele.length == 0) {
                    return false;
                }

                if(returnInput == true) {
                    return ele;
                }

                fieldElement = $(ele[0]).closest(RedooUtils.layout == 'vlayout' ? '.fieldValue' : 'div.mycdivfield');
            } else if(RedooUtils.getViewMode(parentEle) == 'listview') {
                if(RedooUtils.listViewFields === false) {
                    RedooUtils.listViewFields = RedooUtils.getListFields(parentEle);
                }

                if (RedooUtils.currentLVRow !== null) {
                    if(typeof RedooUtils.listViewFields[fieldName] != 'undefined') {
                        if (RedooUtils.listViewFields[fieldName] >= 0) {
                            fieldElement = $($('td.listViewEntryValue', RedooUtils.currentLVRow)[RedooUtils.listViewFields[fieldName]]);
                        } else {
                            fieldElement = $($('td.listViewEntryValue', RedooUtils.currentLVRow)[Number(RedooUtils.listViewFields[fieldName] + 100) * -1]);
                        }

                    } else {
                        return false;
                    }
                } else {
                    return false;
                }

            } else if(RedooUtils.getViewMode() == 'relatedview') {
                if(RedooUtils.listViewFields === false) {
                    RedooUtils.listViewFields = RedooUtils.getListFields(parentEle);
                }

                if($('td[data-field-type]', RedooUtils.currentLVRow).length > 0) {
                    fieldElement = $($('td[data-field-type]', RedooUtils.currentLVRow)[RedooUtils.listViewFields[fieldName]]);
                } else {
                    fieldElement = $($('td.listViewEntryValue', RedooUtils.currentLVRow)[RedooUtils.listViewFields[fieldName]]);
                }
            }

            return fieldElement;
        },
        getListFields: function(parentEle) {
            var cols = jQuery(".listview-table .listViewContentHeaderValues", parentEle);

            var listViewFields = {};
            for(var colIndex in cols ) {
                if (cols.hasOwnProperty(colIndex) && jQuery.isNumeric(colIndex)) {
                    var value = cols[colIndex];

                    if(jQuery(value).data("columnname") == undefined) {
                        listViewFields[jQuery(value).data("fieldname")] = colIndex;
                    } else {
                        listViewFields[jQuery(value).data("columnname")] = colIndex;
                    }
                }
            }

            return listViewFields;
        },
        loadStyles:function(urls, nocache) {
            if(typeof urls == 'string') urls = [urls];
            var aDeferred = jQuery.Deferred();
            if (typeof nocache=='undefined') nocache=false; // default don't refresh
            $.when.apply($,
                $.map(urls, function(url){
                    if (nocache) url += '?_ts=' + new Date().getTime(); // refresh?
                    return $.get(url, function(){
                        $('<link>', {rel:'stylesheet', type:'text/css', 'href':url}).appendTo('head');
                    });
                })
            ).then(function(){
                aDeferred.resolve();
            });

            return aDeferred.promise();
        },
        loadScript:function(url, options) {
            var aDeferred = jQuery.Deferred();
            if(typeof RedooCache.loadedScript == 'undefined') {
                RedooCache.loadedScript = {};
            }
            if(typeof RedooCache.loadedScript[url] != 'undefined') {
                aDeferred.resolve();
                return aDeferred;
            }

            // Allow user to set any option except for dataType, cache, and url
            options = jQuery.extend( options || {}, {
                dataType: "script",
                cache: true,
                url: url
            });

            // Use $.ajax() since it is more flexible than $.getScript
            // Return the jqXHR object so we can chain callbacks
            return jQuery.ajax( options );
        }
    };

    var RedooAjax = {
        postAction: function(actionName, params, settings, dataType) {
            params.module = ScopeName;
            params.action = actionName;

            if(typeof dataType == 'undefined' && typeof settings == 'string') {
                dataType = settings;
                settings = false;
            }
            if(typeof settings != 'undefined' && settings == true) {
                params.parent = 'Settings';
            }

            return RedooAjax.post('index.php', params, dataType);
        },
        postView: function(viewName, params, settings, dataType) {
            params.module = ScopeName;
            params.view = viewName;

            if(typeof dataType == 'undefined' && typeof settings == 'string') {
                dataType = settings;
                settings = false;
            }
            if(typeof settings != 'undefined' && settings == true) {
                params.parent = 'Settings';
            }

            return RedooAjax.post('index.php', params, dataType);
        },
        /**
         *
         * @param url URL to call
         * @param params Object with POST parameters
         * @param dataType Single value of datatype if not set in params
         * @returns {*}
         */
        post: function (url, params, dataType) {
            var aDeferred = jQuery.Deferred();

            if (typeof url == 'object') {
                params = url;
                url = 'index.php';
            }

            if (typeof callback != 'undefined') {
                aDeferred.then(callback)
                //callback = function(data) { };
            }
            if (typeof params == 'undefined') {
                params = {};
            }
            if (typeof dataType == 'undefined' && typeof params.dataType != 'undefined') {
                dataType = params.dataType;
            }

            var options = {
                url: url,
                data: params
            };

            if (typeof dataType != 'undefined') {
                options.dataType = dataType;
            }
            options.dataType = undefined;

            options.type = 'POST';

            jQuery.ajax(options)
                .always(function (data) {
                    if (typeof dataType != 'undefined' && dataType == 'json') {
                        try {
                            data = jQuery.parseJSON( data );
                        } catch (e) {
                            jQuery.unblockUI();

                            console.error('RedooAjax Error - Should: JSON Response:');
                            console.log(data);

                            var height = 10;
                            jQuery('.RedooAjaxError').each(function(index, ele) {
                                height += jQuery(ele).height() + 30;
                            });

                            var id = 'error_' + (Math.floor(Math.random() * 1000000));
                            var content = data.substr(0,500).replace(/</g, '&lt;').replace(/\\(.?)/g, function (s, n1) {
                                switch (n1) {
                                    case '\\':
                                        return '\\'
                                    case '0':
                                        return '\u0000'
                                    case '':
                                        return ''
                                    default:
                                        return n1
                                }
                            });

                            if(data.length > 500) {
                                content += ' .....<em>shortened</em>....... ' + data.substr(-500).replace(/</g, '&lt;').replace(/\\(.?)/g, function (s, n1) {
                                        switch (n1) {
                                            case '\\':
                                                return '\\'
                                            case '0':
                                                return '\u0000'
                                            case '':
                                                return ''
                                            default:
                                                return n1
                                        }
                                    });
                            }

                            var html = '<div class="RedooAjaxError" style="word-wrap:break-word;position:fixed;bottom:' + height + 'px;box-sizing:border-box;left:10px;padding:10px;width:25%;background-color:#ffffff;z-index:90000;border:2px solid #C9331E;background-color:#D29D96;" id="' + id + '"><i class="icon-ban-circle" style="margin-top:2px;margin-right:5px;"></i><span style="color:#C9331E;font-weight:bold;">ERROR:</span> ' + e + '<br/><span style="color:#C9331E;font-weight:bold;">Response:</span>' + content + '</div>';
                            jQuery('body').append(html);

                            jQuery('#' + id).on('click', function() {
                                jQuery(this).fadeOut('fast', function() {
                                    jQuery(this).remove();
                                });
                            });
                            /*
                             window.setTimeout(function() {
                             jQuery('#' + id).hide(function() {
                             jQuery(this).remove();
                             })
                             });
                             */

                            //app.showModalWindow(response);
                            return;
                        }
                    }

                    if (typeof data.success != 'undefined') {
                        if (data.success == false && (data.error.code.indexOf('request') != -1)) {
                            if(confirm('Request Error. Reload of Page is required.')) {
                                window.location.reload();
                            }
                            return;
                        }
                    }

                    aDeferred.resolve(data);
                    //callback(data)
                });

            return aDeferred.promise();
        },
        get: function (url, params, dataType) {
            console.error('Vtiger do not support GET Requests');
            return;
            var aDeferred = jQuery.Deferred();

            if (typeof url == 'object') {
                params = url;
                url = 'index.php';
            }

            if (typeof params == 'undefined') {
                params = {};
            }
            if (typeof dataType == 'undefined' && typeof params.dataType != 'undefined') {
                dataType = params.dataType;
            }

            var options = {
                url: url,
                data: params
            };

            if (typeof datatype != 'undefined') {
                options.dataType = dataType;
            }

            options.type = 'GET';

            jQuery.ajax(options)
                .always(function (data) {
                    if (typeof data.success != 'undefined') {
                        if (data.success == false && (data.error.code.indexOf('request') != -1)) {
                            if(confirm('Request Error. Reload of Page is required.')) {
                                window.location.reload();
                            }
                            return;
                        }
                    }

                    aDeferred.resolve(data);
                    //callback(data)
                });

            return aDeferred.promise();
        },
        /**
         * Drop In Replacement for AppConnector.request
         *
         * @param params object
         * @returns {*}
         */
        request: function (params) {
            return RedooAjax.post('index.php', params);
        }
    };

    if(typeof window.RedooStore == 'undefined') {
        window.RedooStore = {};
    }

    window.RedooStore[ScopeName] = {
        'Ajax': RedooAjax,
        'Utils': RedooUtils,
        'Cache': RedooCache
    };

    if(typeof window.RedooAjax == 'undefined') {
        /**
         *
         * @param ScopeName
         * @returns RedooAjax
         * @constructor
         */
        window.RedooAjax = function(ScopeName) {
            if(typeof window.RedooStore[ScopeName] != 'undefined') {
                return window.RedooStore[ScopeName]['Ajax'];
            }
            console.error('RedooAjax ' + ScopeName + ' Scope not found');
        }
    }
    if(typeof window.RedooUtils == 'undefined') {
        /**
         *
         * @param ScopeName
         * @returns RedooUtils
         * @constructor
         */
        window.RedooUtils = function(ScopeName) {
            if(typeof window.RedooStore[ScopeName] != 'undefined') {
                return window.RedooStore[ScopeName]['Utils'];
            }
            console.error('RedooUtils ' + ScopeName + ' Scope not found');
        }
    }
    if(typeof window.RedooCache == 'undefined') {
        /**
         *
         * @param ScopeName
         * @returns RedooUtils
         * @constructor
         */
        window.RedooCache = function(ScopeName) {
            if(typeof window.RedooStore[ScopeName] != 'undefined') {
                return window.RedooStore[ScopeName]['Cache'];
            }
            console.error('RedooCache ' + ScopeName + ' Scope not found');
        }
    }
    if(typeof window.RedooEvents == 'undefined') {
        /**
         *
         * @returns jQuery Eventhandler
         * @constructor
         */
        window.RedooEvents = $({});
    }

    // Dependency
    /*
     JS Signals <http://millermedeiros.github.com/js-signals/>
     Released under the MIT license
     Author: Miller Medeiros
     Version: 1.0.0 - Build: 268 (2012/11/29 05:48 PM)
     */
    function h(a,b,c,d,e){this._listener=b;this._isOnce=c;this.context=d;this._signal=a;this._priority=e||0}function g(a,b){if(typeof a!=="function")throw Error("listener is a required param of {fn}() and should be a Function.".replace("{fn}",b));}function e(){this._bindings=[];this._prevParams=null;var a=this;this.dispatch=function(){e.prototype.dispatch.apply(a,arguments)}}h.prototype={active:!0,params:null,execute:function(a){var b;this.active&&this._listener&&(a=this.params?this.params.concat(a):
        a,b=this._listener.apply(this.context,a),this._isOnce&&this.detach());return b},detach:function(){return this.isBound()?this._signal.remove(this._listener,this.context):null},isBound:function(){return!!this._signal&&!!this._listener},isOnce:function(){return this._isOnce},getListener:function(){return this._listener},getSignal:function(){return this._signal},_destroy:function(){delete this._signal;delete this._listener;delete this.context},toString:function(){return"[SignalBinding isOnce:"+this._isOnce+
        ", isBound:"+this.isBound()+", active:"+this.active+"]"}};e.prototype={VERSION:"1.0.0",memorize:!1,_shouldPropagate:!0,active:!0,_registerListener:function(a,b,c,d){var e=this._indexOfListener(a,c);if(e!==-1){if(a=this._bindings[e],a.isOnce()!==b)throw Error("You cannot add"+(b?"":"Once")+"() then add"+(!b?"":"Once")+"() the same listener without removing the relationship first.");}else a=new h(this,a,b,c,d),this._addBinding(a);this.memorize&&this._prevParams&&a.execute(this._prevParams);return a},
        _addBinding:function(a){var b=this._bindings.length;do--b;while(this._bindings[b]&&a._priority<=this._bindings[b]._priority);this._bindings.splice(b+1,0,a)},_indexOfListener:function(a,b){for(var c=this._bindings.length,d;c--;)if(d=this._bindings[c],d._listener===a&&d.context===b)return c;return-1},has:function(a,b){return this._indexOfListener(a,b)!==-1},add:function(a,b,c){g(a,"add");return this._registerListener(a,!1,b,c)},addOnce:function(a,b,c){g(a,"addOnce");return this._registerListener(a,
            !0,b,c)},remove:function(a,b){g(a,"remove");var c=this._indexOfListener(a,b);c!==-1&&(this._bindings[c]._destroy(),this._bindings.splice(c,1));return a},removeAll:function(){for(var a=this._bindings.length;a--;)this._bindings[a]._destroy();this._bindings.length=0},getNumListeners:function(){return this._bindings.length},halt:function(){this._shouldPropagate=!1},dispatch:function(a){if(this.active){var b=Array.prototype.slice.call(arguments),c=this._bindings.length,d;if(this.memorize)this._prevParams=
            b;if(c){d=this._bindings.slice();this._shouldPropagate=!0;do c--;while(d[c]&&this._shouldPropagate&&d[c].execute(b)!==!1)}}},forget:function(){this._prevParams=null},dispose:function(){this.removeAll();delete this._bindings;delete this._prevParams},toString:function(){return"[Signal active:"+this.active+" numListeners:"+this.getNumListeners()+"]"}};var f=e;f.Signal=e;RedooUtils.Signal = f.Signal;
})(jQuery);
