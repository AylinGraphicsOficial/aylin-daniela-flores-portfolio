import { Client } from "basic-ftp";

async function fixAndDeploy() {
  const client = new Client();
  client.ftp.verbose = true;
  try {
    console.log("Connecting to Hostinger FTP to fix deployment...");
    await client.access({
      host: "151.106.96.65",
      user: "u888615463",
      password: "Aylin2026.",
      port: 21,
      secure: false
    });

    const targetDir = "domains/aylinflores.com/public_html";
    console.log(`Checking items in ${targetDir}...`);
    await client.cd(targetDir);
    const list = await client.list();
    console.log("Current files in public_html:", list.map(i => i.name));

    // Upload compiled dist
    console.log(`Uploading production build from 'dist' folder to '${targetDir}'...`);
    await client.uploadFromDir("dist", targetDir);
    console.log("SUCCESS: Production site re-deployed and restored!");
  } catch (err) {
    console.error("FTP Fix Error:", err);
  } finally {
    client.close();
  }
}

fixAndDeploy();
