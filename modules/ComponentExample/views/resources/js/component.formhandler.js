jQuery(function() {
    $('.OpenFormBtn').on('click', function() {
        var FormgeneratorInstance = FORMGenerator.start();
        FormgeneratorInstance.setContainer('#FormContainerPlace');

        jQuery.post('index.php', {
            module:'ComponentExample',
            view:'GetForm'
        }, function(response) {
            FormgeneratorInstance.setValidators(response.validators);

            jQuery("#FormContainerPlace").html(response.html);

            jQuery.globalEval(response['js']);

            jQuery('#EventEditorSaveBtn').on('click', ($event) => {
                var isValid = FormgeneratorInstance.isValid();
                console.log('isValid: ', isValid);

                if(isValid === true) {
                    let formData = FormgeneratorInstance.getValues();

                    console.log('selectedValues: ', formData);
                }
            });

            FormgeneratorInstance.init(response.data);

        }, 'json');
    });
});
