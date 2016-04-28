// The currently active worksheet (where the formula resides).
var sheet = SpreadsheetApp.getActiveSheet();

// The active row (where the forumla resides).
var active_row_dynamic = sheet.getActiveRange().getRow();

// STATIC: The row we are calculating - the current pay period (currently in yellow).
// Set this up in the "Random" sheet.
var active_row = get_range_value("Random!B3");

// The row we started doing the "Borrowed" calculations for.
var starting_row = get_range_value("Random!B4");

//var accounts = {};

/**
 * Displays the "Borrowed (Payments)" column headers (for each account). IE: "Amazon Store card ($163.68)"
 *
 * @param  string account The short name for the account (IE: "amazon_visa"). Get this from the global object (`colors`).
 * @return string         The full text that is displayed in the header cell. IE: "Amazon Store card ($163.68)"
 */
function display_account_header(account) {
  // Get the hex code from the global object.
  var account_desc = accounts[account].description;
  return account_desc;
}

/**
 * Returns the deducted total for the currently active billing period/row.
 * @param  string  account  The unique account name.
 * @return string           The amount deducted in the current billing period/row.
 */
function deducted(account) {
  var d = calculate_spent(account, false, active_row_dynamic, active_row_dynamic, false);
  return "$" + d;
}

/**
 * Calculates the total amount paid for all credit cards (appears in the "Credit Cards" column in the "Main" sheet).
 * This is only concerned with the currently active row (one row).
 *
 * @return integer The range value (SUM).
 */
function calculate_creditcards_total() {
  // Get the Amazon Visa total for the *previous* row, without borrowed included.
  // We get the previous row because that's what we're concerned with when we get paid.
  // IE: What were my Amazon Visa expenditures in the last billing period (that I have to now pay for)?
  var previous_row = active_row_dynamic + 1;
  var amazon_visa_current_row_wo_borrowed = get_cell_value("Deducted!" + accounts["amazon_visa"].borrowed_column + previous_row);
  // Get the amount paid (under "Borrowed (Payments)" sheet) for the current row (for Amazon Visa).
  // This is what payment we are making for Amazon Visa with our current paycheck.
  var amazon_visa_current_row_paid = get_cell_value("'Borrowed (Payments)'!" + accounts["amazon_visa"].borrowed_column + active_row_dynamic);
  // This defaults to whatever we set to pay Chase.
  var amazon_visa_value = amazon_visa_current_row_paid;
  if (amazon_visa_current_row_paid > amazon_visa_current_row_wo_borrowed) {
    // If we paid more to Amazon Visa than we spent in the current row (perhaps there is a larger balance on the credit card),
    // then grab just the remaining portion (the "over payment").
    // For example, let's say `amazon_visa_current_row_wo_borrowed` is $126.76 total.
    // In most cases I'll submit a little more to Chase (usually rounding up) so it's a more solid number, like $130.00.
    // That "over payment" ($3.24 in our example above) becomes `amazon_visa_value`, which we have to deduct in the "Credits Cards" column.
    // It's extra money being taken out, so it has to appear there.
    amazon_visa_value = amazon_visa_current_row_paid - amazon_visa_current_row_wo_borrowed;
  } else {
    // We paid LESS than what we spent.
    // Return 0, because we're not deducting anything extra from our running balance.
    // The extra portion (the overage amount) just adds to the "Owed" balance.
    amazon_visa_value = 0;
  }
  // Get the values for every account (column) except the Amazon Visa one (the Amazon Visa charges we already deduct in the billing period),
  // Also avoid the "PNC savings" column.
  var ranges_to_calculate = ["C", "D", "E", "G", "H", "I", "J"];
  var ranges_value = 0;
  for (var i in ranges_to_calculate) {
    // IE: 'Borrowed (Payments)'!C14
    var current = ranges_to_calculate[i];
    ranges_value += get_range_value("'Borrowed (Payments)'!" + current + active_row_dynamic);
  }
  // Add the Amazon VISA "over payment" to the grand total.
  ranges_value = amazon_visa_value + ranges_value;
  return ranges_value;
}

/**
 * Calculate total spent (minus payments made) for a specific account since we started tracking individual account expenses.
 * (So it includes multiple rows.)
 * 
 * @param  string  account            The short name for the account (IE: "amazon_visa"). Get this from the global object (`colors`).
 * @param  boolean include_borrowed   Whether or not to include totals from the "Borrowed (Used)" sheet.
 * @param  integer starting_row_local The row to start the range (local scope variable).
 * @param  integer ending_row_local   The row to end the range (local scope variable).
 * @param  boolean sub_borrowed       I think this subtracts the total borrowed payments made (for this account) since the starting row.
 * @return integer                    The total spent across all applicate ranges/sheets.
 */
