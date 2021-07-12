<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Stefan Warnat <support@stefanwarnat.de>
 * Date: 15.06.15 12:39
 * You must not use this file without permission.
 */
global $root_directory;
require_once($root_directory."/modules/ComponentExample/autoload_wf.php");

class Settings_ComponentExample_CheckDB_View extends Settings_Vtiger_Index_View {
        public function process(Vtiger_Request $request) {
            global $current_user;
                  global $root_directory;
                  $adb = PearDatabase::getInstance();

                  $moduleName = $request->getModule();
          		$qualifiedModuleName = $request->getModule(false);
          		$viewer = $this->getViewer($request);

                  /**
                   * @var $settingsModel Settings_Colorizer_Module_Model
                   */
                  $settingsModel = Settings_Vtiger_Module_Model::getInstance($qualifiedModuleName);

                  ?>
                  <table cellspacing="0" cellpadding="0" border="0" align="center" width="98%">
                  <tr>
                         <td valign="top"></td>
                          <td width="100%" valign="top" style="padding: 10px;" class="showPanelBg">
                              <br>
                              <div class="settingsUI" style="width:95%;padding:10px;margin-left:10px;">
                                  <h2>SearchPlus DB Check</h2>
                                  <div style="padding:20px;border:1px solid #ccc;">
                                  <?php
                                      $objWorkflow = new ComponentExample();
                                      echo "<strong>Step 1 / 2 - Check Database</strong>";
                                      $objWorkflow->initialize_module();
                                      echo " - ok<br/>";
                                      echo "<strong>Step 2 / 2 - Check Links</strong>";
                                      //$objWorkflow->activateEvents();
                                      echo " - ok<br/>";

                                      echo "<p style='text-align:center;font-weight:bold;'><a href='index.php?module=ModuleManager&parent=Settings&view=List'>&laquo; Back to ModuleManager</a></p>";
                                  ?>
                                  </div>
                              </div>
                           </td>
                   </tr>
                   </table>
                  <?php
       	}


}

