/**
 * Get the URL for the Google Apps Script running as a WebApp.
 */

function getScriptUrl() {
 var url = ScriptApp.getService().getUrl();
 return url;
}

function doGet(e) {
  Logger.log( Utilities.jsonStringify(e) );
  if (!e.parameter.page) {
    // When no specific page requested, return "home page"
    return HtmlService.createTemplateFromFile('form').evaluate();
  }
  // else, use page parameter to pick an html file from the script
  return HtmlService.createTemplateFromFile(e.parameter['page']).evaluate();
}

function uploadFiles(form) {
  
  try {
    
    var dropbox = "Teacher Training Program";
    var folder, folders = DriveApp.getFoldersByName(dropbox);
    
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(dropbox);
    }
    
    var blob = form.myFile;    
    var file = folder.createFile(blob);    
        
    return "File uploaded successfully! Your link: " + file.getUrl();  
  } catch (error) {
    
    return error.toString();
  }
  
}

function sendSMS(Body) {
  // Get account SID and auth token here:
  //   https://www.twilio.com/user/account
  var accountSid = "****";
  var authToken = "****";
  var url = "https://api.twilio.com/2010-04-01/Accounts/" + accountSid + "/SMS/Messages.json";
  var options = {
    method: "post",
    headers: {
      Authorization: "Basic " + Utilities.base64Encode(accountSid + ":" + authToken)
    },
    payload: {
      // From is one of your Twilio phone numbers
      From: "+17777777777",
      To: "+14444444444",
      Body: "Mrs. Smith, a new resource entitled '" + Body + "' has just been uploaded for you! Please check your PoP Google Drive when you can!"
    }
  };
  var response = UrlFetchApp.fetch(url, options);
  Logger.log(response);
}
