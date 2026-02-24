import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SplashScreen } from './components/screens/SplashScreen';
import { LoginScreen } from './screens';
import './global.css';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaProvider>
      {showSplash ? <SplashScreen /> : <LoginScreen />}
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
