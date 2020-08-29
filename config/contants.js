module.exports = {
  SPREADSHEET_URL: spreadSheetKey => {
    return `https://docs.google.com/spreadsheets/d/${spreadSheetKey}/edit`;
  },
};
