<div class="ComponentExampleBox">
    <input type="button" class="OpenConditionPopup" value="Open Condition Popup" />

    <script type="text/javascript" src="modules/ComponentExample/views/resources/js/complexecondition.js"></script>
    Condition in Module: <select id="moduleSelector">
        <option value="Contacts">Contacts</option>
        <option value="Accounts">Accounts</option>
        <option value="Invoice">Invoice</option>
    </select>
    <h2>Condition Result</h2>
    <h3>Condition Text</h3>
    <div id="TextCondition"></div>

    <form method="POST" action="#">
        <h3>Condition Value</h3>
        <textarea name="condition" id="ValueElement">{$condition}</textarea>
        <br/>
        <input type="submit" name="generate_sql" value="Generate SQL" />
        {if !empty($query)}
            <h4>Query</h4>
            <pre>
                {$query}
            </pre>
            <h4>Tables</h4>
            <pre>
                {$tables}
            </pre>
        {/if}
    </form>
</div>