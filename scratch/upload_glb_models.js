import { Client } from "basic-ftp";
import fs from "fs";
import path from "path";

async function uploadGlbModels() {
  const client = new Client();
  client.ftp.verbose = true;
  try {
    console.log("Connecting to Hostinger FTP for 3D Models upload...");
    await client.access({
      host: "151.106.96.65",
      user: "u888615463",
      password: "Aylin2026.",
      port: 21,
      secure: false
    });

    const rootDir = "/domains/aylinflores.com/public_html";

    async function uploadFolderSafely(localDir, remoteDir) {
      if (!fs.existsSync(localDir)) {
        console.warn(`Local directory does not exist: ${localDir}`);
        return;
      }
      await client.ensureDir(remoteDir);
      await client.cd(remoteDir);
      const remoteList = await client.list();
      const remoteNames = new Set(remoteList.map(r => r.name));

      const files = fs.readdirSync(localDir);
      for (const file of files) {
        const localFilePath = path.join(localDir, file);
        const stat = fs.statSync(localFilePath);
        if (stat.isFile()) {
          console.log(`Checking ${file} (${(stat.size / 1024 / 1024).toFixed(2)} MB)...`);
          const remoteFile = remoteList.find(r => r.name === file);
          if (remoteFile && remoteFile.size === stat.size) {
            console.log(`- Already up-to-date: ${file}`);
            continue;
          }
          if (remoteNames.has(file)) {
            try {
              console.log(`- Removing outdated remote file: ${file}`);
              await client.remove(file);
            } catch (e) {
              console.warn(`Could not remove ${file}:`, e.message);
            }
          }
          console.log(`- Uploading ${file} to ${remoteDir}...`);
          await client.uploadFrom(localFilePath, file);
          console.log(`  Uploaded ${file} successfully!`);
        }
      }
    }

    // 1. Upload to /public_html/models/
    console.log("\n=== Uploading to models/ ===");
    await uploadFolderSafely("dist/models", `${rootDir}/models`);

    // 2. Upload to /public_html/uploads/
    console.log("\n=== Uploading to uploads/ ===");
    await uploadFolderSafely("dist/uploads", `${rootDir}/uploads`);

    console.log("\nAll 3D models uploaded successfully to Hostinger!");
  } catch (err) {
    console.error("Error uploading GLB models:", err);
  } finally {
    client.close();
  }
}

uploadGlbModels();
