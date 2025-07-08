var api_key = "S88A2RDUVZI9BHMI";

function get_indicator(ticker, indicator, interval, time_period, series_type) {
  // Function for getting indicator value for ticker.

  // Get url.
  var url = `https://www.alphavantage.co/query?function=${indicator}&symbol=${ticker}&interval=${interval}&time_period=${time_period}&series_type=${series_type}&apikey=${api_key}`;

  // Create options.
  var options = {
    method: "get"
  };

  // Send get request.
  const response = UrlFetchApp.fetch(url,options);
  const json = JSON.parse(response.getContentText());

  // Get latest value.
  const latest_value = json[`Technical Analysis: ${indicator}`][Object.keys(json[`Technical Analysis: ${indicator}`])[0]]["RSI"];

  return Number(latest_value)
}