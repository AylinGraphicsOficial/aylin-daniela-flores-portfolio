import { Client } from "basic-ftp";
import path from "path";
import fs from "fs";

async function fastSyncHostinger() {
  const client = new Client();
  client.ftp.verbose = true;
  client.ftp.timeout = 30000;

  try {
    console.log("Connecting to Hostinger FTP (aylinflores.com)...");
    await client.access({
      host: "151.106.96.65",
      user: "u888615463",
      password: "Aylin2026.",
      port: 21,
      secure: false
    });
    console.log("Connected successfully to Hostinger!");

    const targetDir = "/domains/aylinflores.com/public_html";
    await client.cd(targetDir);

    // 1. Upload index.html
    console.log("Uploading index.html...");
    await client.uploadFrom("dist/index.html", "index.html");

    // 2. Upload assets directory
    console.log("Uploading assets folder...");
    await client.uploadFromDir("dist/assets", "assets");

    console.log(">>> DEPLOYMENT SUCCESSFUL! Latest bundle is live on aylinflores.com! <<<");
  } catch (err) {
    console.error("Hostinger Fast Deploy Error:", err);
  } finally {
    client.close();
  }
}

fastSyncHostinger();
