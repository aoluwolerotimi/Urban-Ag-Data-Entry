function doGet() {
    return HtmlService.createHtmlOutputFromFile("main")
  }
  
  function storeHarvest(harvest){
  let ws=SpreadsheetApp.getActiveSpreadsheet();
  let harvestSS =ws.getSheetByName("Harvest Tracking");
  harvestSS.appendRow([harvest.harvestdate, harvest.source, harvest.crop,,,,,,])
  
  }