const { exec, execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

// Configurações
const CONFIG = {
  FLEX_SDK: path.join("libs", "Flex_4.16.1_AIR_32.0"),
  AIRSDK: path.join("libs", "AIRSDK_51.2.1"),
  PROJECT: ".",
  CERT_NAME: "object_builder",
  CERT_PASS: "ObjectBuilder2024!",
  TARGET_PLAYER: "27.0",
};

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

function createDirectories() {
  const dirs = [
    path.join(CONFIG.PROJECT, "bin-debug"),
    path.join(CONFIG.PROJECT, "bin"),
  ];

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      log(`📁 Directory created: ${dir}`, "blue");
    }
  });
}

function checkDependencies() {
  log("🔍 Checking dependencies...", "cyan");

  const requiredPaths = [
    { path: CONFIG.FLEX_SDK, name: "Flex SDK" },
    { path: CONFIG.AIRSDK, name: "AIR SDK" },
    { path: path.join(CONFIG.FLEX_SDK, "bin", "mxmlc.bat"), name: "MXMLC" },
    { path: path.join(CONFIG.AIRSDK, "bin", "adt.bat"), name: "ADT" },
    {
      path: path.join(CONFIG.PROJECT, "src", "ObjectBuilder.mxml"),
      name: "ObjectBuilder.mxml",
    },
    {
      path: path.join(CONFIG.PROJECT, "src", "ObjectBuilder-app.xml"),
      name: "ObjectBuilder-app.xml",
    },
  ];

  const missing = requiredPaths.filter((item) => !fs.existsSync(item.path));

  if (missing.length > 0) {
    log("❌ ERROR: Dependencies not found:", "red");
    missing.forEach((item) => log(`   - ${item.name}: ${item.path}`, "red"));
    process.exit(1);
  }

  // Check playerglobal.swc
  const playerglobalPath = path.join(
    CONFIG.FLEX_SDK,
    "frameworks",
    "libs",
    "player",
    CONFIG.TARGET_PLAYER,
    "playerglobal.swc"
  );
  if (!fs.existsSync(playerglobalPath)) {
    log(`❌ ERROR: playerglobal.swc not found: ${playerglobalPath}`, "red");
    process.exit(1);
  }

  // Check external libraries
  const externalLibs = [
    "mignari_core.swc",
    "mignari.swc",
    "mignari_assets.swc",
    "blooddy_crypto.swc",
    "NailLib.swc",
  ];
  const existingExternalLibs = externalLibs
    .map((lib) => path.join(CONFIG.PROJECT, "libs", lib))
    .filter((lib) => fs.existsSync(lib));

  // OSMF library needs to be included, not external
  const osmfPath = path.join(CONFIG.PROJECT, "libs", "osmf.swc");
  const includeOsmf = fs.existsSync(osmfPath) ? [osmfPath] : [];

  if (existingExternalLibs.length > 0) {
    log("⚠️  External libraries found:", "yellow");
    existingExternalLibs.forEach((lib) =>
      log(`   - ${path.basename(lib)}`, "yellow")
    );
  }

  log("✅ Main dependencies found!", "green");
}

function generateCertificate() {
  const certPath = path.join(CONFIG.PROJECT, `${CONFIG.CERT_NAME}.p12`);

  if (fs.existsSync(certPath)) {
    log("📜 Certificate already exists, using the existing one...", "yellow");
    return Promise.resolve();
  }

  log("🔐 Generating new certificate...", "cyan");

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
        log(
          `❌ Error generating certificate: ${stderr || error.message}`,
          "red"
        );
        reject(error);
        return;
      }

      if (fs.existsSync(certPath)) {
        log("✅ Certificate generated successfully!", "green");
        resolve();
      } else {
        reject(new Error("Failed to create certificate"));
      }
    });
  });
}

