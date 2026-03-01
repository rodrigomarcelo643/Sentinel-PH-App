import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SplashScreen } from './components/screens/SplashScreen';
import { LoginScreen, MultiStepRegisterScreen, PendingApprovalScreen, HomeScreen } from './screens';
import { AuthProvider, useAuth, AnnouncementProvider, useAnnouncements } from './context';
import { AnnouncementNotification } from './components/ui/AnnouncementNotification';
import { useFonts } from 'expo-font';
import './global.css';

const AppContent = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<'login' | 'register' | 'pending'>('login');
  const { user, loading } = useAuth();
  const { latestAnnouncement, showNotification, closeNotification } = useAnnouncements();

  // Debug logs
  useEffect(() => {
    console.log('App - showNotification:', showNotification);
    console.log('App - latestAnnouncement:', latestAnnouncement?.title);
  }, [showNotification, latestAnnouncement]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash || loading) return <SplashScreen />;

  // Redirect based on user status
  if (user?.status === 'approved') return (
    <>
      <HomeScreen />
      <AnnouncementNotification
        announcement={latestAnnouncement}
        visible={showNotification}
        onClose={() => {
          console.log('Closing notification manually');
          closeNotification();
        }}
        onPress={() => {
          console.log('Notification pressed');
          closeNotification();
          // Handle navigation if needed
        }}
      />
    </>
  );
  if (user?.status === 'pending') return <PendingApprovalScreen onBackToLogin={() => setCurrentScreen('login')} />;

  return currentScreen === 'login' ? (
    <LoginScreen 
      onNavigateToRegister={() => setCurrentScreen('register')} 
      onNavigateToPending={() => setCurrentScreen('pending')}
    />
  ) : currentScreen === 'register' ? (
    <MultiStepRegisterScreen onNavigateToLogin={() => setCurrentScreen('login')} />
  ) : (
    <PendingApprovalScreen onBackToLogin={() => setCurrentScreen('login')} />
  );
};

export default function App() {
  const [fontsLoaded] = useFonts({
    'Inter-Light': require('./assets/fonts/Inter_18pt-Light.ttf'),
    'Inter-Medium': require('./assets/fonts/Inter_18pt-Medium.ttf'),
    'Inter-SemiBold': require('./assets/fonts/Inter_24pt-SemiBold.ttf'),
  });

  if (!fontsLoaded) return null;

  return (
    <AuthProvider>
      <AnnouncementProvider>
        <SafeAreaProvider>
          <AppContent />
          <StatusBar style="light" />
        </SafeAreaProvider>
      </AnnouncementProvider>
    </AuthProvider>
  );
}
