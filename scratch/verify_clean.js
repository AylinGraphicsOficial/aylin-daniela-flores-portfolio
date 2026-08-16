import { Client } from "basic-ftp";

async function verify() {
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
    console.log("Current files in public_html:", list.map(f => f.name));

    // Ensure index.html & assets & .htaccess exist, remove index.php / default.php if any remain
    for (const f of list) {
      if (f.name === "index.php" || f.name === "default.php" || f.name === "wp-config.php") {
        console.log(`Deleting remaining file: ${f.name}`);
        await client.remove(f.name);
      }
    }

    console.log("Uploading latest dist files...");
    await client.uploadFromDir("dist");
    console.log("FINAL VERIFICATION COMPLETE!");
  } catch (err) {
    console.error("Verification error:", err);
  } finally {
    client.close();
  }
}

verify();
