import { Client } from "basic-ftp";

async function checkUploads() {
  const client = new Client();
  try {
    await client.access({
      host: "151.106.96.65",
      user: "u888615463",
      password: "Aylin2026.",
      port: 21,
      secure: false
    });
    await client.cd("/domains/aylinflores.com/public_html/uploads");
    const list = await client.list();
    console.log("Files in remote /public_html/uploads (count: " + list.length + "):");
    list.forEach(i => console.log(`- ${i.name} (${(i.size / 1024).toFixed(1)} KB)`));
  } catch (err) {
    console.error("Error:", err);
  } finally {
    client.close();
  }
}

checkUploads();
