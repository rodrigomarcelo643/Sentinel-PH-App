import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import { onAuthStateChanged } from 'firebase/auth';

jest.mock('firebase/auth');
jest.mock('../../lib/firebase');

const TestComponent = () => {
  const { user, loading } = useAuth();
  return (
    <>
      <Text testID="loading">{loading ? 'loading' : 'loaded'}</Text>
      <Text testID="user">{user ? user.uid : 'no-user'}</Text>
    </>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('provides initial loading state', () => {
    const mockOnAuthStateChanged = onAuthStateChanged as jest.Mock;
    mockOnAuthStateChanged.mockImplementation(() => jest.fn());
    
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(getByTestId('loading').props.children).toBe('loading');
  });

  it('updates user state when authenticated', async () => {
    const mockOnAuthStateChanged = onAuthStateChanged as jest.Mock;
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback({ uid: '123', email: 'test@example.com' });
      return jest.fn();
    });
    
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    await waitFor(() => {
      expect(getByTestId('user').props.children).toBe('123');
      expect(getByTestId('loading').props.children).toBe('loaded');
    });
  });

  it('sets user to null when not authenticated', async () => {
    const mockOnAuthStateChanged = onAuthStateChanged as jest.Mock;
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null);
      return jest.fn();
    });
    
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    await waitFor(() => {
      expect(getByTestId('user').props.children).toBe('no-user');
      expect(getByTestId('loading').props.children).toBe('loaded');
    });
  });

  it('unsubscribes on unmount', () => {
    const unsubscribe = jest.fn();
    const mockOnAuthStateChanged = onAuthStateChanged as jest.Mock;
    mockOnAuthStateChanged.mockReturnValue(unsubscribe);
    
    const { unmount } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    unmount();
    expect(unsubscribe).toHaveBeenCalled();
  });
});
