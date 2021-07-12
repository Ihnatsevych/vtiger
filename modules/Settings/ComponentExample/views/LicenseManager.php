<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Stefan Warnat <support@stefanwarnat.de>
 * Date: 11.01.14 17:04
 * You must not use this file without permission.
 */
global $root_directory;
require_once($root_directory."/modules/".basename(dirname(dirname(__FILE__)))."/autoload_wf.php");

class Settings_ComponentExample_LicenseManager_View extends Settings_Vtiger_Index_View {
    function checkPermission(Vtiger_Request $request) {
        return true;
   	}

    public function process(Vtiger_Request $request) {
        $moduleName = $request->getModule();
        $qualifiedModuleName = $request->getModule(false);
        $viewer = $this->getViewer($request);

        $moduleModel = Vtiger_Module_Model::getInstance($moduleName);

        $className = "\\ComponentExample\\S"."WE"."xt"."ension\\c8ba4020e6639588bcae091917e304876d9289cde";

        $as2df = new $className($moduleName, $moduleModel->version);

        if($as2df->ge59ba7f6aeb5a77a8bf87d02cf6ac24683def0ce()) {
            $viewer->assign('ACTIVE_LICENSE', true);
        } else {
                $method = 'ha'.'sLi'.'cen'.'seKe'.'y';
            if($as2df->$method()) {
                $viewer->assign('hasLicense', true);
            } else {
                $viewer->assign('hasLicense', false);
            }

            $viewer->assign('ACTIVE_LICENSE', false);
        }

        $viewer->view('LicenseManager.tpl', $qualifiedModuleName);
   	}

    /**
   	 * Function to get the list of Script models to be included
   	 * @param Vtiger_Request $request
   	 * @return <Array> - List of Vtiger_JsScript_Model instances
   	 */
   	function getHeaderScripts(Vtiger_Request $request) {
   		$headerScriptInstances = parent::getHeaderScripts($request);
   		$moduleName = $request->getModule();

   		$jsFileNames = array(
   			"modules.Settings.$moduleName.views.resources.LicenseManager",
   		);

   		$jsScriptInstances = $this->checkAndConvertJsScripts($jsFileNames);
   		$headerScriptInstances = array_merge($headerScriptInstances, $jsScriptInstances);

           $moduleModel = Vtiger_Module_Model::getInstance($moduleName);
           foreach($headerScriptInstances as $obj) {
               $src = $obj->get('src');
               if(!empty($src) && strpos($src, $moduleName) !== false) {
                   $obj->set('src', $src.'?v='.$moduleModel->version);
               }
           }

           return $headerScriptInstances;
   	}
       function getHeaderCss(Vtiger_Request $request) {
           $headerScriptInstances = parent::getHeaderCss($request);
           $moduleName = $request->getModule();

           $cssFileNames = array(
               "~/modules/Settings/$moduleName/views/resources/backend.css",
           );

           $cssScriptInstances = $this->checkAndConvertCssStyles($cssFileNames);
           $headerStyleInstances = array_merge($headerScriptInstances, $cssScriptInstances);
           return $headerStyleInstances;
       }

}