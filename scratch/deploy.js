import { Client } from "basic-ftp";

async function deploy() {
  const client = new Client();
  client.ftp.verbose = true;
  try {
    console.log("Connecting to Hostinger FTP server...");
    await client.access({
      host: "151.106.96.65",
      user: "u888615463",
      password: "Aylin2026.",
      port: 21,
      secure: false
    });
    console.log("Connected successfully!");

    const list = await client.list();
    console.log("Directory listing at root:");
    console.log(list.map(f => f.name));

    // Determine target directory
    let targetDir = "public_html";
    if (list.some(f => f.name === "public_html")) {
      targetDir = "public_html";
    } else if (list.some(f => f.name === "domains")) {
      targetDir = "domains/aylinflores.com/public_html";
    }

    console.log(`Uploading 'dist' folder contents to '${targetDir}'...`);
    await client.uploadFromDir("dist", targetDir);
    console.log("SUCCESS! All files uploaded to Hostinger successfully!");
  } catch (err) {
    console.error("FTP Deployment Error:", err);
  } finally {
    client.close();
  }
}

deploy();
