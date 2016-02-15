<?php

$time = time();

echo "Current UTC time:<br>";
date_default_timezone_set("UTC");
$current_utc = date("H:i:s", $time) . " UTC " . date("Y-m-d", $time);
print_r($current_utc);

echo "<hr>";

echo "Chicago time for supplied UTC timestamp:<br>";
date_default_timezone_set("America/Chicago");
$x = date("Y-m-d H:i:s", strtotime("01:56:36 UTC 2016-02-04"));
print_r($x);

echo "<hr>";

echo "Australia time for supplied SQL timestamp:<br>";
date_default_timezone_set("Australia/Sydney");
$x = date("Y-m-d H:i:s", strtotime("2016-02-07 22:19:06"));
print_r($x);

?>