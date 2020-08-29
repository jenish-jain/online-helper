const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const config = require('../../config/config');
const constants = require('../../config/contants');
const logger = require('../../helpers/logger.helper');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = './config/token.json';

module.exports = function () {
  // Load client secrets from a local file.
  fs.readFile('./config/credentials.json', (err, content) => {
    if (err) return logger.info('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), listMajors);

    // console.log('auth token', authorize(JSON.parse(content)));

    console.log(
      'Access the sheet at this url : ',
      constants.SPREADSHEET_URL(config.spreadSheetKeys.flipkartReturn)
    );
  });

  function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getNewToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
  }

  function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', code => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err)
          return logger.error(
            'Error while trying to retrieve access token',
            err
          );
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
          if (err) return console.error(err);
          logger.info('Token stored to', TOKEN_PATH);
        });
        callback(oAuth2Client);
      });
    });
  }

  /*
   * Prints the names and majors of students in a sample spreadsheet:
   */

  function listMajors(auth) {
    const sheets = google.sheets({ version: 'v4', auth });
    sheets.spreadsheets.values.get(
      {
        spreadsheetId: config.spreadSheetKeys.flipkartReturn,
        range: 'A2:C',
      },
      (err, res) => {
        if (err) return logger.error('The API returned an error: ' + err);
        const rows = res.data.values;
        if (rows.length) {
          console.log('Date, OrderId:');
          // Print columns A and E, which correspond to indices 0 and 4.
          rows.map(row => {
            console.log(`${row[0]}, ${row[1]}`);
          });
        } else {
          logger.info('No data found.');
        }
      }
    );
  }
};
