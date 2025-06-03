# 🚀 ObjectBuilder - Setup Guide

## Para Novos Desenvolvedores

### ⚡ Setup Rápido (Recomendado)

```bash
git clone https://github.com/seu-repo/object-builder
cd object-builder
npm install    # ← Faz tudo automaticamente!
npm run build  # ✅ Já funciona!
```

**Pronto!** O `npm install` vai:

1. 📦 Instalar dependências (chalk, etc.)
2. 🔽 Verificar e baixar arquivos grandes (se necessário)
3. ✅ Deixar tudo pronto para build

### 📋 O que é baixado automaticamente?

**Apenas 5% dos SDKs** (se necessário):

- ❌ **AdobeAIRSDK.zip** (408MB) - _Só se precisar de recursos avançados_
- ❌ **Arquivos AOT** (*.a) - *Não usados no desktop build\*

**95% já está no Git** (~600MB):

- ✅ **Compiladores** (mxmlc, amxmlc)
- ✅ **Frameworks** (airglobal.swc, applicationupdater.swc)
- ✅ **Tools** (adt.bat, adl.exe)
- ✅ **Libs externas** (mignari, blooddy_crypto, NailLib)

### 🔧 Setup Manual (se necessário)

```bash
# Se quiser pular downloads automáticos:
npm install --ignore-scripts

# Baixar arquivos grandes manualmente (opcional):
npm run download-large

# Verificar se tudo está OK:
npm run check-setup
```

### 🎯 Builds Disponíveis

```bash
npm run build         # Build completo (worker + main + package)
npm run build:worker  # Apenas ObjectBuilderWorker.swf
npm run build:main    # Apenas ObjectBuilder.swf
npm run build:package # Apenas ObjectBuilder.exe
npm run clean         # Limpar builds anteriores
```

### 📊 Tamanhos dos Downloads

| Arquivo         | Tamanho | Status      | Necessário?     |
| --------------- | ------- | ----------- | --------------- |
| **Git Clone**   | ~600MB  | ✅ Sempre   | Sim             |
| AdobeAIRSDK.zip | 408MB   | 🔄 Opcional | Raramente       |
| AOT Libraries   | ~500MB  | ❌ Ignorado | Nunca (desktop) |

### ❓ FAQ

**Q: Por que alguns arquivos não estão no Git?**  
A: GitHub rejeita arquivos > 100MB. Mantivemos apenas o essencial.

**Q: O build funciona sem downloads extras?**  
A: Sim! 95% dos casos funcionam apenas com o Git clone.

**Q: Quando preciso do AdobeAIRSDK.zip?**  
A: Apenas para packaging avançado ou recursos específicos do AIR.

**Q: E os arquivos \*.a (AOT)?**  
A: Só para mobile/ARM. Desktop não usa.

---

**🎉 Resultado: Setup de ~2 minutos vs várias horas do processo manual!**
