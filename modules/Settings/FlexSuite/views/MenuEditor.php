<?php

class Settings_FlexSuite_MenuEditor_View extends Settings_Vtiger_Index_View
{

    public function process(Vtiger_Request $request)
    {
        $adb = \PearDatabase::getInstance();
        $viewer = $this->getViewer($request);

        // $elements = array();
        // $viewer->assign('ELEMENTS', $elements);

        // Add item
        function addItem()
        {
            $itemtype = $_POST['itemtype'];
            $parent = $_POST['parentid'];
            $module = $_POST['moduleid'];
            $positions = \FlexSuite\Database::fetchRows("SELECT `position` FROM menu WHERE `parentid` = ? ORDER BY `position` DESC", $parent);
            ($positions != 'null') ? ($position = $positions[0]['position'] + 1) : $position = 1;
            $insert = \FlexSuite\Database::pquery("INSERT INTO `menu`(`parentid`, `itemtype`, `settings`, `position`) VALUES (?,?,?,?)", $parent, $itemtype, $module, $position);
            if ($insert) {
                header("Location: " . $_SERVER['HTTP_REFERER']);
            }
        }

        // Edit item
        function editItem()
        {
            $itemtype = $_POST['itemtype'];
            $parent = $_POST['parentid'];
            $module = $_POST['moduleid'];
            $id = $_POST['itemid'];
            $insert = \FlexSuite\Database::pquery("UPDATE `menu` SET `parentid`=?, `itemtype`=?, `settings`=? WHERE itemid = ?", $parent, $itemtype, $module, $id);
            if ($insert) {
                header("Location: " . $_SERVER['HTTP_REFERER']);
            }
        }

        // Delete item
        function deleteItem()
        {
            $id = $_POST['itemid'];
            $insert = \FlexSuite\Database::pquery("DELETE FROM `menu` WHERE itemid = ?", $id);
            if ($insert) {
                header("Location: " . $_SERVER['HTTP_REFERER']);
            }
        }

        // Raise item
        function raiseItem()
        {
            $id = $_POST['up'];
            $data = \FlexSuite\Database::fetchRows("SELECT `parentid`, `position` FROM menu WHERE itemid = ?", $id);
            $position = $data[0]['position'];
            $parent = $data[0]['parentid'];
            $new_position = ($position - 1);
            $upper = \FlexSuite\Database::fetchRows("SELECT `itemid` FROM menu WHERE `position` = ? AND parentid = ?", $new_position, $parent);
            $upper_id = $upper[0]['itemid'];
            if ($upper) {
                $up = \FlexSuite\Database::pquery("UPDATE `menu` SET `position`=? WHERE itemid = ?", $new_position, $id);
                $down = \FlexSuite\Database::pquery("UPDATE `menu` SET `position`=? WHERE itemid = ?", $position, $upper_id);
                if ($up && $down) {
                    header("Location: " . $_SERVER['HTTP_REFERER']);
                }
            }
        }

        // Lower item
        function lowerItem()
        {
            $id = $_POST['down'];
            $data = \FlexSuite\Database::fetchRows("SELECT `parentid`, `position` FROM menu WHERE itemid = ?", $id);
            $position = $data[0]['position'];
            $parent = $data[0]['parentid'];
            $new_position = ($position + 1);
            $lower = \FlexSuite\Database::fetchRows("SELECT `itemid` FROM menu WHERE `position` = ? AND parentid = ?", $new_position, $parent);
            $lower_id = $lower[0]['itemid'];
            if ($lower) {
                $up = \FlexSuite\Database::pquery("UPDATE `menu` SET `position`=? WHERE itemid = ?", $new_position, $id);
                $down = \FlexSuite\Database::pquery("UPDATE `menu` SET `position`=? WHERE itemid = ?", $position, $lower_id);
                if ($up && $down) {
                    header("Location: " . $_SERVER['HTTP_REFERER']);
                }
            }
        }

        // Build menu
        function build_menu($rows, $parent = 0)
        {
            $result = '<ul id="sortable1" class="connectedSortable">';
            foreach ($rows as $row) {
                if ($row['parentid'] == $parent) {

                    $result .= '<li id="item_' . $row['itemid'] . '" class="ui-state-default">
                                <label class="select-label">' . $row['itemtype'] . '</label>
                                <form action="" method="post">
                                <input type="hidden" name="up" value="' . $row['itemid'] . '">
                                <button type="submit" name="up_item">▲</button>
                                </form>
                                <form action="" method="post">
                                <input type="hidden" name="down" value="' . $row['itemid'] . '">
                                <button type="submit" name="down_item">▼</button>
                                <a class="btn btn-warning" data-toggle="modal" data-target="#edit' . $row['itemid'] . '">Edit</a>
                                <a class="btn btn-danger" data-toggle="modal" data-target="#delete' . $row['itemid'] . '">Delete</a>
                                </form>';

                    $result .= build_menu($rows, $row['itemid']);
                    $result .= "</li>";
                }
            }
            $result .= '</ul>';

            return $result;
        }

        // Function call
        if (isset($_POST['add_item']))
        {
            addItem();
        }
        if (isset($_POST['edit_item']))
        {
            editItem();
        }
        if (isset($_POST['delete_item']))
        {
            deleteItem();
        }
        if (isset($_POST['up_item']))
        {
            raiseItem();
        }
        if (isset($_POST['down_item']))
        {
            lowerItem();
        }

        $items = \FlexSuite\Database::fetchRows("SELECT * FROM menu ORDER BY `position` ASC"); // get items from database
        $menu = build_menu($items);

        $modules = \FlexSuite\VtUtils::getEntityModules(true); // get modules list

        $viewer->assign('items', $items);
        $viewer->assign('menu', $menu);
        $viewer->assign('modules', $modules);

        $viewer->view('MenuEditor.tpl', 'Settings:FlexSuite');
    }

    function getHeaderScripts(Vtiger_Request $request)
    {
        $headerScriptInstances = parent::getHeaderScripts($request);
        $moduleName = $request->getModule();

        $jsFileNames = array(
            "~modules/$moduleName/views/resources/js/RedooUtils.js",
        );

        $jsScriptInstances = $this->checkAndConvertJsScripts($jsFileNames);
        $headerScriptInstances = array_merge($headerScriptInstances, $jsScriptInstances);

        return $headerScriptInstances;
    }

    function getHeaderCss(Vtiger_Request $request)
    {
        $headerScriptInstances = parent::getHeaderCss($request);
        $moduleName = $request->getModule();

        $cssFileNames = array(
            "~layouts/" . Vtiger_Viewer::getLayoutName() . "/modules/Settings/$moduleName/resources/style.css",
        );

        $cssScriptInstances = $this->checkAndConvertCssStyles($cssFileNames);
        $headerStyleInstances = array_merge($headerScriptInstances, $cssScriptInstances);
        return $headerStyleInstances;
    }
}
