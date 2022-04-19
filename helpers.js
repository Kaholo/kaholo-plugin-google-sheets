function extractSpreadsheetIdFromUrl(url) {
  const match = url.match(/docs\.google\.com\/spreadsheets\/d\/(.+)\/edit/);
  if (!match || !match[1]) {
    throw new Error(`Spreadsheet URL "${url}" is invalid, unable to extract the spreadsheet ID.`);
  }
  return match[1];
}

module.exports = {
  extractSpreadsheetIdFromUrl,
};
