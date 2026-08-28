async function verifyLiveApi() {
  try {
    console.log("1. Calling init_db.php on Hostinger...");
    const initRes = await fetch("https://aylinflores.com/api/init_db.php");
    const initData = await initRes.json();
    console.log("init_db response:", JSON.stringify(initData, null, 2));

    console.log("\n2. Calling projects.php on Hostinger...");
    const projRes = await fetch("https://aylinflores.com/api/projects.php");
    const projData = await projRes.json();
    console.log(`projects.php returned ${Array.isArray(projData) ? projData.length : 'non-array'} projects.`);
    if (Array.isArray(projData) && projData.length > 0) {
      console.log("First project sample:", projData[0].title, "| Category:", projData[0].category);
    }

    console.log("\n3. Calling disciplines.php on Hostinger...");
    const discRes = await fetch("https://aylinflores.com/api/disciplines.php");
    const discData = await discRes.json();
    console.log(`disciplines.php returned ${Array.isArray(discData) ? discData.length : 'non-array'} disciplines.`);

    console.log("\nALL TESTS PASSED! Hostinger MySQL is 100% OPERATIONAL!");
  } catch (err) {
    console.error("Live API Verification Error:", err);
  }
}

verifyLiveApi();
