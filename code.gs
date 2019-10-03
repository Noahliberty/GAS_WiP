//On opening file create custom menu option
function onOpen() {
  SpreadsheetApp.getUi() 
  .createMenu('QA Menu')
  .addItem('QA Emails', 'showSidebar')
  .addToUi();
}

// On click show sidebar
function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('Index')
  .setTitle('My custom sidebar')
  .setWidth(300);
  SpreadsheetApp.getUi() 
  .showSidebar(html);
}

//Handle form submit with date selected in sidebar passed as formObject
function processForm(formObject) {  
  const timestamp = new Date();
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  //  Convert selected date to timestamp format
  const selectedDate = new Date (formObject.date.toString()); 
  const response = ui.alert('Confirm', 'Did you want to send emails for the date: ' + selectedDate, ui.ButtonSet.YES_NO);
  
  // Process the user's response.
  if (response == ui.Button.YES) {
    let counter = 0;
    // create loop for both Opp and Non-Opp tabs in SS 
    const tabs = [
      "Opp Scenario",
      "Non-Opp Scenario"
    ]; 
    
    //  for loop to loop both sheets opp & nonopp
    for(var t = 0; t < tabs.length; t++) {
      //  Set range as per SS and # of rows and cols
      let sheet = ss.getSheetByName(tabs[t]);
      let lastRow = sheet.getLastRow();
      let lastCol = sheet.getLastColumn();
      let range = sheet.getRange(1,1,lastRow,lastCol).getValues();
      let rowLength = sheet.getRange(1,1,lastRow).getValues();      
      
      //  Loop to check if timestamps match QA selected date
      for(i = 1; i <= rowLength.length - 1; i++) {
        let row = sheet.getRange(i+1,1,1,lastCol).getValues();
        let sentCol = sheet.getRange(i + 1,lastCol);
        let dateCol = sheet.getRange(i + 1, 1);
        let col = row[0];
        //col[0] is equal to the cell with time stamp
        let calibrationDate = (col[0]);   
        
        //  Work around to compare Year,Month,Date of Timestamp with out hours sec etc(Needs improvment?)
        let sYyyy = Utilities.formatDate(new Date(calibrationDate), "GMT","yyyy");
        let sMm = Utilities.formatDate(new Date(calibrationDate), "GMT","MM");
        let sDd = Utilities.formatDate(new Date(calibrationDate), "GMT","dd");
        
        let tYyyy = Utilities.formatDate(new Date(selectedDate), "GMT","yyyy");
        let tMm = Utilities.formatDate(new Date(selectedDate), "GMT","MM");
        let tDd = Utilities.formatDate(new Date(selectedDate), "GMT","dd");
        
        // Check to see if email sent
        
        
        //Check to see if dates selected are the same and add check for QA Cal. 
        if (sYyyy + sMm + sDd === tYyyy + tMm + tDd && col[6] !== "QA Calibration" && sentCol.isBlank()) {          
          
          // set object with values for export to html file(s)
          let qaInfo = {
            evaluatoremail: col[39],
            source: col[3],
            product: col[4],	
            language: col[5],
            agentldap: col[6], // do not include @google.com
            dateofcall: col[7],	
            sessionid:	col[8],
            salesforcelink: col[9],
            typeofcalleval: col[10],     
           
          };  
          
          
          
          //Switch statment for     
          switch (tabs[t]) {
            case "Opp Scenario": 
              {
                //       Get html file 'oppEmail' template
                let templ = HtmlService
                .createTemplateFromFile('oppEmail');                
                //  Define variables in template
                templ.qaInfo = qaInfo;
                let message = templ.evaluate().getContent();                
                // Send email using Templ Html with passed variables   
                MailApp.sendEmail({
                  to: "",
                  subject: "You have a new QA score for W" + col[67],
                  htmlBody: message
                }); 
              }
              
              sheet.getRange(i + 1,lastCol).setValue(timestamp);
              sheet.getRange(i + 1,1,1,lastCol ).setBackground("#6ff29b");   
              counter++
                break;             
            case "Non-Opp Scenario":  
              { 
                let templ = HtmlService
                .createTemplateFromFile('nonOppEmail');  
                templ.qaInfo = qaInfo;
                let message = templ.evaluate().getContent();
                MailApp.sendEmail({
                  to: "", 
                  subject: "You have a new QA score for W" + col[64],
                  htmlBody: message
                });                     
              }       
              sheet.getRange(i + 1,lastCol).setValue(timestamp);
              sheet.getRange(i + 1,1,1,lastCol ).setBackground("#6ff29b");
              counter++
                break;              
            default: 
              SpreadsheetApp.getUi().alert("Something went wrong");
              break;
              
          }; // end of switch statement              
        } else if(dateCol.isBlank()) {
          break;
        };  // end of if else to compare dates and break loop at first empty row)      
      }; // end of timestamp for loop 
    }; // end of 'tabs' for loop 
    SpreadsheetApp.getUi().alert("Finished. You have sent " + counter + " emails for the date: " + selectedDate);   
  } else {
    SpeadsheetApp.getUi().alert("You have not sent any emails for " + selectedDate);
  };
  
};
