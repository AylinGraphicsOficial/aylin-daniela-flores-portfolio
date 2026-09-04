import fs from "fs";

async function check() {
  const res = await fetch("https://aylinflores.com/api/projects.php");
  const data = await res.json();
  const proj = data.find(p => p.title?.toLowerCase().includes("rebusca") || p.id?.includes("rebusca"));
  console.log("Found project:", proj ? {
    id: proj.id,
    title: proj.title,
    image: proj.image,
    gallery: proj.gallery,
    images: proj.images,
    detailImages: proj.detailImages,
    logo: proj.logo
  } : "Not found!");
  if (proj) {
    console.log("Full project object:\n", JSON.stringify(proj, null, 2));
  }
}

check();
