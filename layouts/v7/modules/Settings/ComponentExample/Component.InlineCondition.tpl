<form method="POST" action="#">
    {*<flex-complexe-condition module="Accounts" scopename="ComponentExample" name="fieldprefix1" mode="field"></flex-complexe-condition>*}

    {*<flex-complexe-condition module="Quotes" scopename="ComponentExample" name="fieldprefix2"></flex-complexe-condition>*}
    <div class="ReportConditionContainer"></div>

    <input type="submit" value="Save Condition" />
</form>

<script type="text/javascript">
    var InitReportCondition = {$fieldconfig|json_encode};
</script>