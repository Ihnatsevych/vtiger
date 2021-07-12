<?php
global $root_directory;
require_once($root_directory."/modules/".basename(dirname(dirname(__FILE__)))."/autoload_wf.php");

class Settings_ComponentExample_SetLicense_Action extends Settings_Vtiger_Basic_Action {
    
    public function process(Vtiger_Request $request) {
        $moduleModel = Vtiger_Module_Model::getInstance(basename((dirname(dirname(__FILE__)))));

        $qualifiedModuleName = $request->getModule(false);

        $moduleName = $request->getModule(true);

        $className = "\\ComponentExample\\S"."WE"."xt"."ension\\c8ba4020e6639588bcae091917e304876d9289cde";
        $GenKey = new $className(basename(dirname((dirname(__FILE__)))), $moduleModel->version);

        $response = new Vtiger_Response();
        try {
            $GenKey->ga5ed5ff87a1f401fb84e82cedea77fbb0c639d3d($request->get("license"), array(__FILE__));

            $TimecontrolObj = new \ComponentExample();
            $TimecontrolObj->checkDB();
            $TimecontrolObj->activateEvents();

            $response->setResult(array("success" => true));
        } catch(Exception $exp) {
            $response->setResult(array("success" => false, "error" => $exp->getMessage()));
        }

        $response->emit();
    }

}