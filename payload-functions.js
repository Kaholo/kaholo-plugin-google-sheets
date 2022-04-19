const { extractSpreadsheetIdFromUrl } = require("./helpers");

function prepareStartSpreadsheetPayload(params) {
  return {
    requestBody: {
      properties: {
        title: params.spreadsheetTitle,
      },
      sheets: [
        {
          properties: {
            title: params.sheetTitle,
          },
        },
      ],
    },
  };
}

function prepareAddSheetPayload(params) {
  return {
    spreadsheetId: extractSpreadsheetIdFromUrl(params.spreadsheetUrl),
    requestBody: {
      requests: [{
        addSheet: {
          properties: {
            title: params.sheetTitle,
          },
        },
      }],
    },
  };
}

function prepareInsertRowPayload(params) {
  const range = `${params.sheetTitle}!A${params.row}`;
  return {
    spreadsheetId: extractSpreadsheetIdFromUrl(params.spreadsheetUrl),
    range,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      majorDimension: "ROWS",
      values: [params.data],
    },
  };
}

module.exports = {
  prepareStartSpreadsheetPayload,
  prepareAddSheetPayload,
  prepareInsertRowPayload,
};
