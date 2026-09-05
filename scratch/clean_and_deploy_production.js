import { Client } from "basic-ftp";
import fs from "fs";

async function cleanAndDeploy() {
  const client = new Client();
  client.ftp.verbose = true;
  client.ftp.timeout = 30000;

  async function connect() {
    console.log("Connecting to Hostinger FTP (151.106.96.65)...");
    await client.access({
      host: "151.106.96.65",
      user: "u888615463",
      password: "Aylin2026.",
      port: 21,
      secure: false
    });
  }

  try {
    await connect();

    const rootDir = "/domains/aylinflores.com/public_html";
    await client.cd(rootDir);
    console.log("In public_html, starting robust production deployment...");

    // Upload with automatic reconnect & retry
    async function uploadSafely(localPath, remoteName, maxRetries = 3) {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          if (client.closed) {
            await connect();
          }
          await client.uploadFrom(localPath, remoteName);
          console.log(`✓ Uploaded: ${remoteName}`);
          return;
        } catch (err) {
          console.warn(`! Attempt ${attempt} failed for ${remoteName}: ${err.message}`);
          if (attempt === maxRetries) {
            console.error(`✕ Failed after ${maxRetries} attempts: ${remoteName}`);
            throw err;
          }
          await new Promise(r => setTimeout(r, 2000));
          try {
            await connect();
          } catch (cErr) {}
        }
      }
    }

    // 1. UPLOAD ROOT FILES FIRST (index.html, production.html, favicons, etc.)
    console.log("\n--- UPLOADING ROOT ASSETS & HTML ---");
    await client.cd(rootDir);
    const rootFiles = [
      "index.html", "production.html", ".htaccess", "favicon.ico", "favicon.png",
      "favicon-16x16.png", "favicon-32x32.png", "favicon-48x48.png",
      "favicon-512x512.png", "apple-touch-icon.png"
    ];

    for (const file of rootFiles) {
      const localPath = fs.existsSync(`dist/${file}`) ? `dist/${file}` : (fs.existsSync(file) ? file : null);
      if (localPath) {
        await uploadSafely(localPath, file);
      }
    }
    // Also copy to production.html explicitly if needed
    if (fs.existsSync("dist/index.html")) {
      await uploadSafely("dist/index.html", "production.html");
    }
    console.log("Root files uploaded successfully!");

    // 2. UPLOAD COMPILED ASSETS
    console.log("\n--- UPLOADING BUNDLED ASSETS ---");
    await client.cd(`${rootDir}/assets`);
    const assetFiles = fs.readdirSync("dist/assets");
    for (const f of assetFiles) {
      await uploadSafely(`dist/assets/${f}`, f);
    }
    console.log("All compiled assets uploaded successfully!");

    // 3. UPLOAD PHP API FILES
    console.log("\n--- UPLOADING API PHP FILES ---");
    await client.ensureDir(`${rootDir}/api`);
    const apiFiles = ["projects.php", "init_db.php", "disciplines.php", "settings.php", "upload.php", "config.php", "messages.php", "comments.php"];
    for (const f of apiFiles) {
      const localApi = fs.existsSync(`dist/api/${f}`) ? `dist/api/${f}` : `public/api/${f}`;
      if (fs.existsSync(localApi)) {
        await uploadSafely(localApi, f);
      }
    }
    console.log("API backend files uploaded successfully!");

    console.log("\n=======================================================");
    console.log("SUCCESS! PRODUCTION SITE 100% DEPLOYED TO HOSTINGER!");
    console.log("=======================================================");
  } catch (err) {
    console.error("Clean and Deploy Error:", err);
  } finally {
    client.close();
  }
}

cleanAndDeploy();
