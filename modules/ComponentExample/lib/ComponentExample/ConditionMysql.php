<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Stefan Warnat <support@stefanwarnat.de>
 * Date: 12.04.14 18:30
 * You must not use this file without permission.
 */
namespace ComponentExample;

class ConditionMysql
{
    private $_context = false;
    private $_sql = array();
    private $_module = "";

    private $_joinTables = array();
    private $_logger = false;

    public function __construct($module, $context) {
        $this->_module = $module;

        $this->_context = $context;
    }

    public function generateTables($includeAllModTables = false) {
        /**
         * @var $obj CRMEntity
         */
        $obj = \CRMEntity::getInstance($this->_module);
        $sql = array();
        $sql[] = "FROM ".$obj->table_name;

        $relations = $obj->tab_name_index;
        $pastJoinTables = array($obj->table_name);
        foreach($relations as $table => $index) {
            if(in_array($table, $pastJoinTables)) {
                continue;
            }

            $postJoinTables[] = $table;
            if($table == "vtiger_crmentity") {
                $join = "INNER";
            } else {
                $join = "LEFT";
            }

            $sql[] = $join." JOIN `".$table."` ON (`".$table."`.`".$index."` = `".$obj->table_name."`.`".$obj->table_index."`)";
        }

        $sql = array_merge($sql, array_values($this->_joinTables));

        return implode("\n", $sql);
    }
    /**
     * @param $conditions
     * @param $context CRMEntity
     * @return bool
     */
    public function parse($conditions) {
        if(empty($conditions) || $conditions == -1) {
            if($this->_module == 'Leads') {
                return 'vtiger_leaddetails.converted = 0 ';
            }

            return '';
        }

        $this->_checkGroup($conditions);

        if($this->_module == 'Leads') {
            $this->_sql[] = ' AND vtiger_leaddetails.converted = 0 ';
        }

        return implode(" ",$this->_sql);
    }

    private function _checkGroup($condition) {
        $this->_sql[] = "(";

        // Jeden Eintrag in Gruppe durchlaufen
        foreach($condition as $check) {

            if($check["type"] == "group") {
                $this->_checkGroup($check["childs"]);
            } elseif($check["type"] == "field") {
                $tmpResult = $this->_checkField($check);
            }

            if ($check["join"] == "and") {
                $this->_sql[] = "AND";
            } else {
                $this->_sql[] = "OR";
            }

        }
        if(in_array($this->_sql[count($this->_sql) - 1], array("AND", "OR"))) {
            array_pop($this->_sql);
        }

        $this->_sql[] = ")";
    }

