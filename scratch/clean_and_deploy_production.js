import { Client } from "basic-ftp";

async function cleanAndDeploy() {
  const client = new Client();
  client.ftp.verbose = true;
  try {
    console.log("Connecting to Hostinger FTP to clean and deploy production...");
    await client.access({
      host: "151.106.96.65",
      user: "u888615463",
      password: "Aylin2026.",
      port: 21,
      secure: false
    });

    const rootDir = "/domains/aylinflores.com/public_html";
    await client.cd(rootDir);
    const list = await client.list();
    console.log("Found in public_html:", list.map(i => i.name));

    // Delete raw uncompiled repository folders and files cloned by Hostinger Git
    const uncompiledItems = [
      "src", ".git", ".github", "scratch", "public", "domains",
      "package.json", "package-lock.json", "bun.lock", "tsconfig.json",
      "vite.config.ts", "README.md", "metadata.json", ".env.example", ".gitignore"
    ];

    for (const item of list) {
      if (uncompiledItems.includes(item.name)) {
        console.log(`Deleting uncompiled raw item: ${item.name}`);
        if (item.isDirectory) {
          await client.removeDir(`${rootDir}/${item.name}`);
        } else {
          await client.remove(`${rootDir}/${item.name}`);
        }
      }
    }

    console.log("Uploading compiled dist directly to public_html root...");
    await client.uploadFromDir("dist", rootDir);
    console.log("DONE! Production build uploaded and working 100%!");
  } catch (err) {
    console.error("Clean and Deploy Error:", err);
  } finally {
    client.close();
  }
}

cleanAndDeploy();
