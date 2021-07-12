<?php
/**
 * @copyright 2016-2017 Redoo Networks GmbH
 * @link https://redoo-networks.com/
 * This file is part of a vTigerCRM module, implemented by Redoo Networks GmbH and must not used without permission.
 */

function settingsmenublock_add($blockLabel, $sequence) {

    $sql = "SELECT * FROM vtiger_settings_blocks WHERE label = ?";
    $result = \MODDBCheck::pquery($sql, array($blockLabel));

    if(strtolower($sequence) === \DeployTasks::CONST_LASTELEMENT) {
        $seq_res = \MODDBCheck::pquery("SELECT MAX(sequence) AS max_seq FROM vtiger_settings_blocks", array(), true);

        $sequence = \MODDBCheck::query_result($seq_res, 0, 'max_seq');
        $sequence = $sequence + 1;
    }

    if(\MODDBCheck::numRows($result) == 0) {
        $blockid = \MODDBCheck::getUniqueID('vtiger_settings_blocks');

        $seq_res = \MODDBCheck::pquery("SELECT MAX(blockid) AS max_seq FROM vtiger_settings_blocks", array(), true);
        if (\MODDBCheck::numRows($seq_res) > 0) {
            $cur_seq = \MODDBCheck::query_result($seq_res, 0, 'max_seq');
            if ($cur_seq != null)	$cur_seq = $cur_seq + 1;
        }

        $seq_res = \MODDBCheck::pquery("SELECT MAX(blockid) AS max_seq FROM vtiger_settings_blocks WHERE blockid >= ?", array($blockid), true);
        if (\MODDBCheck::numRows($seq_res) > 0) {
            $tmp = \MODDBCheck::query_result($seq_res, 0, 'max_seq');
            if (!empty($tmp)) {
                $blockid = $tmp + 1;
                $sql = 'UPDATE vtiger_settings_blocks_seq SET id = '.($blockid);
                \MODDBCheck::query($sql);
            }
        }

        if(empty($blockid)) {
            $blockid = \MODDBCheck::getUniqueID('vtiger_settings_blocks');
        }

        \MODDBCheck::pquery(
            'INSERT INTO vtiger_settings_blocks(blockid, label, sequence)
            VALUES (?,?,?)',
            array(
                $blockid,
                $blockLabel,
                $sequence,
            ),
            true);

        DeployTasks::log('Settings Menublock '.$blockLabel.'');
    }

}