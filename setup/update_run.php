<?php
ini_set('memory_limit', '1024M');

function is_cli()
{
    if (defined('STDIN')) {
        return true;
    }

    if (php_sapi_name() === 'cli') {
        return true;
    }

    if (array_key_exists('SHELL', $_ENV)) {
        return true;
    }

    if (empty($_SERVER['REMOTE_ADDR']) and !isset($_SERVER['HTTP_USER_AGENT']) and count($_SERVER['argv']) > 0) {
        return true;
    }

    if (!array_key_exists('REQUEST_METHOD', $_SERVER)) {
        return true;
    }

    return false;
}

if (is_cli()) {
    define("LB", PHP_EOL);
} else {
    define("LB", '<br/>');
}
if (is_cli() && defined('UPDATE_STEP') === false) {
    define('UPDATE_STEP', 'ALL');
}

global $dbconfigoption, $dbconfig;
set_include_path(dirname(__FILE__) . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR);
set_time_limit(-1);
chdir(__DIR__ . '/../');

define('DS', DIRECTORY_SEPARATOR);

$checkFile = __DIR__ . DS . 'SETUP_TOKEN';
if (
    file_exists($checkFile) === false ||
    filemtime($checkFile) < time() - 3600
) {
    exit();
}

define('UPDATER', true);

// Composer setup must executed before Scripts of CRM are loaded to have AdoDB available
if (UPDATE_STEP == 'COMPOSER' || UPDATE_STEP == 'ALL') {
    ini_set('display_errors', 1);
    error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED & ~E_STRICT & ~E_WARNING);

    include 'phar://' . __DIR__ . '/composer.phar/vendor/autoload.php';

    putenv('COMPOSER_HOME=' . __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'storage' . DIRECTORY_SEPARATOR . 'composer');

    $command = 'install';
    if (filemtime('composer.json') > filemtime('composer.lock')) {
        $command = 'update';
    }

    echo 'Run Composer ' . $command . LB;

    $input = new \Symfony\Component\Console\Input\ArrayInput(array(
        'command' => $command,
        '-v' => true,
        '--no-interaction' => true,
        '--no-progress' => true,
        '--no-ansi' => false,
        '--no-dev' => true,
        '--optimize-autoloader' => true,
        '-d' => __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR
    ));

//        echo '<h3>Composer setup</h3>';
    if (!is_cli()) {
        echo '<pre style="font-size:12px;">';
    }

    $output = new \Symfony\Component\Console\Output\StreamOutput(fopen('php://output', 'w'));

    $app = new \Composer\Console\Application();
    $app->setAutoExit(false);
    $app->run($input, $output);

    //echo $content;
    if (!is_cli()) {
        echo '</pre>';
    }
}

include_once 'includes/Autoloader.php';

// Initiate .env File, when existing
if (file_exists(__DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . '.env')) {
    $dotenv = Dotenv\Dotenv::create(__DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR);
    $dotenv->load();
}

require('config.php');

$mysqli = new \mysqli($dbconfig['db_server'], $dbconfig['db_username'], $dbconfig['db_password'], $dbconfig['db_name'],
    trim($dbconfig['db_port'], ':'));
