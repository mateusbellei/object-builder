# 🚀 ObjectBuilder - Início Rápido

## Para Novos Desenvolvedores

### 📦 Setup em 3 Passos

1. **Clone e instale dependências:**

   ```bash
   git clone <repositorio>
   cd object-builder
   npm install
   ```

2. **Verificar se tudo está correto:**

   ```bash
   npm run check-setup
   ```

3. **Setup automático (se necessário):**
   ```bash
   npm run setup
   ```

### 🎯 Uso Diário

```bash
# Build completo (30-60s)
npm run build

# Executar ObjectBuilder
npm run run

# Limpar arquivos gerados
npm run clean
```

### 📋 Checklist Rápido

**Antes do primeiro build, certifique-se que existe:**

- [ ] `libs/Flex_4.16.1_AIR_32.0/` (Flex SDK)
- [ ] `libs/AIRSDK_51.2.1/` (AIR SDK)
- [ ] `libs/mignari_core.swc` (Biblioteca externa)
- [ ] `libs/mignari.swc` (Biblioteca externa)
- [ ] `libs/mignari_assets.swc` (Biblioteca externa)
- [ ] `libs/blooddy_crypto.swc` (Biblioteca externa)
- [ ] `libs/NailLib.swc` (Biblioteca externa)

### ⚡ Solução Rápida de Problemas

| Problema            | Solução                                              |
| ------------------- | ---------------------------------------------------- |
| Erro OSMF           | `npm run create-osmf`                                |
| Erro de certificado | Deletar `object_builder.p12` e rodar `npm run build` |
| Erro de dependência | `npm run check-setup`                                |
| Build não funciona  | `npm run clean && npm run build`                     |

### 🎉 Sucesso!

Se o comando `npm run run` abre o ObjectBuilder, está tudo funcionando!

**Tempo total de setup: ~2 minutos**

---

Para mais detalhes: [README.md](README.md)
