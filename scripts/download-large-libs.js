const fs = require("fs");
const path = require("path");
const https = require("https");

console.log("🔽 Downloading large SDK files not included in Git...");

// Lista de arquivos grandes que ficam fora do Git
const largeFiles = [
  {
    name: "AdobeAIRSDK.zip",
    url: "https://download.adobe.com/pub/adobe/air/air_51.2.1/AdobeAIRSDK.zip",
    dest: "libs/Flex_4.16.1_AIR_32.0/in/AdobeAIRSDK.zip",
    size: "408MB",
  },
  // Adicionar outros se necessário
];

async function downloadFile(file) {
  return new Promise((resolve, reject) => {
    console.log(`📦 Downloading ${file.name} (${file.size})...`);

    const destDir = path.dirname(file.dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    const fileStream = fs.createWriteStream(file.dest);

    https
      .get(file.url, (response) => {
        response.pipe(fileStream);

        fileStream.on("finish", () => {
          fileStream.close();
          console.log(`✅ Downloaded ${file.name}`);
          resolve();
        });
      })
      .on("error", (err) => {
        fs.unlink(file.dest, () => {}); // Delete partial file
        console.error(`❌ Error downloading ${file.name}:`, err.message);
        reject(err);
      });
  });
}

async function main() {
  try {
    for (const file of largeFiles) {
      if (!fs.existsSync(file.dest)) {
        await downloadFile(file);
      } else {
        console.log(`⏭️  ${file.name} already exists, skipping...`);
      }
    }
    console.log("🎉 All large files downloaded successfully!");
  } catch (error) {
    console.error("💥 Download failed:", error);
    process.exit(1);
  }
}

main();
