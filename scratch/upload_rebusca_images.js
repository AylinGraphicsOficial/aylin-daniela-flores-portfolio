import { Client } from "basic-ftp";
import fs from "fs";
import path from "path";

async function uploadRebuscaImages() {
  const client = new Client();
  client.ftp.verbose = true;
  try {
    console.log("Connecting to Hostinger FTP to upload Rebusca images...");
    await client.access({
      host: "151.106.96.65",
      user: "u888615463",
      password: "Aylin2026.",
      port: 21,
      secure: false
    });

    const rootDir = "/domains/aylinflores.com/public_html";
    await client.ensureDir(`${rootDir}/uploads`);
    await client.cd(`${rootDir}/uploads`);

    async function uploadFileSafely(localPath, remoteName) {
      try {
        await client.remove(remoteName).catch(() => {});
      } catch (e) {}
      await client.uploadFrom(localPath, remoteName);
    }

    const files = fs.readdirSync("dist/uploads");
    const remoteList = await client.list();

    for (const f of files) {
      if (f.includes("rebusca") || f.includes("naipe") || f.includes("packagin")) {
        const localPath = path.join("dist/uploads", f);
        const stat = fs.statSync(localPath);
        const match = remoteList.find(r => r.name === f);
        if (!match || match.size !== stat.size) {
          console.log(`Uploading ${f} (${(stat.size / 1024).toFixed(1)} KB)...`);
          await uploadFileSafely(localPath, f);
          console.log(`Uploaded ${f} successfully!`);
        } else {
          console.log(`Already exists on server: ${f}`);
        }
      }
    }

    console.log("\nAll Rebusca images uploaded to /public_html/uploads successfully!");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    client.close();
  }
}

uploadRebuscaImages();
