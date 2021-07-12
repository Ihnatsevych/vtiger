<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Stefan Warnat <support@stefanwarnat.de>
 * Date: 15.06.15 12:39
 * You must not use this file without permission.
 */
global $root_directory;
require_once($root_directory."/modules/ComponentExample/autoload_wf.php");

class Settings_ComponentExample_Formhandler_View extends Settings_Vtiger_Index_View {
    public function process(Vtiger_Request $request) {
        global $current_user;
        global $root_directory;
        $adb = PearDatabase::getInstance();

        $moduleName = $request->getModule();
        $qualifiedModuleName = $request->getModule(false);
        $viewer = $this->getViewer($request);


        $viewer->view('Component.FormHandler.tpl', $qualifiedModuleName);
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
            "~modules/$moduleName/views/resources/js/formhandler.js",
//            '~/modules/ComponentExample/views/resources/components/complexecondition.js'
            "~modules/$moduleName/views/resources/js/component.formhandler.js",
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
//            "~layouts/".Vtiger_Viewer::getLayoutName()."/modules/Settings/ComponentExample/style.css",
//            "~modules/$moduleName/views/resources/complexecondition/complexecondition2.css",
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

