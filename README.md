# ObjectBuilder - Automated Build System

> Optimized build system for ObjectBuilder (Adobe AIR/ActionScript)

## 📋 Prerequisites

### Required Software

- **Node.js 16+** ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))
- **Windows 10/11** (tested)

### Required File Structure

```
object-builder/
├── libs/
│   ├── Flex_4.16.1_AIR_32.0/     # Flex SDK
│   ├── AIRSDK_51.2.1/            # AIR SDK
│   ├── mignari_core.swc          # External libraries
│   ├── mignari.swc
│   ├── mignari_assets.swc
│   ├── blooddy_crypto.swc
│   └── NailLib.swc
├── src/
│   ├── ObjectBuilder.mxml        # Main file
│   ├── ObjectBuilderWorker.as    # Worker
│   ├── ObjectBuilder-app.xml     # AIR configuration
│   └── firstRun/
│       ├── versions.xml
│       └── sprites.xml
└── assets/
    └── icon/                     # Application icons
```

## 🚀 Initial Setup (New Machine)

### 1. Clone and Dependencies

```bash
git clone <repository>
cd object-builder
npm install
```

### 2. Verify Setup

```bash
npm run check-setup
```

### 3. First Build

```bash
npm run build
```

## 📦 Available Commands

| Command               | Description             |
| --------------------- | ----------------------- |
| `npm run build`       | Complete build (30-60s) |
| `npm run clean`       | Clean generated files   |
| `npm run run`         | Execute ObjectBuilder   |
| `npm run check-setup` | Verify dependencies     |
| `npm run create-osmf` | Recreate OSMF library   |

## 🛠️ How It Works

### Automated Process

1. **Verification**: Dependencies and SDKs
2. **Certificate**: Automatic generation if needed
3. **Worker**: Compilation of ObjectBuilderWorker.swf
4. **Main**: Compilation of ObjectBuilder.mxml
5. **Packaging**: Creation of final executable

### Generated Outputs

- `bin-debug/ObjectBuilder.swf` - Main SWF (~5MB)
- `workerswfs/ObjectBuilderWorker.swf` - Worker (~0.6MB)
- `bin/ObjectBuilder.exe/` - Final executable bundle

## 🎯 Troubleshooting

### Error: "playerglobal.swc not found"

```bash
# Check if SDKs are in libs/ folder
npm run check-setup
```

### Error: "OSMF TimeEvent not found"

```bash
# Recreate OSMF library
npm run create-osmf
npm run build
```

### Error: "Invalid certificate"

```bash
# Remove existing certificate
del object_builder.p12
npm run build
```

## 📊 Performance

- **Build Time**: 30-60 seconds
- **Before**: 5-10 minutes (manual)
- **Improvement**: ~90% faster
- **Final SWF**: ~5.24 MB
- **Worker**: ~0.61 MB

## 🔧 Advanced Configuration

### Change Settings

Edit `build.config.js`:

```javascript
module.exports = {
  TARGET_PLAYER: "27.0",
  CERT_PASS: "ObjectBuilder2024!",
  // ... other settings
};
```

### Debug Mode

For development with debug:

```bash
# Edit build-optimized.js
compiler.debug=true
compiler.optimize=false
```

## 📝 Logs and Debug

### Verbose Build

```bash
node build-optimized.js
```

### Run with Debug

```bash
libs\AIRSDK_51.2.1\bin\adl.exe src\ObjectBuilder-app.xml bin-debug
```

## 🤝 Contributing

### Build Structure

- `build-optimized.js` - Main script
- `package.json` - NPM scripts
- `scripts/` - Helper scripts
- `create-osmf-stub.js` - OSMF library generator

### Adding New Library

1. Add SWC to `libs/`
2. Include in `externalLibs` in build-optimized.js
3. Test complete build

## 📋 New Machine Checklist

- [ ] Node.js installed
- [ ] Project cloned
- [ ] SDKs in `libs/` folder
- [ ] `npm install` executed
- [ ] `npm run check-setup` passed
- [ ] `npm run build` worked
- [ ] `npm run run` executed ObjectBuilder

## 🆘 Support

In case of problems:

1. Run `npm run check-setup`
2. Check build logs
3. Consult "Troubleshooting" section
4. Verify all libraries are present

---

**Result**: Automated ObjectBuilder build working in 30-60 seconds! 🎉
