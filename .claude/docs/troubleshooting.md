# Troubleshooting Guide

## Common Issues and Solutions

### 1. Environment Variables Not Loading

**Problem:** API keys not working after updating `.env` file

**Solution:**
```bash
# Stop the server (Ctrl + C)
pnpm start --clear
# Reload the app in Expo Go
```

**Why:** Expo caches environment variables. The `--clear` flag clears the cache.

---

### 2. Firebase Index Error

**Problem:**
```
FirebaseError: The query requires an index
```

**Solution:**
- Click the provided Firebase Console link in the error
- Create the composite index
- Wait 2-3 minutes for index to build
- Retry the operation

**Prevention:** Avoid using `orderBy` with `where` clauses without proper indexes.

---

### 3. TypeScript "Unknown Type" Error

**Problem:**
```
Argument of type 'unknown' is not assignable to parameter
```

**Solution:**
```typescript
// Instead of:
const items = Array.from(iterator).map(item => item.value)

// Use:
const items = [...iterator].map((item) => item.value)
// or
const items = Array.from(iterator).map((item: Type) => item.value)
```

---

### 4. OpenAI API Key Invalid

**Problem:**
```
ERROR OpenAI API Error: {"code": "invalid_api_key"}
```

**Solutions:**
1. Verify API key in `.env` file
2. Restart server with `--clear` flag
3. Check API key hasn't expired
4. Get new key from https://platform.openai.com/account/api-keys

---

### 5. Image Upload Failing

**Problem:** Cloudinary upload returns error

**Solutions:**
1. Check Cloudinary credentials in `.env`
2. Verify upload preset exists
3. Check image file size (< 10MB)
4. Ensure proper network connection

---

### 6. Navigation Not Working

**Problem:** Screen doesn't navigate or shows blank

**Solutions:**
1. Check screen is exported in `screens/index.ts`
2. Verify navigation prop is passed correctly
3. Check activeTab state includes new screen
4. Ensure renderContent switch case exists

---

### 7. Styles Not Applying

**Problem:** NativeWind classes not working

**Solutions:**
1. Check `tailwind.config.js` includes file path
2. Restart Metro bundler
3. Clear cache: `pnpm start --clear`
4. Verify className syntax is correct

---

### 8. Firebase Permission Denied

**Problem:**
```
FirebaseError: Missing or insufficient permissions
```

**Solutions:**
1. Check Firestore security rules
2. Verify user is authenticated
3. Ensure user has proper role/permissions
4. Check document path is correct

---

### 9. App Crashes on Startup

**Problem:** App crashes immediately after launch

**Solutions:**
1. Check for syntax errors in recent changes
2. Review error logs in Metro bundler
3. Clear cache and restart
4. Check all imports are correct
5. Verify all required packages are installed

---

### 10. Fonts Not Loading

**Problem:** Custom fonts not displaying

**Solutions:**
1. Verify font files in `assets/fonts/`
2. Check font names in `app.json`
3. Use `useFonts` hook properly
4. Wait for fonts to load before rendering

---

## Debugging Tips

### Enable Debug Mode
```typescript
// Add to component
console.log('Debug:', { variable, state, props });
```

### Check Network Requests
```typescript
// Log API calls
console.log('API Request:', url, body);
console.log('API Response:', response);
```

### Inspect State Changes
```typescript
useEffect(() => {
  console.log('State changed:', state);
}, [state]);
```

### React Native Debugger
1. Shake device (or Cmd+D / Ctrl+D)
2. Select "Debug"
3. Open Chrome DevTools
4. Use Console and Network tabs

---

## Performance Issues

### Slow Rendering
- Use React.memo for expensive components
- Implement virtualization for long lists
- Optimize images (resize, compress)
- Reduce re-renders with useCallback

### Large Bundle Size
- Remove unused dependencies
- Use dynamic imports
- Enable Hermes engine
- Analyze bundle with `npx react-native-bundle-visualizer`

### Memory Leaks
- Clean up subscriptions in useEffect
- Remove event listeners
- Cancel pending API calls
- Clear timers and intervals

---

## Build Issues

### iOS Build Fails
```bash
cd ios
pod install
cd ..
pnpm ios
```

### Android Build Fails
```bash
cd android
./gradlew clean
cd ..
pnpm android
```

### Expo Build Fails
```bash
eas build --platform all --clear-cache
```

---

## Getting Help

### Resources
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [Firebase Docs](https://firebase.google.com/docs)
- [OpenAI API Docs](https://platform.openai.com/docs)

### Community
- Stack Overflow
- React Native Discord
- Expo Forums
- GitHub Issues

### Logs to Provide
1. Error message (full stack trace)
2. Steps to reproduce
3. Environment (OS, Node version, etc.)
4. Recent changes made
5. Relevant code snippets
