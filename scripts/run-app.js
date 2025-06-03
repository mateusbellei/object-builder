const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const exePath = path.join("bin", "ObjectBuilder.exe", "ObjectBuilder.exe");

if (!fs.existsSync(exePath)) {
  console.log("❌ ObjectBuilder.exe não encontrado!");
  console.log("Execute 'npm run build' primeiro.");
  process.exit(1);
}

console.log("🚀 Executando ObjectBuilder...");
exec(`"${exePath}"`, (error, stdout, stderr) => {
  if (error) {
    console.error(`❌ Erro ao executar: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`⚠️ Stderr: ${stderr}`);
  }
  if (stdout) {
    console.log(`📝 Stdout: ${stdout}`);
  }
});
