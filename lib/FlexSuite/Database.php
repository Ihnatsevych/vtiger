<?php
/**
 * Created by Stefan Warnat
 * User: Stefan
 * Date: 25.08.2017
 * Time: 18:18
 */

namespace FlexSuite;


class Database
{
    private $Table = null;

    /**
     * @param $table string
     * @return Database
     */
    public static function table($table)
    {
        $obj = new Database($table);
        return $obj;
    }

    public function __construct($table)
    {
        $this->Table = $table;
    }

    public static function direct($value)
    {
        return array('direct' => true, 'value' => $value);
    }

    public static function checkSequence($table, $checkcolumn = 'id') {
        $sql = 'SELECT id FROM '.$table.'_seq';
        $row = \FlexSuite\Database::fetchByAssoc($sql);

        $sql = 'SELECT MAX('.$checkcolumn.') as maxid FROM '.$table.'';
        $check = \FlexSuite\Database::fetchByAssoc($sql);

        if($check['maxid'] > $row['id']) {
            //Fix wsentity sequence
            $maxSequence = $check['maxid'];

            echo 'Fix sequence '.$table.'! ID = '.$check['maxid'].PHP_EOL;
            $sql = 'UPDATE '.$table.'_seq SET id = '.$maxSequence;
            self::query($sql);
        }
    }

    /**
     * @param $set
     * @return $this
     */
    public function insert($set)
    {
        $sql = $params = array();

        foreach ($set as $key => $value) {
            if (is_array($value) && $value['direct'] === true) {
                $sql[] = '`' . $key . '` = ' . $value['value'];
            } else {
                $sql[] = '`' . $key . '` = ?';
                $params[] = $value;
            }
        }

        VtUtils::pquery('INSERT INTO `' . $this->Table . '` SET ' . implode(',', $sql), $params);

        return $this;
    }

    public function lastInsertId()
    {
        $sql = 'SELECT LAST_INSERT_ID() as id';
        $result = VtUtils::fetchByAssoc($sql);

        return $result['id'];
    }

    /**
     * @param $set
     * @param $where
     * @return $this
     */
    public function update($set, $where, $whereParams = array())
    {
        if (!is_array($where) && is_numeric($where)) {
            $where = array('id = ' . $where);
        }

        $sql = $params = array();

        foreach ($set as $key => $value) {
            $sql[] = '`' . $key . '` = ?';
            $params[] = $value;
        }

        $params = array_merge($params, $whereParams);

        VtUtils::pquery('UPDATE `' . $this->Table . '` ' .
            'SET ' . implode(',', $sql) . ' ' .
            'WHERE ' . implode(' AND ', $where), $params);

        return $this;
    }

    /**
     * @param $set
     * @param $where
     * @return $this
     */
    public function delete($where, $whereParams = array())
    {
        if (!is_array($where) && is_numeric($where)) {
            $where = array('id = ' . $where);
        }

        VtUtils::pquery('DELETE FROM `' . $this->Table . ' WHERE ' . implode(' AND ', $where), $whereParams);

        return $this;
    }

    public static function query($sql)
    {
        $adb = \PearDatabase::getInstance();

        if (!empty($_COOKIE['stefanDebug']) && $_COOKIE['stefanDebug'] == '1') {
            $debug = true;
        } else {
            $debug = false;
        }

        $return = $adb->query($sql, $debug);

        try {
            self::logSQLError($adb->database->errorMsg(), $sql);
        } catch (\Exception $exp) {
            echo $exp->getMessage();
        }

        return $return;
    }

    /**
     * @param $sql string
     * @param array $params
     * @return mixed
     */
    public static function pquery($sql, $params = array())
    {
        if (!is_array($params)) {
            $args = func_get_args();
            array_shift($args);
            $params = $args;
        }

        $adb = \PearDatabase::getInstance();
        if (!empty($_COOKIE['stefanDebug']) && $_COOKIE['stefanDebug'] == '1') {
            $debug = true;
        } else {
            $debug = false;
        }

        $return = $adb->pquery($sql, $params, $debug);

        try {
            self::logSQLError($adb->database->errorMsg(), $adb->convert2Sql($sql, $params));
        } catch (\Exception $exp) {
            echo $exp->getMessage();
        }

        return $return;
    }

    public static function logSQLError($error, $sqlQuery = '')
    {
        if (!empty($error)) {
            if (class_exists(__NAMESPACE__ . '\\SqlFormatter', true)) {
//                require_once(REPORTS_EXTENDS_DIR . '/SqlFormatter.php');
                $sqlQuery = SqlFormatter::format($sqlQuery);
            }

            throw new \Exception('Database Error in Query ' . $sqlQuery . ' - ' . $error);
        }
    }

    public static function numRows($result)
    {
        $adb = \PearDatabase::getInstance();
        return $adb->num_rows($result);
    }

    // @codingStandardsIgnoreStart
    /**
     * Deprecated
     * @param $result
     * @return mixed
     */
    public static function num_rows($result)
    {
        return self::numRows($result);
    }
    // @codingStandardsIgnoreEnd

    /**
     * @param $sql
     * @param array $params
     * @param array $params2, ... [optional]
     * @return array
     */
    public static function fetchRows($sql, $params = array())
    {
        if (!is_array($params)) {
            $args = func_get_args();
            array_shift($args);
            $params = $args;
        }

        $return = array();
        $result = self::pquery($sql, $params);

        while ($row = self::fetchByAssoc($result)) {
            $return[] = $row;
        }
        return $return;
    }
    public static function fetchByAssoc($result, $params = array())
    {
        if (is_string($result)) {
            if (!is_array($params)) {
                $args = func_get_args();
                array_shift($args);
                $params = $args;
            }

            $result = self::pquery($result, $params);
        }

        $adb = \PearDatabase::getInstance();
        return $adb->fetchByAssoc($result);
    }
}
