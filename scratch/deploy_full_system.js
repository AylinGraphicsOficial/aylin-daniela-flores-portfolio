import { Client } from "basic-ftp";

async function deployFullSystem() {
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
    console.log("Connected to Hostinger successfully!");

    const rootDir = "/domains/aylinflores.com/public_html";
    await client.cd(rootDir);

    console.log("Uploading compiled dist directory (React + PHP API + Uploads Security)...");
    await client.uploadFromDir("dist", rootDir);
    console.log("All files, API endpoints, and assets uploaded successfully!");

    // Ensure uploads directory exists
    try {
      await client.ensureDir(`${rootDir}/uploads`);
      console.log("Verified /uploads directory exists on Hostinger.");
    } catch (e) {
      console.log("Uploads dir check:", e.message);
    }

    console.log("DEPLOYMENT COMPLETE! Now initializing database via HTTP...");
  } catch (err) {
    console.error("FTP Deployment Error:", err);
  } finally {
    client.close();
  }
}

deployFullSystem();
