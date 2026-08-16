import { Client } from "basic-ftp";

async function finalCleanup() {
  const client = new Client();
  try {
    await client.access({
      host: "151.106.96.65",
      user: "u888615463",
      password: "Aylin2026.",
      port: 21,
      secure: false
    });
    await client.cd("/domains/aylinflores.com/public_html");
    const list = await client.list();
    
    const extraWpFiles = ["wp-login.php", "license.txt", "wp-config-sample.php", ".htaccess.bk", "default.php"];
    for (const f of list) {
      if (extraWpFiles.includes(f.name)) {
        console.log(`Deleting ${f.name}`);
        await client.remove(f.name);
      }
    }

    const finalList = await client.list();
    console.log("Spotless public_html list:", finalList.map(f => f.name));
  } catch (e) {
    console.error(e);
  } finally {
    client.close();
  }
}

finalCleanup();
