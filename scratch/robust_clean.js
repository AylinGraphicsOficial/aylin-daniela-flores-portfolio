import { Client } from "basic-ftp";

async function getConnectedClient() {
  const client = new Client();
  client.ftp.verbose = false;
  client.ftp.timeout = 20000;
  await client.access({
    host: "151.106.96.65",
    user: "u888615463",
    password: "Aylin2026.",
    port: 21,
    secure: false
  });
  return client;
}

async function removeRecursive(path) {
  let client;
  try {
    client = await getConnectedClient();
    console.log(`Listing ${path}...`);
    let items = [];
    try {
      items = await client.list(path);
    } catch (e) {
      console.log(`Could not list ${path}: ${e.message}`);
      client.close();
      return;
    }
    client.close();

    for (const item of items) {
      const fullPath = `${path}/${item.name}`;
      if (item.isDirectory) {
        await removeRecursive(fullPath);
      } else {
        let deleted = false;
        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            const fClient = await getConnectedClient();
            console.log(`Deleting file: ${fullPath}`);
            await fClient.remove(fullPath);
            fClient.close();
            deleted = true;
            break;
          } catch (err) {
            console.error(`Attempt ${attempt} failed deleting ${fullPath}: ${err.message}`);
          }
        }
      }
    }

    // Now remove the directory itself
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const dClient = await getConnectedClient();
        console.log(`Removing empty directory: ${path}`);
        await dClient.removeDir(path);
        dClient.close();
        break;
      } catch (err) {
        console.error(`Attempt ${attempt} failed removing dir ${path}: ${err.message}`);
      }
    }
  } catch (err) {
    console.error(`Error in removeRecursive for ${path}: ${err.message}`);
    if (client) client.close();
  }
}

async function main() {
  console.log("Starting robust recursive WP cleanup...");
  
  // Targets to clean
  const pubPath = "/domains/aylinflores.com/public_html";
  
  let client = await getConnectedClient();
  const pubList = await client.list(pubPath);
  client.close();

  for (const item of pubList) {
    if (item.name.startsWith("wp-")) {
      await removeRecursive(`${pubPath}/${item.name}`);
    }
  }

  client = await getConnectedClient();
  const rootList = await client.list("/");
  client.close();

  for (const item of rootList) {
    if (item.name === ".wp-cli" || item.name.startsWith("wp-")) {
      await removeRecursive(`/${item.name}`);
    }
  }

  console.log("=== FINAL VERIFICATION ===");
  client = await getConnectedClient();
  const finalPub = await client.list(pubPath);
  const finalRoot = await client.list("/");
  client.close();

  console.log("Final items in public_html:", finalPub.map(i => i.name));
  console.log("Final items in root:", finalRoot.map(i => i.name));
}

main();
