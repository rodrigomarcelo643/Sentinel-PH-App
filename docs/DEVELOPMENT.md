# Development Guide

## Prerequisites

- **Node.js** v18 or higher
- **pnpm** package manager
- **Expo CLI** (installed globally)
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)
- **Firebase Account** with project setup

## Initial Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-username/sentinelph.git
cd Sentinel-PH-App
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Environment Configuration

Create `.env` file in root directory:

```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id

# Cloudinary Configuration
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Google Maps API
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_api_key

# Geoapify API
EXPO_PUBLIC_GEOAPIFY_API_KEY=your_geoapify_key
```

### 4. Firebase Setup

1. Create Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Email/Password)
3. Create Firestore database
4. Set up security rules (see `firebase.rules`)
5. Add web app and copy configuration

## Development Workflow

### Running the App

#### Web Development
```bash
pnpm run dev
# or
pnpm web
```

#### Android Development
```bash
pnpm android
```

#### iOS Development (macOS only)
```bash
pnpm ios
```

### Code Quality

#### Linting
```bash
pnpm lint
```

#### Formatting
```bash
pnpm format
```

#### Type Checking
```bash
pnpm tsc --noEmit
```

### Testing

#### Run Tests
```bash
pnpm test
```

#### Watch Mode
```bash
pnpm test --watch
```

#### Coverage Report
```bash
pnpm test --coverage
```

## Project Structure

```
Sentinel-PH-App/
├── components/          # Reusable components
│   ├── camera/         # Camera components
│   ├── registration/   # Registration flow
│   ├── report/         # Report submission
│   ├── screens/        # Screen components
│   └── ui/             # UI library
├── screens/            # Main screens
│   └── tabs/           # Tab screens
├── services/           # API services
├── context/            # React contexts
├── hooks/              # Custom hooks
├── utils/              # Utility functions
├── config/             # Configuration
├── assets/             # Static assets
└── docs/               # Documentation
```

## Component Development

### Creating New Components

1. Create component file in appropriate directory
2. Use TypeScript for type safety
3. Follow naming conventions (PascalCase)
4. Export from index.ts

Example:
```typescript
// components/ui/MyComponent.tsx
import React from 'react';
import { View, Text } from 'react-native';

interface MyComponentProps {
  title: string;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title }) => {
  return (
    <View>
      <Text>{title}</Text>
    </View>
  );
};
```

### Styling Guidelines

Use NativeWind (Tailwind CSS):
```typescript
<View className="flex-1 bg-white p-4">
  <Text className="text-lg font-semibold text-primary">
    Hello World
  </Text>
</View>
```

### Custom Fonts
```typescript
<Text style={{ fontFamily: 'Inter-SemiBold' }}>
  Bold Text
</Text>
```

## Service Development

### Creating New Services

1. Create service file in `/services`
2. Import Firebase/API dependencies
3. Export async functions
4. Handle errors appropriately

Example:
```typescript
// services/myService.ts
import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';

export const createItem = async (data: any) => {
  try {
    const docRef = await addDoc(collection(db, 'items'), data);
    return docRef.id;
  } catch (error) {
    console.error('Error creating item:', error);
    throw error;
  }
};
```

## State Management

### Using Context

```typescript
// context/MyContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface MyContextType {
  value: string;
  setValue: (val: string) => void;
}

const MyContext = createContext<MyContextType | undefined>(undefined);

export const MyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [value, setValue] = useState('');
  
  return (
    <MyContext.Provider value={{ value, setValue }}>
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => {
  const context = useContext(MyContext);
  if (!context) throw new Error('useMyContext must be used within MyProvider');
  return context;
};
```

## Navigation

### Screen Navigation

```typescript
// Using NavigationContext
const { navigateTo } = useNavigation();

navigateTo('screenName', { param: 'value' });
```

## Debugging

### React Native Debugger
1. Install React Native Debugger
2. Run app in development mode
3. Open debugger (Cmd+D / Ctrl+D)
4. Select "Debug JS Remotely"

### Console Logging
```typescript
console.log('Debug info:', data);
console.error('Error:', error);
console.warn('Warning:', warning);
```

### Firebase Debugging
```typescript
import { enableLogging } from 'firebase/firestore';
enableLogging(true);
```

## Building for Production

### Android APK
```bash
./build-apk.sh
# or
eas build --platform android
```

### iOS IPA
```bash
eas build --platform ios
```

### Web Build
```bash
pnpm build
```

## Common Issues

### Metro Bundler Cache
```bash
pnpm start --reset-cache
```

### Node Modules
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Expo Cache
```bash
expo start -c
```

## Git Workflow

### Branch Naming
- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/update-description` - Documentation
- `refactor/component-name` - Code refactoring

### Commit Messages
```
feat: add symptom report feature
fix: resolve QR code generation issue
docs: update API documentation
refactor: optimize authentication flow
```

## Code Review Checklist

- [ ] Code follows TypeScript best practices
- [ ] Components are properly typed
- [ ] Error handling is implemented
- [ ] No console.log in production code
- [ ] Tests are written and passing
- [ ] Documentation is updated
- [ ] No hardcoded credentials
- [ ] Responsive design works on all devices

## Performance Optimization

### Image Optimization
- Use Cloudinary transformations
- Lazy load images
- Compress before upload

### List Optimization
- Use FlatList for long lists
- Implement pagination
- Use keyExtractor

### Bundle Size
- Analyze bundle: `npx react-native-bundle-visualizer`
- Remove unused dependencies
- Use dynamic imports

## Security Best Practices

- Never commit `.env` files
- Use environment variables for secrets
- Validate user input
- Implement rate limiting
- Use Firebase security rules
- Sanitize data before display
