const { google } = require("googleapis");
const _ = require("lodash");
const { GOOGLE_API_CLIENT_NAMES } = require("./consts");

/**
 * This function injects given Google API Clients with JWT Auth Client
 * into the parameters of the passed function with created
 */
function injectGoogleApiClients(callback, apiClientNames) {
  validateApiClientNames(apiClientNames);
  const scopes = determineAuthScopes(apiClientNames);
  return async (params) => {
    validateCredentials(params.credentials);
    const authClient = await createGoogleServiceAccountAuthClient(params.credentials, scopes);
    const googleClients = createGoogleApiClients(apiClientNames, authClient);
    return callback(googleClients, _.omit(params, "credentials"));
  };
}

/**
 * Each API Client requires different authorization scope
 */
function determineAuthScopes(apiClientNames) {
  const apiClientsRequiredScopesMap = new Map([
    [GOOGLE_API_CLIENT_NAMES.SHEETS, ["https://www.googleapis.com/auth/spreadsheets"]],
    [GOOGLE_API_CLIENT_NAMES.DRIVE, ["https://www.googleapis.com/auth/drive"]],
  ]);
  return apiClientNames.map((apiClientName) => (
    apiClientsRequiredScopesMap.get(apiClientName)
  )).flat();
}

function validateCredentials(credentialsObject) {
  if (!credentialsObject) {
    throw new Error("Google Service Account credentials are required. Please specify them in the action's parameters or plugin's settings.");
  }
  // These properties are required for JWT Auth Client
  const requiredProperties = ["client_email", "private_key"];
  requiredProperties.forEach((prop) => {
    if (!Reflect.has(credentialsObject, prop)) {
      throw new Error(`Missing property "${prop}" in the Google Service Account credentials object.`);
    }
  });
}

async function createGoogleServiceAccountAuthClient(credentials, scopes) {
  const jwtAuthClient = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    scopes,
  );
  await jwtAuthClient.authorize();
  return jwtAuthClient;
}

function validateApiClientNames(apiClientNames) {
  if (!Array.isArray(apiClientNames)) {
    throw new Error("apiClientNames parameter must be an array.");
  }
  const invalidApiClientNames = apiClientNames.filter((apiClientName) => (
    !Object.values(GOOGLE_API_CLIENT_NAMES).includes(apiClientName)
  ));
  if (invalidApiClientNames.length) {
    const invalidClientNamesString = invalidApiClientNames.map((apiClientName) => `"${apiClientName}"`).join(", ");
    const errorMessage = `Invalid Google API client name(s) were provided. Cannot inject ${invalidClientNamesString} Google API client(s).`;
    throw new Error(errorMessage);
  }
}

function createGoogleApiClients(apiClientNames, authClient) {
  const entries = apiClientNames.map((apiClientName) => (
    [apiClientName, createGoogleApiClient(apiClientName, authClient)]
  ));
  return Object.fromEntries(entries);
}

function createGoogleApiClient(apiClientName, auth) {
  const apiClientConfig = getGoogleApiClientConfig(apiClientName);
  return google[apiClientName]({
    ...apiClientConfig,
    auth,
  });
}

function getGoogleApiClientConfig(clientName) {
  const apiClientConfigsMap = new Map([
    [GOOGLE_API_CLIENT_NAMES.SHEETS, { version: "v4" }],
    [GOOGLE_API_CLIENT_NAMES.DRIVE, { version: "v3" }],
  ]);
  return apiClientConfigsMap.get(clientName);
}

module.exports = {
  injectGoogleApiClients,
};