function buildLibraryPaths() {
  // Main libraries from Flex/AIR
  const coreLibraries = [
    // Basic libraries from Flex
    path.join(CONFIG.FLEX_SDK, "frameworks", "libs", "framework.swc"),
    path.join(CONFIG.FLEX_SDK, "frameworks", "libs", "spark.swc"),
    path.join(CONFIG.FLEX_SDK, "frameworks", "libs", "sparkskins.swc"),
    path.join(CONFIG.FLEX_SDK, "frameworks", "libs", "spark_dmv.swc"),
    path.join(CONFIG.FLEX_SDK, "frameworks", "libs", "rpc.swc"),
    path.join(CONFIG.FLEX_SDK, "frameworks", "libs", "mx", "mx.swc"),

    // AIR libraries (correct: comes from Flex SDK)
    path.join(CONFIG.FLEX_SDK, "frameworks", "libs", "air", "airframework.swc"),
    path.join(CONFIG.FLEX_SDK, "frameworks", "libs", "air", "airspark.swc"),

    // AIR libraries from AIR SDK (for UpdateEvent, etc.)
    path.join(
      CONFIG.AIRSDK,
      "frameworks",
      "libs",
      "air",
      "applicationupdater.swc"
    ),
    path.join(
      CONFIG.AIRSDK,
      "frameworks",
      "libs",
      "air",
      "applicationupdater_ui.swc"
    ),
  ];

  // Check which libraries exist
  const existingCoreLibs = coreLibraries.filter((lib) => fs.existsSync(lib));
  const missingCoreLibs = coreLibraries.filter((lib) => !fs.existsSync(lib));

  if (missingCoreLibs.length > 0) {
    log("⚠️  Some main libraries were not found:", "yellow");
    missingCoreLibs.forEach((lib) =>
      log(`   - ${path.basename(lib)}`, "yellow")
    );
  }

  // External libraries
  const externalLibs = [
    "mignari_core.swc",
    "mignari.swc",
    "mignari_assets.swc",
    "blooddy_crypto.swc",
    "NailLib.swc",
  ];
  const existingExternalLibs = externalLibs
    .map((lib) => path.join(CONFIG.PROJECT, "libs", lib))
    .filter((lib) => fs.existsSync(lib));

  // OSMF needs to be included, not external
  const osmfPath = path.join(CONFIG.PROJECT, "libs", "osmf.swc");
  const includeOsmf = fs.existsSync(osmfPath) ? [osmfPath] : [];

  // Library paths
  const libraryPaths = [
    path.join(CONFIG.FLEX_SDK, "frameworks", "libs"),
    path.join(CONFIG.FLEX_SDK, "frameworks", "libs", "mx"),
    path.join(CONFIG.FLEX_SDK, "frameworks", "libs", "air"),
    path.join(CONFIG.AIRSDK, "frameworks", "libs", "air"),
    path.join(CONFIG.PROJECT, "libs"),
  ];

  return {
    libraryPaths: libraryPaths
      .map((lib) => `-library-path+="${lib}"`)
      .join(" "),
    includedLibs: [...existingCoreLibs, ...existingExternalLibs, ...includeOsmf]
      .map((lib) => `-include-libraries+="${lib}"`)
      .join(" "),
  };
}

function compileWorker() {
  return new Promise((resolve, reject) => {
    log("🔧 Compiling ObjectBuilderWorker.swf...", "cyan");

    // Create workerswfs directory if it doesn't exist
    const workerDir = path.join(CONFIG.PROJECT, "workerswfs");
    if (!fs.existsSync(workerDir)) {
      fs.mkdirSync(workerDir, { recursive: true });
      log(`📁 Directory created: ${workerDir}`, "blue");
    }

    const playerglobalPath = path.resolve(
      path.join(
        CONFIG.FLEX_SDK,
        "frameworks",
        "libs",
        "player",
        CONFIG.TARGET_PLAYER,
        "playerglobal.swc"
      )
    );
    const airglobalPath = path.resolve(
      path.join(CONFIG.AIRSDK, "frameworks", "libs", "air", "airglobal.swc")
    );

    const mxmlcCommand = [
      `"${path.join(CONFIG.FLEX_SDK, "bin", "mxmlc.bat")}"`,
      `-target-player=${CONFIG.TARGET_PLAYER}`,
      `-external-library-path+="${playerglobalPath}"`,
      `-external-library-path+="${airglobalPath}"`,
      `-library-path+="${path.join(CONFIG.FLEX_SDK, "frameworks", "libs")}"`,
      `-library-path+="${path.join(
        CONFIG.FLEX_SDK,
        "frameworks",
        "libs",
        "mx"
      )}"`,
      `-library-path+="${path.join(
        CONFIG.FLEX_SDK,
        "frameworks",
        "libs",
        "air"
      )}"`,
      `-library-path+="${path.join(CONFIG.PROJECT, "libs")}"`,
      `-source-path+="${path.join(CONFIG.PROJECT, "src")}"`,
      `-locale=`, // Disable locale for worker
      `-compiler.debug=false`,
      `-compiler.optimize=true`,
      `-compiler.strict=false`,
      `-warnings=false`,
      `"${path.join(CONFIG.PROJECT, "src", "ObjectBuilderWorker.as")}"`,
      `-o "${path.join(
        CONFIG.PROJECT,
        "workerswfs",
        "ObjectBuilderWorker.swf"
      )}"`,
    ].join(" ");

    log("Executing command to compile worker...", "blue");

    // Define environment variables for the process
    const env = {
      ...process.env,
      PLAYERGLOBAL_HOME: path.resolve(
        path.join(CONFIG.FLEX_SDK, "frameworks", "libs", "player")
      ),
    };

    exec(
      mxmlcCommand,
      {
        maxBuffer: 1024 * 1024 * 10,
        env: env,
      },
      (error, stdout, stderr) => {
        if (error) {
          log(`❌ Error compiling worker: ${stderr || error.message}`, "red");
          reject(error);
          return;
        }

        const workerPath = path.join(
          CONFIG.PROJECT,
          "workerswfs",
          "ObjectBuilderWorker.swf"
        );
        if (!fs.existsSync(workerPath)) {
          reject(new Error("Failed to generate ObjectBuilderWorker.swf!"));
          return;
        }

        const workerStats = fs.statSync(workerPath);
        log(
          `✅ Worker compiled! SWF: ${(workerStats.size / 1024 / 1024).toFixed(
            2
          )} MB`,
          "green"
        );
        resolve();
      }
    );
  });
}

