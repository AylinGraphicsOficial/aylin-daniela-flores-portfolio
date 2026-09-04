import { Client } from "basic-ftp";

async function inspectPublicHtml() {
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
    console.log("Found in /domains/aylinflores.com/public_html:");
    list.forEach(i => console.log(`${i.isDirectory ? '[DIR]' : '[FILE]'} ${i.name} (${i.size} bytes)`));
  } catch (e) {
    console.error(e);
  } finally {
    client.close();
  }
}

inspectPublicHtml();
