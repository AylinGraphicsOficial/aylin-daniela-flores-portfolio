import { Client } from "basic-ftp";

const phpCode = `<?php
header('Content-Type: text/plain');
function removeTree($dir) {
    if (!file_exists($dir)) return;
    if (is_file($dir) || is_link($dir)) {
        @unlink($dir);
        return;
    }
    $files = array_diff(scandir($dir), array('.', '..'));
    foreach ($files as $file) {
        removeTree($dir . '/' . $file);
    }
    @rmdir($dir);
}

echo "Starting PHP instant cleanup...\\n";

removeTree(__DIR__ . '/wp-content');
echo "wp-content: " . (file_exists(__DIR__ . '/wp-content') ? "STILL EXISTS" : "DELETED") . "\\n";

removeTree(__DIR__ . '/wp-includes');
echo "wp-includes: " . (file_exists(__DIR__ . '/wp-includes') ? "STILL EXISTS" : "DELETED") . "\\n";

$rootWpCli = dirname(__DIR__, 2) . '/.wp-cli';
removeTree($rootWpCli);
echo ".wp-cli: " . (file_exists($rootWpCli) ? "STILL EXISTS" : "DELETED") . "\\n";
`;

async function main() {
  const client = new Client();
  try {
    await client.access({
      host: "151.106.96.65",
      user: "u888615463",
      password: "Aylin2026.",
      port: 21,
      secure: false
    });

    // Upload clean.php
    console.log("Uploading instant PHP cleaner...");
    const buffer = Buffer.from(phpCode);
    const { Readable } = await import("stream");
    const stream = Readable.from(buffer);
    await client.uploadFrom(stream, "/domains/aylinflores.com/public_html/clean.php");
    console.log("Uploaded clean.php successfully!");

    client.close();

    // Trigger clean.php via HTTP
    console.log("Executing clean.php via HTTP request...");
    const response = await fetch("https://aylinflores.com/clean.php");
    const text = await response.text();
    console.log("PHP Execution Result:\n", text);

    // Delete clean.php
    const cleanClient = new Client();
    await cleanClient.access({
      host: "151.106.96.65",
      user: "u888615463",
      password: "Aylin2026.",
      port: 21,
      secure: false
    });
    await cleanClient.remove("/domains/aylinflores.com/public_html/clean.php");
    cleanClient.close();
    console.log("Removed clean.php after cleanup!");

  } catch (err) {
    console.error("PHP Clean Error:", err);
  }
}

main();
