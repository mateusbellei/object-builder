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
      log(`📁 Diretório criado: ${dir}`, "blue");
    }
  });
}

function checkDependencies() {
  log("🔍 Verificando dependências...", "cyan");

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
    log("❌ ERRO: Dependências não encontradas:", "red");
    missing.forEach((item) => log(`   - ${item.name}: ${item.path}`, "red"));
    process.exit(1);
  }

  // Verificar playerglobal.swc
  const playerglobalPath = path.join(
    CONFIG.FLEX_SDK,
    "frameworks",
    "libs",
    "player",
    CONFIG.TARGET_PLAYER,
    "playerglobal.swc"
  );
  if (!fs.existsSync(playerglobalPath)) {
    log(`❌ ERRO: playerglobal.swc não encontrado: ${playerglobalPath}`, "red");
    process.exit(1);
  }

  // Verificar bibliotecas externas
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

  // OSMF precisa ser incluída, não externa
  const osmfPath = path.join(CONFIG.PROJECT, "libs", "osmf.swc");
  const includeOsmf = fs.existsSync(osmfPath) ? [osmfPath] : [];

  if (existingExternalLibs.length > 0) {
    log("⚠️  Bibliotecas externas encontradas:", "yellow");
    existingExternalLibs.forEach((lib) =>
      log(`   - ${path.basename(lib)}`, "yellow")
    );
  }

  log("✅ Dependências principais encontradas!", "green");
}

function generateCertificate() {
  const certPath = path.join(CONFIG.PROJECT, `${CONFIG.CERT_NAME}.p12`);

  if (fs.existsSync(certPath)) {
    log("📜 Certificado já existe, usando o existente...", "yellow");
    return Promise.resolve();
  }

  log("🔐 Gerando novo certificado...", "cyan");

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
        log(`❌ Erro ao gerar certificado: ${stderr || error.message}`, "red");
        reject(error);
        return;
      }

      if (fs.existsSync(certPath)) {
        log("✅ Certificado gerado com sucesso!", "green");
        resolve();
      } else {
        reject(new Error("Falha ao criar certificado"));
      }
    });
  });
}

