import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { LoginScreen } from '../../screens/LoginScreen';
import { signInWithEmailAndPassword } from 'firebase/auth';

jest.mock('firebase/auth');
jest.mock('../../context', () => ({
  useAuth: () => ({ user: null, loading: false })
}));

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form correctly', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    
    expect(getByPlaceholderText(/email/i)).toBeTruthy();
    expect(getByPlaceholderText(/password/i)).toBeTruthy();
    expect(getByText(/sign in/i)).toBeTruthy();
  });

  it('validates email format', async () => {
    const { getByPlaceholderText, getByText, findByText } = render(<LoginScreen />);
    
    const emailInput = getByPlaceholderText(/email/i);
    const submitButton = getByText(/sign in/i);
    
    fireEvent.changeText(emailInput, 'invalid-email');
    fireEvent.press(submitButton);
    
    await waitFor(() => {
      expect(findByText(/valid email/i)).toBeTruthy();
    });
  });

  it('validates password requirement', async () => {
    const { getByPlaceholderText, getByText, findByText } = render(<LoginScreen />);
    
    const emailInput = getByPlaceholderText(/email/i);
    const submitButton = getByText(/sign in/i);
    
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.press(submitButton);
    
    await waitFor(() => {
      expect(findByText(/password/i)).toBeTruthy();
    });
  });

  it('calls signIn with correct credentials', async () => {
    const mockSignIn = signInWithEmailAndPassword as jest.Mock;
    mockSignIn.mockResolvedValue({ user: { uid: '123' } });
    
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    
    fireEvent.changeText(getByPlaceholderText(/email/i), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText(/password/i), 'password123');
    fireEvent.press(getByText(/sign in/i));
    
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith(
        expect.anything(),
        'test@example.com',
        'password123'
      );
    });
  });

  it('displays error on failed login', async () => {
    const mockSignIn = signInWithEmailAndPassword as jest.Mock;
    mockSignIn.mockRejectedValue(new Error('Invalid credentials'));
    
    const { getByPlaceholderText, getByText, findByText } = render(<LoginScreen />);
    
    fireEvent.changeText(getByPlaceholderText(/email/i), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText(/password/i), 'wrong');
    fireEvent.press(getByText(/sign in/i));
    
    await waitFor(() => {
      expect(findByText(/invalid credentials/i)).toBeTruthy();
    });
  });

  it('toggles password visibility', () => {
    const { getByPlaceholderText, getByTestId } = render(<LoginScreen />);
    
    const passwordInput = getByPlaceholderText(/password/i);
    const toggleButton = getByTestId('toggle-password');
    
    expect(passwordInput.props.secureTextEntry).toBe(true);
    fireEvent.press(toggleButton);
    expect(passwordInput.props.secureTextEntry).toBe(false);
  });
});
