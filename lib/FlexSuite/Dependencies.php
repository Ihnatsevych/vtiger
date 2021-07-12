<?php


namespace FlexSuite;


class Dependencies
{
    public static function registerComposerPackage($package, $version)
    {
        $composer = json_decode(file_get_contents(\VtigerConfig::get('root_directory') . 'composer.json'), true);

        if ($composer['require'][$package]) {
            $composer['require'][$package] = $version;
        }
    }
}
