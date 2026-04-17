#!/bin/bash
echo "🧹 Starting full Wem cleanup..."

# Remove caches only
rm -rf node_modules
rm -f package-lock.json
rm -rf .expo
rm -rf /tmp/metro-*

# Clean npm cache
npm cache clean --force 2>/dev/null

# Install
echo "Installing packages..."
npm install --legacy-peer-deps

# Force remove reanimated — causes worklets errors
rm -rf node_modules/react-native-reanimated
rm -rf node_modules/react-native-worklets-core
rm -rf node_modules/react-native-worklets

echo ""
echo "✅ Done! Now run: npx expo start --web --clear"
