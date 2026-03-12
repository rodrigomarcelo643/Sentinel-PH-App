const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.unstable_enableSymlinks = true;
config.resolver.unstable_enablePackageExports = true;
config.watchFolders = [path.resolve(__dirname)];

// Ensure proper asset resolution for APK builds
config.resolver.assetExts.push('db', 'mp3', 'ttf', 'obj', 'png', 'jpg');
config.resolver.sourceExts.push('jsx', 'js', 'ts', 'tsx', 'json', 'wasm', 'svg');

// Optimize for production builds
config.transformer.minifierConfig = {
  keep_fnames: true,
  mangle: {
    keep_fnames: true,
  },
};

module.exports = withNativeWind(config, { input: './global.css' });
