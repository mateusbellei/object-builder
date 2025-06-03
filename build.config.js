// Configurações do Build - ObjectBuilder
module.exports = {
  // Caminhos dos SDKs
  paths: {
    FLEX_SDK: "libs/Flex_4.16.1_AIR_32.0",
    AIRSDK: "libs/AIRSDK_51.2.1",
    PROJECT: ".",
  },

  // Configurações do certificado
  certificate: {
    name: "object_builder",
    password: "ObjectBuilder2024!",
    validityPeriod: 25, // anos
    commonName: "ObjectBuilder",
    organizationalUnit: "Development",
    organization: "ObjectBuilder",
    country: "BR",
  },

  // Configurações de compilação
  compiler: {
    targetPlayer: "27.0",
    debug: false,
    optimize: true,
    verboseStacktraces: true,

    // Bibliotecas externas (libs/)
    externalLibraries: [
      "mignari_core.swc",
      "mignari.swc",
      "mignari_assets.swc",
      "blooddy_crypto.swc",
      "NailLib.swc",
    ],
  },

  // Arquivos extras para incluir no build
  packageFiles: [
    {
      source: "src/firstRun/versions.xml",
      destination: "versions.xml",
    },
    {
      source: "src/firstRun/sprites.xml",
      destination: "sprites.xml",
    },
    {
      source: "assets/icon",
      destination: "icon",
    },
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
