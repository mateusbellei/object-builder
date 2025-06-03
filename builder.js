const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const FLEX_SDK = path.join("libs", "Flex_4.16.1_AIR_32.0");
const AIRSDK = path.join("libs", "AIRSDK_51.2.1");
const PROJECT = ".";

const playerglobalHome = path.join(FLEX_SDK, "frameworks", "libs", "player");

if (!fs.existsSync(path.join(playerglobalHome, "27.0", "playerglobal.swc"))) {
  console.error("❌ ERRO: playerglobal.swc NÃO encontrado em:");
  console.error(path.join(playerglobalHome, "27.0", "playerglobal.swc"));
  process.exit(1);
}

function buildProject() {
  console.log("🚀 Compilando ObjectBuilder.mxml...");

  const mxmlcCommand =
    `"${path.join(FLEX_SDK, "bin", "mxmlc.bat")}" -target-player=27.0 ` +
    `-library-path+=${path.join(FLEX_SDK, "frameworks", "libs")} ` +
    `-library-path+=${path.join(FLEX_SDK, "frameworks", "libs", "mx")} ` +
    `-include-libraries+=${path.join(
      FLEX_SDK,
      "frameworks",
      "libs",
      "spark.swc"
    )} ` +
    `-include-libraries+=${path.join(
      FLEX_SDK,
      "frameworks",
      "libs",
      "sparkskins.swc"
    )} ` +
    `-include-libraries+=${path.join(
      FLEX_SDK,
      "frameworks",
      "libs",
      "spark_dmv.swc"
    )} ` +
    `-include-libraries+=${path.join(
      FLEX_SDK,
      "frameworks",
      "libs",
      "framework.swc"
    )} ` +
    `-include-libraries+=${path.join(
      FLEX_SDK,
      "frameworks",
      "libs",
      "rpc.swc"
    )} ` +
    `-include-libraries+=${path.join(
      FLEX_SDK,
      "frameworks",
      "libs",
      "mx",
      "mx.swc"
    )} ` +
    `-include-libraries+=${path.join(
      FLEX_SDK,
      "frameworks",
      "libs",
      "air",
      "airframework.swc"
    )} ` +
    `-include-libraries+=${path.join(
      FLEX_SDK,
      "frameworks",
      "libs",
      "air",
      "airspark.swc"
    )} ` +
    `-include-libraries+=${path.join(
      AIRSDK,
      "frameworks",
      "libs",
      "air",
      "airglobal.swc"
    )} ` +
    `-source-path+=${path.join(PROJECT, "src")} ` +
    `"${path.join(PROJECT, "src", "ObjectBuilder.mxml")}" ` +
    `-o "${path.join(PROJECT, "bin-debug", "ObjectBuilder.swf")}"`;

  exec(mxmlcCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Erro ao compilar:\n${stderr || error.message}`);
      return;
    }
    console.log(stdout);

    const swfPath = path.join(PROJECT, "bin-debug", "ObjectBuilder.swf");
    if (!fs.existsSync(swfPath)) {
      console.error("❌ ERRO: Falha ao gerar ObjectBuilder.swf!");
      return;
    }

    console.log("⚙️ Empacotando ObjectBuilder.exe...");

    const adtCommand =
      `"${path.join(
        AIRSDK,
        "bin",
        "adt.bat"
      )}" -package -storetype pkcs12 -keystore "${path.join(
        PROJECT,
        "object_builder.p12"
      )}" -storepass Mateus007! -target bundle "${path.join(
        PROJECT,
        "bin",
        "ObjectBuilder.exe"
      )}" "${path.join(
        PROJECT,
        "src",
        "ObjectBuilder-app.xml"
      )}" -C "${path.join(PROJECT, "bin-debug")}" ObjectBuilder.swf ` +
      `-e "${path.join(
        PROJECT,
        "src",
        "firstRun",
        "versions.xml"
      )}" versions.xml ` +
      `-e "${path.join(
        PROJECT,
        "src",
        "firstRun",
        "sprites.xml"
      )}" sprites.xml ` +
      `-e "${path.join(PROJECT, "assets", "icon")}" icon`;

    exec(adtCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Erro ao empacotar:\n${stderr || error.message}`);
        return;
      }
      console.log(stdout);

      const exePath = path.join(PROJECT, "bin", "ObjectBuilder.exe");
      if (fs.existsSync(exePath)) {
        console.log("✅ Build concluído com sucesso! 🎉");
      } else {
        console.error("❌ ERRO: Falha ao gerar ObjectBuilder.exe!");
      }
    });
  });
}

buildProject();
