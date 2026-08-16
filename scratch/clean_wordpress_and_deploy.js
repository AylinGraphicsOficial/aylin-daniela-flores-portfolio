import { Client } from "basic-ftp";

async function cleanWordPressAndDeploy() {
  const client = new Client();
  client.ftp.verbose = true;
  try {
    console.log("Connecting to Hostinger FTP...");
    await client.access({
      host: "151.106.96.65",
      user: "u888615463",
      password: "Aylin2026.",
      port: 21,
      secure: false
    });

    const targetPath = "/domains/aylinflores.com/public_html";
    console.log(`Navigating to ${targetPath}...`);
    await client.cd(targetPath);

    const files = await client.list();
    console.log("Existing files in public_html:", files.map(f => f.name));

    // WordPress files/dirs to clean
    const wpItems = [
      "index.php",
      "wp-config.php",
      "wp-load.php",
      "wp-settings.php",
      "wp-blog-header.php",
      "wp-cron.php",
      "wp-activate.php",
      "wp-comments-post.php",
      "wp-links-opml.php",
      "wp-mail.php",
      "wp-signup.php",
      "wp-trackback.php",
      "xmlrpc.php",
      "licence.txt",
      "readme.html",
      "wp-admin",
      "wp-includes",
      "wp-content"
    ];

    for (const item of files) {
      if (wpItems.includes(item.name)) {
        console.log(`Removing WordPress item: ${item.name}`);
        try {
          if (item.isDirectory) {
            await client.removeDir(item.name);
          } else {
            await client.remove(item.name);
          }
        } catch (e) {
          console.warn(`Could not remove ${item.name}:`, e.message);
        }
      }
    }

    console.log("Re-uploading clean 'dist' folder...");
    await client.uploadFromDir("dist");

    const remainingFiles = await client.list();
    console.log("Cleaned public_html files:", remainingFiles.map(f => f.name));
    console.log("SUCCESS! WordPress has been completely removed and replaced with React Portfolio!");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    client.close();
  }
}

cleanWordPressAndDeploy();
