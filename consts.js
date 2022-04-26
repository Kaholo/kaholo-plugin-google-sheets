const GOOGLE_API_CLIENT_NAMES = {
  SHEETS: "sheets",
  DRIVE: "drive",
};

const API_CLIENT_SCOPES = new Map([
  [GOOGLE_API_CLIENT_NAMES.SHEETS, ["https://www.googleapis.com/auth/spreadsheets"]],
  [GOOGLE_API_CLIENT_NAMES.DRIVE, ["https://www.googleapis.com/auth/drive"]],
]);

module.exports = {
  GOOGLE_API_CLIENT_NAMES,
  API_CLIENT_SCOPES,
};
