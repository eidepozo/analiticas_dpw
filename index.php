<!DOCTYPE html>
 
<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>Login : Desarrollo de un Proyecto Web - OpenTERA</title>
    <!-- Bootstrap CSS -->
    <link rel="icon" type="image/png" href="assets/images/icons/favicon.ico"/>
    <link rel="stylesheet" href="assets/vendor/bootstrap/css/bootstrap.min.css">
    <link href="assets/vendor/fonts/circular-std/style.css" rel="stylesheet">
    <link rel="stylesheet" href="assets/libs/css/style.css">
    <link rel="stylesheet" href="assets/vendor/fonts/fontawesome/css/fontawesome-all.css">
    <style>
    html,
    body {
        height: 100%;
    }

    body {
        display: -ms-flexbox;
        display: flex;
        -ms-flex-align: center;
        align-items: center;
        padding-top: 40px;
        padding-bottom: 40px;
    }
    </style>
</head>

<body>
    <!-- ============================================================== -->
    <!-- login page  -->
    <!-- ============================================================== -->
    <div class="splash-container">
        <div class="card ">
            <!----><div class="card-header text-center"><a href="index.html"><img class="logo-img" src="assets/images/logo.png" width="100" height="100" alt="logo" size></a><span class="splash-description">Analíticas del Aprendizaje</span></div>
            <div class="card-body">
                <form method="post">
                    <div class="form-group">
                        <input class="form-control form-control-lg" name="user" id="username" type="text" placeholder="Nombre de usuario" autocomplete="off" required>
                    </div>
                    <div class="form-group">
                        <input class="form-control form-control-lg" name="pass" id="password" type="password" placeholder="Contraseña" required>
                    </div>
                    <button type="submit" name="add" class="btn btn-primary btn-lg btn-block">Acceder</button>
                </form>
                <?php

                    include("services/config.php");
                    session_start();
                    if(isset($_POST['add'])){
                        $user= strtoupper($_POST["user"]);
                        $pass= strtoupper( $_POST["pass"]);
                        $sql = mysqli_query(openCon(), "SELECT * FROM mdl_user WHERE username='$user'");
                        if(mysqli_num_rows($sql) == 0){
                            echo '
                            <div class="alert alert-danger alert-dismissable">
                            <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                            Error. El estudiante <strong>'. $user .'</strong> no se encuentra matriculado!</div>';
                        }
                        else{
                            $row = mysqli_fetch_assoc($sql);
                            $id = $row['id'];
                            $sql2 = mysqli_query(openCon(), "SELECT * FROM mdl_logstore_standard_log WHERE userid='$id' AND courseid=16 LIMIT 1");
                            $_SESSION['course_id'] = (mysqli_num_rows($sql2) == 0)? 19 : 16;
                            $_SESSION['login_user'] = $user;
                            $_SESSION['id'] = $id;
                            $_SESSION["loggedin"] = true;
                            header("location: pages/inicio.php");
                        }
                    }
                ?>
            </div>
            <div class="card-footer bg-white p-0  ">
            </div>
        </div>
    </div>
  
    <!-- ============================================================== -->
    <!-- end login page  -->
    <!-- ============================================================== -->
    <!-- Optional JavaScript -->
    <script src="assets/vendor/jquery/jquery-3.3.1.min.js"></script>
    <script src="assets/vendor/bootstrap/js/bootstrap.bundle.js"></script>
</body>
 
</html>