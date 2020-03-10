<?php
    function OpenCon()
    {
      $username = "";
      $password = "";
      $host = "";
      $database = "";

        $con = new mysqli($host, $username, $password, $database) or die("Connect failed: %s\n". $conn -> error);

        return $con;
    }

    function CloseCon($con)
    {
        $con->close();
    }
?>
