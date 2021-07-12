<?php
/**
 * @copyright 2016-2017 Redoo Networks GmbH
 * @link https://redoo-networks.com/
 * This file is part of a vTigerCRM module, implemented by Redoo Networks GmbH and must not used without permission.
 */

function db_table_isempty($tablename, $callbackIsEmpty = false) {

    if(\MODDBCheck::existTable($tablename) === false) {
        return false;
    }

    $sql = 'SELECT COUNT(*) as num FROM '.$tablename;
    $result = \MODDBCheck::query($sql);

    if(\MODDBCheck::query_result($result, 0, 'num') == 0) {
        if($callbackIsEmpty !== false && is_callable($callbackIsEmpty)) {
            $callbackIsEmpty();
        }
    }
}