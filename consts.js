const { sheets } = require("@googleapis/sheets");
const { drive } = require("@googleapis/drive");

const GOOGLE_API_CLIENT_NAMES = {
  SHEETS: "sheets",
  DRIVE: "drive",
};

const API_CLIENT_SCOPES = new Map([
  [GOOGLE_API_CLIENT_NAMES.SHEETS, ["https://www.googleapis.com/auth/spreadsheets"]],
  [GOOGLE_API_CLIENT_NAMES.DRIVE, ["https://www.googleapis.com/auth/drive"]],
]);

const API_CLIENT_CONFIGS = new Map([
  [GOOGLE_API_CLIENT_NAMES.SHEETS, { version: "v4" }],
  [GOOGLE_API_CLIENT_NAMES.DRIVE, { version: "v3" }],
]);

const GOOGLE_API_CLIENTS = new Map([
  [GOOGLE_API_CLIENT_NAMES.SHEETS, sheets],
  [GOOGLE_API_CLIENT_NAMES.DRIVE, drive],
]);

module.exports = {
  GOOGLE_API_CLIENT_NAMES,
  API_CLIENT_SCOPES,
  API_CLIENT_CONFIGS,
  GOOGLE_API_CLIENTS,
};
