//On opening file create custom menu option
function onOpen() {
  SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
      .createMenu('Custom Menu')
      .addItem('Custome Sidebar', 'showSidebar')
      .addToUi();
}

// On click show sidebar
function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('Index')
      .setTitle('My custom sidebar')
      .setWidth(300);
  SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
      .showSidebar(html);
}

//Handle form submit with date passed as formObject
function processForm(formObject) {  
 
//  Set range
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  var range = sheet.getRange(1,1,lastRow,lastCol).getValues();
  var rowLength = sheet.getRange(1,1,lastRow).getValues();

//  Loop to check if timestamps match QA selected date
  for(i = 1; i <= rowLength.length - 1; i++) {
    let row = sheet.getRange(i+1,1,1,lastCol).getValues();
    let col = row[0];
//    col[0] is equal to the col with time stamps in it.
    let calibrationDate = (col[0]);    
//  Convert selected date to timestamp format
    let selectedDate = new Date (formObject.date.toString()); 
//  Work around to compare Year,Month,Date of Timestamp with out hours sec etc
    let sYyyy = Utilities.formatDate(new Date(calibrationDate), "GMT","yyyy");
    let sMm = Utilities.formatDate(new Date(calibrationDate), "GMT","MM");
    let sDd = Utilities.formatDate(new Date(calibrationDate), "GMT","dd");

    let tYyyy = Utilities.formatDate(new Date(selectedDate), "GMT","yyyy");
    let tMm = Utilities.formatDate(new Date(selectedDate), "GMT","MM");
    let tDd = Utilities.formatDate(new Date(selectedDate), "GMT","dd");

//    Check to see if dates are on same date
 if (sYyyy + sMm + sDd === tYyyy + tMm + tDd) {
   SpreadsheetApp.getUi().alert(calibrationDate);
//   Grab all values from row that matches
//   Create an object with those values. Possibly with a loop
   //  send Html template using passed variable to fill in blanks
  } 
}
}
