# Gmail API Email Automation using Node.js

This project demonstrates how to send emails using the official Gmail API with Node.js, OAuth2 authentication, and Google APIs client libraries.

---

## Features

- Sends email directly from your Gmail account via Gmail API (no SMTP!)
- Secure OAuth2 flow using `credentials.json`
- No need to use App Passwords or enable Less Secure Apps

---

## Prerequisites

  Step 1: Go to Google Cloud Console  
   - Open this link: [https://console.cloud.google.com/]  
   - Login with your Gmail account if you're not logged in.

  Step 2: Create a New Project (or select existing)
   - Click on the project dropdown (top-left of the header).
   - Click “New Project”.
   - Enter a Project name (e.g., GmailAPI-Automation) and click Create.
   - After it's created, select your new project from the dropdown.

  Step 3: Enable the Gmail API
   - From the left sidebar, go to:
   - APIs & Services → Library
   - In the search bar, type Gmail API.
   - Click on Gmail API in the search results.
   - Click the blue Enable button.

  Step 4: Configure OAuth Consent Screen
   - Go to: APIs & Services → OAuth consent screen
   - Select External and click Create.
   - Fill in:
    - App name: e.g., My Gmail Sender
    - User support email: your Gmail
    - Scroll down → Developer contact info: your Gmail
    - Click Save and Continue (repeat for all screens)
    - Under Test users, add your Gmail address (the one you'll use for sending the email).
    - Click Save and Continue.
  Step 5: Create OAuth 2.0 Credentials
    - Go to: APIs & Services → Credentials
    - Click + Create Credentials → Choose OAuth client ID
    - Choose:
       - Application type: Desktop app
       - Name: Gmail Automation
   - Click Create
       - It will show you Client ID and Client Secret. Click Download JSON (this is your credentials.json file).

Final Step:
  - Place credentials.json in your project
  - Move the downloaded credentials.json file to your Node.js project folder (e.g., inside /tests).
  - Make sure this file is listed in .gitignore so it doesn't get pushed to GitHub (for security).
    
6. Install required packages:
   ```bash
   npm install googleapis @google-cloud/local-auth

## Code: sendEmailUsingGmailAPI.js
```js
const fs = require('fs');
const path = require('path');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');

async function getAuthClient() {
  return await authenticate({
    keyfilePath: path.join(__dirname, 'credentials.json'),
    scopes: [
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/gmail.readonly',
    ],
  });
}

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

async function sendEmail() {
  const auth = await getAuthClient();
  const gmail = google.gmail({ version: 'v1', auth });

  const rawMessage = createEmail(
    'your_email@gmail.com',
    'Test Email from Gmail API 🎯',
    'Hello! This email was sent using Gmail API + Node.js!'
  );

  const res = await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw: rawMessage },
  });

  console.log('✅ Email sent:', res.data.id);
}

sendEmail().catch(console.error);

```
## How to Run
```bash
node sendEmailUsingGmailAPI.js
```
  
## Pros
- Secure OAuth2 flow (no password in code)
- Full access to Gmail API features (not just sending)
- No SMTP configuration required
- Scalable for production integrations

## Cons
- Requires setup in Google Cloud Console
- Needs consent screen configuration
- Works only with authenticated Google accounts
- 

