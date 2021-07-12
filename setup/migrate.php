<?php
/**
 * Created by PhpStorm.
 * User: StefanWarnat
 * Date: 14.12.2018
 * Time: 18:16
 */
if(empty($_GET['step'])) {
    $step = 1;
} else {
    $step = intval($_GET['step']);
}

set_time_limit(1200);
$url = 'https://dl.redoo.cloud/flexsuite.zip';
define('ROOT', realpath(dirname(__FILE__) . DIRECTORY_SEPARATOR . '..') . DIRECTORY_SEPARATOR);
$filename = ROOT . 'flexsuite.zip';

if($step == 1) {
//    $current_version = str_replace('.', '', $vtiger_current_version);

    if (!extension_loaded('curl')) {
        die('You cannot use this Task! You must install the cURL PHP Extension before usage.');
    }


    $fp = fopen($filename, 'w+');

//Here is the file we are downloading, replace spaces with %20
    $ch = curl_init($url);

    curl_setopt($ch, CURLOPT_TIMEOUT, 600);

// write curl response to file
    curl_setopt($ch, CURLOPT_FILE, $fp);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true); 

// get curl response
    curl_exec($ch);
    curl_close($ch);
    fclose($fp);

    echo '<a href="migrate.php?step=2">Download der aktuellen Version abgeschlossen. Weiter zum Prüfen der Dateirechte</a>';
}

if($step == 2) {
    touch(ROOT.'update.processing');
    $zip = new ZipArchive();
    $res = $zip->open($filename);

	$files = $zip->numFiles;

	$errors = array();
	for($i = 0; $i < $files; $i++) {
		$filename = $zip->getNameIndex($i);
		
		if(file_exists(ROOT . $filename) && !is_writable(ROOT . $filename)) {
			$errors[] = $filename;
		}
		if(!file_exists(ROOT . $filename) && file_exists(dirname(ROOT . $filename)) && !is_writable(dirname(ROOT . $filename))) {
			$errors[] = $filename;
		}
	}
	
	if(!empty($errors)) {
		echo '<p style="background-color:red;padding:5px 10px;">Please check the following filepermissions before update. They are not writeable:</p>';
		echo implode('<br/>', $errors);
		exit();
	}
    
	$zip->close();
	echo '<a href="migrate.php?step=3">Dateirechte in Ordnung. Weiter zum Entpacken</a>';
}

if($step == 3) {
    $zip = new ZipArchive();
    $res = $zip->open($filename);
	
	$zip->extractTo(ROOT);
    $zip->close();

    touch(ROOT . 'migratedsystem');

    echo '<a href="migrate.php?step=4">Entpacken der aktuellen Version abgeschlossen. Weiter zum Einspielen aller Datenbank Updates</a>';
}

if($step == 4) {
	unlink($filename);
    unlink(ROOT.'update.processing');

	touch(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'SETUP_TOKEN');
	
	echo '<meta http-equiv="refresh" content="0; URL=update.php">';
	exit();
}

