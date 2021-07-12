<?php
/**
 *
 */
global $root_directory;
require_once($root_directory."/modules/ComponentExample/autoload_wf.php");

class Settings_ComponentExample_FieldSetter_View extends Settings_Vtiger_Index_View {
    public function process(Vtiger_Request $request) {
        global $current_user;
        global $root_directory;
        $adb = PearDatabase::getInstance();

        $moduleName = $request->getModule();
        $qualifiedModuleName = $request->getModule(false);
        $viewer = $this->getViewer($request);

        if(!empty($_POST['fieldsetter'])) {
            // This is the context, which should be used to write fields into
            // $targetContext = \ComponentExample\VTEntity::getDummy();

            // This is the context, which should be used to load variables from. Or Dummy, if no variables are available
            if($request->has('crmidtotest')) {
                $sourceContext = \ComponentExample\VTEntity::getForId($request->get('crmidtotest'));
            } else {
                $sourceContext = \ComponentExample\VTEntity::getDummy();
            }

            /*
             * When you want to have an easy use, also add this FieldSetter class. This will provide a ready-to-use interface for the configurations
             *
             * You are able to get the results, independent from configuration as array
             */
            $fieldsData = new \ComponentExample\FieldSetter($_POST['fieldsetter'], $sourceContext);

            $viewer->assign('RESULT', $fieldsData->getAsArray());
        } else {

            $viewer->assign('RESULT', false);

        }

        if($request->has('crmidtotest')) {
            $viewer->assign('crmidtotest', intval($request->get('crmidtotest')));
        } else {
            $sql = 'SELECT crmid FROM vtiger_crmentity WHERE setype = ? LIMIT 1';
            $result = \ComponentExample\VtUtils::pquery($sql, array('Leads'));

            if($adb->num_rows($result) > 0) {
                $data = $adb->fetchByAssoc($result);

                $viewer->assign('crmidtotest', intval($adb->query_result($result,0 , 'crmid')));
            } else {
                $viewer->assign('crmidtotest', '');
            }
        }

        $viewer->assign('fieldsetter', !empty($_POST['fieldsetter'])?$_POST['fieldsetter']:array());

        $viewer->view('Component.FieldSetter.tpl', $qualifiedModuleName);
    }

    /**
     * Function to get the list of Script models to be included
     * @param Vtiger_Request $request
     * @return <Array> - List of Vtiger_JsScript_Model instances
     */
    function getHeaderScripts(Vtiger_Request $request) {
        $moduleModel = Vtiger_Module_Model::getInstance("Colorizer");

        $headerScriptInstances = parent::getHeaderScripts($request);
        $moduleName = $request->getModule();


        $jsFileNames = array(
            "~modules/$moduleName/views/resources/js/fieldsetter.js",
//            '~/modules/ComponentExample/views/resources/components/complexecondition.js'
            "~modules/$moduleName/views/resources/js/component.fieldsetter.js",
        );

        $jsScriptInstances = $this->checkAndConvertJsScripts($jsFileNames);
        $headerScriptInstances = array_merge($headerScriptInstances, $jsScriptInstances);

//        $obj = $headerScriptInstances["modules.ComponentExample.views.resources.js.script"];
//        $obj->set('src', $obj->get('src').'?v='.$moduleModel->version);

        return $headerScriptInstances;
    }
    function getHeaderCss(Vtiger_Request $request) {
        $moduleModel = Vtiger_Module_Model::getInstance("Workflow2");
        $headerScriptInstances = parent::getHeaderCss($request);
        $moduleName = $request->getModule();

        $cssFileNames = array(
            "~layouts/".Vtiger_Viewer::getLayoutName()."/modules/Settings/ComponentExample/style.css",
            "~modules/$moduleName/views/resources/complexecondition/complexecondition2.css",
        );

        $cssScriptInstances = $this->checkAndConvertCssStyles($cssFileNames);
        $headerStyleInstances = array_merge($headerScriptInstances, $cssScriptInstances);

        foreach($headerStyleInstances as $obj) {
            $src = $obj->get('href');
            if(!empty($src) && strpos($src, $moduleName) !== false) {
                $obj->set('href', $src.'?v='.$moduleModel->version);
            }
        }

        return $headerStyleInstances;
    }
}