if ($mysqli->connect_errno) {
    die("Verbindung fehlgeschlagen: " . $mysqli->connect_error);
}
$sql = 'CREATE TABLE IF NOT EXISTS `flexsuite_config` (
 `key` varchar(128) NOT NULL,
 `value` text NOT NULL,
 `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 `autoload` tinyint(4) NOT NULL,
 PRIMARY KEY (`key`)
) ENGINE=InnoDB';
$mysqli->query($sql);
$mysqli->close();

include_once 'includes/Autoloader.php';
//Overrides GetRelatedList : used to get related query
//TODO : Eliminate below hacking solution
include_once 'include/Webservices/Relation.php';

include_once 'vtlib/Vtiger/Module.php';
include_once 'includes/Loader.php';

vimport('includes.runtime.EntryPoint');

$adb = \PearDatabase::getInstance();
$adb->setDieOnError(true);

ini_set('display_errors', 1);
error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED & ~E_STRICT & ~E_WARNING);

$root = realpath(dirname(__FILE__) . '/../');

chdir(dirname(__FILE__) . DS . '..' . DS);

$nothingDone = true;
if (UPDATE_STEP == 'MODREQUIREMENTS' || UPDATE_STEP == 'ALL') {
    $files = glob('modules' . DS . '*' . DS . 'requirements.xml');

    foreach ($files as $file) {
        $moduleName = basename(dirname($file));

        require_once('modules' . DS . $moduleName . DS . 'lib' . DS . $moduleName . DS . 'Requirements.php');
        $classname = '\\' . $moduleName . '\\Requirements';

        // Instantiate the Requirements class of module and check if update is necessary
        $obj = new $classname();
        if ($obj->requireUpdate() == true) {
            echo 'Update ' . $moduleName . ' Dependencies' . LB;
            $obj->update();
            $nothingDone = false;
        }
    }

    if ($nothingDone == true) {
        echo 'No updates necessary' . LB;
    }
}

if (UPDATE_STEP == 'SCRIPTS' || UPDATE_STEP == 'ALL') {
    require_once(dirname(__FILE__) . '/functions.php');

    if (\MODDBCheck::existTable('flexsuite_updates') === false) {
        $sql = 'CREATE TABLE `flexsuite_updates` (
 `update` varchar(64) NOT NULL,
 `done` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 PRIMARY KEY (`update`)
) ENGINE=InnoDB';
        $adb->query($sql);
        $files = glob(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'done' . DIRECTORY_SEPARATOR . '*.php');

        foreach ($files as $file) {
            $filename = str_replace('.php', '', basename($file));
            $sql = 'INSERT INTO flexsuite_updates SET `update` = ?, done = ?';
            $adb->pquery($sql, array($filename, date('Y-m-d H-i-s', filemtime($file))), true);
        }
    }

    $sql = 'SELECT `update` FROM flexsuite_updates';
    $result = $adb->query($sql);

    $done = array();
    while ($row = $adb->fetchByAssoc($result)) {
        $done[] = html_entity_decode($row['update'], ENT_QUOTES);
    }

    /** Will init update scripts */
    $files = glob(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'updates' . DIRECTORY_SEPARATOR . '*.php');
    sort($files);

    if (file_exists(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'done') === false) {
        @mkdir(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'done');
    }

    foreach ($files as $file) {
        $filename = basename($file);
        $filename = preg_replace('/[^a-zA-Z0-9-_ ]/', '', $filename);

        if (in_array($filename, $done)) {
            continue;
        }

        echo 'Add Update Script ' . $filename . LB;

        require_once($file);
    }

    runTasks('before');

    $files = glob($root . '/modules/*/MODCheckDB.php');

    ini_set('display_errors', 1);
    if (defined('E_DEPRECATED')) {
        error_reporting(E_ALL & ~E_NOTICE & ~E_STRICT & ~E_DEPRECATED);
    } else {
        error_reporting(E_ALL & ~E_NOTICE);
    }


    foreach ($files as $file) {

        $moduleName = basename(dirname($file));

        echo ' - Execute CheckDB: ' . $moduleName . LB;

        class_alias('MODDBCheck', '' . $moduleName . '_DBUpdate');
        class_alias('MODDBCheck', '\\' . $moduleName . '\\DBUpdate');

        require_once($file);
    }

    runTasks('after');
}

if (UPDATE_STEP == 'FINAL' || UPDATE_STEP == 'ALL') {
    echo 'Recreate tabdata.php ... ';
	touch('tabdata.php');
    Vtiger_Deprecated::createModuleMetaFile();
    if (!is_cli()) {
        echo '<span style="color:darkgreen;font-weight:bold;">OK</span><br/>';
    } else {
        echo 'OK' . LB;
    }

    echo 'Recreate User Privileges Files ...' . LB;
    $sql = 'SELECT id FROM vtiger_users WHERE status = "Active"';
    $result = $adb->query($sql);

    require_once('modules/Users/CreateUserPrivilegeFile.php');

    while ($row = $adb->fetchByAssoc($result)) {
        if (!is_cli()) {
            echo '&nbsp;&middot;&nbsp;User ' . $row['id'] . ' - ';
        } else {
            echo ' - User ' . $row['id'] . ' - ';
        }

        createUserPrivilegesfile($row['id']);
        createUserSharingPrivilegesfile($row['id']);

        ini_set('display_errors', 1);

        global $root_directory;
        require_once($root_directory . 'user_privileges/user_privileges_' . $row['id'] . '.php');
        require_once($root_directory . 'user_privileges/sharing_privileges_' . $row['id'] . '.php');

        if (!is_cli()) {
            echo '<span style="color:darkgreen;font-weight:bold;">OK</span>' . LB;
        } else {
            echo 'OK' . LB;
        }
    }

    echo 'Clear Template cache - ';
    $files = glob('test' . DS . 'templates_c' . DS . 'v7' . DS . '*.php');
    foreach ($files as $file) {
        unlink($file);
    }

    if (!is_cli()) {
        echo '<span style="color:darkgreen;font-weight:bold;">OK</span>' . LB;
    } else {
        echo 'OK' . LB;
    }


    echo 'Remove SETUP_TOKEN' . LB;
    @unlink($checkFile);
}
//require_once(dirname(__FILE__) . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'include/database/PearDatabase.php');
//
//global $adb;



