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

    // 1. Upload HTML
    console.log("Uploading index.html & production.html...");
    await client.uploadFrom("dist/index.html", "index.html");
    await client.uploadFrom("dist/index.html", "production.html");

    // 2. Upload assets directory
    console.log("Uploading assets folder...");
    await client.uploadFromDir("dist/assets", "assets");

    // 3. Upload uploads directory
    console.log("Uploading uploads folder...");
    await client.uploadFromDir("public/uploads", "uploads");

    console.log(">>> DEPLOYMENT SUCCESSFUL! Latest bundle & uploads are live on aylinflores.com! <<<");
  } catch (err) {
    console.error("Hostinger Fast Deploy Error:", err);
  } finally {
    client.close();
  }
}

fastSyncHostinger();
