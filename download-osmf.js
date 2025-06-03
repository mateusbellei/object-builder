const https = require("https");
const fs = require("fs");
const path = require("path");

const url = "https://github.com/adobe/osmf/releases/download/v2.0/osmf_2.0.swc";
const outputPath = path.join("libs", "osmf.swc");

console.log("📥 Baixando OSMF...");

const file = fs.createWriteStream(outputPath);
https
  .get(url, (response) => {
    if (response.statusCode === 302 || response.statusCode === 301) {
      // Redirect
      https.get(response.headers.location, (redirectResponse) => {
        redirectResponse.pipe(file);
        file.on("finish", () => {
          file.close();
          console.log("✅ OSMF baixado com sucesso!");
          console.log(`📁 Salvo em: ${outputPath}`);
        });
      });
    } else {
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        console.log("✅ OSMF baixado com sucesso!");
        console.log(`📁 Salvo em: ${outputPath}`);
      });
    }
  })
  .on("error", (err) => {
    fs.unlink(outputPath, () => {}); // Delete the file async
    console.error("❌ Erro ao baixar OSMF:", err.message);
  });
