import * as ftp from 'basic-ftp';
import * as path from 'path';
import * as fs from 'fs';

async function deployDistOnly() {
  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    console.log('Connecting to Hostinger FTP for fast dist upload...');
    await client.access({
      host: '151.106.96.65',
      user: 'u888615463',
      password: 'Aylin2026.',
      secure: false
    });

    console.log('Connected! Uploading dist/ build files...');
    const localDist = path.resolve('dist');
    const remoteDir = '/domains/aylinflores.com/public_html';

    await client.uploadFromDir(localDist, remoteDir);
    console.log('Fast dist upload completed successfully!');
  } catch (err) {
    console.error('Fast Deploy Error:', err);
  } finally {
    client.close();
  }
}

deployDistOnly();
