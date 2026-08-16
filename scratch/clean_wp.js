import { Client } from "basic-ftp";

async function safeRemove(client, path, isDir) {
  try {
    if (isDir) {
      console.log(`Removing dir: ${path}`);
      await client.removeDir(path);
    } else {
      console.log(`Removing file: ${path}`);
      await client.remove(path);
    }
  } catch (e) {
    console.error(`Error removing ${path}: ${e.message}`);
  }
}

async function runCleanupPass() {
  const client = new Client();
  client.ftp.verbose = false;
  client.ftp.timeout = 15000;
  
  try {
    await client.access({
      host: "151.106.96.65",
      user: "u888615463",
      password: "Aylin2026.",
      port: 21,
      secure: false
    });

    const pubPath = "/domains/aylinflores.com/public_html";
    const pubList = await client.list(pubPath);

    for (const item of pubList) {
      if (item.name.startsWith("wp-") || item.name.endsWith(".php") && item.name !== "index.html") {
        await safeRemove(client, `${pubPath}/${item.name}`, item.isDirectory);
      }
    }

    const rootList = await client.list("/");
    for (const item of rootList) {
      if (item.name === ".wp-cli" || item.name.startsWith("wp-")) {
        await safeRemove(client, `/${item.name}`, item.isDirectory);
      }
    }

  } catch (err) {
    console.error("Cleanup Pass Error:", err.message);
  } finally {
    client.close();
  }
}

async function main() {
  console.log("Starting multi-pass WP cleanup...");
  for (let pass = 1; pass <= 10; pass++) {
    console.log(`\n=== PASS ${pass} ===`);
    await runCleanupPass();
    
    // Check if anything remains
    const checkClient = new Client();
    checkClient.ftp.timeout = 10000;
    try {
      await checkClient.access({
        host: "151.106.96.65",
        user: "u888615463",
        password: "Aylin2026.",
        port: 21,
        secure: false
      });
      const pubList = await checkClient.list("/domains/aylinflores.com/public_html");
      const rootList = await checkClient.list("/");
      
      const pubWP = pubList.filter(i => i.name.startsWith("wp-"));
      const rootWP = rootList.filter(i => i.name.startsWith(".wp") || i.name.startsWith("wp-"));

      console.log("Remaining in public_html:", pubList.map(i => i.name));
      console.log("Remaining in root:", rootList.map(i => i.name));

      if (pubWP.length === 0 && rootWP.length === 0) {
        console.log("ALL WORDPRESS FILES SUCCESSFULLY REMOVED!");
        checkClient.close();
        break;
      }
    } catch (e) {
      console.error("Check Error:", e.message);
    } finally {
      checkClient.close();
    }
  }
}

main();
