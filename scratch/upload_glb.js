import fs from "fs";

async function uploadGlb() {
  try {
    console.log("Uploading torre-castillo.glb to Hostinger /api/upload.php...");
    const filePath = "public/models/torre-castillo.glb";
    const fileBuffer = fs.readFileSync(filePath);
    const blob = new Blob([fileBuffer], { type: "model/gltf-binary" });

    const formData = new FormData();
    formData.append("file", blob, "torre-castillo.glb");

    const res = await fetch("https://aylinflores.com/api/upload.php", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    console.log("GLB Upload response:", JSON.stringify(data, null, 2));

    if (data.success && data.url) {
      console.log(`Verifying uploaded GLB accessible at https://aylinflores.com${data.url}...`);
      const checkRes = await fetch(`https://aylinflores.com${data.url}`);
      console.log(`Public GLB status: ${checkRes.status} (Length: ${checkRes.headers.get("content-length")} bytes)`);
    }
  } catch (err) {
    console.error("Upload Error:", err);
  }
}

uploadGlb();
