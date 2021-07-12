<?php

//ini_set('display_errors', 1);
//error_reporting(E_ALL & ~E_NOTICE);

global $root_directory;
require_once(dirname(__FILE__)."/ComponentExample.php");
require_once(dirname(__FILE__)."/autoloader.php");

\ComponentExample\Autoload::register("ComponentExample", "~/modules/ComponentExample/lib");