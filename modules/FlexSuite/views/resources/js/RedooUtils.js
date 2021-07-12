
// Sorting items
/*
$( function() {
    $( "#sortable1, #sortable2" ).sortable({
        connectWith: ".connectedSortable",
        update: function (event, ui) {
            var data = $(this).sortable('serialize');

            $.ajax({
                data: data,
                type: 'POST',
                url: '~modules/Settings/FlexSuite/actions/MenuReorder.php'
            });
        }
    }).disableSelection();
} );
*/