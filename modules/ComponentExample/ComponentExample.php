<?php
/*+**********************************************************************************
 * The contents of this file are subject to the vtiger CRM Public License Version 1.0
 * ("License"); You may not use this file except in compliance with the License
 * The Original Code is:  vtiger CRM Open Source
 * The Initial Developer of the Original Code is vtiger.
 * Portions created by vtiger are Copyright (C) vtiger.
 * All Rights Reserved.
 ************************************************************************************/

require_once('autoload_wf.php');

class ComponentExample {

    function checkDB() {
        $adb = \PearDatabase::getInstance();

        require_once(dirname(__FILE__).'/checkDB.php');
    }

	public function RemoveHeaderLink() {
		$adb = PearDatabase::getInstance();

		$sql = "DELETE FROM vtiger_links WHERE linktype = 'HEADERSCRIPT' AND linklabel = '".get_class($this)."JS'";
		$adb->query($sql);

	}
	public function AddHeaderLink() {
		$adb = PearDatabase::getInstance();

		$this->removeHeaderLink();

		$moduleModel = Vtiger_Module_Model::getInstance(get_class($this));

		require_once('vtlib/Vtiger/Module.php');
		$link_module = Vtiger_Module::getInstance(get_class($this));
		$link_module->addLink('HEADERSCRIPT',get_class($this)."JS","modules/".get_class($this)."/views/resources/js/frontend.js?v=".$moduleModel->version."&", "", "1");
	}

    public function initialize_module() {
        ob_start();
		
		// Check DB
        $this->checkDB();
        
		// Add Global JavaScript file modules/ComponentExample/views/resources/frontend.js
		// $this->AddHeaderLink();
		
		// Enable Settings Link in Sidebar
        $this->checkSettingsField();
		
        ob_end_clean();
    }
	
    public function removeSettingsField() {
        $adb = PearDatabase::getInstance();

        $sql = "DELETE FROM vtiger_settings_field WHERE name = 'ComponentExample'";
        $adb->pquery($sql);
    }
	
	public function checkSettingsField() {
		global $adb;
		$sql = 'DELETE FROM vtiger_settings_field WHERE linkto = "index.php?module=ComponentExample&action=admin&parenttab=Settings"';
		$adb->query($sql);

		$sql = "SELECT * FROM vtiger_settings_field WHERE linkto = 'index.php?module=ComponentExample&view=Index&parent=Settings'";
		$result = $adb->query($sql);
		
		if($adb->num_rows($result) == 0) {
			$fieldid = $adb->getUniqueID('vtiger_settings_field');
			$blockid = getSettingsBlockId('LBL_OTHER_SETTINGS');
			$seq_res = $adb->pquery("SELECT max(sequence) AS max_seq FROM vtiger_settings_field WHERE blockid = ?", array($blockid));
            
			$maxfieldidRST = $adb->pquery("SELECT max(fieldid) AS fieldid FROM vtiger_settings_field");
            $maxFieldId = $adb->query_result($maxfieldidRST, 0, 'fieldid');
			
            if($fieldid < $maxFieldId) {
                $fieldid = $maxFieldId + 1;
                $sql = 'UPDATE vtiger_settings_field_seq SET id = '.$fieldid;
                $adb->pquery($sql);
            }

            $blockid = getSettingsBlockId('LBL_OTHER_SETTINGS');
            $seq_res = $adb->pquery("SELECT max(sequence) AS max_seq FROM vtiger_settings_field WHERE blockid = ?", array($blockid));
            if ($adb->num_rows($seq_res) > 0) {
                $cur_seq = $adb->query_result($seq_res, 0, 'max_seq');
                if ($cur_seq != null)	$seq = $cur_seq + 1;
            }

			$adb->pquery('INSERT INTO vtiger_settings_field(fieldid, blockid, name, iconpath, description, linkto, sequence)
				VALUES (?,?,?,?,?,?,?)', array($fieldid, $blockid, 'ComponentExample', '', '', 'index.php?module=ComponentExample&view=Index&parent=Settings', $cur_seq));
		}
	}

    /**
	 * Invoked when special actions are performed on the module.
	 * @param String Module name
	 * @param String Event Type (module.postinstall, module.disabled, module.enabled, module.preuninstall)
	 */
	function vtlib_handler($modulename, $event_type) {
		global $adb;

		if($event_type == 'module.postinstall') {
            $this->initialize_module();

			// TODO Handle post installation actions
		} else if($event_type == 'module.disabled') {
            
			$this->removeHeaderLink();
            $this->removeSettingsField();
			
			// TODO Handle actions when this module is disabled.
		} else if($event_type == 'module.enabled') {
            
			$this->initialize_module();
			
			// TODO Handle actions when this module is enabled.
		} else if($event_type == 'module.preuninstall') {
            
			$this->removeHeaderLink();
            $this->removeSettingsField();
			
			// TODO Handle actions when this module is about to be deleted.
		} else if($event_type == 'module.preupdate') {
			// TODO Handle actions before this module is updated.
		} else if($event_type == 'module.postupdate') {
			// TODO Handle actions after this module is updated.

            $this->initialize_module();
		}
	}

	/** 
	 * Handle saving related module information.
	 * NOTE: This function has been added to CRMEntity (base class).
	 * You can override the behavior by re-defining it here.
	 */
	// function save_related_module($module, $crmid, $with_module, $with_crmid) { }
	
	/**
	 * Handle deleting related module information.
	 * NOTE: This function has been added to CRMEntity (base class).
	 * You can override the behavior by re-defining it here.
	 */
	//function delete_related_module($module, $crmid, $with_module, $with_crmid) { }

	/**
	 * Handle getting related list information.
	 * NOTE: This function has been added to CRMEntity (base class).
	 * You can override the behavior by re-defining it here.
	 */
	//function get_related_list($id, $cur_tab_id, $rel_tab_id, $actions=false) { }

	/**
	 * Handle getting dependents list information.
	 * NOTE: This function has been added to CRMEntity (base class).
	 * You can override the behavior by re-defining it here.
	 */
	//function get_dependents_list($id, $cur_tab_id, $rel_tab_id, $actions=false) { }
}

?>
