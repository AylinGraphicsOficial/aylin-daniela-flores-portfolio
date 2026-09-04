import fs from "fs";
import path from "path";

const srcDir = "C:\\Users\\Jovas-Motion\\Documents\\WEB ARCHIVOS AYLIN\\Elementos\\Proyectos\\La Rebusca";
const publicUploads = "public/uploads";
const distUploads = "dist/uploads";
const publicImages = "public/images/projects/la-rebusca";
const distImages = "dist/images/projects/la-rebusca";

[publicUploads, distUploads, publicImages, distImages].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const mappings = [
  { src: "imagen_naipes@300x.webp", target: "upload_1788482995_2dac4e_imagen_naipes_300x.webp" },
  { src: "naipe1@300x.webp", target: "upload_1788483016_4eb356_naipe1_300x.webp" },
  { src: "naipe2@300x.webp", target: "upload_1788483020_8cdc04_naipe2_300x.webp" },
  { src: "naipe3@300x.webp", target: "upload_1788483023_fdf748_naipe3_300x.webp" },
  { src: "naipe4@300x.webp", target: "upload_1788483025_23bb2b_naipe4_300x.webp" },
  { src: "packagin 1@300x.webp", target: "upload_1788483028_3ab4df_packagin_1_300x.webp" },
  { src: "post_losrebusca@300x.webp", target: "upload_1788483035_7a7356_post_losrebusca_300x.webp" }
];

for (const m of mappings) {
  const fullSrc = path.join(srcDir, m.src);
  if (fs.existsSync(fullSrc)) {
    fs.copyFileSync(fullSrc, path.join(publicUploads, m.target));
    fs.copyFileSync(fullSrc, path.join(distUploads, m.target));
    console.log(`Copied ${m.src} -> ${m.target} (${(fs.statSync(fullSrc).size / 1024).toFixed(1)} KB)`);
  } else {
    console.warn(`Source not found: ${fullSrc}`);
  }
}

// Also copy all clean files
const allFiles = fs.readdirSync(srcDir);
for (const f of allFiles) {
  const fullSrc = path.join(srcDir, f);
  fs.copyFileSync(fullSrc, path.join(publicImages, f));
  fs.copyFileSync(fullSrc, path.join(distImages, f));
  console.log(`Copied clean: ${f}`);
}

console.log("All La Rebusca images copied successfully!");
