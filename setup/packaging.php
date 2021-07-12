<?php

$contentDir = realpath(__DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;

define('ROOT', $contentDir);

define('TMPDIR', $contentDir.'/test/'.date('YmdHis'));
mkdir(TMPDIR);

function rrmdir($src) {
    $dir = opendir($src);
    while(false !== ( $file = readdir($dir)) ) {
        if (( $file != '.' ) && ( $file != '..' )) {
            $full = $src . '/' . $file;
            if ( is_dir($full) ) {
                rrmdir($full);
            }
            else {
                unlink($full);
            }
        }
    }
    closedir($dir);
    rmdir($src);
}
function addDirectoryToZip(&$zip, $dir, $base = 0, $baseFolder = '') {
    global $ignoreFiles;
    global $obfuscated;

    foreach(glob($dir . '{,.}[!.,!..]*',GLOB_MARK|GLOB_BRACE) as $file) {
        if(is_dir($file)) {
            addDirectoryToZip($zip, $file, $base, $baseFolder);
        } else {
            $zip->addFile($file, substr($file, $base));
        }
    }
}
function collectFiles($dir, $base = 0, $baseFolder = '') {
    //var_dump($dir);
    global $obfuscated;

    foreach(glob($dir . '{,.}[!.,!..]*',GLOB_MARK|GLOB_BRACE) as $file) {
        if(basename($file) == '.git') {
            continue;
        }

        if(is_dir($file)) {
            collectFiles($file, $base, $baseFolder);
        } else {
            if(!empty($baseFolder)) {
                $baseFolder = rtrim($baseFolder, '/').'/';
            }

            $currentBase = $base;
            $currentBaseFolder = $baseFolder;
            $currentFile = $file;

            $tmpFile = TMPDIR . DIRECTORY_SEPARATOR . $currentBaseFolder . substr($currentFile, $currentBase);
            @mkdir(dirname($tmpFile), 0777, true);

            copy($file, $tmpFile);
            echo 'Add '.$baseFolder . substr($file, $base).PHP_EOL;

            foreach($obfuscated as $ignoreRegex) {
                if(preg_match('#'.$ignoreRegex.'#', $file)) {
                    echo 'Obfuscate '.substr($file, $base).' because of '.$ignoreRegex.PHP_EOL;

                    if (in_array(strtolower(array_pop(explode('.', $file))), array('php', 'inc', 'service'))){
                        cryptFile($tmpFile);
                    }
                }
            }
        }
    }
}

if(empty($_POST['module'])) {
    $moduleList = glob(ROOT . 'modules' . DIRECTORY_SEPARATOR . '*');

    $moduleName = array();
    echo 'Module to generate: ';
    echo '<form method="POST" action="#"><select name="module" required="required">';
    echo '<option value=""></option>';

    foreach($moduleList as  $module) {

        if(file_exists($module.'/manifest.xml')) {
            echo '<option value="'.basename($module).'">'.basename($module).'</option>';
        }

    }

    echo '</select>';
    echo '<input type="submit" name="submit" value="Generate" /></form>';
    echo '<br/><p>If a module is not listed, make sure you store a manifest.xml file within main module directory.</p>';
} else {
    $moduleName = $_POST['module'];
    $moduleName = preg_replace('/[^a-zA-Z0-9_-]/', '', $moduleName);

    $fileName = $moduleName . '-' . date('Y-m-d-H-i').'.zip';
    $zipfile = ROOT . 'test' . DIRECTORY_SEPARATOR . 'upload' . DIRECTORY_SEPARATOR . $fileName;

    @unlink($zipfile);
    $zip = new ZipArchive();
    $ret = $zip->open($zipfile, ZipArchive::CREATE);

    echo '<a href="../test/upload/'.$fileName.'">Download '.$fileName.'</a>';
    echo '<pre style="font-size:11p;">';

    echo 'Add manifest.xml'.PHP_EOL;
    $zip->addFile(ROOT . 'modules/'.$moduleName.'/manifest.xml', 'manifest.xml');

    if(file_exists(ROOT . 'modules/'.$moduleName.'/license.txt')) {
        echo 'Add license.txt'.PHP_EOL;
        $zip->addFile(ROOT . 'modules/'.$moduleName.'/license.txt', 'license.txt');
    }

    $files = glob(ROOT.'languages/*/'.$moduleName.'.php');
    foreach($files as $file) {
        echo 'Add '.substr($file, strlen(ROOT)).PHP_EOL;
        $zip->addFile($file, substr($file, strlen(ROOT)));
    }

    $files = glob(ROOT.'languages/*/Settings/'.$moduleName.'.php');
    foreach($files as $file) {
        echo 'Add '.substr($file, strlen(ROOT)).PHP_EOL;
        $zip->addFile($file, substr($file, strlen(ROOT)));
    }

    collectFiles(
        ROOT . 'layouts/*/modules/'.$moduleName.'/', // The path to the folder you wish to archive
        strlen(ROOT) // The string length of the base folder
    ////'settings'
    );
    collectFiles(
        ROOT . 'layouts/*/modules/Settings/'.$moduleName.'/', // The path to the folder you wish to archive
        strlen(ROOT) // The string length of the base folder
    //'settings'
    );

    $files = glob(ROOT.'cron/modules/'.$moduleName.'/*');
    foreach($files as $file) {
        $targetFilename = 'cron/modules/'.basename($file);
        echo 'Add '.$targetFilename.PHP_EOL;
        $zip->addFile($file, 'cron/'.basename($targetFilename));
    }

    collectFiles(
        ROOT . 'modules/'.$moduleName.'/', // The path to the folder you wish to archive
        strlen(ROOT) // The string length of the base folder
    //'modules'
    );

    collectFiles(
        ROOT . 'modules/Settings/'.$moduleName.'/', // The path to the folder you wish to archive
        strlen(ROOT . 'modules/Settings/'.$moduleName.'/'), // The string length of the base folder
        'settings'
    );

    addDirectoryToZip($zip, TMPDIR.'/', strlen(TMPDIR.'/'));

    $zip->close();
    echo '</pre>';
    echo '<a href="../test/upload/'.$fileName.'">Download '.$fileName.'</a>';

    rrmdir(TMPDIR);
    //unlink($zipfile);
}