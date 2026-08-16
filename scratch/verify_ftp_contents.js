import * as ftp from "basic-ftp";

async function main() {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        await client.access({
            host: "151.106.96.65",
            port: 21,
            user: "u888615463",
            password: "Aylin2026.",
            secure: false
        });

        const root = "/domains/aylinflores.com/public_html";
        await client.cd(root);
        const list = await client.list();
        console.log("Root items:", list.map(i => i.name));

        for (const item of list) {
            if (item.isDirectory && (item.name === "wp-content" || item.name === "wp-includes" || item.name === "wp-admin")) {
                console.log(`Removing directory: ${item.name}`);
                await client.removeDir(`${root}/${item.name}`);
                console.log(`Successfully removed ${item.name}`);
            }
        }

        const finalList = await client.list(root);
        console.log("Final root items:", finalList.map(i => i.name));
    } catch (err) {
        console.error("Error:", err);
    } finally {
        client.close();
    }
}

main();
