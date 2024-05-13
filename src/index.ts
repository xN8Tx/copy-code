import { google } from 'googleapis';
import dotenv from 'dotenv';

import createAllFilesPath from './files/create-all-files-path';
import googleAuth from './google/google-auth';
import getText from './files/get-text';
import insertText from './google/insert-text';

import { PATH_TO_FOLDER } from './constants';

dotenv.config();

async function start() {
  try {
    const auth = await googleAuth();
    const docs = google.docs({ version: 'v1', auth });

    if (!PATH_TO_FOLDER || PATH_TO_FOLDER.length === 0)
      throw new Error('Path to folder is empty');

    const files = createAllFilesPath(PATH_TO_FOLDER);
    const text = await Promise.all(files.map(getText));
    await Promise.all(text.map(async (t) => await insertText(docs, t)));

    console.log('All code successfully copy');
  } catch (error) {
    console.log(error);
  }
}

await start();
