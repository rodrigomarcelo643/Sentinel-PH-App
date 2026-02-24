const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.unstable_enableSymlinks = true;
config.resolver.unstable_enablePackageExports = true;
config.watchFolders = [path.resolve(__dirname)];

module.exports = withNativeWind(config, { input: './global.css' });
