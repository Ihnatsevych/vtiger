jQuery(function() {
    jQuery('.OpenConditionPopup').on('click', function() {

        ConditionPopup.open('#ValueElement', jQuery('#moduleSelector').val(), 'Title of Condition', {
            textele: '#TextCondition',
            'defaultText': '<em>No condition</em>'
        });

    });
});