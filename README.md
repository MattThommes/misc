Miscellaneous scripts
==========

These are my miscellaneous scripts that don't yet fit in to a more formal repository.

## google_maps.php

[See here](https://developers.google.com/maps/documentation/javascript/tutorial#api_key) on how to generate your API key. Put that value in `google_maps_auth.php` file. The contents should look like:

	<?php

		// your Google Maps API key.
		$auth_key = "";

	?>

## parse_params.php

Let's say you have a URL-encoded string, and you want to convert it to a JSON string (or just more readable output). Example:

	var1=value1&var2%5Ba%5D=value2&var2%5Bb%5D=value3&var3%5Ba%5D%5Bc%5D=value5&var3%5Ba%5D%5Bd%5D=value6&var4=value4

It's hard to visualize this. Run it through the script and you'll get nice output like this:

	var1=value1&var2[a]=value2&var2[b]=value3&var3[a][c]=value5&var3[a][d]=value6&var4=value4

	Array
	(
			[var1] => value1
			[var2] => Array
					(
							[a] => value2
							[b] => value3
					)

			[var3] => Array
					(
							[a] => Array
									(
											[c] => value5
											[d] => value6
									)

					)

			[var4] => value4
	)


	{"var1":"value1","var2":{"a":"value2","b":"value3"},"var3":{"a":{"c":"value5","d":"value6"}},"var4":"value4"}