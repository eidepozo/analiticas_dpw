<?php
    include 'config.php';
    $con = OpenCon();
    $idcourse = $_GET['course'];
    
    if (!($con->connect_errno)) {
        $myquery = "SELECT contextinstanceid AS label, COUNT(*) AS count  
        FROM mdl_logstore_standard_log 
        WHERE (courseid='$idcourse' AND action='viewed' AND timecreated>=UNIX_TIMESTAMP('2019-06-17') 
        AND timecreated<UNIX_TIMESTAMP('2019-06-24') 
        AND userid NOT IN(2,70,167,185)) 
        AND ((component='mod_page' AND target='course_module') 
        OR (component='mod_assign' AND target='submission_status' 
        OR target='submission_form')) 
        GROUP BY label";
        
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
