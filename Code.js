function doGet() {
    return HtmlService.createHtmlOutputFromFile("main");
  }
  
  function saveHarvestData(uniqueId, harvestData, phase) {
    let ws = SpreadsheetApp.getActiveSpreadsheet();
    let harvestSS = ws.getSheetByName("Harvest Tracking");
    let rows = harvestSS.getDataRange().getValues();
  
    // Check if entry already exists
    let entryRow = -1;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i][0] == uniqueId) {
        entryRow = i + 1;
        break;
      }
    }
  
    // Collect data to save
    let dataToSave = [];
    harvestData.crops.forEach((crop, index) => {
      let row = [
        uniqueId,
        harvestData.harvestdate,
        harvestData.source,
        crop.crop,
        crop.weight,
        crop.foodTransformation,
        crop.destination,
        crop.marketDate,
        crop.comments
      ];
      dataToSave.push(row);
    });
  
    if (entryRow == -1) {
      // New entry, append rows
      harvestSS.getRange(harvestSS.getLastRow() + 1, 1, dataToSave.length, dataToSave[0].length).setValues(dataToSave);
    } else {
      // Existing entry, update rows
      for (let i = 0; i < dataToSave.length; i++) {
        harvestSS.getRange(entryRow + i, 1, 1, dataToSave[0].length).setValues([dataToSave[i]]);
      }
    }
  
    // Update phase status
    if (phase === 1) {
      harvestSS.getRange(entryRow + 1, 10).setValue("Phase 1 Completed");
    } else if (phase === 2) {
      harvestSS.getRange(entryRow + 1, 11).setValue("Phase 2 Completed");
    } else if (phase === 3) {
      harvestSS.getRange(entryRow + 1, 12).setValue("Phase 3 Completed");
    }
  }
  