function compileProject() {
  return new Promise((resolve, reject) => {
    log("🚀 Compiling ObjectBuilder.mxml...", "cyan");

    const { libraryPaths, includedLibs } = buildLibraryPaths();

    // Use a simpler approach - define the complete path of playerglobal
    const playerglobalPath = path.resolve(
      path.join(
        CONFIG.FLEX_SDK,
        "frameworks",
        "libs",
        "player",
        CONFIG.TARGET_PLAYER,
        "playerglobal.swc"
      )
    );
    const airglobalPath = path.resolve(
      path.join(CONFIG.AIRSDK, "frameworks", "libs", "air", "airglobal.swc")
    );

    const mxmlcCommand = [
      `"${path.join(CONFIG.FLEX_SDK, "bin", "mxmlc.bat")}"`,
      `-target-player=${CONFIG.TARGET_PLAYER}`,
      `-external-library-path+="${playerglobalPath}"`,
      `-external-library-path+="${airglobalPath}"`,
      `-library-path+="${path.join(CONFIG.FLEX_SDK, "frameworks", "libs")}"`,
      `-library-path+="${path.join(
        CONFIG.FLEX_SDK,
        "frameworks",
        "libs",
        "mx"
      )}"`,
      `-library-path+="${path.join(
        CONFIG.FLEX_SDK,
        "frameworks",
        "libs",
        "air"
      )}"`,
      `-library-path+="${path.join(
        CONFIG.AIRSDK,
        "frameworks",
        "libs",
        "air"
      )}"`,
      `-library-path+="${path.join(CONFIG.PROJECT, "libs")}"`,
      includedLibs,
      `-source-path+="${path.join(CONFIG.PROJECT, "src")}"`,
      `-source-path+="${path.join(CONFIG.PROJECT, "locale", "{locale}")}"`,
      `-locale=en_US,es_ES,pt_BR`,
      `-allow-source-path-overlap=true`,
      `-compiler.verbose-stacktraces=true`,
      `-compiler.debug=false`,
      `-compiler.optimize=true`,
      `-compiler.strict=false`, // Less strict for legacy projects
      `-warnings=false`, // Reduce verbose warnings
      `-compiler.accessible=false`, // Disable accessibility that can cause problems
      `"${path.join(CONFIG.PROJECT, "src", "ObjectBuilder.mxml")}"`,
      `-o "${path.join(CONFIG.PROJECT, "bin-debug", "ObjectBuilder.swf")}"`,
    ].join(" ");

    log("Executing command to compile...", "blue");

    // Define environment variables for the process
    const env = {
      ...process.env,
      PLAYERGLOBAL_HOME: path.resolve(
        path.join(CONFIG.FLEX_SDK, "frameworks", "libs", "player")
      ),
    };

    exec(
      mxmlcCommand,
      {
        maxBuffer: 1024 * 1024 * 10,
        env: env,
      },
      (error, stdout, stderr) => {
        if (error) {
          log(`❌ Error compiling: ${stderr || error.message}`, "red");
          reject(error);
          return;
        }

        if (stdout) {
          // Filter only important messages
          const lines = stdout
            .split("\n")
            .filter(
              (line) =>
                line.includes("Loading configuration") ||
                line.includes("Loading") ||
                line.includes("Warning") ||
                line.includes("Error") ||
                line.trim().length === 0
            );
          if (lines.length > 1) {
            log("Output of compilation:", "blue");
            console.log(lines.join("\n"));
          }
        }

        const swfPath = path.join(
          CONFIG.PROJECT,
          "bin-debug",
          "ObjectBuilder.swf"
        );
        if (!fs.existsSync(swfPath)) {
          reject(new Error("Failed to generate ObjectBuilder.swf!"));
          return;
        }

        const swfStats = fs.statSync(swfPath);
        log(
          `✅ Compilation completed! SWF: ${(
            swfStats.size /
            1024 /
            1024
          ).toFixed(2)} MB`,
          "green"
        );

        // Copy necessary files to bin-debug
        const filesToCopy = [
          { src: "src/firstRun/versions.xml", dest: "bin-debug/versions.xml" },
          { src: "src/firstRun/sprites.xml", dest: "bin-debug/sprites.xml" },
        ];

        filesToCopy.forEach((file) => {
          const srcPath = path.join(CONFIG.PROJECT, file.src);
          const destPath = path.join(CONFIG.PROJECT, file.dest);
          if (fs.existsSync(srcPath)) {
            fs.copyFileSync(srcPath, destPath);
            log(`📄 Copied: ${file.dest}`, "blue");
          }
        });

        resolve();
      }
    );
  });
}

