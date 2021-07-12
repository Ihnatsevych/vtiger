<?php

function module_delete($moduleName) {

    $moduleInstance = Vtiger_Module::getInstance($moduleName);

    if (!$moduleInstance) {
        DeployTasks::log('Module '.$moduleName.' not found');
    } else {
        DeployTasks::log('Module '.$moduleName.' deleted');

        $moduleInstance->delete();
    }
}