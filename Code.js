function doGet() {
    return HtmlService.createHtmlOutputFromFile("main")
  }
  
  function storeHarvest(harvest) {
    let ws = SpreadsheetApp.getActiveSpreadsheet();
    let harvestSS = ws.getSheetByName("Harvest Tracking");
  
    // Iterate over each crop and create a new row for each one
    harvest.crops.forEach(function(crop) {
      harvestSS.appendRow([harvest.harvestdate, harvest.source, crop]);
    });
  }