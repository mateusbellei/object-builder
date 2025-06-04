const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

// Configurações CLÁSSICAS - igual ao original
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
    path.join(CONFIG.PROJECT, "workerswfs"),
  ];

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      log(`📁 Directory created: ${dir}`, "blue");
    }
  });
}

function compileClassicWorker() {
  return new Promise((resolve, reject) => {
    log("🔧 Compiling ObjectBuilderWorker.swf (CLASSIC)...", "cyan");

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
      `-swf-version=40`,
      `-external-library-path+="${playerglobalPath}"`,
      `-external-library-path+="${airglobalPath}"`,
      `-library-path+="${path.join(CONFIG.FLEX_SDK, "frameworks", "libs")}"`,
      `-library-path+="${path.join(
        CONFIG.FLEX_SDK,
        "frameworks",
        "libs",
        "air"
      )}"`,
      `-library-path+="${path.join(CONFIG.PROJECT, "libs")}"`,
      `-source-path+="${path.join(CONFIG.PROJECT, "src")}"`,
      `-locale=`,
      `-debug=false`,
      `-optimize=true`,
      `-verbose-stacktraces=false`,
      `-strict=false`,
      `-incremental=false`,
      `-use-network=false`,
      `-benchmark=false`,
      `-omit-trace-statements=true`,
      `-warnings=false`,
      `-accessible=false`,
      `"${path.join(CONFIG.PROJECT, "src", "ObjectBuilderWorker.as")}"`,
      `-o "${path.join(
        CONFIG.PROJECT,
        "workerswfs",
        "ObjectBuilderWorker.swf"
      )}"`,
    ].join(" ");

    log("Executing CLASSIC worker compilation...", "blue");

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
          `✅ CLASSIC Worker compiled! Size: ${(
            workerStats.size /
            1024 /
            1024
          ).toFixed(2)} MB`,
          "green"
        );
        resolve();
      }
    );
  });
}

function compileClassicProject() {
  return new Promise((resolve, reject) => {
    log("🚀 Compiling ObjectBuilder.mxml (CLASSIC)...", "cyan");

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
      `-swf-version=40`,
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
      `-source-path+="${path.join(CONFIG.PROJECT, "src")}"`,
      `-source-path+="${path.join(CONFIG.PROJECT, "locale", "{locale}")}"`,
      `-locale=en_US,es_ES,pt_BR`,
      `-allow-source-path-overlap=true`,
      `-debug=false`,
      `-optimize=true`,
      `-verbose-stacktraces=false`,
      `-strict=false`,
      `-incremental=false`,
      `-use-network=false`,
      `-benchmark=false`,
      `-omit-trace-statements=true`,
      `-warnings=false`,
      `-accessible=false`,
      `"${path.join(CONFIG.PROJECT, "src", "ObjectBuilder.mxml")}"`,
      `-o "${path.join(CONFIG.PROJECT, "bin-debug", "ObjectBuilder.swf")}"`,
    ].join(" ");

    log("Executing CLASSIC compilation...", "blue");

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
          `✅ CLASSIC Compilation completed! SWF: ${(
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

function packageClassicApp() {
  return new Promise((resolve, reject) => {
    log("📦 Creating final ObjectBuilder.exe...", "green");

    // Ensure bin directory exists
    const binDir = path.join(CONFIG.PROJECT, "bin");
    if (!fs.existsSync(binDir)) {
      fs.mkdirSync(binDir, { recursive: true });
    }

    const adtCommand = [
      `"${path.join(CONFIG.AIRSDK, "bin", "adt.bat")}"`,
      `-package`,
      `-storetype pkcs12`,
      `-keystore "${path.join(CONFIG.PROJECT, "object_builder.p12")}"`,
      `-storepass "ObjectBuilder2024!"`,
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

    log(`Executing: ${adtCommand}`, "yellow");

    exec(adtCommand, { cwd: CONFIG.PROJECT }, (error, stdout, stderr) => {
      if (error) {
        log(`❌ Packaging failed: ${error.message}`, "red");
        log(`Stderr: ${stderr}`, "red");
        reject(error);
        return;
      }

      if (stderr && stderr.includes("Error")) {
        log(`❌ Packaging error: ${stderr}`, "red");
        reject(new Error(stderr));
        return;
      }

      log("✅ ObjectBuilder.exe created successfully!", "green");

      // Check if file was created
      const exePath = path.join(CONFIG.PROJECT, "bin", "ObjectBuilder.exe");
      if (fs.existsSync(exePath)) {
        const stats = fs.statSync(exePath);
        log(
          `📁 ObjectBuilder.exe size: ${(stats.size / 1024 / 1024).toFixed(
            2
          )} MB`,
          "cyan"
        );
        resolve();
      } else {
        log("❌ ObjectBuilder.exe was not created", "red");
        reject(new Error("Executable not found"));
      }
    });
  });
}

// Main function
async function main() {
  try {
    log("🏛️ Starting CLASSIC build of ObjectBuilder...", "cyan");
    log("=".repeat(50), "cyan");

    // 1. Create directories
    createDirectories();

    // 2. Compile worker
    await compileClassicWorker();

    // 3. Compile main project
    await compileClassicProject();

    // 4. Package application
    await packageClassicApp();

    log("=".repeat(50), "green");
    log("🎉 CLASSIC Build completed successfully!", "green");
    log(
      `📁 SWF: ${path.join(CONFIG.PROJECT, "bin-debug", "ObjectBuilder.swf")}`,
      "green"
    );
    log(
      "🚀 Test with: libs\\AIRSDK_51.2.1\\bin\\adl.exe src\\ObjectBuilder-app.xml bin-debug",
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

module.exports = { main };
