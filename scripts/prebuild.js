import fs from 'fs';

if (fs.existsSync('index.template.html')) {
  fs.copyFileSync('index.template.html', 'index.html');
  console.log('☟ Restored index.html from index.template.html');
}
