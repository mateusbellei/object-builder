# ObjectBuilder - Sistema de Build Otimizado

## ✅ Status: FUNCIONANDO PERFEITAMENTE!

Este sistema de build automatizado substitui o processo manual descrito no [tutorial original](https://github.com/punkice3407/ObjectBuilder/wiki) com uma solução moderna e otimizada.

## 🚀 Build Rápido

```bash
# Build completo (recomendado)
npm run build

# Build e executar
npm start

# Apenas executar (após build)
npm run run
```

## 📋 Pré-requisitos

- **Node.js** 14+
- **Flex SDK 4.16.1** em `libs/Flex_4.16.1_AIR_32.0/`
- **AIR SDK 51.2.1** em `libs/AIRSDK_51.2.1/`
- **Bibliotecas externas** em `libs/`:
  - mignari_core.swc
  - mignari.swc
  - mignari_assets.swc
  - blooddy_crypto.swc
  - NailLib.swc

## 🔧 Processo de Build

O sistema executa automaticamente:

1. **Verificação de dependências** - Valida SDKs e arquivos
2. **Geração de certificado** - Cria `object_builder.p12` (senha: `ObjectBuilder2024!`)
3. **Compilação do Worker** - `ObjectBuilderWorker.swf` (0.61 MB)
4. **Compilação principal** - `ObjectBuilder.swf` (5.24 MB)
5. **Empacotamento AIR** - `bin/ObjectBuilder.exe/` (bundle completo)

## 📁 Estrutura de Saída

```
bin/ObjectBuilder.exe/
├── ObjectBuilder.exe      # Executável principal
├── ObjectBuilder.swf      # Aplicação Flash (5.24 MB)
├── Adobe AIR/            # Runtime AIR
├── icon/                 # Ícones da aplicação
├── META-INF/            # Metadados AIR
├── versions.xml         # Configurações
├── sprites.xml          # Configurações
└── mimetype             # Tipo MIME
```

## 🛠️ Scripts Disponíveis

```bash
npm run build           # Build completo
npm run build:worker    # Apenas worker
npm run build:main      # Apenas aplicação principal
npm run build:package   # Apenas empacotamento
npm run clean           # Limpar arquivos gerados
npm run cert:generate   # Gerar novo certificado
npm run cert:info       # Informações do certificado
npm run run             # Executar aplicação
npm start               # Build + executar
```

## 🔐 Certificado

- **Arquivo**: `object_builder.p12`
- **Senha**: `ObjectBuilder2024!`
- **Validade**: 25 anos
- **Geração**: Automática no primeiro build

## ⚡ Melhorias vs Tutorial Original

| Aspecto          | Tutorial Original  | Sistema Otimizado      |
| ---------------- | ------------------ | ---------------------- |
| **Configuração** | Manual, complexa   | Automática             |
| **Certificado**  | Manual via ADT     | Geração automática     |
| **Dependências** | Verificação manual | Validação automática   |
| **Build**        | VS Code + tasks    | Script Node.js         |
| **Logs**         | Básicos            | Coloridos e detalhados |
| **Erros**        | Difícil debug      | Mensagens claras       |
| **Tempo**        | ~5-10 minutos      | ~30-60 segundos        |

## 🐛 Problemas Resolvidos

### ✅ Compilação

- [x] Configuração playerglobalHome
- [x] Bibliotecas AIR (airglobal.swc)
- [x] Worker SWF não encontrado
- [x] Problemas de locale
- [x] Tipos UpdateEvent ausentes

### ✅ Empacotamento

- [x] Arquivo app.xml inválido (`content` placeholder)
- [x] Ícones ausentes no pacote
- [x] Sintaxe ADT incorreta
- [x] Caminhos de arquivo Windows

## 🎯 Resultado Final

**✅ Build 100% funcional!**

- Worker: 0.61 MB
- Aplicação: 5.24 MB
- Bundle completo em `bin/ObjectBuilder.exe/`
- Executável pronto para distribuição

## 📞 Suporte

Se encontrar problemas:

1. Execute `npm run clean`
2. Verifique se os SDKs estão em `libs/`
3. Execute `npm run build` novamente
4. Verifique logs coloridos para detalhes

---

**Desenvolvido para otimizar o workflow do ObjectBuilder** 🚀
