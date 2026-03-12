import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useCallback } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BackHandler, Platform } from 'react-native';
import { SplashScreen } from './components/screens/SplashScreen';
import { LoginScreen, MultiStepRegisterScreen, PendingApprovalScreen, HomeScreen, AnnouncementDetailScreen, ForgotPasswordScreen, CommunityScreen, RecentOutbreaksScreen, BHWDirectoryScreen, EmergencyContactsScreen } from './screens';
import { AuthProvider, useAuth, AnnouncementProvider, useAnnouncements } from './context';
import { AnnouncementNotification } from './components/ui/AnnouncementNotification';
import { useFonts } from 'expo-font';
import './global.css';

const AppContent = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<'login' | 'register' | 'pending' | 'forgotPassword'>('login');
  const [showAnnouncementDetail, setShowAnnouncementDetail] = useState(false);
  const [modalAnnouncement, setModalAnnouncement] = useState<any>(null);
  const { user, loading } = useAuth();
  const { latestAnnouncement, showNotification, closeNotification } = useAnnouncements();

  // Handle Android back button
  useEffect(() => {
    if (Platform.OS === 'android') {
      const backAction = () => {
        if (showAnnouncementDetail) {
          setShowAnnouncementDetail(false);
          setModalAnnouncement(null);
          return true;
        }
        if (currentScreen !== 'login' && !user) {
          setCurrentScreen('login');
          return true;
        }
        return false;
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
      return () => backHandler.remove();
    }
  }, [showAnnouncementDetail, currentScreen, user]);

  // Navigation handler with proper state management
  const handleNavigation = useCallback((screen: string, data?: any) => {
    switch (screen) {
      case 'login':
        setCurrentScreen('login');
        break;
      case 'register':
        setCurrentScreen('register');
        break;
      case 'pending':
        setCurrentScreen('pending');
        break;
      case 'forgotPassword':
        setCurrentScreen('forgotPassword');
        break;
      case 'announcementDetail':
        setModalAnnouncement(data);
        setShowAnnouncementDetail(true);
        break;
      case 'back':
        if (showAnnouncementDetail) {
          setShowAnnouncementDetail(false);
          setModalAnnouncement(null);
        } else {
          setCurrentScreen('login');
        }
        break;
    }
  }, [showAnnouncementDetail]);

  // Debug logs
  useEffect(() => {
    console.log('App - showNotification:', showNotification);
    console.log('App - latestAnnouncement:', latestAnnouncement?.title);
  }, [showNotification, latestAnnouncement]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500); // Reduced from 3000 to 2500 for better UX
    return () => clearTimeout(timer);
  }, []);

  // Ensure splash screen is hidden when fonts are loaded and user state is determined
  useEffect(() => {
    if (!loading && user !== undefined) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 1500); // Minimum splash duration
      return () => clearTimeout(timer);
    }
  }, [loading, user]);

  if (showSplash || loading) return <SplashScreen />;

  // Redirect based on user status
  if (user?.status === 'approved') {
    // Show announcement detail screen when modal is clicked
    if (showAnnouncementDetail && modalAnnouncement) {
      return (
        <AnnouncementDetailScreen 
          announcement={modalAnnouncement}
          onBack={() => handleNavigation('back')}
        />
      );
    }
    
    return (
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
            console.log('Notification pressed - navigating to detail');
            closeNotification();
            handleNavigation('announcementDetail', latestAnnouncement);
          }}
        />
      </>
    );
  }
  if (user?.status === 'pending') return <PendingApprovalScreen onBackToLogin={() => handleNavigation('login')} />;

  return currentScreen === 'login' ? (
    <LoginScreen 
      onNavigateToRegister={() => handleNavigation('register')} 
      onNavigateToPending={() => handleNavigation('pending')}
      onNavigateToForgotPassword={() => handleNavigation('forgotPassword')}
    />
  ) : currentScreen === 'register' ? (
    <MultiStepRegisterScreen onNavigateToLogin={() => handleNavigation('login')} />
  ) : currentScreen === 'forgotPassword' ? (
    <ForgotPasswordScreen onNavigateBack={() => handleNavigation('login')} />
  ) : (
    <PendingApprovalScreen onBackToLogin={() => handleNavigation('login')} />
  );
};

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Light': require('./assets/fonts/Inter_18pt-Light.ttf'),
    'Inter-Medium': require('./assets/fonts/Inter_18pt-Medium.ttf'),
    'Inter-SemiBold': require('./assets/fonts/Inter_24pt-SemiBold.ttf'),
  });

  // Show splash screen while fonts are loading or if there's an error
  if (!fontsLoaded && !fontError) {
    return <SplashScreen />;
  }

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
