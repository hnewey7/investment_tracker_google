function daily_value_tracker() {
  Logger.log("Running daily task...");

  // Get active sheets.
  Logger.log("Getting active sheets...")
  let spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let summary = spreadsheet.getSheets()[0];
  let investment_history = spreadsheet.getSheets()[1];

  // Check day of week.
  Logger.log("Checking day of the week...")
  const date = new Date()
  const day = date.getDay()
  const valid_day = check_day_of_week(day)

  if (valid_day) {
    Logger.log("Valid day of the week.")

    // Get current valuation.
    let current_value = get_current_valuation()

    Logger.log("Checking row already added...")
    if (!check_row_added(investment_history, date)){
        Logger.log("Row has not been added.")
        // Create new row.
        create_new_row(investment_history, current_value, date)
    } else {
        Logger.log("Row has already been added.")
        // Update valuation.
        update_current_valuation(investment_history, current_value)
    }
    
    
  } else {
    Logger.log("Invalid day of the week.")
  }
}


function check_day_of_week(day) {
    // Function for checking day of week.
    if (day == 0 || day == 6) {
        return false
    } else {
        return true
    }
}


function check_row_added(spreadsheet, date) {
    // Function for checking if row already added.
    last_row_number = spreadsheet.getLastRow()
    last_row_date_string = spreadsheet.getRange(`A${last_row_number}`).getValue()
    last_row_date = new Date(last_row_date_string)

    return date.getFullYear() === last_row_date.getFullYear() &&
         date.getMonth() === last_row_date.getMonth() &&
         date.getDate() === last_row_date.getDate();
}


function get_current_valuation() {
    // Function for getting current account valuation.
    let current_holdings_value = new Intl.NumberFormat("en-IE",{ style: "currency", currency: "GBP" }).format(summary.getRange("B2").getValue());
    return current_holdings_value
}


function create_new_row(spreadsheet, valuation, date) {
    // Create new row with current valuation.
    const contents = [date, valuation]
    // Add previous valuation.
    last_row_number = spreadsheet.getLastRow()
    contents.push(spreadsheet.getRange(`B${last_row_number}`).getValue())
    // Add previous formulas.
    new_row_number = last_row_number + 1
    contents.push(`=B${new_row_number}-C${new_row_number}`)
    contents.push(`=D${new_row_number}/C${new_row_number}`)
    // Add row.
    spreadsheet.appendRow(contents)
}


function update_current_valuation(spreadsheet, valuation) {
    // Function for updating current valuation.
    last_row_number = spreadsheet.getLastRow()
    update_cell = spreadsheet.getRange(`B${last_row_number}`).setValue(valuation)
}