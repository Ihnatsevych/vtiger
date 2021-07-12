<?php
ini_set('display_errors', 1);
error_reporting(-1);
if(empty($_REQUEST['step'])) {
    $step = 1;
} else {
    $step = intval($_REQUEST['step']);
}

?>

<!doctype html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">

    <title>Flex Suite Setup</title>
  </head>
  <body>
  <br/>
  <div class="container">
      <div style="overflow:hidden">
      <img src="logo.png" alt="Redoo Networks Logo" style="float:right;" />
          <h1>Flex<span style="color:#d13939;">Suite</span> Setup</h1>
      </div>
      <br/>
      <?php
      if($step == 2 && !empty($_POST['db_server']) && !empty($_POST['db_port']) && !empty($_POST['db_name']) && !empty($_POST['db_username']) && !empty($_POST['db_password'])) {
          $error = false;

          try {
              $db = new PDO('mysql:host='.$_POST['db_server'].';dbname='.$_POST['db_name'].'', $_POST['db_username'], $_POST['db_password']);
              $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
              $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
          } catch (\Exception $exp) {
              $error = true;
              echo '<div class="alert alert-danger" role="alert">Cannot connect to database!</div>';
              $step = 1;
          }

          if($error === false) {
              $fileContent = '<?php
    
    //Maximum number of Mailboxes in mail converter
    $max_mailboxes = 3;
    
    
    $dbconfig[\'db_server\'] = \'' . $_POST['db_server'] . '\';
    $dbconfig[\'db_port\'] = \':' . $_POST['db_port'] . '\';
    $dbconfig[\'db_username\'] = \'' . $_POST['db_username'] . '\';
    $dbconfig[\'db_password\'] = \'' . $_POST['db_password'] . '\';
    $dbconfig[\'db_name\'] = \'' . $_POST['db_name'] . '\';
    $dbconfig[\'db_type\'] = \'mysqli\';
    $dbconfig[\'db_status\'] = \'true\';
    $dbconfig[\'db_hostname\'] = $dbconfig[\'db_server\'].$dbconfig[\'db_port\'];
       
        ';

              file_put_contents(__DIR__ . '/../config_override.php', $fileContent);

              echo '<p>Configuration written to config_override.php</p>';
              echo '<div class="alert alert-info" role="alert">To continue press "<strong>Start Import</strong>"</div>';
//        echo '<iframe src="initialize.php?start=1&fn=mysqldump.sql&foffset=0&totalqueries=0" style="width:100%;height:600px;"></iframe>';
              echo '<iframe src="initialize.php" frameborder="0" style="border:3px solid #d13939; border-radius:5px;width:100%;height:600px;"></iframe>';
              echo '<div class="alert alert-info" role="alert">When database Import is ready: &nbsp;&nbsp;&nbsp;<a href="update.php" class="btn btn-primary">Run CRM Initialization</a><br/>CRM Login after initialization: admin / admin</div>';
              return;
          }
      } else {
          $step = 1;
      }

      if($step == 1) {

          if(file_exists(__DIR__ . '/../config_override.php')) {
              echo '<div class="alert alert-danger" role="alert">config_override.php already existing. Please remove first!</div>';
          } else {
          ?>
            <form method="POST" action="?step=2">
                <div class="row">
                    <div class="col">
                          <div class="form-group">
                            <label for="siteURL">Database Server</label>
                            <input type="text" class="form-control" id="db_server" name="db_server" required="required" aria-describedby="emailHelp" placeholder="DB Server"  value="<?php if(!empty($_POST['db_server'])) echo htmlentities($_POST['db_server']); else echo 'localhost'; ?>" />
                          </div>
                    </div>
                    <div class="col" style="max-width:20%;">
                          <div class="form-group">
                            <label for="siteURL">Database Port</label>
                            <input type="text" class="form-control" id="db_port" name="db_port" required="required" aria-describedby="emailHelp" placeholder="DB Port"  value="<?php if(!empty($_POST['db_port'])) echo htmlentities($_POST['db_port']); else echo '3306'; ?>" />
                          </div>
                    </div>
                    <div class="col">
                          <div class="form-group">
                            <label for="siteURL">Database Name</label>
                            <input type="text" class="form-control" id="db_name" name="db_name" required="required" aria-describedby="emailHelp" placeholder="DB Name" value="<?php if(!empty($_POST['db_name'])) echo htmlentities($_POST['db_name']); else echo ''; ?>" />
                          </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <div class="form-group">
                            <label for="siteURL">Database Username</label>
                            <input type="text" class="form-control" id="db_username" name="db_username" required="required" aria-describedby="emailHelp" placeholder="DB Login Username"  value="<?php if(!empty($_POST['db_username'])) echo htmlentities($_POST['db_username']); else echo ''; ?>" />
                        </div>
                    </div>
                    <div class="col">
                        <div class="form-group">
                            <label for="siteURL">Database Passwort</label>
                            <input type="text" class="form-control" id="db_password" name="db_password" required="required" aria-describedby="emailHelp" placeholder="DB Login Password"  value="<?php if(!empty($_POST['db_password'])) echo htmlentities($_POST['db_password']); else echo ''; ?>" />
                        </div>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary">Setup</button>
            </form>
      <?php }
      } ?>
  </div>
    <!-- Optional JavaScript -->
    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
  </body>
</html>