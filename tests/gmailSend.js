const fs = require('fs');
const path = require('path');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');

// Load OAuth2 credentials
async function getAuthClient() {
  return await authenticate({
    keyfilePath: path.join(__dirname, 'credentials.json'),
    scopes: [
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/gmail.readonly',
    ],
  });
}

// Create base64 encoded email
function createEmail(to, subject, body) {
  const emailLines = [
    `To: ${to}`,
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${subject}`,
    '',
    body,
  ];
  return Buffer.from(emailLines.join('\n')).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
}

// Send the email
async function sendEmail() {
  const auth = await getAuthClient();
  const gmail = google.gmail({ version: 'v1', auth });

  const rawMessage = createEmail(
    'roshaniPrajapati2110@gmail.com',  // ✅ your Gmail here
    'Test Email from Gmail API 🎯',
    'Hello! This email was sent using the Gmail API via Node.js--------'
  );

  const res = await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: rawMessage,
    },
  });

  console.log('✅ Email sent:', res.data.id);
}

sendEmail().catch(console.error);
