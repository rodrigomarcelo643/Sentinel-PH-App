#!/bin/bash

# SentinelPH APK Build Script
# This script ensures proper APK generation with state navigation support

echo "🚀 Building SentinelPH APK..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .expo
rm -rf android/app/build
rm -rf node_modules/.cache

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Prebuild for Android
echo "🔧 Prebuilding for Android..."
npx expo prebuild --platform android --clean

# Build APK
echo "📱 Building APK..."
npx expo run:android --variant release

echo "✅ APK build completed!"
echo "📍 APK location: android/app/build/outputs/apk/release/app-release.apk"