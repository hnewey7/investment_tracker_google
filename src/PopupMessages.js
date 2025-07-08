// Get spreadsheet and sheets.
let spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
let summary = spreadsheet.getSheets()[0];
let current_holdings = spreadsheet.getSheets()[2];
let previous_trades = spreadsheet.getSheets()[3];
let alerts = spreadsheet.getSheets()[4];

function display_summary(){
  // Get UI.
  let ui = SpreadsheetApp.getUi()

  // Get values for current summary.
  let current_holdings_value = new Intl.NumberFormat("en-IE",{ style: "currency", currency: "GBP" }).format(summary.getRange("B2").getValue());
  let profit_loss = new Intl.NumberFormat("en-IE",{ style: "currency", currency: "GBP" }).format(summary.getRange("B3").getValue());

  // Generate pop up.
  ui.alert("Investment Summary","Current holdings are valued: " + current_holdings_value +  "\n With profit / loss: " + profit_loss,ui.ButtonSet.OK);
}

function display_all_alerts(){
  // Display all alerts.

  // Get alerts.
  let active_alerts = get_alerts();

  // Iterate through all alerts.
  let triggered_alerts = new Array();

  for (let i = 0; i < active_alerts.length; i++){
    // Check individual alert.
    if (check_alert(active_alerts[i])) {
      // Add row number to triggered alerts.
      triggered_alerts.push(active_alerts[i]);
    }
  }

  // Display alerts on one pop up.
  display_alerts(triggered_alerts);
}

function get_alerts(){
  // Get all alerts from alerts sheet.
  let all_alerts = alerts.getRange('A2:A100').getValues();
  let active_alerts = new Array();

  // Check populated alerts.
  for (let i = 0; i < all_alerts.length; i++){
    if (all_alerts[i] != ''){
      active_alerts.push(i+2);
    }
  }

  return active_alerts;
}

function check_alert(row_number){
  // Check individual alert.
  
  // Get operator, target and current value.
  let operator = alerts.getRange(`E${row_number}`).getValue();
  let target_value = alerts.getRange(`F${row_number}`).getValue();
  let current_value = alerts.getRange(`G${row_number}`).getValue();

  // Evaluate statement and return.
  return eval(`${current_value} ${operator} ${target_value}`)
}

function display_alerts(triggered_alerts){
  // Display triggered alerts.
  if (triggered_alerts.length == 0) {
    return
  }

  let display_message = ""
  let ui = SpreadsheetApp.getUi();

  for (i=0; i<triggered_alerts.length; i++){
    display_message += `- ${alerts.getRange(`C${triggered_alerts[i]}`).getValue()} ${alerts.getRange(`A${triggered_alerts[i]}`).getValue()}`;
  }
  ui.alert("Triggered Alerts:",display_message,ui.ButtonSet.OK);
  
}

function onOpen(){
  // Display summary.
  display_summary();

  // Display all triggered alerts.
  display_all_alerts();
}

