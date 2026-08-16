import * as ftp from "basic-ftp";

async function getClient() {
  const client = new ftp.Client(15000); // 15s timeout
  await client.access({
    host: "151.106.96.65",
    port: 21,
    user: "u888615463",
    password: "Aylin2026.",
    secure: false
  });
  return client;
}

async function removeRecursive(client, rootPath, relPath = "") {
  const currentPath = relPath ? `${rootPath}/${relPath}` : rootPath;
  await client.cd(currentPath);
  const items = await client.list();

  for (const item of items) {
    if (item.name === "." || item.name === "..") continue;
    const subRel = relPath ? `${relPath}/${item.name}` : item.name;

    if (item.isDirectory) {
      await removeRecursive(client, rootPath, subRel);
    } else {
      await client.cd(currentPath);
      await client.remove(item.name);
    }
  }

  // After removing all contents, remove the directory itself
  const parent = relPath.includes("/") ? relPath.substring(0, relPath.lastIndexOf("/")) : "";
  const dirName = relPath.includes("/") ? relPath.substring(relPath.lastIndexOf("/") + 1) : relPath;
  const parentPath = parent ? `${rootPath}/${parent}` : rootPath;

  if (relPath) {
    await client.cd(parentPath);
    await client.removeDir(dirName);
  }
}

async function run() {
  let client = await getClient();
  const root = "/domains/aylinflores.com/public_html";

  try {
    await client.cd(root);
    const items = await client.list();
    console.log("Root items:", items.map(i => i.name));

    const wpItems = items.filter(i => i.name.startsWith("wp-") || i.name === ".private");

    for (const item of wpItems) {
      console.log(`\n--- Removing ${item.name} ---`);
      let retries = 3;
      while (retries > 0) {
        try {
          if (client.closed) {
            client = await getClient();
          }
          if (item.isDirectory) {
            await removeRecursive(client, root, item.name);
          } else {
            await client.cd(root);
            await client.remove(item.name);
          }
          console.log(`Success removing ${item.name}`);
          break;
        } catch (e) {
          console.error(`Error on ${item.name} (retries left ${retries - 1}):`, e.message);
          retries--;
          try { client.close(); } catch (_) {}
          client = await getClient();
        }
      }
    }

    await client.cd(root);
    const finalItems = await client.list();
    console.log("\n=== FINAL public_html CONTENTS ===");
    console.log(finalItems.map(i => i.name));

  } catch (err) {
    console.error("Fatal:", err);
  } finally {
    try { client.close(); } catch (_) {}
  }
}

run();
