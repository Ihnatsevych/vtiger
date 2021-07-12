<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Stefan Warnat <support@stefanwarnat.de>
 * Date: 15.06.15 14:53
 * You must not use this file without permission.
 */
$adb = \PearDatabase::getInstance();
/*
if(!\ComponentExample\VtUtils::existTable("vtiger_ComponentExample_templates")) {
	echo "Create table vtiger_ComponentExample_templates ... ok<br>";
	$adb->query("CREATE TABLE IF NOT EXISTS `vtiger_ComponentExample_templates` (
		  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
		  `subject` VARCHAR(255) NOT NULL,
		  `text` text NOT NULL,
		  PRIMARY KEY (`id`)
		) ENGINE=InnoDB;");
}


*/