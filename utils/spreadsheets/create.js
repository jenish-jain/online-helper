const {google} = require('googleapis');
const sheets = google.sheets({version: 'v4', auth});
const resource = {
    properties: {
      title,
    },
  };
  sheets.spreadsheets.create({
    resource,
    fields: 'spreadsheetId',
  }, (err, spreadsheet) =>{
    if (err) {
      console.log(err);
    } else {
      console.log(`Spreadsheet ID: ${spreadsheet.spreadsheetId}`);
    }
  });