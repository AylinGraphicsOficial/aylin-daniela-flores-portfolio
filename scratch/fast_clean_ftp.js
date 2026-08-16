import * as ftp from "basic-ftp";

async function getClient() {
  const client = new ftp.Client(20000); // 20s timeout
  client.ftp.verbose = true;
  await client.access({
    host: "151.106.96.65",
    port: 21,
    user: "u888615463",
    password: "Aylin2026.",
    secure: false
  });
  return client;
}

async function fastPurgeFolder(root, folderName) {
  let client = await getClient();
  try {
    const fullPath = `${root}/${folderName}`;
    console.log(`\n========================================`);
    console.log(`Starting fast clear for: ${fullPath}`);
    console.log(`========================================`);
    
    await client.cd(fullPath);
    await client.clearWorkingDir();
    await client.cd(root);
    await client.removeDir(folderName);
    console.log(`SUCCESSFULLY DELETED: ${folderName}`);
  } catch (err) {
    console.error(`Error purging ${folderName}:`, err.message);
    try {
      if (client && !client.closed) {
        await client.cd(root);
        await client.removeDir(folderName);
        console.log(`REMOVED DIR AFTER CLEAN: ${folderName}`);
      }
    } catch (e2) {
      console.error(`Second attempt removeDir error:`, e2.message);
    }
  } finally {
    try { client.close(); } catch (_) {}
  }
}

async function main() {
  let client = await getClient();
  const root = "/domains/aylinflores.com/public_html";
  await client.cd(root);
  const items = await client.list();
  console.log("Current root items:", items.map(i => i.name));
  client.close();

  const wpFolders = items.filter(i => i.isDirectory && (i.name.startsWith("wp-") || i.name.startsWith(".")));

  for (const f of wpFolders) {
    await fastPurgeFolder(root, f.name);
  }

  // Final check
  client = await getClient();
  await client.cd(root);
  const finalItems = await client.list();
  console.log("\n========================================");
  console.log("FINAL public_html ITEMS:");
  console.log(finalItems.map(i => i.name));
  console.log("========================================\n");
  client.close();
}

main();
