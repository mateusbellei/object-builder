# 🚀 ObjectBuilder - Quick Start

## For New Developers

### 📦 Setup in 3 Steps

1. **Clone and install dependencies:**

   ```bash
   git clone <repository>
   cd object-builder
   npm install
   ```

2. **Verify everything is correct:**

   ```bash
   npm run check-setup
   ```

3. **Automatic setup (if needed):**
   ```bash
   npm run setup
   ```

### 🎯 Daily Usage

```bash
# Complete build (30-60s)
npm run build

# Execute ObjectBuilder
npm run run

# Clean generated files
npm run clean
```

### 📋 Quick Checklist

**Before first build, make sure these exist:**

- [ ] `libs/Flex_4.16.1_AIR_32.0/` (Flex SDK)
- [ ] `libs/AIRSDK_51.2.1/` (AIR SDK)
- [ ] `libs/mignari_core.swc` (External library)
- [ ] `libs/mignari.swc` (External library)
- [ ] `libs/mignari_assets.swc` (External library)
- [ ] `libs/blooddy_crypto.swc` (External library)
- [ ] `libs/NailLib.swc` (External library)

### ⚡ Quick Troubleshooting

| Problem           | Solution                                            |
| ----------------- | --------------------------------------------------- |
| OSMF error        | `npm run create-osmf`                               |
| Certificate error | Delete `object_builder.p12` and run `npm run build` |
| Dependency error  | `npm run check-setup`                               |
| Build not working | `npm run clean && npm run build`                    |

### 🎉 Success!

If the command `npm run run` opens ObjectBuilder, everything is working!

**Total setup time: ~2 minutes**

---

For more details: [README.md](README.md)
