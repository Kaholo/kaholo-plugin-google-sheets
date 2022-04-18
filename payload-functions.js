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

module.exports = {
  prepareStartSpreadsheetPayload,
};
