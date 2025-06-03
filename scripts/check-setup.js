const fs = require("fs");
const path = require("path");

// Cores para console
const colors = {
  red: "\x1b[31m%s\x1b[0m",
  green: "\x1b[32m%s\x1b[0m",
  yellow: "\x1b[33m%s\x1b[0m",
  blue: "\x1b[34m%s\x1b[0m",
  cyan: "\x1b[36m%s\x1b[0m",
};

function log(message, color = "cyan") {
  console.log(colors[color], message);
}

function checkSetup() {
  log("🔍 Checking ObjectBuilder setup...", "cyan");
  log("=".repeat(50), "cyan");

  let allOk = true;

  // 1. Check Node.js
  const nodeVersion = process.version;
  log(`✅ Node.js: ${nodeVersion}`, "green");

  // 2. Check folder structure
  const requiredDirs = [
    "libs",
    "libs/Flex_4.16.1_AIR_32.0",
    "libs/AIRSDK_51.2.1",
    "src",
    "assets",
    "assets/icon",
  ];

  log("\n📁 Checking folder structure:", "blue");
  requiredDirs.forEach((dir) => {
    if (fs.existsSync(dir)) {
      log(`  ✅ ${dir}`, "green");
    } else {
      log(`  ❌ ${dir} - MISSING`, "red");
      allOk = false;
    }
  });

  // 3. Check SDKs
  log("\n🛠️  Checking SDKs:", "blue");
  const sdkFiles = [
    "libs/Flex_4.16.1_AIR_32.0/bin/mxmlc.bat",
    "libs/AIRSDK_51.2.1/bin/adt.bat",
    "libs/Flex_4.16.1_AIR_32.0/frameworks/libs/player/27.0/playerglobal.swc",
  ];

  sdkFiles.forEach((file) => {
    if (fs.existsSync(file)) {
      log(`  ✅ ${path.basename(file)}`, "green");
    } else {
      log(`  ❌ ${file} - MISSING`, "red");
      allOk = false;
    }
  });

  // 4. Check external libraries
  log("\n📚 Checking external libraries:", "blue");
  const libraries = [
    "mignari_core.swc",
    "mignari.swc",
    "mignari_assets.swc",
    "blooddy_crypto.swc",
    "NailLib.swc",
  ];

  libraries.forEach((lib) => {
    const libPath = path.join("libs", lib);
    if (fs.existsSync(libPath)) {
      const stats = fs.statSync(libPath);
      log(`  ✅ ${lib} (${(stats.size / 1024).toFixed(1)}KB)`, "green");
    } else {
      log(`  ❌ ${lib} - MISSING`, "red");
      allOk = false;
    }
  });

  // 5. Check main files
  log("\n📄 Checking main files:", "blue");
  const mainFiles = [
    "src/ObjectBuilder.mxml",
    "src/ObjectBuilderWorker.as",
    "src/ObjectBuilder-app.xml",
    "src/firstRun/versions.xml",
    "src/firstRun/sprites.xml",
  ];

  mainFiles.forEach((file) => {
    if (fs.existsSync(file)) {
      log(`  ✅ ${file}`, "green");
    } else {
      log(`  ❌ ${file} - MISSING`, "red");
      allOk = false;
    }
  });

  // 6. Check OSMF library
  log("\n🎬 Checking OSMF library:", "blue");
  const osmfPath = path.join("libs", "osmf.swc");
  if (fs.existsSync(osmfPath)) {
    log(`  ✅ osmf.swc present`, "green");
  } else {
    log(`  ⚠️  osmf.swc not found - will be created automatically`, "yellow");
  }

  // 7. Final result
  log("\n" + "=".repeat(50), "cyan");
  if (allOk) {
    log("🎉 SETUP COMPLETE! Ready to build.", "green");
    log("\nNext steps:", "blue");
    log("  npm run build    # Run complete build", "cyan");
    log("  npm run run      # Execute ObjectBuilder", "cyan");
  } else {
    log("❌ SETUP INCOMPLETE - Problems found!", "red");
    log("\nSolutions:", "blue");
    log("  1. Check if SDKs are in libs/ folder", "yellow");
    log("  2. Download missing external libraries", "yellow");
    log("  3. Check folder structure", "yellow");
  }

  return allOk;
}

// Execute if called directly
if (require.main === module) {
  const success = checkSetup();
  process.exit(success ? 0 : 1);
}

module.exports = { checkSetup };
