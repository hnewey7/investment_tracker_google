var api_key = "S88A2RDUVZI9BHMI";

function search_symbol(keyword) {
  // Function to search what symbols are available on Alpha Vantage.

  // Get url.
  var url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keyword}&apikey=${api_key}`;

  // Create options.
  var options = {
    method: "get"
  };

  // Send get request.
  const response = UrlFetchApp.fetch(url,options);
  const json = JSON.parse(response.getContentText());
  console.log(json);
}