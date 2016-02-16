<?php

$time = time();

echo "Current UTC time:<br>";
date_default_timezone_set("UTC");
$current_utc = date("H:i:s", $time) . " UTC " . date("Y-m-d", $time);
print_r($current_utc);

echo "<hr>";

$test1 = "01:56:36 UTC 2016-02-04";
echo "Chicago time for supplied UTC timestamp ({$test1}):<br>";
date_default_timezone_set("America/Chicago");
$x = date("Y-m-d H:i:s", strtotime($test1));
print_r($x);

echo "<hr>";

$test2 = "2016-02-07 22:19:06";
echo "Australia time for supplied SQL timestamp ({$test2}):<br>";
date_default_timezone_set("Australia/Sydney");
$x = date("Y-m-d H:i:s", strtotime($test2));
print_r($x);

?>