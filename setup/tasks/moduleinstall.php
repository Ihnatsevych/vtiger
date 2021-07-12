<?php
/**
 * @copyright 2016-2017 Redoo Networks GmbH
 * @link https://redoo-networks.com/
 * This file is part of a vTigerCRM module, implemented by Redoo Networks GmbH and must not used without permission.
 */

function moduleinstall($modName, $updateExisting = false) {
    \FlexSuite\Database::checkSequence('vtiger_ws_entity');

    $moduleInstance = Vtiger_Module::getInstance($modName);

    if(!empty($moduleInstance)) {
        if($updateExisting === false) {
            DeployTasks::log('Module ' . $modName . ' already installed - Not updating');
            return;
        } else {
            DeployTasks::log('Module ' . $modName . ' already installed - Updating');
            $package = new \Deploy_PackageUpdate($modName);
            $package->update_Module($moduleInstance);
            return;
        }
    }

    $package = new \Deploy_PackageImport($modName);
    $package->import($moduleInstance);

    DeployTasks::log('Module '.$modName.' installed');
}