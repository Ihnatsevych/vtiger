<?php
/**
 * @copyright 2016-2017 Redoo Networks GmbH
 * @link https://redoo-networks.com/
 * This file is part of a vTigerCRM module, implemented by Redoo Networks GmbH and must not used without permission.
 */

function db_table_column($table, $colum, $type, $default = false, $callbackIfNew = false, $resetType = false) {

    MODDBCheck::checkColumn($table, $colum, $type, $default, $callbackIfNew, $resetType);

}