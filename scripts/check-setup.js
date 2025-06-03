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
  log("🔍 Verificando setup do ObjectBuilder...", "cyan");
  log("=".repeat(50), "cyan");

  let allOk = true;

  // 1. Verificar Node.js
  const nodeVersion = process.version;
  log(`✅ Node.js: ${nodeVersion}`, "green");

  // 2. Verificar estrutura de pastas
  const requiredDirs = [
    "libs",
    "libs/Flex_4.16.1_AIR_32.0",
    "libs/AIRSDK_51.2.1",
    "src",
    "assets",
    "assets/icon",
  ];

  log("\n📁 Verificando estrutura de pastas:", "blue");
  requiredDirs.forEach((dir) => {
    if (fs.existsSync(dir)) {
      log(`  ✅ ${dir}`, "green");
    } else {
      log(`  ❌ ${dir} - FALTANDO`, "red");
      allOk = false;
    }
  });

  // 3. Verificar SDKs
  log("\n🛠️  Verificando SDKs:", "blue");
  const sdkFiles = [
    "libs/Flex_4.16.1_AIR_32.0/bin/mxmlc.bat",
    "libs/AIRSDK_51.2.1/bin/adt.bat",
    "libs/Flex_4.16.1_AIR_32.0/frameworks/libs/player/27.0/playerglobal.swc",
  ];

  sdkFiles.forEach((file) => {
    if (fs.existsSync(file)) {
      log(`  ✅ ${path.basename(file)}`, "green");
    } else {
      log(`  ❌ ${file} - FALTANDO`, "red");
      allOk = false;
    }
  });

  // 4. Verificar bibliotecas externas
  log("\n📚 Verificando bibliotecas externas:", "blue");
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
      log(`  ❌ ${lib} - FALTANDO`, "red");
      allOk = false;
    }
  });

  // 5. Verificar arquivos principais
  log("\n📄 Verificando arquivos principais:", "blue");
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
      log(`  ❌ ${file} - FALTANDO`, "red");
      allOk = false;
    }
  });

  // 6. Verificar biblioteca OSMF
  log("\n🎬 Verificando biblioteca OSMF:", "blue");
  const osmfPath = path.join("libs", "osmf.swc");
  if (fs.existsSync(osmfPath)) {
    log(`  ✅ osmf.swc presente`, "green");
  } else {
    log(
      `  ⚠️  osmf.swc não encontrada - será criada automaticamente`,
      "yellow"
    );
  }

  // 7. Resultado final
  log("\n" + "=".repeat(50), "cyan");
  if (allOk) {
    log("🎉 SETUP COMPLETO! Pronto para build.", "green");
    log("\nPróximos passos:", "blue");
    log("  npm run build    # Fazer build completo", "cyan");
    log("  npm run run      # Executar ObjectBuilder", "cyan");
  } else {
    log("❌ SETUP INCOMPLETO - Problemas encontrados!", "red");
    log("\nSoluções:", "blue");
    log("  1. Verificar se SDKs estão na pasta libs/", "yellow");
    log("  2. Baixar bibliotecas externas faltantes", "yellow");
    log("  3. Verificar estrutura de pastas", "yellow");
  }

  return allOk;
}

// Executar se chamado diretamente
if (require.main === module) {
  const success = checkSetup();
  process.exit(success ? 0 : 1);
}

module.exports = { checkSetup };
