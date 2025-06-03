const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const CONFIG = {
  AIRSDK: path.join("..", "libs", "AIRSDK_51.2.1"),
  CERT_NAME: "object_builder",
  CERT_PASS: "ObjectBuilder2024!",
  PROJECT: "..",
};

function generateCertificate(overwrite = false) {
  const certPath = path.join(CONFIG.PROJECT, `${CONFIG.CERT_NAME}.p12`);

  if (fs.existsSync(certPath) && !overwrite) {
    console.log("📜 Certificado já existe! Use --force para sobrescrever");
    return Promise.resolve();
  }

  console.log("🔐 Gerando certificado...");

  return new Promise((resolve, reject) => {
    const adtCommand = `"${path.join(
      CONFIG.AIRSDK,
      "bin",
      "adt.bat"
    )}" -certificate -validityPeriod 25 -cn "ObjectBuilder" -ou "Development" -o "ObjectBuilder" -c "BR" 2048-RSA "${certPath}" "${
      CONFIG.CERT_PASS
    }"`;

    exec(adtCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(
          `❌ Erro ao gerar certificado: ${stderr || error.message}`
        );
        reject(error);
        return;
      }

      if (fs.existsSync(certPath)) {
        console.log("✅ Certificado gerado com sucesso!");
        console.log(`📄 Local: ${certPath}`);
        console.log(`🔑 Senha: ${CONFIG.CERT_PASS}`);
        resolve();
      } else {
        reject(new Error("Falha ao criar certificado"));
      }
    });
  });
}

async function main() {
  const forceFlag = process.argv.includes("--force");

  try {
    await generateCertificate(forceFlag);
  } catch (error) {
    console.error(`Erro: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { generateCertificate };
