function sell_current_holding(){
    Logger.log("Running sell current holding...");

    // Get ui and sheets.
    let ui = SpreadsheetApp.getUi()
    let spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let previous_trades = spreadsheet.getSheets()[3];

    // Get active row.
    let active_row = spreadsheet.getActiveCell().getRow();
    Logger.log(`Active cell: ${active_row}`)

    if (check_valid_row(spreadsheet, active_row)) {
        Logger.log("Valid holding selected.");
        let holding_details = get_holding_details(spreadsheet, active_row);
        let confirm_sell = ui.alert("Confirm Sell?", `Name: ${holding_details["name"]} \n Symbol: ${holding_details["symbol"]} \n Current Price: ${holding_details["current_price"]} \n Buy Price: ${holding_details["buy_price"]} \n Quantity: ${holding_details["quantity"]} \n Profit/Loss: ${holding_details["profit_loss"]} \n Percentage Profit/Loss: ${holding_details["percentage_profit_loss"]}`, ui.ButtonSet.YES_NO);
        Logger.log(`Confirm Sell: ${confirm_sell}`)

        if (confirm_sell=="YES") {
            // Delete row.
            spreadsheet.deleteRow(active_row);
            // Add previous trade.
            add_previous_trade(previous_trades, holding_details);
        }

    } else {
        Logger.log("Invalid holding selected.");
        ui.alert("Sell Failed", "Invalid holding selected, please select a valid holding.", ui.ButtonSet.OK);
    }
}


function check_valid_row(spreadsheet, row_number){
    // Function for checking valid row.

    // Get last holding row.
    let last_row = spreadsheet.getLastRow();
    Logger.log(`Last row: ${last_row}`)

    // Check within range.
    if (row_number > 2 && row_number < last_row) {
        return true
    } else {
        return false
    }
}


function get_holding_details(spreadsheet, row_number){
    // Function for getting details of selected holding.
    let holding_details = {
        "name":spreadsheet.getRange(`C${row_number}`).getValue(),
        "symbol":spreadsheet.getRange(`B${row_number}`).getValue(),
        "current_price":spreadsheet.getRange(`D${row_number}`).getValue(),
        "buy_price":spreadsheet.getRange(`E${row_number}`).getValue(),
        "buy_date":spreadsheet.getRange(`F${row_number}`).getValue(),
        "quantity":spreadsheet.getRange(`G${row_number}`).getValue(),
        "profit_loss":spreadsheet.getRange(`K${row_number}`).getValue(),
        "percentage_profit_loss":spreadsheet.getRange(`I${row_number}`).getValue(),
        "account":spreadsheet.getRange(`A${row_number}`).getValue()
    }

    // Change formatting where needed.
    holding_details["current_price"] = new Intl.NumberFormat("en-IE",{ style: "currency", currency: "GBP" }).format(holding_details["current_price"]);
    holding_details["buy_price"] = new Intl.NumberFormat("en-IE",{ style: "currency", currency: "GBP" }).format(holding_details["buy_price"]);
    holding_details["profit_loss"] = new Intl.NumberFormat("en-IE",{ style: "currency", currency: "GBP" }).format(holding_details["profit_loss"]);
    holding_details["percentage_profit_loss"] = new Intl.NumberFormat("en-IE",{ style: "percent", maximumSignificantDigits: 3}).format(holding_details["percentage_profit_loss"]);

    return holding_details
}


function add_previous_trade(spreadsheet, trade_details){
    // Get last row.
    let last_row = spreadsheet.getLastRow();
    Logger.log(`Last row: ${last_row}`)

    let current_date = new Date();

    // Contents of row.
    const contents = [
        trade_details["account"],
        trade_details["symbol"],
        trade_details["name"],
        null,
        current_date,
        trade_details["buy_price"],
        trade_details["buy_date"],
        trade_details["quantity"]
    ]

    // Add formulas.
    contents.push(`=H${last_row}*F${last_row}`);
    contents.push(`=(D${last_row}-F${last_row})/F${last_row}`);
    contents.push(`=J${last_row}/(DAYS(E${last_row},G${last_row})/365)`);
    contents.push(`=(D${last_row}-F${last_row})*H${last_row}`);

    spreadsheet.appendRow(contents)
    const rowSpec = spreadsheet.getRange(`A${last_row+1}:L${last_row+1}`);
    spreadsheet.moveRows(rowSpec,last_row)
}