import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SplashScreen } from './components/screens/SplashScreen';
import { LoginScreen } from './screens';
import { useFonts } from 'expo-font';
import './global.css';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [fontsLoaded] = useFonts({
    'Inter-Light': require('./assets/fonts/Inter_18pt-Light.ttf'),
    'Inter-Medium': require('./assets/fonts/Inter_18pt-Medium.ttf'),
    'Inter-SemiBold': require('./assets/fonts/Inter_24pt-SemiBold.ttf'),
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      {showSplash ? <SplashScreen /> : <LoginScreen />}
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
