<?php
/**
 * @copyright 2016-2017 Redoo Networks GmbH
 * @link https://redoo-networks.com/
 * This file is part of a vTigerCRM module, implemented by Redoo Networks GmbH and must not used without permission.
 */

function link_remove($tabid, $type, $label, $url = false) {
    \Vtiger_Link::deleteLink($tabid, $type, $label, $url);

    DeployTasks::log('Link '.$label.' removed');
}