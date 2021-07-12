<?php
/**
 * @copyright 2016-2017 Redoo Networks GmbH
 * @link https://redoo-networks.com/
 * This file is part of a vTigerCRM module, implemented by Redoo Networks GmbH and must not used without permission.
 */

function plugin_remove($type, $key) {
    DeployTasks::log('Remove Plugin '.$type.'/'.$key);
    \FlexSuite\PluginHandler::remove($type, $key);
}