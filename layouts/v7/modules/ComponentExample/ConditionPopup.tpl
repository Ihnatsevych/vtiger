<div class="modal-dialog modelContainer" style="width:1200px;">
    {assign var=HEADER_TITLE value={vtranslate("configure Condition",$ConditionScopeModule)}}
    {include file="ModalHeader.tpl"|vtemplate_path:$MODULE TITLE=$HEADER_TITLE}

    <form method="POST" id="PopupConditionForm" action="index.php?module=Workflow2&parent=Settings&action=ConditionPopupStore">
        <div class="modal-content">
            <input type="hidden" name="task[module]" value="{$toModule}" />
            <p style="margin:5px 10px;">
                {$title}
            </p>
            <div style="margin:0 10px;">
                {$conditionalContent}
            </div>

            {if $show_calculation}
                <div style="margin:10px;overflow:hidden;">
                    <input type="button" class="btn btn-primary calculateRecords pull-left" name="calculator" value="{vtranslate('calculate number of records', $ConditionScopeModule)}" />
                    <p id="recordMatchCounter" class=" pull-left" style="line-height:28px;margin-left:20px;display:none;"><span></span> {vtranslate('Records found', $ConditionScopeModule)}</p>
                </div>
            {/if}
            {include file='ModalFooter.tpl'|@vtemplate_path:$MODULE BUTTON_NAME=vtranslate('store condition', $ConditionScopeModule)}
        </div>
    </form>

</div>


<script type="text/javascript">
    {$javascript}
</script>
