const { checkSetup } = require("./scripts/check-setup");
const { exec } = require("child_process");
const fs = require("fs");

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

async function runCommand(command, description) {
  log(`🔨 ${description}...`, "blue");

  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        log(`❌ Error: ${error.message}`, "red");
        reject(error);
        return;
      }
      if (stdout) {
        console.log(stdout);
      }
      resolve();
    });
  });
}

async function setupProject() {
  log("🚀 Automatic ObjectBuilder configuration", "cyan");
  log("=".repeat(60), "cyan");

  try {
    // 1. Check initial setup
    log("\n1️⃣ Checking setup...", "yellow");
    const setupOk = checkSetup();

    if (!setupOk) {
      log("\n❌ Incomplete setup. Check missing files.", "red");
      return false;
    }

    // 2. Create OSMF library if necessary
    log("\n2️⃣ Checking OSMF library...", "yellow");
    if (!fs.existsSync("libs/osmf.swc")) {
      await runCommand("node create-osmf-stub.js", "Creating OSMF library");
      log("✅ OSMF library created!", "green");
    } else {
      log("✅ OSMF library already exists", "green");
    }

    // 3. First build
    log("\n3️⃣ Running first build...", "yellow");
    await runCommand("node build-optimized.js", "Initial build");

    // 4. Execution test
    log("\n4️⃣ Testing execution...", "yellow");
    log("⚠️  An ObjectBuilder window should open briefly...", "yellow");

    // 5. Success
    log("\n" + "=".repeat(60), "green");
    log("🎉 SETUP COMPLETED SUCCESSFULLY!", "green");
    log("\n📋 Available commands:", "blue");
    log("  npm run build      # Complete build", "cyan");
    log("  npm run run        # Execute ObjectBuilder", "cyan");
    log("  npm run clean      # Clean generated files", "cyan");
    log("  npm run check-setup # Check dependencies", "cyan");

    log("\n🚀 Ready to use! Execute: npm run run", "green");

    return true;
  } catch (error) {
    log("\n❌ Error during setup:", "red");
    log(error.message, "red");
    log("\n🔧 Try running manually:", "yellow");
    log("  npm run check-setup", "cyan");
    log("  npm run create-osmf", "cyan");
    log("  npm run build", "cyan");
    return false;
  }
}

// Execute if called directly
if (require.main === module) {
  setupProject().then((success) => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { setupProject };
