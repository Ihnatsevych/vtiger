function storeLicense() {
    if(jQuery('#licensecode').val() == '') {
        return;
    }

    var params = {
        module: 'ComponentExample',
        action: 'SetLicense',
        parent: 'Settings',
        dataType: 'json',
        license: jQuery('#licensecode').val()
    };
    if(window.location.search.indexOf('stefanDebug=1') != -1) {
        params['stefanDebug'] = 1;
    }

    AppConnector.request(params).then(function(data) {
        if(data.result.success == false) {
            jQuery('#licenseError').html(data.result.error).show();
        } else {
            window.location.reload();
        }
    }).fail(function(data, data2, data3) {
        jQuery('#licenseError').html('Unexpected error:<br/><br/>' + data2.message).show();
    });

}
function refreshLicense() {
    jQuery.post('index.php', {module:'ComponentExample', parent:'Settings', action:'LicenseRefresh'}, function() {
        window.location.reload();
    });
}
function removeLicense() {
    jQuery.post('index.php', {module:'ComponentExample', parent:'Settings', action:'LicenseRemove'}, function() {
        window.location.reload();
    });
}