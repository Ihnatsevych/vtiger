<?php
global $root_directory;
require_once($root_directory."/modules/ComponentExample/autoload_wf.php");

class Settings_ComponentExample_LicenseRefresh_Action extends Settings_Vtiger_Basic_Action {
    
    public function process(Vtiger_Request $request) {
        global $current_user;
        $adb = PearDatabase::getInstance();

        $params = $request->getAll();

        $moduleModel = Vtiger_Module_Model::getInstance("ComponentExample");

        $className = "\\ComponentExample\\S"."WE"."xt"."ension\\c8ba4020e6639588bcae091917e304876d9289cde";
        $as2df = new $className('ComponentExample', $moduleModel->version);

        $as2df->g7cd354a00dadcd8c4600f080755860496d0c03d5();

        echo json_encode(array('result' => 'ok'));
    }
}