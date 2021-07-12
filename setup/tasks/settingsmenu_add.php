<?php
/**
 * @copyright 2016-2017 Redoo Networks GmbH
 * @link https://redoo-networks.com/
 * This file is part of a vTigerCRM module, implemented by Redoo Networks GmbH and must not used without permission.
 */

function settingsmenu_add($blockName, $label, $description, $linkto, $pinned = false) {

    $sql = "SELECT * FROM vtiger_settings_field WHERE linkto = ?";
    $result = \MODDBCheck::pquery($sql, array($linkto));

    $blockid = getSettingsBlockId($blockName);

    if(\MODDBCheck::numRows($result) == 0) {
        $fieldid = \MODDBCheck::getUniqueID('vtiger_settings_field');

        $seq_res = \MODDBCheck::pquery("SELECT MAX(sequence) AS max_seq FROM vtiger_settings_field WHERE blockid = ?", array($blockid), true);
        if (\MODDBCheck::numRows($seq_res) > 0) {
            $cur_seq = \MODDBCheck::query_result($seq_res, 0, 'max_seq');
            if ($cur_seq != null)	$cur_seq = $cur_seq + 1;
        } else {
            $cur_seq = 1;
        }

        $seq_res = \MODDBCheck::pquery("SELECT MAX(fieldid) AS max_seq FROM vtiger_settings_field WHERE fieldid >= ?", array($fieldid), true);
        if (\MODDBCheck::numRows($seq_res) > 0) {
            $tmp = \MODDBCheck::query_result($seq_res, 0, 'max_seq');
            if (!empty($tmp)) {
                $fieldid = $tmp + 1;
                $sql = 'UPDATE vtiger_settings_field_seq SET id = '.($fieldid);
                \MODDBCheck::query($sql);
            }
        }

        if(empty($fieldid)) {
            $fieldid = \MODDBCheck::getUniqueID('vtiger_settings_field');
        }


        \MODDBCheck::pquery(
            'INSERT INTO vtiger_settings_field(fieldid, blockid, name, iconpath, description, linkto, sequence, active, pinned)
            VALUES (?,?,?,?,?,?,?,?,?)',
            array(
                $fieldid,
                $blockid,
                $label,
                'Smarty/templates/modules/Workflow2/settings.png',
                $description,
                $linkto,
                $cur_seq,
                0,
                $pinned ? 1 : 0
            ),
        true);

        DeployTasks::log('Settings Field '.$label.' added to Block '.$blockName);
    } else {
        $fieldData = \MODDBCheck::fetchByAssoc($result);

        \MODDBCheck::pquery(
            'UPDATE vtiger_settings_field SET blockid = ?, name = ?, iconpath = ?, description = ?
            WHERE fieldid = ?',
            array(
                $blockid,
                $label,
                'Smarty/templates/modules/Workflow2/settings.png',
                $description,
                $fieldData['fieldid'],
            ),
            true);

        DeployTasks::log('Settings Field '.$label.' updated');
    }

}