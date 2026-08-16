import { Client } from "basic-ftp";

async function deepCleanWordPress() {
  const client = new Client();
  client.ftp.verbose = true;
  try {
    console.log("Connecting to Hostinger FTP for fast purge...");
    await client.access({
      host: "151.106.96.65",
      user: "u888615463",
      password: "Aylin2026.",
      port: 21,
      secure: false
    });

    const publicHtml = "/domains/aylinflores.com/public_html";
    await client.cd(publicHtml);

    // List top-level items
    const list = await client.list();
    console.log("Top-level items before purge:", list.map(f => f.name));

    const wpDirs = ["wp-content", "wp-includes", "wp-admin", ".private"];

    for (const dirName of wpDirs) {
      try {
        console.log(`Clearing directory: ${dirName}...`);
        await client.cd(`${publicHtml}/${dirName}`);
        await client.clearWorkingDir();
        await client.cd(publicHtml);
        await client.removeDir(dirName);
        console.log(`Successfully removed ${dirName}!`);
      } catch (err) {
        console.warn(`Note on ${dirName}: ${err.message}`);
        await client.cd(publicHtml);
      }
    }

    // Re-ensure dist files are uploaded
    console.log("Uploading fresh React build assets from dist/...");
    await client.cd(publicHtml);
    await client.uploadFromDir("dist");

    const finalList = await client.list();
    console.log("FINAL public_html items:", finalList.map(f => f.name));
    console.log("PURGE AND DEPLOY SUCCESSFUL!");
  } catch (err) {
    console.error("Purge error:", err);
  } finally {
    client.close();
  }
}

deepCleanWordPress();
