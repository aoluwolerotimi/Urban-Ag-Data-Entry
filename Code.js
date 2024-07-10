function doGet() {
  return HtmlService.createHtmlOutputFromFile("harvestMain");
}

function saveHarvestData(hgId, harvestData, phase) {
  let ws = SpreadsheetApp.getActiveSpreadsheet();
  let harvestSS = ws.getSheetByName("Harvest Tracking");
  let rows = harvestSS.getDataRange().getValues(); // AO necessary to save all rows like this? why not just the hgID column

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

}

// checking only the column first before pulling only the required rows
function lookupHarvestData(hgId) {
  let ws = SpreadsheetApp.getActiveSpreadsheet();
  let harvestSS = ws.getSheetByName("Harvest Tracking");
  
  // Fetch only the first column values
  let hgIdColumn = harvestSS.getRange(1, 1, harvestSS.getLastRow(), 1).getValues();

  // Trim and normalize the hgId for comparison
  hgId = hgId.trim().toLowerCase();

  // Create an array of all hgIDs
  let hgIdArray = hgIdColumn.map(row => row[0].trim().toLowerCase());

  // Find the first occurrence of the hgId in the array
  let entryRow = hgIdArray.indexOf(hgId);
  
  if (entryRow === -1) {
    // No entry found
    return null;
  } else {
    // Fetch the relevant rows starting from the matching entryRow
    let endRow = entryRow;
    for (let i = entryRow + 1; i < hgIdArray.length; i++) {
      if (hgIdArray[i] !== hgId) {
        break;
      }
      endRow = i;
    }

    let rows = harvestSS.getRange(entryRow + 1, 1, endRow - entryRow + 1, harvestSS.getLastColumn()).getValues();

    let rawDate = new Date(rows[0][1]);
    let formattedDate = Utilities.formatDate(rawDate, Session.getScriptTimeZone(), "yyyy-MM-dd");

    let harvestData = {
      harvestdate: formattedDate,
      source: rows[0][2],
      crops: []
    };

    // Collect all rows with the same hgId
    for (let i = 0; i < rows.length && rows[i][0].trim().toLowerCase() === hgId; i++) {
      harvestData.crops.push({
        crop: rows[i][3],
        weight: rows[i][4],
        foodTransformation: rows[i][5],
        destination: rows[i][6],
        comments: rows[i][7]
      });
    }
    return harvestData;
  }
}