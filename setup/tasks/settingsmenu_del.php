<?php
/**
 * @copyright 2016-2017 Redoo Networks GmbH
 * @link https://redoo-networks.com/
 * This file is part of a vTigerCRM module, implemented by Redoo Networks GmbH and must not used without permission.
 */

function settingsmenu_del($linkto) {

    $sql = "DELETE FROM vtiger_settings_field WHERE linkto = ?";
    \MODDBCheck::pquery($sql, array($linkto));

    DeployTasks::log('Settings Field '.$linkto.' removed');

}