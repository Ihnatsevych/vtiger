<div class="FormGenContainer">
    <ul class="FormGenEditorTabs" style="{if count($TABS) eq 1}display:none;{/if}">
        {foreach from=$TABS key=INDEX item=TAB}
            <li class="FormGenTabBtn {if $INDEX eq 0}ActiveFormTab{/if}" data-target="FormGenTab_{$INDEX}">
                {vtranslate($TAB->getTabLabel(), $FORMMODULE)}
            </li>
        {/foreach}
    </ul>

    {foreach from=$TABS key=INDEX item=TAB}
        <div id="FormGenTab_{$INDEX}" class="FormGenTab {if $TAB->skipPaddings()}FullSize{/if} {if $INDEX eq 0}ActiveFormGenTab{/if}" style="display:none;">
            {foreach from=$TAB->getGroups() key=INDEX item=GROUP}
                {if $GROUP->hasHeadline() && count($TAB->getGroups()) > 1}
                    <h4 style="margin:{if $INDEX > 0}15px{else}0{/if} 0 5px 0;color:#576873;text-transform: uppercase;font-size:14px;font-weight:bold;line-height:25px;    justify-content: left; align-items: center;">
                        <i class="fa fa-stop-circle" aria-hidden="true"></i>
                        {vtranslate($GROUP->getHeadline(), $FORMMODULE)}
                    </h4>
                {/if}

                <div class="FormGenFields Columns_{$GROUP->getColumnCount()}">
                    {foreach from=$GROUP->getFields() item=FIELD}
                        <div class="FormGenField {if !empty($FIELD->isFullWidth())}FormGenFullwidthField{/if}" data-fieldname="{$FIELD->getName()}">
                            {$FIELD->render()}
                        </div>
                    {/foreach}
                </div>

            {/foreach}

        </div>
    {/foreach}
</div>
