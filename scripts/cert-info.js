const fs = require("fs");
const path = require("path");

const CONFIG = {
  CERT_NAME: "object_builder",
  CERT_PASS: "ObjectBuilder2024!",
  PROJECT: "..",
};

function checkCertificate() {
  const certPath = path.join(CONFIG.PROJECT, `${CONFIG.CERT_NAME}.p12`);

  console.log("📜 INFORMAÇÕES DO CERTIFICADO");
  console.log("=============================");

  if (!fs.existsSync(certPath)) {
    console.log("❌ Certificado não encontrado!");
    console.log(`   Local esperado: ${certPath}`);
    console.log("   Execute 'npm run cert:generate' para criar um novo");
    return;
  }

  const stats = fs.statSync(certPath);

  console.log(`✅ Certificado encontrado`);
  console.log(`📄 Local: ${certPath}`);
  console.log(`📏 Tamanho: ${stats.size} bytes`);
  console.log(`📅 Criado em: ${stats.birthtime.toLocaleString()}`);
  console.log(`📅 Modificado em: ${stats.mtime.toLocaleString()}`);
  console.log(`🔑 Senha: ${CONFIG.CERT_PASS}`);

  // Verificar idade do certificado (25 anos de validade)
  const ageInDays = Math.floor(
    (Date.now() - stats.birthtime.getTime()) / (1000 * 60 * 60 * 24)
  );
  const daysUntilExpiry = 25 * 365 - ageInDays;

  if (daysUntilExpiry > 365) {
    console.log(`⏰ Válido por mais ${Math.floor(daysUntilExpiry / 365)} anos`);
  } else if (daysUntilExpiry > 30) {
    console.log(`⏰ Válido por mais ${daysUntilExpiry} dias`);
  } else if (daysUntilExpiry > 0) {
    console.log(`⚠️  Expira em ${daysUntilExpiry} dias - considere renovar`);
  } else {
    console.log(`❌ Certificado expirado! Gere um novo`);
  }
}

if (require.main === module) {
  checkCertificate();
}

module.exports = { checkCertificate };
