function extractSpreadsheetIdFromUrl(url) {
  const match = url.match(/\/d\/(.*?)(\/|$)/);
  if (!match || !match[1]) {
    throw new Error(`Spreadsheet URL "${url}" is invalid, unable to extract the spreadsheet ID.`);
  }
  return match[1];
}

async function fetchAllPermissions(drive, fileId, pageToken) {
  const payload = { fileId };
  if (pageToken) {
    payload.pageToken = pageToken;
  }
  const { data: { nextPageToken, permissions } } = await drive.permissions.list(payload);
  if (nextPageToken) {
    const recursivePermissions = await fetchAllPermissions(drive, fileId, nextPageToken);
    return permissions.concat(recursivePermissions);
  }
  return permissions;
}

module.exports = {
  extractSpreadsheetIdFromUrl,
  fetchAllPermissions,
};
