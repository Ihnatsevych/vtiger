<?php
/*+***********************************************************************************
 * The contents of this file are subject to the vtiger CRM Public License Version 1.0
 * ("License"); You may not use this file except in compliance with the License
 * The Original Code is:  vtiger CRM Open Source
 * The Initial Developer of the Original Code is vtiger.
 * Portions created by vtiger are Copyright (C) vtiger.
 * All Rights Reserved.
 *************************************************************************************/
global $root_directory;
require_once($root_directory."/modules/".basename(dirname(dirname(__FILE__)))."/autoload_wf.php");

class ComponentExample_Module_Model extends Vtiger_Module_Model {
    /**
   	 * Function to get Settings links
   	 * @return <Array>
   	 */
   	public function getSettingLinks(){
           $settingsLinks = parent::getSettingLinks();

           $settingsLinks[] = array(
                'linktype' => 'LISTVIEWSETTING',
                'linklabel' => 'check DB',
                 'linkurl' => 'index.php?parent=Settings&module=ComponentExample&view=CheckDB&filename=vtiger',
            );

           $settingsLinks[] = array(
                'linktype' => 'LISTVIEWSETTING',
                'linklabel' => 'set License',
                 'linkurl' => 'index.php?parent=Settings&module=ComponentExample&view=LicenseManager&filename=vtiger',
            );
           $settingsLinks[] = array(
                'linktype' => 'LISTVIEWSETTING',
                'linklabel' => 'check for Update',
                 'linkurl' => 'index.php?parent=Settings&module=ComponentExample&view=Upgrade&filename=vtiger',
            );


           return $settingsLinks;
    }

    public function getTemplatesForModule($moduleName) {
        $adb = \PearDatabase::getInstance();

        $sql = 'SELECT id, name FROM vtiger_ComponentExample_templates WHERE module_name = ?';
        $result = $adb->pquery($sql, array($moduleName));

        $templates = array();
        while($row = $adb->fetchByAssoc($result)) {
            $templates[] = $row;
        }

        return $templates;
    }

    public function getBody($templateid) {
        $adb = \PearDatabase::getInstance();

        $sql = 'SELECT text FROM vtiger_ComponentExample_templates WHERE id = ?';
        $result = $adb->pquery($sql, array(intval($templateid)));

        return $adb->query_result($result, 0, 'text');
    }

}