const { google } = require('googleapis');
const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, OAUTH2_REFRESH_TOKEN } = process.env;

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oauth2Client.setCredentials({ refresh_token: OAUTH2_REFRESH_TOKEN });

module.exports = oauth2Client;
