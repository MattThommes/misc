/**
 *
 */
function get_range_value(range_val) {
  var sheet = SpreadsheetApp.getActiveSheet();
  var range = sheet.getRange(range_val);
  var val = 0;
  for (var i = 1; i <= range.getNumRows(); i++) {
    for (var j = 1; j <= range.getNumColumns(); j++) {
      var cell = range.getCell(i, j);
      var cellVal = parseFloat(cell.getValue());
      if (isFinite(cellVal)) {
        val += cellVal;
      }
    }
  }
  return val;
}