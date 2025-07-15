function buy_new_holding() {
    // Function for buying new holding.
    
    // Get sheets.
    let spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheets()[2];

    // Get last row number.
    let last_row_number = spreadsheet.getLastRow();
    let new_row_number = last_row_number + 1;

    // Get contents for new row.
    const contents = [
        null,
        null,
        null,
        `=GOOGLEFINANCE(B${new_row_number}, "price") /100`,
        null,
        new Date(),
        null
    ]

    // Add formulas.
    contents.push(`=E${new_row_number}*G${new_row_number}`);
    contents.push(`=(D${new_row_number}-E${new_row_number})/E${new_row_number}`);
    contents.push(`=I${new_row_number}/(DAYS(TODAY(),F${new_row_number})/365)`);
    contents.push(`=(D${new_row_number}-E${new_row_number})*G${new_row_number}`);
    contents.push(`=D${new_row_number}*G${new_row_number}`);

    // Add row.
    spreadsheet.appendRow(contents);
    const rowSpec = spreadsheet.getRange(`A${new_row_number}:L${new_row_number}`);
    sheet.moveRows(rowSpec,last_row_number);

    // Copy formatting.
    const source_range = sheet.getRange(`A${last_row_number-1}:L${last_row_number-1}`);
    source_range.copyFormatToRange(sheet, 1, last_row_number-1 , last_row_number, last_row_number);
}