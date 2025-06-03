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
    description: "Complete AIR SDK (includes mobile/desktop runtimes)",
    required: false, // Only needed for advanced packaging
    checkFiles: [
      "libs/AIRSDK_51.2.1/bin/adt.bat",
      "libs/AIRSDK_51.2.1/lib/adt.jar",
    ],
  },
  // Note: AOT files (*.a) are NOT needed for desktop builds
  // They are only used for mobile ARM compilation
];

function checkIfFileNeeded(file) {
  // Check if essential files already exist
  const hasEssentialFiles = file.checkFiles.every((filePath) =>
    fs.existsSync(filePath)
  );

  if (hasEssentialFiles && !file.required) {
    console.log(
      `⏭️  ${file.name} not needed - essential files already present`
    );
    return false;
  }

  return true;
}

async function downloadFile(file) {
  return new Promise((resolve, reject) => {
    console.log(`📦 Downloading ${file.name} (${file.size})...`);
    console.log(`ℹ️  ${file.description}`);

    const destDir = path.dirname(file.dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    const fileStream = fs.createWriteStream(file.dest);

    https
      .get(file.url, (response) => {
        if (response.statusCode !== 200) {
          reject(
            new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`)
          );
          return;
        }

        const totalSize = parseInt(response.headers["content-length"], 10);
        let downloadedSize = 0;

        response.on("data", (chunk) => {
          downloadedSize += chunk.length;
          if (totalSize) {
            const percent = Math.round((downloadedSize / totalSize) * 100);
            process.stdout.write(
              `\r📊 Progress: ${percent}% (${Math.round(
                downloadedSize / 1024 / 1024
              )}MB)`
            );
          }
        });

        response.pipe(fileStream);

        fileStream.on("finish", () => {
          fileStream.close();
          console.log(`\n✅ Downloaded ${file.name}`);
          resolve();
        });
      })
      .on("error", (err) => {
        fs.unlink(file.dest, () => {}); // Delete partial file
        console.error(`\n❌ Error downloading ${file.name}:`, err.message);
        reject(err);
      });
  });
}

async function main() {
  try {
    console.log("🔍 Checking which files are needed...\n");

    const filesToDownload = largeFiles.filter((file) => {
      if (fs.existsSync(file.dest)) {
        console.log(`⏭️  ${file.name} already exists, skipping...`);
        return false;
      }

      return checkIfFileNeeded(file);
    });

    if (filesToDownload.length === 0) {
      console.log("🎉 All required files are already available!");
      console.log(
        "💡 Our build only needs core SDK files, not the large AOT libraries."
      );
      return;
    }

    console.log(`📋 Downloading ${filesToDownload.length} file(s)...\n`);

    for (const file of filesToDownload) {
      await downloadFile(file);
    }

    console.log("\n🎉 All large files downloaded successfully!");
    console.log("💡 ObjectBuilder desktop build is now ready!");
  } catch (error) {
    console.error("\n💥 Download failed:", error.message);
    console.log(
      "🔧 You can continue with the build - these files are optional for desktop builds"
    );
    process.exit(0); // Don't fail the build
  }
}

main();
