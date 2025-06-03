# Estratégia de Libs - ObjectBuilder

## 📋 Decisão: SDKs Incluídos no Repositório (Estratégia Híbrida)

### 🚨 **Problema Descoberto:**

GitHub tem **limites rígidos** de tamanho de arquivo:

- ⚠️ **Warning**: Arquivos > 50MB
- ❌ **Error**: Arquivos > 100MB são **rejeitados completamente**

**Arquivos problemáticos identificados:**

```
❌ REJEITADOS:
├── libRuntimeHMAOT.arm-air.a          (203.42 MB)
├── AdobeAIRSDK.zip                    (408.80 MB)
└── libRuntimeInterpreter.arm-air.a    (202.63 MB)
```

### 🎯 **Solução: Estratégia Híbrida**

#### ✅ **O que VAI para o Git:**

- **SDK Core**: Compiladores, frameworks, libs essenciais
- **SWCs externos**: Todas as bibliotecas .swc (< 1MB cada)
- **Tools**: Ferramentas de build e templates
- **Samples**: Exemplos e themes

#### ❌ **O que NÃO vai para o Git:**

- **Arquivos AOT**: `*.a` (nativos ARM/x86)
- **ZIPs grandes**: `AdobeAIRSDK.zip` (408MB)
- **Runtimes nativos**: Apenas para mobile/desktop

#### 🔄 **Download Automático:**

```bash
# Após clone inicial:
npm install          # Automatically runs postinstall
npm run download-large   # Downloads missing large files
npm run build        # Works normally
```

### 📦 **O que está incluído:**

```
libs/
├── Flex_4.16.1_AIR_32.0/     # SDK essencial (~500MB)
│   ├── frameworks/           # ✅ Incluído
│   ├── bin/                  # ✅ Incluído
│   ├── lib/                  # ✅ Incluído
│   └── in/AdobeAIRSDK.zip    # ❌ Download separado
├── AIRSDK_51.2.1/            # AIR SDK filtrado (~100MB)
│   ├── frameworks/           # ✅ Incluído
│   ├── bin/                  # ✅ Incluído
│   └── lib/aot/              # ❌ Arquivos .a excluídos
├── mignari_core.swc          # ✅ Incluído (177 KB)
├── mignari.swc               # ✅ Incluído (236 KB)
├── mignari_assets.swc        # ✅ Incluído (10 KB)
├── blooddy_crypto.swc        # ✅ Incluído (25 KB)
├── NailLib.swc               # ✅ Incluído (286 KB)
└── osmf.swc                  # ✅ Incluído (1.9 KB)
```

### 🚀 **Benefícios Mantidos:**

1. **Setup Simples**: `git clone` → `npm install` → `npm run build`
2. **95% Offline**: Apenas alguns downloads automáticos
3. **Builds Reproduzíveis**: Versões exatas dos SDKs
4. **Tamanho Aceitável**: ~600MB em vez de 3.14GB

### 🔒 **Segurança Mantida:**

- **Certificados (.p12)** continuam no `.gitignore`
- **Builds temporários** continuam ignorados
- **Downloads automáticos** de fontes oficiais Adobe

### 📈 **Alternativas Consideradas:**

1. ~~**Git LFS**~~: Requer configuração especial no servidor
2. ~~**Repositório completo**~~: Excede limites do GitHub
3. ✅ **Estratégia Híbrida**: Melhor custo-benefício
4. ~~**Download manual**~~: Muito trabalhoso para devs

### 🎯 **Conclusão Revisada:**

A **estratégia híbrida** resolve o problema do GitHub mantendo **95% dos benefícios** do repositório completo, com apenas **alguns downloads automáticos** para arquivos que excedem os limites.

**Resultado prático:**

```bash
git clone object-builder      # ~600MB (rápido)
npm install                   # Downloads automáticos
npm run build                 # ✅ Funciona perfeitamente
```

---

**Última atualização**: Janeiro 2025  
**Problema GitHub**: Resolvido com estratégia híbrida
