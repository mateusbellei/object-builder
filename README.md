# ObjectBuilder - Build Automatizado

> Sistema de build otimizado para o ObjectBuilder (Adobe AIR/ActionScript)

## 📋 Pré-requisitos

### Software Necessário

- **Node.js 16+** ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))
- **Windows 10/11** (testado)

### Estrutura de Arquivos Necessária

```
object-builder/
├── libs/
│   ├── Flex_4.16.1_AIR_32.0/     # Flex SDK
│   ├── AIRSDK_51.2.1/            # AIR SDK
│   ├── mignari_core.swc          # Bibliotecas externas
│   ├── mignari.swc
│   ├── mignari_assets.swc
│   ├── blooddy_crypto.swc
│   └── NailLib.swc
├── src/
│   ├── ObjectBuilder.mxml        # Arquivo principal
│   ├── ObjectBuilderWorker.as    # Worker
│   ├── ObjectBuilder-app.xml     # Configuração AIR
│   └── firstRun/
│       ├── versions.xml
│       └── sprites.xml
└── assets/
    └── icon/                     # Ícones da aplicação
```

## 🚀 Setup Inicial (Nova Máquina)

### 1. Clone e Dependências

```bash
git clone <repositorio>
cd object-builder
npm install
```

### 2. Verificar Setup

```bash
npm run check-setup
```

### 3. Primeiro Build

```bash
npm run build
```

## 📦 Comandos Disponíveis

| Comando               | Descrição               |
| --------------------- | ----------------------- |
| `npm run build`       | Build completo (30-60s) |
| `npm run clean`       | Limpar arquivos gerados |
| `npm run run`         | Executar ObjectBuilder  |
| `npm run check-setup` | Verificar dependências  |
| `npm run create-osmf` | Recriar biblioteca OSMF |

## 🛠️ Como Funciona

### Processo Automatizado

1. **Verificação**: Dependências e SDKs
2. **Certificado**: Geração automática se necessário
3. **Worker**: Compilação do ObjectBuilderWorker.swf
4. **Principal**: Compilação do ObjectBuilder.mxml
5. **Empacotamento**: Criação do executável final

### Saídas Geradas

- `bin-debug/ObjectBuilder.swf` - SWF principal (~5MB)
- `workerswfs/ObjectBuilderWorker.swf` - Worker (~0.6MB)
- `bin/ObjectBuilder.exe/` - Bundle executável final

## 🎯 Solução de Problemas

### Erro: "playerglobal.swc não encontrado"

```bash
# Verificar se os SDKs estão na pasta libs/
npm run check-setup
```

### Erro: "OSMF TimeEvent not found"

```bash
# Recriar biblioteca OSMF
npm run create-osmf
npm run build
```

### Erro: "Certificado inválido"

```bash
# Remover certificado existente
del object_builder.p12
npm run build
```

## 📊 Performance

- **Tempo de Build**: 30-60 segundos
- **Antes**: 5-10 minutos (manual)
- **Melhoria**: ~90% mais rápido
- **SWF Final**: ~5.24 MB
- **Worker**: ~0.61 MB

## 🔧 Configuração Avançada

### Alterar Configurações

Edite `build.config.js`:

```javascript
module.exports = {
  TARGET_PLAYER: "27.0",
  CERT_PASS: "ObjectBuilder2024!",
  // ... outras configurações
};
```

### Debug Mode

Para desenvolvimento com debug:

```bash
# Editar build-optimized.js
compiler.debug=true
compiler.optimize=false
```

## 📝 Logs e Debug

### Build Verbose

```bash
node build-optimized.js
```

### Executar com Debug

```bash
libs\AIRSDK_51.2.1\bin\adl.exe src\ObjectBuilder-app.xml bin-debug
```

## 🤝 Contribuição

### Estrutura do Build

- `build-optimized.js` - Script principal
- `package.json` - NPM scripts
- `scripts/` - Scripts auxiliares
- `create-osmf-stub.js` - Gerador da lib OSMF

### Adicionando Nova Biblioteca

1. Adicionar SWC em `libs/`
2. Incluir em `externalLibs` no build-optimized.js
3. Testar build completo

## 📋 Checklist para Nova Máquina

- [ ] Node.js instalado
- [ ] Projeto clonado
- [ ] SDKs na pasta `libs/`
- [ ] `npm install` executado
- [ ] `npm run check-setup` passou
- [ ] `npm run build` funcionou
- [ ] `npm run run` executou ObjectBuilder

## 🆘 Suporte

Em caso de problemas:

1. Executar `npm run check-setup`
2. Verificar logs do build
3. Consultar seção "Solução de Problemas"
4. Verificar se todas as bibliotecas estão presentes

---

**Resultado**: Build automatizado do ObjectBuilder funcionando em 30-60 segundos! 🎉
