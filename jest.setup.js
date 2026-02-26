import '@testing-library/jest-native/extend-expect';

// Mock Firebase
jest.mock('./lib/firebase', () => ({
  db: {},
  auth: {},
  storage: {}
}));

// Mock Expo modules
jest.mock('expo-camera', () => ({
  Camera: 'Camera'
}));

jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
  MediaTypeOptions: { Images: 'Images' }
}));

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn()
}));

// Mock React Native modules
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Silence console warnings in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn()
};
