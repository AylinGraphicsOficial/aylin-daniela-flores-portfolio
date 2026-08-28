import { Client } from "basic-ftp";

async function uploadCore() {
  const client = new Client();
  client.ftp.verbose = true;
  try {
    console.log("Connecting to Hostinger...");
    await client.access({
      host: "151.106.96.65",
      user: "u888615463",
      password: "Aylin2026.",
      port: 21,
      secure: false
    });
    console.log("Connected!");

    const targetDir = "domains/aylinflores.com/public_html";
    await client.cd(targetDir);
    console.log("Uploading index.html...");
    await client.uploadFrom("dist/index.html", "index.html");

    console.log("Uploading assets folder...");
    await client.uploadFromDir("dist/assets", "assets");

    console.log("CORE ASSETS & HTML UPLOADED TO HOSTINGER 100% SUCCESSFULLY!");
  } catch (err) {
    console.error("Upload error:", err);
  } finally {
    client.close();
  }
}

uploadCore();
