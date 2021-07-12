<div class="container-fluid" id="moduleManagerContents">
    <form method="POST" action='#' onsubmit="storeLicense();return false;">
        <div class="widget_header row-fluid">
            <div class="span12">
                <h3>
                    <b>
                        {vtranslate('BeeFree Maileditor', 'ComponentExample')} {vtranslate('Configuration', 'ComponentExample')}
                    </b>
                </h3>
            </div>
        </div>
        <hr>

        <script type="text/javascript" src="modules/ComponentExample/resources/Backend.js?v=1.0"></script>
        <table class="table table-condensed">
            {foreach from=$templates item=template}
                <tr data-templateid="{$template['id']}" class="template">
                    <td style="width:50px;">{$template['id']}</td>
                    <td style="width:200px;">{vtranslate($template['module_name'], $template['module_name'])}</td>
                    <td>{$template['name']}</td>
                    <td>
                        <a href="index.php?module=ComponentExample&view=Editor&parent=Settings&templateid={$template['id']}">Edit</a>
                        &nbsp;&middot;&nbsp;
                        <a href="#" class="DuplicateTemplate">Duplicate</a>
                        &nbsp;&middot;&nbsp;
                        <a href="#" class="DeleteTemplate">Delete</a>
                    </td>
                </tr>
            {/foreach}
        </table>
            <br>
            {*<button class="btn btn-primary" onclick="refreshLicense();">{vtranslate('LBL_REVALIDATE_LICENSE', 'Settings:Workflow2')}</button>*}
            <button class="btn btn-success" onclick="addTemplate();">{vtranslate('create Template', 'ComponentExample')}</button>
    </form>
</div>
