const { bootstrap } = require("kaholo-plugin-library");
const { GOOGLE_API_CLIENT_NAMES } = require("./consts");
const { injectGoogleApiClients } = require("./google-service");
const {
  prepareStartSpreadsheetPayload,
  prepareAddSheetPayload,
  prepareInsertRowPayload,
  prepareModifyAccessRightsPayloads,
} = require("./payload-functions");

async function startSpreadsheet({ sheets, drive }, params) {
  const payload = prepareStartSpreadsheetPayload(params);
  const { data: result } = await sheets.spreadsheets.create(payload);
  if (params.authorizedUsers) {
    const permissionPayloads = prepareModifyAccessRightsPayloads({
      spreadsheetUrl: result.spreadsheetUrl,
      sharing: "restricted",
      editors: params.authorizedUsers,
    });
    const requests = permissionPayloads.map(
      (permissionPayload) => drive.permissions.create(permissionPayload),
    );
    await Promise.all(requests);
    const prependMessageWith = params.authorizedUsers.length > 1 ? `Users ${params.authorizedUsers.join(", ")} were` : `User ${params.authorizedUsers[0]} was`;
    // TODO: Change console.error to console.info
    // when it is fixed for console.info to print
    // messages in the Activity Log
    console.error(`${prependMessageWith} granted writer permissions to the spreadsheet ${result.spreadsheetId}`);
  }
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
  if (params.row) {
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
