import fs from "fs";

async function testUpload() {
  try {
    console.log("Testing media upload to Hostinger /api/upload.php...");
    const filePath = "public/favicon.webp";
    const fileBuffer = fs.readFileSync(filePath);
    const blob = new Blob([fileBuffer], { type: "image/webp" });

    const formData = new FormData();
    formData.append("file", blob, "test_verification_upload.webp");

    const res = await fetch("https://aylinflores.com/api/upload.php", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    console.log("Upload test response:", JSON.stringify(data, null, 2));

    if (data.success && data.url) {
      console.log(`Verifying uploaded file accessible at https://aylinflores.com${data.url}...`);
      const checkRes = await fetch(`https://aylinflores.com${data.url}`);
      console.log(`Public media status: ${checkRes.status} (Length: ${checkRes.headers.get("content-length")} bytes)`);
    }
  } catch (err) {
    console.error("Upload Test Error:", err);
  }
}

testUpload();
