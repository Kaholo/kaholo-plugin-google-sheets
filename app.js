const { bootstrap } = require("kaholo-plugin-library");
const { GOOGLE_API_CLIENT_NAMES } = require("./consts");
const { injectGoogleApiClients } = require("./google-service");
const { prepareStartSpreadsheetPayload, prepareAddSheetPayload, prepareInsertRowPayload } = require("./payload-functions");

async function startSpreadsheet({ sheets }, params) {
  const { data: result } = await sheets.spreadsheets.create(prepareStartSpreadsheetPayload(params));
  return result;
}

async function addSheet({ sheets }, params) {
  const { data: result } = await sheets.spreadsheets.batchUpdate(prepareAddSheetPayload(params));
  return {
    spreadsheetId: result.spreadsheetId,
    properties: result.replies[0].addSheet.properties,
  };
}

async function insertRow({ sheets }, params) {
  let result;
  const payload = prepareInsertRowPayload(params);
  if (params.overwrite) {
    result = await sheets.spreadsheets.values.update(payload);
  } else {
    result = await sheets.spreadsheets.values.append(payload);
  }
  return result.data;
}

module.exports = bootstrap({
  startSpreadsheet: injectGoogleApiClients(startSpreadsheet, [GOOGLE_API_CLIENT_NAMES.SHEETS]),
  addSheet: injectGoogleApiClients(addSheet, [GOOGLE_API_CLIENT_NAMES.SHEETS]),
  insertRow: injectGoogleApiClients(insertRow, [GOOGLE_API_CLIENT_NAMES.SHEETS]),
});