function buildLibraryPaths() {
  // Bibliotecas principais do Flex/AIR
  const coreLibraries = [
    // Bibliotecas básicas do Flex
    path.join(CONFIG.FLEX_SDK, "frameworks", "libs", "framework.swc"),
    path.join(CONFIG.FLEX_SDK, "frameworks", "libs", "spark.swc"),
    path.join(CONFIG.FLEX_SDK, "frameworks", "libs", "sparkskins.swc"),
    path.join(CONFIG.FLEX_SDK, "frameworks", "libs", "spark_dmv.swc"),
    path.join(CONFIG.FLEX_SDK, "frameworks", "libs", "rpc.swc"),
    path.join(CONFIG.FLEX_SDK, "frameworks", "libs", "mx", "mx.swc"),

    // Bibliotecas AIR (correto: vem do Flex SDK)
    path.join(CONFIG.FLEX_SDK, "frameworks", "libs", "air", "airframework.swc"),
    path.join(CONFIG.FLEX_SDK, "frameworks", "libs", "air", "airspark.swc"),

    // Bibliotecas AIR do AIR SDK (para UpdateEvent, etc.)
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

  // Verificar quais bibliotecas existem
  const existingCoreLibs = coreLibraries.filter((lib) => fs.existsSync(lib));
  const missingCoreLibs = coreLibraries.filter((lib) => !fs.existsSync(lib));

  if (missingCoreLibs.length > 0) {
    log("⚠️  Algumas bibliotecas principais não foram encontradas:", "yellow");
    missingCoreLibs.forEach((lib) =>
      log(`   - ${path.basename(lib)}`, "yellow")
    );
  }

  // Bibliotecas externas
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

  // OSMF precisa ser incluída, não externa
  const osmfPath = path.join(CONFIG.PROJECT, "libs", "osmf.swc");
  const includeOsmf = fs.existsSync(osmfPath) ? [osmfPath] : [];

  // Caminhos de biblioteca
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
    log("🔧 Compilando ObjectBuilderWorker.swf...", "cyan");

    // Criar diretório workerswfs se não existir
    const workerDir = path.join(CONFIG.PROJECT, "workerswfs");
    if (!fs.existsSync(workerDir)) {
      fs.mkdirSync(workerDir, { recursive: true });
      log(`📁 Diretório criado: ${workerDir}`, "blue");
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
      `-locale=`, // Desabilitar locale para worker
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

    log("Executando comando de compilação do worker...", "blue");

    // Definir variáveis de ambiente para o processo
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
          log(`❌ Erro ao compilar worker: ${stderr || error.message}`, "red");
          reject(error);
          return;
        }

        const workerPath = path.join(
          CONFIG.PROJECT,
          "workerswfs",
          "ObjectBuilderWorker.swf"
        );
        if (!fs.existsSync(workerPath)) {
          reject(new Error("Falha ao gerar ObjectBuilderWorker.swf!"));
          return;
        }

        const workerStats = fs.statSync(workerPath);
        log(
          `✅ Worker compilado! SWF: ${(workerStats.size / 1024 / 1024).toFixed(
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
    log("🚀 Compilando ObjectBuilder.mxml...", "cyan");

    const { libraryPaths, includedLibs } = buildLibraryPaths();

    // Usar uma abordagem mais simples - definir o caminho completo do playerglobal
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
      `-compiler.strict=false`, // Menos rigoroso para projetos legados
      `-warnings=false`, // Reduzir warnings verbosos
      `-compiler.accessible=false`, // Desabilitar acessibilidade que pode causar problemas
      `"${path.join(CONFIG.PROJECT, "src", "ObjectBuilder.mxml")}"`,
      `-o "${path.join(CONFIG.PROJECT, "bin-debug", "ObjectBuilder.swf")}"`,
    ].join(" ");

    log("Executando comando de compilação...", "blue");

    // Definir variáveis de ambiente para o processo
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
          log(`❌ Erro ao compilar: ${stderr || error.message}`, "red");
          reject(error);
          return;
        }

        if (stdout) {
          // Filtrar apenas mensagens importantes
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
            log("Saída da compilação:", "blue");
            console.log(lines.join("\n"));
          }
        }

        const swfPath = path.join(
          CONFIG.PROJECT,
          "bin-debug",
          "ObjectBuilder.swf"
        );
        if (!fs.existsSync(swfPath)) {
          reject(new Error("Falha ao gerar ObjectBuilder.swf!"));
          return;
        }

        const swfStats = fs.statSync(swfPath);
        log(
          `✅ Compilação concluída! SWF: ${(
            swfStats.size /
            1024 /
            1024
          ).toFixed(2)} MB`,
          "green"
        );

        // Copiar arquivos necessários para bin-debug
        const filesToCopy = [
          { src: "src/firstRun/versions.xml", dest: "bin-debug/versions.xml" },
          { src: "src/firstRun/sprites.xml", dest: "bin-debug/sprites.xml" },
        ];

        filesToCopy.forEach((file) => {
          const srcPath = path.join(CONFIG.PROJECT, file.src);
          const destPath = path.join(CONFIG.PROJECT, file.dest);
          if (fs.existsSync(srcPath)) {
            fs.copyFileSync(srcPath, destPath);
            log(`📄 Copiado: ${file.dest}`, "blue");
          }
        });

        resolve();
      }
    );
  });
}

function packageApplication() {
  return new Promise((resolve, reject) => {
    log("⚙️ Empacotando ObjectBuilder.exe...", "cyan");

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

    log("Executando comando de empacotamento...", "blue");

    exec(
      adtCommand,
      {
        maxBuffer: 1024 * 1024 * 10,
      },
      (error, stdout, stderr) => {
        if (error) {
          log(`❌ Erro ao empacotar: ${stderr || error.message}`, "red");
          reject(error);
          return;
        }

        const exePath = path.join(CONFIG.PROJECT, "bin", "ObjectBuilder.exe");
        if (!fs.existsSync(exePath)) {
          reject(new Error("Falha ao gerar ObjectBuilder.exe!"));
          return;
        }

        const exeStats = fs.statSync(exePath);
        if (exeStats.isDirectory()) {
          // Bundle - diretório
          const mainExe = path.join(exePath, "ObjectBuilder.exe");
          const swfFile = path.join(exePath, "ObjectBuilder.swf");

          if (fs.existsSync(mainExe) && fs.existsSync(swfFile)) {
            const swfStats = fs.statSync(swfFile);
            log(
              `✅ Aplicação empacotada! Bundle criado em: ${exePath}`,
              "green"
            );
            log(
              `📱 SWF principal: ${(swfStats.size / 1024 / 1024).toFixed(
                2
              )} MB`,
              "green"
            );
          } else {
            reject(
              new Error(
                "Bundle criado mas arquivos principais não encontrados!"
              )
            );
            return;
          }
        } else {
          // Arquivo único
          log(
            `✅ Aplicação empacotada! EXE: ${(
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

// Função principal
async function main() {
  try {
    log("🚀 Iniciando build do ObjectBuilder...", "cyan");
    log("=".repeat(50), "cyan");

    // 1. Criar diretórios
    createDirectories();

    // 2. Verificar dependências
    checkDependencies();

    // 3. Gerar certificado se necessário
    await generateCertificate();

    // 4. Compilar worker primeiro
    await compileWorker();

    // 5. Compilar projeto principal
    await compileProject();

    // 6. Empacotar aplicação
    await packageApplication();

    log("=".repeat(50), "green");
    log("🎉 Build concluído com sucesso!", "green");
    log(
      `📁 Executável: ${path.join(CONFIG.PROJECT, "bin", "ObjectBuilder.exe")}`,
      "green"
    );
    log(
      `🔐 Certificado: ${CONFIG.CERT_NAME}.p12 (senha: ${CONFIG.CERT_PASS})`,
      "yellow"
    );
  } catch (error) {
    log("=".repeat(50), "red");
    log(`❌ Build falhou: ${error.message}`, "red");
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}
