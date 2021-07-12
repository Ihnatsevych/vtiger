<?php

use ComponentExample\VtUtils;
use ComponentExample\ConditionPlugin;

global $root_directory;
require_once ($root_directory . "/modules/" . basename(dirname(dirname(__FILE__))) . "/autoload_wf.php");


class ComponentExample_FieldSetter_Action extends Vtiger_Action_Controller {

    function checkPermission(Vtiger_Request $request) {
        return;
    }

    function __construct() {

        parent::__construct();
        $this->exposeMethod('init');

    }

    function process(Vtiger_Request $request)
    {

        $mode = $request->getMode();

        if (!empty($mode)) {
            echo $this->invokeExposedMethod($mode, $request);
            return;
        }

    }

    private function json_encode($value) {

        $result = json_encode($value);

        if(empty($result) && !empty($value)) {
            \Zend_Json::$useBuiltinEncoderDecoder = true;
            $result = \Zend_Json::encode($value);
        }

        if(empty($result) && !empty($value)) {
            \Zend_Json::$useBuiltinEncoderDecoder = false;
            $result = \Zend_Json::encode($value);
        }

        return $result;
    }

    public function init(\Vtiger_Request $request) {
        $moduleName = $request->get('mainModule');

        $required = $request->get('required');
        $return = array();
        $adb = \PearDatabase::getInstance();

        foreach($required as $require) {

            switch($require) {
                case 'users':
                    $return['users'] = array();
                    while($user = $adb->fetchByAssoc($result)) {
                        $return['users'][$user['id']] = $user['first_name'].' '.$user['last_name'];
                    }

                    break;
                case 'fields':
                    $return['fields'] = VtUtils::getFieldsWithBlocksForModule($moduleName, false);

                    $sql = "SELECT id,user_name,first_name,last_name FROM vtiger_users WHERE status = 'Active'";
                    $result = $adb->query($sql);

                    break;
            }
        }

        echo $this->json_encode($return);

    }

    public function loadOperators(Vtiger_Request $request) {

        $moduleName = $request->get('mainModule');
        $conditionMode = $request->get('conditionMode');

        $operators = ConditionPlugin::getAvailableOperators($moduleName, $conditionMode);
    }



}

