//On opening file create custom menu option
function onOpen() {
  SpreadsheetApp.getUi() 
      .createMenu('Custom Menu')
      .addItem('Custome Sidebar', 'showSidebar')
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
    
    let qaInfoOpp = {
     evaluatoremail: "test", // need to get this based on who is sending the email
     source: col[3],
     product: col[4],	
     language: col[5],
     agentldap: col[6], // do not include
     dateofcall: col[7],	
     sessionid:	col[8],
     salesforcelink: col[9],
     typeofcalleval: col[10],     
     px: {
       introscrubing: col[11],	
       activelistening: col[12],	
       productknowledge:	col[13],
       softskills: col[14],
       recappingandbuildvalue: col[15],
       },     
     qualification: {
       discovery: col[16],
       budget: col[17],
       authority: col[18],
       need: col[19],
       timeline: col[20],
       crosssell: col[21]
       },    	    
     adminwork:  {
       scrubbing: col[22],
       datahygiene:	col[23],
       disclaimer: col[24],
       disclosureinfo: col[25]
       },         	
     comments: col[26],     
     scores: {
       overallpx: col[48],
       overallqualification: col[57],
       overallscrubbingdata: col[62],   
       }        
   } //end of obj

//    Check to see if dates selected are the same and handle 
 if (sYyyy + sMm + sDd === tYyyy + tMm + tDd) {
   
 
   
   //   Grab all values from row that matches and store to object to pass to email html template
   
   //  send Html template using passed variable to fill in blanks
   
     // if statment to check value of scenario type (opp or non opp)
   SpreadsheetApp.getUi().alert(col[10]);
   
   if(col[10] === "Opportunity Scenario") {
   
     let templ = HtmlService
      .createTemplateFromFile('oppEmail');
  
//  Define variables in template
  templ.qaInfoOpp = qaInfoOpp;
  let message = templ.evaluate().getContent();
  
// Send email using Templ Html with passed variables   
   MailApp.sendEmail({
    to: + "",
    subject: "You have a new QA score for W" + col[67],
    htmlBody: message
  }); 
   
   
   
   } // else {
   
//   sendmail for non opp
   
   //}    end of else stat
   
   
 
   
   
   
   } // end of if stat
   

   
  } // end of for loop 
  //  add a finished alert at end of loop with x amount of emails sent (some kind of feed back)
} //end of function


          
          
       
         
    


  
  
  

  

        

         

  
  


  
  
  
  
  

 
  




