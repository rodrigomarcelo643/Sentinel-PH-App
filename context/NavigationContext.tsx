import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { NavigationStack, saveNavigationState, loadNavigationState } from '../utils/navigation';

interface NavigationContextType {
  currentScreen: string;
  activeTab: string;
  navigationStack: NavigationStack;
  navigate: (screen: string, params?: any) => void;
  goBack: () => boolean;
  canGoBack: () => boolean;
  setActiveTab: (tab: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [activeTab, setActiveTabState] = useState('home');
  const [navigationStack] = useState(new NavigationStack());

  // Load navigation state on app start
  useEffect(() => {
    const loadState = async () => {
      const savedState = await loadNavigationState();
      if (savedState) {
        setCurrentScreen(savedState.currentScreen);
        setActiveTabState(savedState.activeTab);
      }
    };
    loadState();
  }, []);

  // Save navigation state when it changes
  useEffect(() => {
    saveNavigationState({
      currentScreen,
      activeTab,
    });
  }, [currentScreen, activeTab]);

  const navigate = useCallback((screen: string, params?: any) => {
    navigationStack.push(currentScreen);
    setCurrentScreen(screen);
  }, [currentScreen, navigationStack]);

  const setActiveTab = useCallback((tab: string) => {
    navigationStack.push(activeTab);
    setActiveTabState(tab);
  }, [activeTab, navigationStack]);

  const goBack = useCallback((): boolean => {
    if (navigationStack.canGoBack()) {
      const previousScreen = navigationStack.pop();
      if (previousScreen) {
        setCurrentScreen(previousScreen);
        return true;
      }
    }
    return false;
  }, [navigationStack]);

  const canGoBack = useCallback((): boolean => {
    return navigationStack.canGoBack();
  }, [navigationStack]);

  const value: NavigationContextType = {
    currentScreen,
    activeTab,
    navigationStack,
    navigate,
    goBack,
    canGoBack,
    setActiveTab,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};