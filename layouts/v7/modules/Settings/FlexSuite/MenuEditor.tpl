<link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
<script src="https://code.jquery.com/jquery-1.12.4.js"></script>
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>


<h1>Menu Editor</h1>
<button class="btn btn-success mt-2" data-toggle="modal" data-target="#create">ADD ITEM</button>

{$menu}

<!-- Modal create item-->
<div class="modal fade" id="create" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Add</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <div class="modal-body">
                <form action="" method="post">
                    <div class="form-group">
                        <small>Item Type</small>
                        <input type="text" class="form-control" name="itemtype" required>
                    </div>
                    <div class="form-group">
                        <small>Module</small>
                        <select name="moduleid" value="{$module["0"]}" size="6" class="form-control" required>
                            {foreach from=$modules item=module}
                                <option value="{$module["0"]}">{$module["1"]}</option>
                            {/foreach}
                        </select>
                    </div>
                    <div class="form-group">
                        <small>Parent</small>
                        <select name="parentid" value="{$parent["parentid"]}" size="6" class="form-control" required>
                            <option value="null">no parent</option>
                            {foreach from=$items item=item}
                                <option value="{$item["itemid"]}">{$item["itemtype"]}</option>
                            {/foreach}
                        </select>
                    </div>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="submit" class="btn btn-primary" name="add_item">Add</button>
                </form>
            </div>
        </div>
    </div>
</div>
<!-- Modal create item-->


<!-- Modal edit item-->
{foreach from=$items item=item_}
    <div class="modal fade" id="edit{$item_['itemid']}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Edit</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                </div>
                <div class="modal-body">
                    <form action="" method="post">
                        <input type="hidden" name="itemid" value="{$item_['itemid']}">
                        <div class="form-group">
                            <small>Item Type</small>
                            <input type="text" class="form-control" name="itemtype" value="{$item_["itemtype"]}" required>
                        </div>
                        <div class="form-group">
                            <small>Module</small>
                            <select name="moduleid" value="{$module["0"]}" size="6" class="form-control" required>
                                {foreach from=$modules item=module}
                                    <option {if $module["0"] eq $item_["settings"]} selected {/if} value="{$module["0"]}">{$module["1"]}</option>
                                {/foreach}
                            </select>
                        </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-primary" name="edit_item">Edit</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
{/foreach}
<!-- Modal edit item-->

<!-- Modal delete item-->
{foreach from=$items item=item_}
    <div class="modal fade" id="delete{$item_['itemid']}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Delete</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                </div>
                <div class="modal-body">
                    <form action="" method="post">
                        <input type="hidden" name="itemid" value="{$item_['itemid']}">
                        <h5 class="modal-title" id="exampleModalLabel">Delete item "{$item_["itemtype"]}"?</h5>

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-primary" name="delete_item">Delete</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
{/foreach}
<!-- Modal delete item-->
