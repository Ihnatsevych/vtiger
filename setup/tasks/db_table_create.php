<?php
/**
 * @copyright 2016-2017 Redoo Networks GmbH
 * @link https://redoo-networks.com/
 * This file is part of a vTigerCRM module, implemented by Redoo Networks GmbH and must not used without permission.
 */

function db_table_create($tablename, $sql, $callbackIfNew = false) {

    if(\MODDBCheck::existTable($tablename) === false) {
        DeployTasks::log('Create table '.$tablename);

        \MODDBCheck::query($sql);

        if($callbackIfNew !== false && is_callable($callbackIfNew)) {
            $callbackIfNew();
        }
    }

}