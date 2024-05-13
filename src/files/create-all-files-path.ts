import fs from 'fs';

import { IGNORE_FILES, IGNORE_FOLDERS } from '../constants';

function createAllFilesPath(path: string) {
  const filePaths: string[] = [];
  console.log('Start create file Successpaths');

  const addFilesPath = (path: string) => {
    const folderName = path.split('/').pop();

    if (!folderName) return null;
    if (IGNORE_FOLDERS.includes(folderName)) return null;

    const unparsedFiles = fs.readdirSync(path);

    unparsedFiles.forEach((file) => {
      const pathToUnparsedFile = `${path}/${file}`;

      const fileStat = fs.statSync(pathToUnparsedFile);
      const isDirectory = fileStat?.isDirectory();

      if (!isDirectory) {
        if (IGNORE_FILES.includes(file)) return null;
        return filePaths.push(pathToUnparsedFile);
      }
      return addFilesPath(pathToUnparsedFile);
    });
  };

  addFilesPath(path);

  console.log('Successfuly create file paths');
  return filePaths;
}

export default createAllFilesPath;
