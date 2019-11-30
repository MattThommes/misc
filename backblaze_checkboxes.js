function checkIt(start, max) {
	console.log("Starting at " + start + " with a max of " + max);

	var rows = $("#rtf-table").find("tr[id^=frow] img");

	console.log("Total rows: " + rows.length);

	var processed = 0;

	for (var i in rows) {
		if (parseInt(i, 10)) {
			if (i >= start && processed < max) {
				$(rows[i]).click();
				processed++;
			}
		}
	}
}

checkIt(1050, 400);
