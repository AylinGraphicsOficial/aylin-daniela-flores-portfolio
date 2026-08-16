import { Client } from "basic-ftp";

async function deployDist() {
  const client = new Client();
  client.ftp.verbose = true;
  try {
    console.log("Connecting to Hostinger FTP to deploy dist...");
    await client.access({
      host: "151.106.96.65",
      user: "u888615463",
      password: "Aylin2026.",
      port: 21,
      secure: false
    });
    console.log("Connected to Hostinger!");

    const targetDir = "domains/aylinflores.com/public_html";
    console.log(`Uploading compiled 'dist' folder to '${targetDir}'...`);
    await client.uploadFromDir("dist", targetDir);
    console.log("SUCCESS! Production build uploaded to Hostinger successfully!");
  } catch (err) {
    console.error("FTP Upload Error:", err);
  } finally {
    client.close();
  }
}

deployDist();
