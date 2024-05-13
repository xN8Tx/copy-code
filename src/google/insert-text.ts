import type { docs_v1 } from 'googleapis';

async function insertText(docs: docs_v1.Docs, text: string) {
  await docs.documents.batchUpdate({
    documentId: process.env.DOCUMENT_ID,
    requestBody: {
      requests: [
        {
          insertPageBreak: {
            endOfSegmentLocation: {
              segmentId: '',
            },
          },
        },
        {
          insertText: {
            text,
            endOfSegmentLocation: {
              segmentId: '',
            },
          },
        },
      ],
    },
  });

  console.log('Successfuly insert text');
  return 0;
}

export default insertText;
