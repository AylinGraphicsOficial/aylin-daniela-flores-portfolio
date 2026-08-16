import { Client } from "basic-ftp";

async function inspectWPDetails() {
  const client = new Client();
  client.ftp.verbose = true;
  try {
    await client.access({
      host: "151.106.96.65",
      user: "u888615463",
      password: "Aylin2026.",
      port: 21,
      secure: false
    });

    console.log("Checking all files inside public_html...");
    const pubList = await client.list("/domains/aylinflores.com/public_html");
    for (const item of pubList) {
      console.log(`- ${item.name} (${item.isDirectory ? 'DIR' : 'FILE'})`);
    }

  } catch (err) {
    console.error("FTP Error:", err);
  } finally {
    client.close();
  }
}

inspectWPDetails();
