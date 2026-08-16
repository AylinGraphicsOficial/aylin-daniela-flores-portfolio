import { Client } from "basic-ftp";

async function inspectWP() {
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

    console.log("--- ROOT LISTING ---");
    const rootList = await client.list("/");
    for (const item of rootList) {
      console.log(`[ROOT] ${item.isDirectory ? 'DIR ' : 'FILE'} ${item.name}`);
    }

    console.log("--- DOMAINS LISTING ---");
    const domainsList = await client.list("/domains");
    for (const item of domainsList) {
      console.log(`[DOMAINS] ${item.isDirectory ? 'DIR ' : 'FILE'} ${item.name}`);
    }

    console.log("--- DOMAINS/AYLINFLORES.COM LISTING ---");
    const domainSiteList = await client.list("/domains/aylinflores.com");
    for (const item of domainSiteList) {
      console.log(`[AYLINFLORES.COM] ${item.isDirectory ? 'DIR ' : 'FILE'} ${item.name}`);
    }

    console.log("--- PUBLIC_HTML LISTING ---");
    const publicHtmlList = await client.list("/domains/aylinflores.com/public_html");
    for (const item of publicHtmlList) {
      console.log(`[PUBLIC_HTML] ${item.isDirectory ? 'DIR ' : 'FILE'} ${item.name}`);
    }

  } catch (err) {
    console.error("FTP Inspection Error:", err);
  } finally {
    client.close();
  }
}

inspectWP();
