Miscellaneous scripts
==========

These are my miscellaneous scripts that don't yet fit in to a more formal repository.

## `gamedaze/`

These are just some basic Node.js test scripts that I started as an experiment. I wanted to fetch all Major League Baseball stadiums and somehow display them in a web interface. **These scripts are experimental only and may not work completely yet.**

## `datetime.php`

Random date/time conversions and output.

## `google_maps.php`

[See here](https://developers.google.com/maps/documentation/javascript/tutorial#api_key) on how to generate your API key. Put that value in `google_maps_auth.php` file. The contents should look like:

	<?php

		// your Google Maps API key.
		$auth_key = "";

	?>

## `google_sheets.js`

An example function to use with Google Sheets scripting. [Read more on my blog post](http://blog.matt.thomm.es/post/135857895761/google-sheets-programming).

## `parse_params.php`

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