    private function _checkField($check) {
        global $adb;

        if(is_string($check['rawvalue']) && $check["mode"] != 'function') {
            $check['rawvalue'] = array('value' => $check['rawvalue']);
        }

        // static Value
        if($check["mode"] == "value" || empty($check["mode"])) {
//            var_dump($check["field"]);
            $checkvalue = $check["rawvalue"];

            if(is_array($checkvalue)) {
                foreach ($checkvalue as $index => $val) {
                    if (strpos($val, '$') !== false || strpos($val, '?') !== false) {
                        $objTemplate = new VTTemplate($this->_context);
                        $checkvalue[$index] = $objTemplate->render($val);
                    }
                }
            }

        } elseif($check["mode"] == "function") {
            $parser = new ExpressionParser($check["rawvalue"], $this->_context, false); # Last Parameter = DEBUG

            $parser->run();

            $checkvalue = $parser->getReturn();

            if(is_string($checkvalue)) {
                $checkvalue['value'] = $checkvalue;
            }
        }

        if(!empty($checkvalue['value']) && preg_match("/^([0-9]+)x([0-9]+)$/", $checkvalue['value'], $matches)) {
            $checkvalue = $matches[2];
        }
        if($check["field"] != "crmid") {
            if(preg_match('/\((\w+) ?: \(([_\w]+)\) (\w+)\)/', $check["field"], $matches)) {
                $fieldData = VtUtils::getFieldInfo($matches[3], getTabid($matches[2]));

                if($fieldData['tablename'] == 'vtiger_inventoryproductrel') {
                    $fieldNames = array("`" . $fieldData['tablename'] . "`.`" . $fieldData["columnname"] . '`');
                } else {
                    $fieldInfoReference = VtUtils::getFieldInfo($matches[1], getTabid($this->_module));
                    $obj = \CRMEntity::getInstance($matches[2]);
                    //$objReference = \CRMEntity::getInstance($this->_module);

                    if (empty($obj->tab_name_index[$fieldData['tablename']])) {
                        return false;
                    }

                    $joinTableKey = ucfirst($fieldData['tablename']) . '' . ucfirst($matches[0]);
                    $alias = 't' . md5($joinTableKey);
                    if (!isset($this->_joinTables[$joinTableKey])) {
                        $this->_joinTables[$joinTableKey] = 'INNER JOIN ' . $fieldData['tablename'] . ' as ' . $alias . ' ON(' . $alias . '.' . $obj->tab_name_index[$fieldData['tablename']] . ' = ' . $fieldInfoReference['tablename'] . '.' . $fieldInfoReference['columnname'] . ')';
                    }
                    $fieldNames = array("`" . $alias . "`.`" . $fieldData["columnname"] . '`');
                }
            } else {

                $sql = "SELECT columnname, tablename, uitype FROM vtiger_field WHERE (fieldname = ? OR columnname = ?) AND tabid = " . getTabId($this->_module);

                $result = $adb->pquery($sql, array($check["field"], $check["field"]), true);
                $fieldData = $adb->fetchByAssoc($result);

                if ($fieldData["columnname"] == "idlists" && $this->_module == "Emails") {
                    $fieldNames = array("`vtiger_seactivityrel`.`crmid`");
                } else {
                    $fieldNames = array("`" . $fieldData["tablename"] . "`.`" . $fieldData["columnname"] . '`');
                }
            }

            if(in_array(intval($fieldData["uitype"]), VtUtils::$referenceUitypes) && empty($check["not"]) && $check["operation"] == 'equal') {
                $check['operation'] = 'core/reference_equal';
/*
                $modules = VtUtils::getModuleForReference(getTabId($this->_module), $check["field"], $fieldData["uitype"]);

                if(count($modules) == 1) {
                    foreach($modules as $module) {
                        $tmpFocus = \CRMEntity::getInstance($module);
                        $tableName = "t".count($this->_joinTables)."_".$module."_".$check["field"]."";
                        $this->_joinTables[] = "LEFT JOIN ".$tmpFocus->table_name." as ".$tableName." ON (`".$tableName."`.`".$tmpFocus->table_index."` = `".$fieldNames[0]."`)";

                        $fieldData["tablename"] = $tableName;
                        $fieldData["columnname"] = $tmpFocus->list_link_field;

                        //if(!is_numeric($checkvalue)) {
                            $fieldNames[] = "".$fieldData["tablename"]."`.`".$fieldData["columnname"];
                        //} else {
    //                        $fieldNames = array("".$fieldData["tablename"]."`.`".$fieldData["columnname"]);
      //                  }
                    }
                }*/
            }
        } else {
            $fieldNames = array("`vtiger_crmentity`.`crmid`");
        }

        $this->log("Check field: ".$check["field"]." ".(!empty($check["not"])?'not':'')." ".$check["operation"]." ".json_encode($checkvalue));

#        var_dump($fieldvalue." - ".($check["not"]=="1"?"NOT ":"").$check["operation"]." - ".$checkvalue);echo "<br>";
        if(!empty($check["not"])) {
            $not = true;
        } else {
            $not = false;
        }

        $sql = ConditionPlugin::getSQLCondition($check['operation'], $this->_module, $fieldNames[0], $checkvalue, $not);

        $this->_sql[] = $sql;

        return false;
    }

    public function log($value) {
        //ExecutionLogger::getCurrentInstance()->log($value);
    }

    /**
     * Set the Log-Routine, to log every Check
     * @deprecated
     * @param $logger
     */
    public function setLogger($logger) {
        $this->_logger = $logger;
    }
}

