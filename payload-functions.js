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
  const values = [(params.data || []).map((cell) => cell.trim())];
  return {
    spreadsheetId: extractSpreadsheetIdFromUrl(params.spreadsheetUrl),
    range,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      majorDimension: "ROWS",
      values,
    },
  };
}

function prepareModifyAccessRightsPayloads(params) {
  const fileId = extractSpreadsheetIdFromUrl(params.spreadsheetUrl);
  if (params.sharing === "unrestricted") {
    return [{
      fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    }];
  }
  const emailOptions = params.notifyMessage ? {
    emailMessage: params.notifyMessage,
    sendNotificationEmail: true,
  } : {
    sendNotificationEmail: false,
  };
  const commonOptions = {
    ...emailOptions,
    fields: "id",
    fileId,
  };
  const viewers = params.viewers ? params.viewers.map((viewerMail) => ({
    ...commonOptions,
    requestBody: {
      role: "viewer",
      type: "user",
      emailAddress: viewerMail,
    },
  })) : [];
  const commenters = params.commenters ? params.commenters.map((commenterMail) => ({
    ...commonOptions,
    requestBody: {
      role: "commenter",
      type: "user",
      emailAddress: commenterMail,
    },
  })) : [];
  const writers = params.writers ? params.writers.map((writerMail) => ({
    ...commonOptions,
    requestBody: {
      role: "writer",
      type: "user",
      emailAddress: writerMail,
    },
  })) : [];
  return [...viewers, ...commenters, ...writers];
}

module.exports = {
  prepareStartSpreadsheetPayload,
  prepareAddSheetPayload,
  prepareInsertRowPayload,
  prepareModifyAccessRightsPayloads,
};