function packageApplication() {
  return new Promise((resolve, reject) => {
    log("⚙️ Packaging ObjectBuilder.exe...", "cyan");

    const adtCommand = [
      `"${path.join(CONFIG.AIRSDK, "bin", "adt.bat")}"`,
      `-package`,
      `-storetype pkcs12`,
      `-keystore "${path.join(CONFIG.PROJECT, `${CONFIG.CERT_NAME}.p12`)}"`,
      `-storepass "${CONFIG.CERT_PASS}"`,
      `-target bundle`,
      `"${path.join(CONFIG.PROJECT, "bin", "ObjectBuilder.exe")}"`,
      `"${path.join(CONFIG.PROJECT, "src", "ObjectBuilder-app.xml")}"`,
      `-C "${path.join(CONFIG.PROJECT, "bin-debug")}" ObjectBuilder.swf`,
      `-C "${path.join(CONFIG.PROJECT, "workerswfs")}" ObjectBuilderWorker.swf`,
      `-C "${path.join(CONFIG.PROJECT, "assets")}" icon`,
      `-C "${path.join(
        CONFIG.PROJECT,
        "src",
        "firstRun"
      )}" versions.xml sprites.xml`,
    ].join(" ");

    log("Executing command to package...", "blue");

    exec(
      adtCommand,
      {
        maxBuffer: 1024 * 1024 * 10,
      },
      (error, stdout, stderr) => {
        if (error) {
          log(`❌ Error packaging: ${stderr || error.message}`, "red");
          reject(error);
          return;
        }

        const exePath = path.join(CONFIG.PROJECT, "bin", "ObjectBuilder.exe");
        if (!fs.existsSync(exePath)) {
          reject(new Error("Failed to generate ObjectBuilder.exe!"));
          return;
        }

        const exeStats = fs.statSync(exePath);
        if (exeStats.isDirectory()) {
          // Bundle - directory
          const mainExe = path.join(exePath, "ObjectBuilder.exe");
          const swfFile = path.join(exePath, "ObjectBuilder.swf");

          if (fs.existsSync(mainExe) && fs.existsSync(swfFile)) {
            const swfStats = fs.statSync(swfFile);
            log(
              `✅ Application packaged! Bundle created in: ${exePath}`,
              "green"
            );
            log(
              `📱 Main SWF: ${(swfStats.size / 1024 / 1024).toFixed(2)} MB`,
              "green"
            );
          } else {
            reject(new Error("Bundle created but main files not found!"));
            return;
          }
        } else {
          // Single file
          log(
            `✅ Application packaged! EXE: ${(
              exeStats.size /
              1024 /
              1024
            ).toFixed(2)} MB`,
            "green"
          );
        }

        resolve();
      }
    );
  });
}

// Main function
async function main() {
  try {
    log("🚀 Starting build of ObjectBuilder...", "cyan");
    log("=".repeat(50), "cyan");

    // 1. Create directories
    createDirectories();

    // 2. Check dependencies
    checkDependencies();

    // 3. Generate certificate if necessary
    await generateCertificate();

    // 4. Compile worker first
    await compileWorker();

    // 5. Compile main project
    await compileProject();

    // 6. Package application
    await packageApplication();

    log("=".repeat(50), "green");
    log("🎉 Build completed successfully!", "green");
    log(
      `📁 Executable: ${path.join(CONFIG.PROJECT, "bin", "ObjectBuilder.exe")}`,
      "green"
    );
    log(
      `🔐 Certificate: ${CONFIG.CERT_NAME}.p12 (password: ${CONFIG.CERT_PASS})`,
      "yellow"
    );
  } catch (error) {
    log("=".repeat(50), "red");
    log(`❌ Build failed: ${error.message}`, "red");
    process.exit(1);
  }
}

// Execute if called directly
if (require.main === module) {
  main();
}