function calculate_spent(account, include_borrowed, starting_row_local, ending_row_local, sub_borrowed) {
  // Get the hex code from the global object.
  var account_colorcode = accounts[account].background_color;
  var account_borrowed_column = accounts[account].borrowed_column;
  var range_total = 0;
  if (typeof(starting_row_local) == "undefined" || starting_row_local == 0) {
    // Use the global var.
    starting_row_local = starting_row;
  }
  if (typeof(ending_row_local) == "undefined" || ending_row_local == 0) {
    // Use the top-most row (below the column headers).
    ending_row_local = 2;
  }
  // "Main" sheet.
  range_total += sumWhereBackgroundColorIs("#" + account_colorcode, "Main!B" + starting_row_local + ":Z" + ending_row_local);
  // "Misc" sheet.
  range_total += sumWhereBackgroundColorIs("#" + account_colorcode, "Misc!B" + starting_row_local + ":Z" + ending_row_local);
  // "Web" sheet.
  range_total += sumWhereBackgroundColorIs("#" + account_colorcode, "Web!B" + starting_row_local + ":Z" + ending_row_local);
  if (include_borrowed) {
    // "Borrowed (Used)" sheet.
    // *** REMOVED ON 04/22/2016. ***
    //range_total += sumWhereBackgroundColorIs("#" + account_colorcode, "'Borrowed (Used)'!B" + starting_row_local + ":Z" + ending_row_local);
  }
  if (typeof(sub_borrowed) != "undefined" && sub_borrowed) {
    // Get total borrowed payments made (for this account) since the starting row.
    var borrowed_payments_total = sumByCondition(
      "",
      account_borrowed_column + starting_row_local + ":" + account_borrowed_column + ending_row_local
    );
    var total = range_total - borrowed_payments_total;
  } else {
    var total = range_total;
  }
  return total.toFixed(2);
}

/**
 * @param  string  cell_val    Something like "Deducted!B12"
 * @param  string  return_type The type of data you want returned (IE: "int", "string").
 * @return                     The actual cell value, in the format you want (integer, string, etc).
 */
function get_cell_value(cell_val, return_type) {
  if (typeof(return_type) == "undefined") {
    return_type = "int";
  }
  var range = sheet.getRange(cell_val);
  var cell = range.getCell(1,1);
  var val = cell.getValue();
  if (return_type == "int") {
    if (typeof(val) != "number") {
      // It's a string so we can use replace on it.
      // We want to capture cell values that are strings, such as when we output the dollar sign: "$123.00"
      // That above example is no longer a number, so replace fails.
      // We just want the number portion (including the decimal, if there is one).
      val = val.replace(/[^0-9\.]+/g, "");
    }
    // Force it to be an integer?
    //val = parseInt(val, 10);
  } else if (return_type == "string") {
    // Force it to be a string.
    val = val.toString();
  }
  return val;
}

// range_val has to be a string (IE: "F16").
function get_range_value(range_val) {
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

function test() {
  //setBackground('yellow');
  sheet.getActiveCell().setBackground('#a4c2f4');
}

/**
 * ****** UNUSED!!!! *******
 * Calculate the running balance of miscellaneous expenditures.
 *
 * @param  integer  this_row      The number of the current cell we are running this function in.
 * @param  integer  previous_row  The number of the cell we are looking at (typically the cell above this_row).
 * @return float                  The new dollar amount indicating our miscellaneous cap.
 */
function calculate_misc(this_row, previous_row) {
  var misc_column_letter = "F";
  var misc_hard_limit_val = 75.00;
  var misc_expenses_rows = "Misc!B" + this_row + ":Z" + this_row;
  var misc_expenses_val = get_range_value(misc_expenses_rows);
  // The value alove the cell we are calculating this formula for.
  var previous_val = get_range_value(misc_column_letter + previous_row);
  if (previous_val > misc_hard_limit_val) {
    // Went over our limit.
    misc_hard_limit_val = misc_hard_limit_val - (previous_val - misc_hard_limit_val);
  } else {
    // Remained under our limit.
    misc_hard_limit_val = misc_hard_limit_val + (misc_hard_limit_val - previous_val);
  }
  return misc_hard_limit_val;
}
