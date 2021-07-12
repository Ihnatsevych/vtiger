<?php

use ComponentExample\Form;
use \ComponentExample\VTEntity;
use \ComponentExample\VTTemplate;

use ComponentExample\Form\Field;

global $root_directory;
require_once($root_directory."/modules/ComponentExample/autoload_wf.php");

class ComponentExample_GetForm_View extends Vtiger_Index_View {

    function checkPermission(Vtiger_Request $request) {
        return true;
    }

    public function process(Vtiger_Request $request) {
        $adb = PearDatabase::getInstance();

        $moduleName = $request->getModule();
        $qualifiedModuleName = $request->getModule(false);
        $viewer = $this->getViewer($request);

        $form = new Form();

        $form->setWidth(600);
        $tab = $form->addTab('General');
        $group = $tab->addGroup('General');

        $group->addField()
            ->setLabel('Account title')
            ->setName('title')
            ->setType(Field::INPUT_TEXT);

        $group->addField()
            ->setLabel('Account title')
            ->setName('title_RO')
            ->setReadonly(true)
            ->setType(Field::INPUT_TEXT);

        $group = $tab->addGroup('Server Data');
        $group->setColumCount(2);

        $lengthValidator =new Form\Validator\Length();
        $lengthValidator->minLength(4);


        $group->addField()
            ->setLabel('Base URL')
            ->setName('url')
            ->addValidator($lengthValidator)
            ->setType(Field::INPUT_TEXT);

        $group->addField()
            ->setLabel('Owner E-Mail')
            ->setName('port')
            ->setType(Field::INPUT_EMAIL)
            ->addValidator(new Form\Validator\Mandatory());

        $tab = $form->addTab('Additional Data');
        $group = $tab->addGroup('Access Data');

        $group->addField()
            ->setLabel('Passwort')
            ->setName('password')
            ->setType(Field::INPUT_PASSWORD);

        $group = $tab->addGroup('Other Fields');

        $group->addField()
            ->setLabel('Checkbox')
            ->setName('checkbox')
            ->setType(Field::INPUT_BOOLEAN);

        $group->addField()
            ->setLabel('Date')
            ->setName('date')
            ->setType(Field::INPUT_DATE);

        /*
        $group->addField()
            ->setLabel('Signature')
            ->setName('signature')
            ->setType(Field::INPUT_HTMLEDITOR);
*/
        $group->addField()
            ->setLabel('Picklist')
            ->setName('picklist')
            ->setType(Field::INPUT_PICKLIST)
            ->setOptions(array('options' => array('allow' => 'Allow', 'deny' => 'Deny access')));

        $viewer->assign('Form', $form);

        $data = [
            'title_RO' => 'Account title Value RO',
            'title' => 'Account title Value'
        ];

        $form->setValues($data);

        echo json_encode(
            $form->getFrontendData()
        );
    }

    public function validateRequest(Vtiger_Request $request) {
        $request->validateReadAccess();
    }
}
