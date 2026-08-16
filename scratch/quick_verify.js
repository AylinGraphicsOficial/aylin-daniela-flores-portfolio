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
    console.log("Root files in public_html now:", list.map(i => i.name));
  } catch (err) {
    console.error(err);
  } finally {
    client.close();
  }
}

verify();
