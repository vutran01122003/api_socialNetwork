const oauth2Client = require('./oAuth2Client');
const nodemailer = require('nodemailer');

const { CLIENT_ID, CLIENT_SECRET, OAUTH2_REFRESH_TOKEN } = process.env;

async function createTransporter() {
    const accessToken = await oauth2Client.getAccessToken();
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: 'tranducvu234@gmail.com',
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: OAUTH2_REFRESH_TOKEN,
            accessToken: accessToken
        }
    });

    return transporter;
}

module.exports = createTransporter;
