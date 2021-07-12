<?php

class MODDBCheck {
	public static function existTable($tableName) {
		global $adb;
		$tables = $adb->get_tables();

		foreach($tables as $table) {
			if($table == $tableName)
				return true;
		}

		return false;
	}
	public static function checkColumn($table, $colum, $type, $default = false, $callbackIfNew = false, $resetType = false) {
		global $adb;

		if(!self::existTable($table)) {
			return false;
		}

		$result = $adb->query("SHOW COLUMNS FROM `".$table."` LIKE '".$colum."'");
		$exists = ($adb->num_rows($result))?true:false;

		if($exists == false) {
			//echo "Add column '".$table."'.'".$colum."'<br>";
			$adb->query("ALTER TABLE `".$table."` ADD `".$colum."` ".$type." NOT NULL".($default !== false?" DEFAULT  '".$default."'":""), false);

			if($callbackIfNew !== false && is_callable($callbackIfNew)) {
				$callbackIfNew($adb);
			}
		} elseif($resetType == true) {
			$existingType = strtolower(html_entity_decode($adb->query_result($result, 0, 'type'), ENT_QUOTES));
			$existingType = str_replace(' ', '', $existingType);
			if($existingType != strtolower(str_replace(' ', '', $type))) {
				$sql = "ALTER TABLE  `".$table."` CHANGE  `".$colum."`  `".$colum."` ".$type.";";
				$adb->query($sql);
			}
		}

		return $exists;
	}
	public static function pquery($query, $parameters) {
        global $adb;

        return $adb->pquery($query, $parameters, true);
    }
	public static function query($query) {
		global $adb;

		return $adb->query($query, true);
	}
	public static function numRows($result) {
	    global $adb;

	    return $adb->num_rows($result);
    }
    public static function getUniqueID($tableName) {
	    $adb = \PearDatabase::getInstance();

	    return $adb->getUniqueID($tableName);
    }
    public static function query_result($result, $index, $field) {
	    $adb = \PearDatabase::getInstance();

	    return $adb->query_result($result, $index, $field);
    }
    public static function fetchByAssoc($result) {
	    $adb = \PearDatabase::getInstance();

	    return $adb->fetchByAssoc($result);
    }
}

class Deploy_PackageImport extends Vtiger_PackageImport {
    private $moduleName = null;
    private $moduleDir = null;
    function checkZip($zipfile) {
        return true;
    }

    public function __construct($moduleName) {
        $this->moduleName = $moduleName;
        $this->moduleDir = vglobal('root_directory').'modules' . DIRECTORY_SEPARATOR . $this->moduleName . DIRECTORY_SEPARATOR;

        $this->_modulexml = simplexml_load_file($this->moduleDir . 'manifest.xml');
        parent::__construct();
    }
    function import($zipfile, $overwrite=false) {
        $this->import_Module();
    }
}

class Deploy_PackageUpdate extends Vtiger_PackageUpdate {
    private $moduleName = null;
    private $moduleDir = null;
    function checkZip($zipfile) {
        return true;
    }

    public function __construct($moduleName) {
        $this->moduleName = $moduleName;
        $this->moduleDir = vglobal('root_directory').'modules' . DIRECTORY_SEPARATOR . $this->moduleName . DIRECTORY_SEPARATOR;

        $this->_modulexml = simplexml_load_file($this->moduleDir . 'manifest.xml');
        //var_dump($this->moduleDir);
        parent::__construct();
    }
}

/**
 * Class DeployTasks
 * @method static moduleinstall($modulename, $updateExisting = false)
 * @method static db_query($sql, $params)
 * @method static settingsmenu_add($blockName, $label, $description, $linkto, $pinned = false)
 * @method static settingsmenu_del($linkto)
 * @method static settingsmenublock_add($label, $sequence)
 * @method static db_table_create($tableName, $sqlToCreate, $callbackIfNew = false)
 * @method static db_table_column($table, $colum, $type, $default = false, $callbackIfNew = false, $resetType = false)
 * @method static db_table_column_drop($table, $colum)
 * @method static db_table_isempty($tableName, $callbackIfEmpty)
 * @method static plugin_add($type, $key, $title, $class, $file = '', $order = 50)
 * @method static plugin_remove($type, $key)
 * @method static link_remove($tabid, $type, $label, $url = false)
 * @method static module_delete($moduleName)
 */
class DeployTasks {
    private static $log = array();
    const CONST_LASTELEMENT = 'lastelement';

    public static function __callStatic($method, $arguments) {
        $handler = dirname(__FILE__) . DIRECTORY_SEPARATOR . 'tasks' . DIRECTORY_SEPARATOR . $method . '.php';
        if(file_exists($handler)) {
            require_once($handler);
        }

        echo ' - Start Task ' . $method . LB;

        call_user_func_array($method, $arguments);

        foreach(self::$log as $log) {
            if(!is_cli()) {
                echo '<em> - LOG - '.$log.'</em><br/>';
            } else {
                echo ' - LOG - '.$log.LB;
            }

        }
        self::$log = array();
    }

    public static function log($log) {
        self::$log[] = $log;
    }
}

/** Deply Task Management */
global $DeployTasks;
$DeployTasks = array(
    'before' => array(),
    'after' => array(),
    'files' => array()
);
function task($step, $function) {
    global $DeployTasks;

    if(!is_callable($function)) return;
    if(!isset($DeployTasks[$step])) return;

    $DeployTasks[$step][] = $function;
}
function finishUpdate() {
    $trace = debug_backtrace(0, 2);
    $filename = basename($trace[0]['file']);
    if($filename == 'functions.php') $filename = basename($trace[1]['file']);

    $filename = preg_replace('/[^a-zA-Z0-9-_ ]/', '', $filename);

    $adb = \PearDatabase::getInstance();
    $sql = 'INSERT INTO flexsuite_updates SET `update` = ?';
    $adb->pquery($sql, array($filename));

    //$lockFile = dirname(__FILE__) . DIRECTORY_SEPARATOR . 'done' . DIRECTORY_SEPARATOR . $filename.'.php';
    //touch($lockFile);
}
function runTasks($step) {
    global $DeployTasks;

    if(!isset($DeployTasks[$step])) return;

    if(is_cli()) {

        echo 'Run Update Step "' . $step . '": ' . count($DeployTasks[$step]) . ' Actions' . LB;
    } else {
        echo 'Run Update Step <strong>' . $step . '</strong>: ' . count($DeployTasks[$step]) . ' Actions' . LB;
    }
    foreach($DeployTasks[$step] as $function) {
        call_user_func($function);
    }
}