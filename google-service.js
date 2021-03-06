const _ = require("lodash");
const googleAuth = require("google-auth-library");
const {
  GOOGLE_API_CLIENT_NAMES,
  API_CLIENT_SCOPES,
  API_CLIENT_CONFIGS,
  GOOGLE_API_CLIENTS,
} = require("./consts");

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

/**
 * Each API Client requires different authorization scope
 */
function determineAuthScopes(apiClientNames) {
  return apiClientNames.map((apiClientName) => (
    API_CLIENT_SCOPES.get(apiClientName)
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
  const jwtAuthClient = new googleAuth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    scopes,
  );
  await jwtAuthClient.authorize();
  return jwtAuthClient;
}

function createGoogleApiClients(apiClientNames, authClient) {
  const entries = apiClientNames.map((apiClientName) => (
    [apiClientName, createGoogleApiClient(apiClientName, authClient)]
  ));
  return Object.fromEntries(entries);
}

function createGoogleApiClient(apiClientName, auth) {
  const apiClientConfig = getGoogleApiClientConfig(apiClientName);
  return GOOGLE_API_CLIENTS.get(apiClientName)({
    ...apiClientConfig,
    auth,
  });
}

function getGoogleApiClientConfig(clientName) {
  return API_CLIENT_CONFIGS.get(clientName);
}

module.exports = {
  injectGoogleApiClients,
};
