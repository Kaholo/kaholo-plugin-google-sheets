const { bootstrap } = require("kaholo-plugin-library");
const { injectGoogleApiClients } = require("./helpers");
const { prepareStartSpreadsheetPayload } = require("./payload-functions");

async function startSpreadsheet({ sheets }, params) {
  const {
    data: result,
  } = await sheets.spreadsheets.create(prepareStartSpreadsheetPayload(params));
  return result;
}

module.exports = bootstrap({
  startSpreadsheet: injectGoogleApiClients(startSpreadsheet, ["sheets"]),
});
