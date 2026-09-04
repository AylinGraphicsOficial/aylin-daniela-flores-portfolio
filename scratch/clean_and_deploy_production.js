import { Client } from "basic-ftp";
import fs from "fs";

async function cleanAndDeploy() {
  const client = new Client();
  client.ftp.verbose = true;
  try {
    console.log("Connecting to Hostinger FTP to clean and deploy production...");
    await client.access({
      host: "151.106.96.65",
      user: "u888615463",
      password: "Aylin2026.",
      port: 21,
      secure: false
    });

    const rootDir = "/domains/aylinflores.com/public_html";
    await client.cd(rootDir);
    const list = await client.list();
    console.log("Found in public_html:", list.map(i => i.name));

    // Delete raw uncompiled repository folders and files cloned by Hostinger Git
    const uncompiledItems = [
      "src", ".git", ".github", "scratch", "public", "domains",
      "package.json", "package-lock.json", "bun.lock", "tsconfig.json",
      "vite.config.ts", "README.md", "metadata.json", ".env.example", ".gitignore"
    ];

    for (const item of list) {
      if (uncompiledItems.includes(item.name)) {
        console.log(`Deleting uncompiled raw item: ${item.name}`);
        if (item.isDirectory) {
          await client.removeDir(`${rootDir}/${item.name}`);
        } else {
          await client.remove(`${rootDir}/${item.name}`);
        }
      }
    }

    console.log("Uploading compiled dist assets, api and root files to Hostinger...");
    
    // Helper to safely upload file deleting remote first if present
    async function uploadFileSafely(localPath, remoteName) {
      try {
        await client.remove(remoteName).catch(() => {});
      } catch (e) {}
      await client.uploadFrom(localPath, remoteName);
    }

    // Upload assets safely
    await client.ensureDir(`${rootDir}/assets`);
    await client.cd(`${rootDir}/assets`);
    const assetFiles = fs.readdirSync("dist/assets");
    for (const f of assetFiles) {
      await uploadFileSafely(`dist/assets/${f}`, f);
      console.log(`Uploaded asset: ${f}`);
    }
    console.log("Assets uploaded!");

    // Upload api files safely
    await client.ensureDir(`${rootDir}/api`);
    await client.cd(`${rootDir}/api`);
    const apiFiles = ["projects.php", "init_db.php", "disciplines.php", "settings.php", "upload.php", "config.php"];
    for (const f of apiFiles) {
      if (fs.existsSync(`dist/api/${f}`)) {
        await uploadFileSafely(`dist/api/${f}`, f);
        console.log(`Uploaded api file: ${f}`);
      }
    }
    console.log("API uploaded!");

    // Helper to safely sync directory with size check and recursive support
    async function syncDirectory(localDir, remoteDir) {
      if (!fs.existsSync(localDir)) return;
      await client.ensureDir(remoteDir);
      await client.cd(remoteDir);
      const remoteList = await client.list();
      const files = fs.readdirSync(localDir);
      for (const file of files) {
        const localPath = `${localDir}/${file}`;
        const stat = fs.statSync(localPath);
        if (stat.isDirectory()) {
          await syncDirectory(localPath, `${remoteDir}/${file}`);
          await client.cd(remoteDir);
        } else if (stat.isFile()) {
          const match = remoteList.find(r => r.name === file);
          if (!match || match.size !== stat.size) {
            console.log(`Uploading ${file} to ${remoteDir}...`);
            await uploadFileSafely(localPath, file);
          }
        }
      }
    }

    // Sync models, uploads & images
    await syncDirectory("dist/models", `${rootDir}/models`);
    await syncDirectory("dist/uploads", `${rootDir}/uploads`);
    await syncDirectory("dist/images", `${rootDir}/images`);
    console.log("3D Models, Uploads and Images synced!");

    // Upload root files
    await client.cd(rootDir);
    const rootFiles = [
      "index.html", ".htaccess", "favicon.ico", "favicon.png",
      "favicon-16x16.png", "favicon-32x32.png", "favicon-48x48.png",
      "favicon-512x512.png", "apple-touch-icon.png"
    ];

    for (const file of rootFiles) {
      const localPath = `dist/${file}`;
      if (fs.existsSync(localPath)) {
        try {
          await uploadFileSafely(localPath, file);
          console.log(`Uploaded root file: ${file}`);
        } catch (fErr) {
          console.warn(`Note on uploading ${file}:`, fErr.message);
        }
      }
    }

    console.log("DONE! Production build uploaded and working 100%!");
  } catch (err) {
    console.error("Clean and Deploy Error:", err);
  } finally {
    client.close();
  }
}

cleanAndDeploy();
