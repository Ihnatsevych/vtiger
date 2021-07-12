<?php
// Stefan Warnat 2018-02-13
// Install Business Processes Modul

if(!defined('UPDATER')) exit();

task('before',function() {

    DeployTasks::moduleinstall('ComponentExample', true);

    finishUpdate();

});
