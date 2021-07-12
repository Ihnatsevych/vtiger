jQuery(function() {
    var ModuleName = 'Accounts';
    var SourceModule = 'Contacts';

    var FieldSetter = new FlexFieldSetter('.FieldSetter', 'fieldsetter');

    FieldSetter.setMainTargetModule(ModuleName);

    FieldSetter.setMainSourceModule(SourceModule);

    // This define the module, which should be used to load dependencies
    FieldSetter.setScopeName('ComponentExample');

    FieldSetter.setConfiguration(FieldSetterConfiguration);

    FieldSetter.init();
});