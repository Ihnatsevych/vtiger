<?php
namespace FlexSuite;

class Config
{
    private static $_TableName = 'flexsuite_config';
    private static $Cache = array();

    public static function clear($key)
    {
        $sql = 'DELETE FROM ' . self::$_TableName . ' WHERE `key` = ?';
        VtUtils::pquery($sql, $key);
    }

    public static function get($key, $default = -1)
    {
        if (isset(self::$Cache[$key])) {
            return self::$Cache[$key];
        }
        $adb = \PearDatabase::getInstance();

        $sql = 'SELECT value FROM ' . self::$_TableName . ' WHERE `key` = ?';
        $result = VtUtils::pquery($sql, array($key));

        if (VtUtils::num_rows($result) == 0) {
            return self::$Cache[$key] = $default;
        }

        $value = html_entity_decode($adb->query_result($result, 0, 'value'));
        return self::$Cache[$key] = unserialize($value);
    }

    public static function set($key, $value, $autoload = false)
    {
        if(empty($key)) return;

        $adb = \PearDatabase::getInstance();

        self::$Cache[$key] = $value;
        $value = serialize($value);

        // Do not use dieOnError
        $sql = 'REPLACE INTO ' . self::$_TableName . ' SET `key` = ?, `value` = ?, autoload = ?';
        VtUtils::pquery($sql, array($key, $value, $autoload ? 1 : 0), false);
    }

    public static function getInterface()
    {
        return new ConfigInterface();
    }

    public static function load()
    {
        VtUtils::query('CREATE TABLE IF NOT EXISTS `flexsuite_config` (
 `key` varchar(128) NOT NULL,
 `value` text NOT NULL,
 `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 `autoload` tinyint(4) NOT NULL,
 PRIMARY KEY (`key`)
) ENGINE=InnoDB');

        $sql = 'SELECT * FROM ' . self::$_TableName . ' WHERE autoload = 1';
        $result = VtUtils::query($sql);

        while ($row = VtUtils::fetchByAssoc($result)) {
            self::$Cache[$row['key']] = unserialize(html_entity_decode($row['value'], ENT_QUOTES));
        }
    }
}

class ConfigInterface
{
    public function get($key, $default = -1)
    {
        return Config::get($key, $default);
    }
    public function set($key, $value)
    {
        Config::set($key, $value);
    }
}
