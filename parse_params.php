<pre><?php

$x = 'var1=value1&var2%5Ba%5D=value2&var2%5Bb%5D=value3&var3%5Ba%5D%5Bc%5D=value5&var3%5Ba%5D%5Bd%5D=value6&var4=value4';
print_r(urldecode($x));

echo "<br /><br />";

$x1 = explode("&", $x);
//print_r($x1);

$x2 = array();
foreach ($x1 as $i) {
	$i1 = explode("=", $i);
	$var = urldecode($i1[0]);
	$val = $i1[1];
	if (preg_match("/\[/", $var)) {
		// array
		$v_arr = explode("[", $var);
//print_r($v_arr);
		$var_ = $v_arr[0];
		$val_ = trim($v_arr[1], "]");
		if (isset($v_arr[2])) {
			$val_2 = trim($v_arr[2], "]");
			if (isset($v_arr[3])) {
				$val_3 = trim($v_arr[3], "]");
				$x2[$var_][$val_][$val_2][$val_3] = $val;
			} else {
				$x2[$var_][$val_][$val_2] = $val;
			}
		} else {
			$x2[$var_][$val_] = $val;
		}
	} else {
		$x2[$var] = $val;
	}
}
print_r($x2);

echo "<br /><br />";

$x2 = json_encode($x2);
print_r($x2);

?></pre>