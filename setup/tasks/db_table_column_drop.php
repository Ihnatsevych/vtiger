<?php
/**
 * @copyright 2016-2017 Redoo Networks GmbH
 * @link https://redoo-networks.com/
 * This file is part of a vTigerCRM module, implemented by Redoo Networks GmbH and must not used without permission.
 */

function db_table_column_drop($tablename, $column) {
    $db = PearDatabase::getInstance();

    // Remove unused column from user table
    $columns = $db->getColumnNames('vtiger_users');

    if (in_array('user_hash', $columns)) {
        DeployTasks::log('Drop column '.$tablename.'.'.$column);

        $db->pquery('ALTER TABLE vtiger_users DROP COLUMN user_hash', array());
    } else {
        DeployTasks::log('Drop column not found '.$tablename.'.'.$column);
    }

}