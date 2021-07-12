<?php
require_once(dirname(dirname(__FILE__)) . DIRECTORY_SEPARATOR . "autoload_wf.php");

class ComponentExample_TemplateVariables_Action extends Vtiger_Action_Controller {

    function checkPermission(Vtiger_Request $request) {
        return;
    }

    private $ScopeName = '';

    function __construct() {
        if(empty($this->ScopeName)) {
            $this->ScopeName = basename(dirname(dirname(__FILE__)));
        }

        parent::__construct();
        $this->exposeMethod('templateFields');

    }

    public function templateFields(Vtiger_Request $request) {
        $adb = PearDatabase::getInstance();
        $params = $request->getAll();
        $uitypes = $params['uitypes'];

        if(!empty($params["mainModule"])) {
            $tabID = getTabId($params["mainModule"]);

            if(empty($tabID)) {
                return "";
            }
        }

        /**
         * @var $settingsModel Settinsgs_Workflow2_Module_Model
         */
        #$settingsModel = Settings_Vtiger_Module_Mosdel::getInstance($this->ScopeName);


        $type = $params["type"];

        switch($type) {
            case "email":
                $uitypes = array(13,104);
                break;
        }
        if(empty($uitypes) || empty($uitypes[0])) {
            $uitypes = false;
        }

        $vtUtilsClassName = $this->getFullClassName('VtUtils');

        if(!empty($params["mainModule"])) {
            $moduleFields = $vtUtilsClassName::getFieldsWithBlocksForModule($params["mainModule"], !empty($params["reftemplate"]), $params["reftemplate"]);
        } else {
            $moduleFields = array();
        }

        echo '<div style="padding: 10px 10px 0 20px;">';
        echo "<p>".getTranslatedString("LBL_INSERT_TEMPLATE_VARIABLE", $this->ScopeName).":</p>";
        echo '<select id="insertTemplateField_Select" class="chzn-select ModalResultValue" style="width:100%;">';

        if(!empty($params["functions"]) && $params["functions"] == "1") {
            echo '<optgroup label="'.getTranslatedString("global functions", $this->ScopeName).'">';
            echo "<option value='[Now]'>Now()</option>";
            echo "<option value='[Now,-x]'>".sprintf(getTranslatedString("- %s days", $this->ScopeName), "x")."</option>";
            echo "<option value='[Now,+x]'>".sprintf(getTranslatedString("+ %s days", $this->ScopeName), "x")."</option>";
            echo "<option value='[Link,\$id]'>".getTranslatedString("Link to Record", $this->ScopeName)."</option>";
            echo "<option value='"."{ ..custom function.. }}>'>".'$'."{ ..custom function.. }}></option>";
            echo '</optgroup>';
        }

        if(!empty($params["refFields"]) && $params["refFields"] == "true") {
            $references = $vtUtilsClassName::getReferenceFieldsForModule($params["mainModule"]);
            echo '<optgroup label="'.getTranslatedString("LBL_REFERENCES", $this->ScopeName).'">';

            echo '<option value="id">'.getTranslatedString("LBL_ID_OF_CURRENT_RECORD", $this->ScopeName).'&nbsp;&nbsp;('.getTranslatedString($params["mainModule"], $params["mainModule"]).')</option>';
            foreach($references as $ref) {
                $name = $ref["fieldname"];
//                $name = str_replace(array("[source]", "[module]", "[destination]"), array($ref["fieldname"], $ref["module"], "id"), "([source]: ([module]) [destination])");

                echo '<option value="'.$name.'">'. getTranslatedString($ref["fieldlabel"], $ref["module"]) . "&nbsp;&nbsp;&nbsp;(".getTranslatedString($ref["module"], $ref["module"]).')</option>';
            }
            echo '</optgroup>';
        } else {
            echo '<option value="id">'.getTranslatedString("LBL_ID_OF_CURRENT_RECORD", $this->ScopeName).'</option>';
        }

        $init = false;
        $close = false;

        foreach($moduleFields as $blockKey => $blockValue) {

            $init = '<optgroup label="'.$blockKey.'">';
            foreach($blockValue as $fieldKey => $field) {
                if($uitypes === false || in_array($field->uitype, $uitypes)) {
                    if($init !== false) {
                        echo $init;
                        $init = false;
                        $close = true;
                    }
                    echo "<option value='".$field->name."'>".$field->label."</option>";
                }
            }
            if($close == true) {
                echo "</optgroup>";
            }
        }

        echo "</div>";
    }

    private function getFullClassName($className) {
        return '\\'.$this->ScopeName . '\\' . $className;
    }


    function process(Vtiger_Request $request)
    {
        $mode = $request->getMode();
        if (!empty($mode)) {
            echo $this->invokeExposedMethod($mode, $request);
            return;
        }
    }
}
