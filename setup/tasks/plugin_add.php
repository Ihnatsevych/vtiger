<?php
/**
 * @copyright 2016-2017 Redoo Networks GmbH
 * @link https://redoo-networks.com/
 * This file is part of a vTigerCRM module, implemented by Redoo Networks GmbH and must not used without permission.
 */

function plugin_add($type, $key, $title, $class, $file = '', $order = 50) {
    DeployTasks::log('Add/Update Plugin '.$type.'/'.$key);

    \FlexSuite\PluginHandler::register($type, $key, $title, $class, $file, $order);
}