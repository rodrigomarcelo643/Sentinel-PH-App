import AsyncStorage from '@react-native-async-storage/async-storage';

const NAVIGATION_STATE_KEY = '@SentinelPH:navigationState';

export interface NavigationState {
  currentScreen: string;
  activeTab: string;
  previousScreen?: string;
}

export const saveNavigationState = async (state: NavigationState): Promise<void> => {
  try {
    await AsyncStorage.setItem(NAVIGATION_STATE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Failed to save navigation state:', error);
  }
};

export const loadNavigationState = async (): Promise<NavigationState | null> => {
  try {
    const stateString = await AsyncStorage.getItem(NAVIGATION_STATE_KEY);
    return stateString ? JSON.parse(stateString) : null;
  } catch (error) {
    console.warn('Failed to load navigation state:', error);
    return null;
  }
};

export const clearNavigationState = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(NAVIGATION_STATE_KEY);
  } catch (error) {
    console.warn('Failed to clear navigation state:', error);
  }
};

// Navigation stack management for proper back button handling
export class NavigationStack {
  private stack: string[] = [];
  
  push(screen: string): void {
    // Avoid duplicate consecutive screens
    if (this.stack[this.stack.length - 1] !== screen) {
      this.stack.push(screen);
    }
  }
  
  pop(): string | undefined {
    return this.stack.pop();
  }
  
  peek(): string | undefined {
    return this.stack[this.stack.length - 1];
  }
  
  clear(): void {
    this.stack = [];
  }
  
  canGoBack(): boolean {
    return this.stack.length > 1;
  }
  
  getPrevious(): string | undefined {
    return this.stack.length > 1 ? this.stack[this.stack.length - 2] : undefined;
  }
}