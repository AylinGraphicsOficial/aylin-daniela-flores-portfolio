async function updateRemoteLab3D() {
  try {
    const labData = {
      titleEs: "LABORATORIO 3D INTERACTIVO",
      titleEn: "INTERACTIVE 3D LAB",
      subtitleEs: "Rota, inspecciona la geometría e interactúa con modelos tridimensionales en tiempo real en tu navegador.",
      subtitleEn: "Rotate, inspect geometry, and explore real-time materials in the browser.",
      defaultModelId: "torre-castillo",
      lightingColor: "#76FF03",
      autoRotate: true,
      models: [
        {
          id: "torre-castillo",
          name: "Torre Castillo 3D",
          url: "/uploads/upload_1787936961_195256_torre-castillo.glb",
          type: "glb",
          stats: "Modelado GLB • Geometría & Texturas PBR",
          visible: true
        },
        {
          id: "retro-car",
          name: "Retro Mini 3D",
          url: "",
          type: "procedural",
          proceduralKey: "retroCar",
          stats: "24 Vertices • 28 Structural Edges • 4-Wheel Axle Grid",
          visible: true
        },
        {
          id: "cyber-hand",
          name: "Tactile Hand",
          url: "",
          type: "procedural",
          proceduralKey: "cyberHand",
          stats: "36 Articulated Joints • 42 Phalange Nodes",
          visible: true
        },
        {
          id: "brand-poly",
          name: "Polyhedron",
          url: "",
          type: "procedural",
          proceduralKey: "brandPoly",
          stats: "12 Facets • 30 Kinetic Edges • Icosahedral Symmetry",
          visible: true
        },
        {
          id: "hyper-cube",
          name: "Tesseract 4D",
          url: "",
          type: "procedural",
          proceduralKey: "hyperCube",
          stats: "16 Vertices • 32 Isometric Hyper-Edges",
          visible: true
        }
      ]
    };

    console.log("Updating remote lab3d in Hostinger MySQL...");
    const res = await fetch("https://aylinflores.com/api/settings.php?section=lab3d", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(labData)
    });

    const data = await res.json();
    console.log("Response:", data);
  } catch (err) {
    console.error("Error updating lab3d:", err);
  }
}

updateRemoteLab3D();
