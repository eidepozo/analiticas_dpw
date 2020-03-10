<?php
    include 'config.php';
    $con = OpenCon();
    $iduser = $_GET['id'];
    $idcourse = $_GET['course'];

    if (!($con->connect_errno)) {
        $myquery = "SELECT DATE(FROM_UNIXTIME(timecreated)) AS fecha, COUNT(*) AS total 
        FROM mdl_logstore_standard_log  
        WHERE component='mod_forum' 
        AND action='viewed' 
        AND courseid='$idcourse'
        AND timecreated>=UNIX_TIMESTAMP('2019-06-17') 
        AND timecreated<UNIX_TIMESTAMP('2019-06-24') 
        AND userid='$iduser' 
        GROUP BY fecha";
        
        $results = $con->query($myquery);

        if ( !$results->num_rows >0 ) {
            echo "nooooo!";
        die;
        }

        $data = array();

        for ($x = 0; $x < $results->num_rows; $x++) {
            $data[] = $results->fetch_assoc();
        }

        echo json_encode($data);
    }
    CloseCon($con);
?>
