const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);

// On web, redirect native-only packages to empty stubs
// Metro uses .web.tsx files automatically, but this catches any stragglers
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web') {
    const nativeOnly = [
      'react-native-maps',
      'react-native-reanimated',
      'react-native-worklets-core',
    ];
    if (nativeOnly.some(pkg => moduleName.startsWith(pkg))) {
      return { type: 'empty' };
    }
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
