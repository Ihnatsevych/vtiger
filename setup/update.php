<?php
	define('DS', DIRECTORY_SEPARATOR);

	header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
	header("Cache-Control: post-check=0, pre-check=0", false);
	header("Pragma: no-cache");

    $checkFile = __DIR__ . DS . 'SETUP_TOKEN';
    touch($checkFile);
    if(
        file_exists($checkFile) === false ||
        filemtime($checkFile) < time() - 3600
    ) {
        header('Location:../index.php');
        exit();
    }

    if(!empty($_GET['step'])) {
        define('UPDATE_STEP', strtoupper($_GET['step']));
        require_once('update_run.php');
        exit();
    }
?>
<!doctype html>
<html lang="en">
<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">

    <title>Update FlexSuite</title>
</head>
<body>
<a href="../index.php" class="float-right btn-lg btn-primary">Back to CRM</a>
<h1>FlexSuite CRM Update</h1>

<div class="card UpdateStep" data-step="COMPOSER">
    <div class="card-body">
        <h5 class="card-title">CRM Dependencies Update</h5>
        <p class="card-text"><em>No result</em></p>
    </div>
</div>
<div class="card UpdateStep" data-step="MODREQUIREMENTS">
    <div class="card-body">
        <h5 class="card-title">Module Dependencies Update</h5>
        <p class="card-text"><em>No result</em></p>
    </div>
</div>
<div class="card UpdateStep" data-step="SCRIPTS">
    <div class="card-body">
        <h5 class="card-title">Update Scripts</h5>
        <p class="card-text"><em>No result</em></p>
    </div>
</div>
<div class="card UpdateStep" data-step="FINAL">
    <div class="card-body">
        <h5 class="card-title">Update Finalization</h5>
        <p class="card-text"><em>No result</em></p>
    </div>
</div>

<!-- Optional JavaScript -->
<!-- jQuery first, then Popper.js, then Bootstrap JS -->
<script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>

<script type="text/javascript">
    function exec() {
        if(elements.length == 0) {
            return;
        };

        var ele = elements.shift();

        var step = $(ele).data('step');

        $(ele).find('.card-text').html('<strong>Execute step ...</strong>');

        $.get('update.php?step=' + step, function(response) {
            $(ele).find('.card-text').html(response);

            if(step != 'FINAL') {
                exec();
            }
        }, 'text');

    }

    var elements = [];
    $(function() {
        $.fn.shift = function() {
            var bottom = this.get(0);
            this.splice(0,1);
            return bottom;
        };

        elements = $('.UpdateStep');
        exec();
    });
</script>
<style type="text/css">
    h5 {
        margin:-20px -20px 10px -10px;
        padding:10px;
        background-color:#596875;
        color:white;
    }
    .card {
        border:none;
    }
</style>
</body>
</html>
<?php
