<form method="POST" action="#">
    {*<flex-complexe-condition module="Accounts" scopename="ComponentExample" name="fieldprefix1" mode="field"></flex-complexe-condition>*}

    {*<flex-complexe-condition module="Quotes" scopename="ComponentExample" name="fieldprefix2"></flex-complexe-condition>*}
    <div class="FieldSetter" style="margin:20px;border:1px solid #000000;"></div>

    <input type="text" name="crmidtotest" value="{$crmidtotest}" />
    <input type="submit" value="Save Configuration" />
</form>

{if !empty($RESULT)}
    <pre>{var_dump($RESULT)}</pre>
{/if}
<script type="text/javascript">
    var FieldSetterConfiguration = {$fieldsetter|json_encode};

</script>