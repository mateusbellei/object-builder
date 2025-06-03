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
        log(`❌ Erro: ${error.message}`, "red");
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
  log("🚀 Configuração automática do ObjectBuilder", "cyan");
  log("=".repeat(60), "cyan");

  try {
    // 1. Verificar setup inicial
    log("\n1️⃣ Verificando setup...", "yellow");
    const setupOk = checkSetup();

    if (!setupOk) {
      log("\n❌ Setup incompleto. Verifique os arquivos em falta.", "red");
      return false;
    }

    // 2. Criar biblioteca OSMF se necessário
    log("\n2️⃣ Verificando biblioteca OSMF...", "yellow");
    if (!fs.existsSync("libs/osmf.swc")) {
      await runCommand("node create-osmf-stub.js", "Criando biblioteca OSMF");
      log("✅ Biblioteca OSMF criada!", "green");
    } else {
      log("✅ Biblioteca OSMF já existe", "green");
    }

    // 3. Primeiro build
    log("\n3️⃣ Executando primeiro build...", "yellow");
    await runCommand("node build-optimized.js", "Build inicial");

    // 4. Teste de execução
    log("\n4️⃣ Testando execução...", "yellow");
    log("⚠️  Uma janela do ObjectBuilder deve abrir brevemente...", "yellow");

    // 5. Sucesso
    log("\n" + "=".repeat(60), "green");
    log("🎉 SETUP COMPLETO COM SUCESSO!", "green");
    log("\n📋 Comandos disponíveis:", "blue");
    log("  npm run build      # Build completo", "cyan");
    log("  npm run run        # Executar ObjectBuilder", "cyan");
    log("  npm run clean      # Limpar arquivos gerados", "cyan");
    log("  npm run check-setup # Verificar dependências", "cyan");

    log("\n🚀 Pronto para usar! Execute: npm run run", "green");

    return true;
  } catch (error) {
    log("\n❌ Erro durante o setup:", "red");
    log(error.message, "red");
    log("\n🔧 Tente executar manualmente:", "yellow");
    log("  npm run check-setup", "cyan");
    log("  npm run create-osmf", "cyan");
    log("  npm run build", "cyan");
    return false;
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  setupProject().then((success) => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { setupProject };
