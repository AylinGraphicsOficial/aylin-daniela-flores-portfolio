import fs from 'fs';
import path from 'path';

console.log('🚀 Running postbuild synchronization...');

// 1. Copy dist/index.html to production.html and public/production.html
if (fs.existsSync('dist/index.html')) {
  fs.copyFileSync('dist/index.html', 'production.html');
  if (!fs.existsSync('public')) {
    fs.mkdirSync('public', { recursive: true });
  }
  fs.copyFileSync('dist/index.html', 'public/production.html');
  console.log('✔ Copied dist/index.html to production.html & public/production.html');
}

// 2. Copy dist/assets to assets/ so they are tracked in git & available for Hostinger Git pull
if (fs.existsSync('dist/assets')) {
  if (!fs.existsSync('assets')) {
    fs.mkdirSync('assets', { recursive: true });
  }
  const distAssets = fs.readdirSync('dist/assets');
  for (const file of distAssets) {
    fs.copyFileSync(path.join('dist/assets', file), path.join('assets', file));
  }
  console.log(`✔ Copied ${distAssets.length} assets to assets/ directory`);
}

// 3. Ensure .htaccess is in dist/
if (fs.existsSync('public/.htaccess')) {
  fs.copyFileSync('public/.htaccess', 'dist/.htaccess');
  console.log('✔ Copied public/.htaccess to dist/.htaccess');
}

console.log('✅ Postbuild completed successfully.');
