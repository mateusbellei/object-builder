const fs = require("fs");
const path = require("path");

function deleteRecursive(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((file) => {
      const curPath = path.join(dirPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dirPath);
  }
}

function clean() {
  console.log("🧹 Limpando arquivos de build...");

  const pathsToClean = [
    path.join(".", "bin-debug"),
    path.join(".", "bin", "ObjectBuilder.exe"),
  ];

  pathsToClean.forEach((cleanPath) => {
    if (fs.existsSync(cleanPath)) {
      if (fs.lstatSync(cleanPath).isDirectory()) {
        deleteRecursive(cleanPath);
        console.log(`🗑️  Diretório removido: ${cleanPath}`);
      } else {
        fs.unlinkSync(cleanPath);
        console.log(`🗑️  Arquivo removido: ${cleanPath}`);
      }
    }
  });

  console.log("✅ Limpeza concluída!");
}

if (require.main === module) {
  clean();
}

module.exports = { clean };
