// Configurações do Build - ObjectBuilder
module.exports = {
  // Configurações de SDK
  FLEX_SDK: "libs/Flex_4.16.1_AIR_32.0",
  AIRSDK: "libs/AIRSDK_51.2.1",
  TARGET_PLAYER: "27.0",

  // Configurações de certificado
  CERT_NAME: "object_builder",
  CERT_PASS: "ObjectBuilder2024!",

  // Bibliotecas externas necessárias
  EXTERNAL_LIBS: [
    "mignari_core.swc",
    "mignari.swc",
    "mignari_assets.swc",
    "blooddy_crypto.swc",
    "NailLib.swc",
  ],

  // Locales suportados
  LOCALES: "en_US,es_ES,pt_BR",

  // Configurações de compilação
  COMPILER: {
    DEBUG: false,
    OPTIMIZE: true,
    STRICT: false,
    WARNINGS: false,
    ACCESSIBLE: false,
  },

  // Arquivos que devem ser copiados para bin-debug
  COPY_FILES: [
    { src: "src/firstRun/versions.xml", dest: "bin-debug/versions.xml" },
    { src: "src/firstRun/sprites.xml", dest: "bin-debug/sprites.xml" },
  ],

  // Configurações de output
  output: {
    swfPath: "bin-debug/ObjectBuilder.swf",
    exePath: "bin/ObjectBuilder.exe",
    createDirectories: true,
  },

  // Configurações de logging
  logging: {
    colors: true,
    verbose: false,
    showFileSize: true,
  },
};
