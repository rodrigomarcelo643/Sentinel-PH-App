import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SplashScreen } from './components/screens/SplashScreen';
import './global.css';

export default function App() {
  return (
    <SafeAreaProvider>
      <SplashScreen />
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
