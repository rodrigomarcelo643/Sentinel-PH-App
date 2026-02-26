# Testing Infrastructure

> **Branch:** `feature/jest-testing-infrastructure`

## 📦 Installation

```bash
pnpm add -D jest @testing-library/react-native @testing-library/jest-native jest-expo @types/jest react-test-renderer @types/react-test-renderer
```

## 📂 Structure

```
__tests__/
├── screens/           # Screen component tests
│   ├── LoginScreen.test.tsx
│   └── RegisterScreen.test.tsx
├── components/        # UI component tests
│   └── ui.test.tsx
├── services/          # Service layer tests
│   └── auth.test.ts
├── context/           # Context provider tests
│   └── AuthContext.test.tsx
└── utils/             # Utility function tests
```

## 🚀 Running Tests

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:coverage

# Specific test file
pnpm test LoginScreen

# Update snapshots
pnpm test -u
```

## 📝 Test Scripts (Add to package.json)

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --maxWorkers=2"
  }
}
```

## ✅ Test Coverage

### Screens
- ✅ LoginScreen - Authentication flow
- ✅ RegisterScreen - Multi-step registration
- ⏳ HomeScreen - Navigation and tabs
- ⏳ ReportScreen - Symptom reporting

### Components
- ✅ Button - Click handlers, variants, loading
- ✅ Input - Validation, errors, icons
- ⏳ Camera - ID scanner, selfie capture
- ⏳ StepIndicator - Multi-step progress

### Services
- ✅ Auth - Sign in, sign up, sign out
- ⏳ Registration - User profile creation
- ⏳ Location - Geolocation services

### Context
- ✅ AuthContext - User state management
- ⏳ Other contexts as needed

## 🧪 Writing Tests

### Component Test Example
```typescript
import { render, fireEvent } from '@testing-library/react-native';
import { MyComponent } from '../MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    const { getByText } = render(<MyComponent />);
    expect(getByText('Hello')).toBeTruthy();
  });

  it('handles button press', () => {
    const onPress = jest.fn();
    const { getByText } = render(<MyComponent onPress={onPress} />);
    fireEvent.press(getByText('Click'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

### Service Test Example
```typescript
import { myService } from '../services/myService';

jest.mock('firebase/firestore');

describe('myService', () => {
  it('fetches data successfully', async () => {
    const result = await myService.getData();
    expect(result).toBeDefined();
  });
});
```

## 🔧 Configuration

### jest.config.js
- Preset: `jest-expo`
- Transform ignore patterns for React Native modules
- Setup file: `jest.setup.js`
- Coverage collection from all `.ts/.tsx` files

### jest.setup.js
- Extends `@testing-library/jest-native`
- Mocks Firebase modules
- Mocks Expo modules (camera, location, image picker)
- Silences console warnings

## 📊 Coverage Goals

- **Statements:** 80%
- **Branches:** 75%
- **Functions:** 80%
- **Lines:** 80%

## 🚨 Common Issues

### Module not found
```bash
# Clear cache
pnpm test --clearCache
```

### Transform errors
```bash
# Ensure transformIgnorePatterns includes all RN modules
```

### Firebase mocks
```bash
# Check jest.setup.js has proper Firebase mocks
```

## 📚 Resources

- [Jest Documentation](https://jestjs.io/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Jest Expo](https://docs.expo.dev/guides/testing-with-jest/)

## ✨ Best Practices

1. **Test user behavior, not implementation**
2. **Use data-testid for complex queries**
3. **Mock external dependencies**
4. **Keep tests isolated and independent**
5. **Write descriptive test names**
6. **Test edge cases and error states**
7. **Maintain high coverage for critical paths**

---

**Status:** Active testing infrastructure  
**Last Updated:** 2024
