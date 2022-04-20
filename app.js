const { bootstrap } = require("kaholo-plugin-library");
const { GOOGLE_API_CLIENT_NAMES } = require("./consts");
const { injectGoogleApiClients } = require("./google-service");
const {
  prepareStartSpreadsheetPayload, prepareAddSheetPayload,
  prepareInsertRowPayload, prepareModifyAccessRightsPayloads,
} = require("./payload-functions");

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

async function modifyAccessRights({ drive }, params) {
  // TODO: Implement overwrite feature
  if (params.overwrite) {
    throw new Error("Overwrite feature is not yet implemented. If Viewers, Commenters, or Editors are specified, they will be added. If empty, no change is made.");
  }
  const payload = prepareModifyAccessRightsPayloads(params);
  const results = await Promise.all(payload.map(
    (permissionRequest) => drive.permissions.create(permissionRequest),
  ));
  return results.map((result) => result.data);
}

module.exports = bootstrap({
  startSpreadsheet: injectGoogleApiClients(
    startSpreadsheet,
    [GOOGLE_API_CLIENT_NAMES.SHEETS, GOOGLE_API_CLIENT_NAMES.DRIVE],
  ),
  addSheet: injectGoogleApiClients(addSheet, [GOOGLE_API_CLIENT_NAMES.SHEETS]),
  insertRow: injectGoogleApiClients(insertRow, [GOOGLE_API_CLIENT_NAMES.SHEETS]),
  modifyAccessRights: injectGoogleApiClients(modifyAccessRights, [GOOGLE_API_CLIENT_NAMES.DRIVE]),
});
