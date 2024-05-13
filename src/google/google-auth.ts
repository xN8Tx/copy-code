import process from 'process';
import path from 'path';
import fs from 'fs';

import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';

import type { OAuth2Client } from 'google-auth-library';

/*
  Code from https://developers.google.com/docs/api/quickstart/nodejs   
*/

const SCOPES = ['https://www.googleapis.com/auth/documents'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

// Reads previously authorized credentials from the save file.
async function loadSavedCredentialsIfExist(): Promise<OAuth2Client | null> {
  try {
    const content = await fs.promises.readFile(TOKEN_PATH);

    const credentials = JSON.parse(content.toString());

    return google.auth.fromJSON(credentials) as OAuth2Client;
  } catch (err) {
    return null;
  }
}

// Serializes credentials to a file compatible with GoogleAuth.fromJSON.
async function saveCredentials(client: OAuth2Client): Promise<void> {
  const content = await fs.promises.readFile(CREDENTIALS_PATH);

  const keys = JSON.parse(content.toString());
  const key = keys.installed || keys.web;

  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });

  await fs.promises.writeFile(TOKEN_PATH, payload);
}

// Load or request or authorization to call APIs.
async function googleAuth() {
  let client = await loadSavedCredentialsIfExist();

  if (client) return client;

  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });

  if (client.credentials) await saveCredentials(client);

  return client as OAuth2Client;
}

export default googleAuth;
