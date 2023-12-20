import Imap from 'imap';
import { simpleParser } from 'mailparser';
import fs, { writeFileSync } from 'fs';
import path from 'path';


const imapConfig = {
  user: '',
  password: '',
  host: 'imap.gmail.com',
  port: 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false }
};


export const getEmails = async() => {
    try {
      const imap = new Imap(imapConfig);
      imap.once('ready', () => {
        imap.openBox('INBOX', false, () => {
          imap.search(['UNSEEN', ['SINCE', new Date()]], (err, results) => {
            const f = imap.fetch(results, {bodies: ''});
            f.on('message', msg => {
              msg.on('body', stream => {
                simpleParser(stream, async (err, parsed) => {
                  const {from,to , subject, textAsHtml, text} = parsed;
                  console.log(parsed.attachments, "reading the content !");
                  const oracleIdMatch = text.match(/oracle_id\s*:\s*(\w+)/i);
                const oracleId = oracleIdMatch ? oracleIdMatch[1] : null;
                console.log('oracle_id:', oracleId);
                
                if (parsed.attachments && parsed.attachments[0].type === 'attachment') {
                    console.log('In downloading file');
                    const filename = parsed.attachments[0].filename;
                    const filePath = path.join('invoices', filename);
                    console.log(filePath , "filepath")
                    const writeStream = fs.writeFileSync(filePath, parsed.attachments[0].content , 'binary');
                    msg.on('body', async stream => {
                      await new Promise(resolve => {
                        stream.pipe(writeStream);
                        stream.on('end', () => {
                            console.log('Download completed:', filename);
                            resolve();
                          });
                        });
                        console.log('Downloading attachment:', filename);

                    })
  
                  }
                  /* Make API call to save the data
                     Save the retrieved data into a database.
                     E.t.c
                  */
                });
              });
              msg.once('attributes', attrs => {
                const { uid} = attrs;   
                imap.addFlags(uid, ['\\Seen'], () => {
                  // Mark the email as read after reading it
                  console.log('Marked as read!');
                });
              });
            });
            f.once('error', ex => {
              return Promise.reject(ex);
            });
            f.once('end', () => {
              console.log('Done fetching all messages!');
              imap.end();
            });
          });
        });
      });
  
      imap.once('error', err => {
        console.log("error",err);
      });
  
      imap.once('end', () => {
        console.log('Connection ended');
      });
  
      imap.connect();
    } catch (ex) {
      console.log('an error occurred');
    }
  };
