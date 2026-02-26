import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { MultiStepRegisterScreen } from '../../screens/MultiStepRegisterScreen';
import { createUserWithEmailAndPassword } from 'firebase/auth';

jest.mock('firebase/auth');
jest.mock('firebase/firestore');
jest.mock('../../context', () => ({
  useAuth: () => ({ user: null, loading: false })
}));

describe('MultiStepRegisterScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders personal details step initially', () => {
    const { getByPlaceholderText, getByText } = render(<MultiStepRegisterScreen />);
    
    expect(getByPlaceholderText(/first name/i)).toBeTruthy();
    expect(getByPlaceholderText(/last name/i)).toBeTruthy();
    expect(getByText(/next/i)).toBeTruthy();
  });

  it('validates required fields in personal details', async () => {
    const { getByText, findByText } = render(<MultiStepRegisterScreen />);
    
    fireEvent.press(getByText(/next/i));
    
    await waitFor(() => {
      expect(findByText(/required/i)).toBeTruthy();
    });
  });

  it('validates Philippine phone number format', async () => {
    const { getByPlaceholderText, getByText, findByText } = render(<MultiStepRegisterScreen />);
    
    const phoneInput = getByPlaceholderText(/contact number/i);
    fireEvent.changeText(phoneInput, '12345');
    fireEvent.press(getByText(/next/i));
    
    await waitFor(() => {
      expect(findByText(/valid.*phone/i)).toBeTruthy();
    });
  });

  it('validates password strength', async () => {
    const { getByPlaceholderText, findByText } = render(<MultiStepRegisterScreen />);
    
    // Navigate to credentials step (mock navigation)
    const passwordInput = getByPlaceholderText(/password/i);
    fireEvent.changeText(passwordInput, 'weak');
    
    await waitFor(() => {
      expect(findByText(/at least 8 characters/i)).toBeTruthy();
    });
  });

  it('validates password confirmation match', async () => {
    const { getByPlaceholderText, findByText } = render(<MultiStepRegisterScreen />);
    
    const passwordInput = getByPlaceholderText(/^password$/i);
    const confirmInput = getByPlaceholderText(/confirm password/i);
    
    fireEvent.changeText(passwordInput, 'Password123!');
    fireEvent.changeText(confirmInput, 'Different123!');
    
    await waitFor(() => {
      expect(findByText(/passwords.*match/i)).toBeTruthy();
    });
  });

  it('creates user account with valid data', async () => {
    const mockCreateUser = createUserWithEmailAndPassword as jest.Mock;
    mockCreateUser.mockResolvedValue({ user: { uid: '123' } });
    
    const { getByPlaceholderText, getByText } = render(<MultiStepRegisterScreen />);
    
    // Fill personal details
    fireEvent.changeText(getByPlaceholderText(/first name/i), 'Juan');
    fireEvent.changeText(getByPlaceholderText(/last name/i), 'Dela Cruz');
    fireEvent.changeText(getByPlaceholderText(/contact/i), '09171234567');
    fireEvent.press(getByText(/next/i));
    
    // Fill credentials
    fireEvent.changeText(getByPlaceholderText(/email/i), 'juan@example.com');
    fireEvent.changeText(getByPlaceholderText(/^password$/i), 'Password123!');
    fireEvent.changeText(getByPlaceholderText(/confirm/i), 'Password123!');
    fireEvent.press(getByText(/register/i));
    
    await waitFor(() => {
      expect(mockCreateUser).toHaveBeenCalled();
    });
  });

  it('displays error on registration failure', async () => {
    const mockCreateUser = createUserWithEmailAndPassword as jest.Mock;
    mockCreateUser.mockRejectedValue(new Error('Email already exists'));
    
    const { getByText, findByText } = render(<MultiStepRegisterScreen />);
    
    // Complete registration flow
    fireEvent.press(getByText(/register/i));
    
    await waitFor(() => {
      expect(findByText(/email already exists/i)).toBeTruthy();
    });
  });

  it('navigates between registration steps', () => {
    const { getByText, queryByText } = render(<MultiStepRegisterScreen />);
    
    // Step 1: Personal Details
    expect(queryByText(/personal details/i)).toBeTruthy();
    
    fireEvent.press(getByText(/next/i));
    
    // Step 2: Document Verification
    expect(queryByText(/document/i)).toBeTruthy();
    
    fireEvent.press(getByText(/back/i));
    
    // Back to Step 1
    expect(queryByText(/personal details/i)).toBeTruthy();
  });
});
