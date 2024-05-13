import { open } from 'fs/promises';

import { START_TEXT } from '../constants';

async function getText(pathToFile: string) {
  const file = await open(pathToFile);

  let fullText = `${START_TEXT} \n// ${pathToFile}`;

  for await (const line of file.readLines()) {
    fullText += `\n${line}`;
  }

  return fullText;
}

export default getText;
