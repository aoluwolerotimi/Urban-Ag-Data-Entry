function doGet() {
  return HtmlService.createHtmlOutputFromFile("main");
}

function saveHarvestData(hgId, harvestData, phase) {
  let ws = SpreadsheetApp.getActiveSpreadsheet();
  let harvestSS = ws.getSheetByName("Harvest Tracking");
  let rows = harvestSS.getDataRange().getValues();

  // Check if entry already exists
  let entryRow = -1;
  for (let i = 0; i < rows.length; i++) {
    if (rows[i][0] == hgId) {
      entryRow = i + 1;
      break;
    }
  }

  // Collect data to save
  let dataToSave = [];
  harvestData.crops.forEach((crop, index) => {
    let row = [
      hgId,
      harvestData.harvestdate,
      harvestData.source,
      crop.crop,
      crop.weight,
      crop.foodTransformation,
      crop.destination,
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

function lookupHarvestData(hgId) {
  let ws = SpreadsheetApp.getActiveSpreadsheet();
  let harvestSS = ws.getSheetByName("Harvest Tracking");
  let rows = harvestSS.getDataRange().getValues();

  // Trim and normalize the hgId for comparison
  hgId = hgId.trim().toLowerCase();
  Logger.log(`Comparing ${hgId}`);
  // Create an array of all hgIDs
  let hgIdArray = rows.map(row => row[0].trim().toLowerCase());

  // Find the first occurrence of the hgId in the array
  let entryRow = hgIdArray.indexOf(hgId);
  Logger.log(`${entryRow}`);
  if (entryRow === -1) {
    // No entry found
    return null;
  } else {
    let harvestData = {
      harvestdate: Utilities.formatDate(rows[entryRow][1], "EST", "yyyy-MM-dd"),
      source: rows[entryRow][2],
      crops: []
    };

    // Collect all rows with the same hgId
    for (let i = entryRow; i < rows.length && rows[i][0].trim().toLowerCase() === hgId; i++) {
      harvestData.crops.push({
        crop: rows[i][3],
        weight: rows[i][4],
        foodTransformation: rows[i][5],
        destination: rows[i][6],
        comments: rows[i][7]
      });
    }
  // Logger.log(harvestData)
    return harvestData;
  }
}

// function test(){
//   lookupHarvestData("2024-07-01-Evangel")
// }

