import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';

jest.mock('firebase/auth');
jest.mock('../../lib/firebase');

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    it('successfully signs in user', async () => {
      const mockSignIn = signInWithEmailAndPassword as jest.Mock;
      mockSignIn.mockResolvedValue({ user: { uid: '123', email: 'test@example.com' } });
      
      const result = await signInWithEmailAndPassword(auth, 'test@example.com', 'password');
      
      expect(result.user.uid).toBe('123');
      expect(mockSignIn).toHaveBeenCalledWith(auth, 'test@example.com', 'password');
    });

    it('throws error on invalid credentials', async () => {
      const mockSignIn = signInWithEmailAndPassword as jest.Mock;
      mockSignIn.mockRejectedValue(new Error('auth/invalid-credential'));
      
      await expect(
        signInWithEmailAndPassword(auth, 'wrong@example.com', 'wrong')
      ).rejects.toThrow();
    });

    it('throws error on user not found', async () => {
      const mockSignIn = signInWithEmailAndPassword as jest.Mock;
      mockSignIn.mockRejectedValue(new Error('auth/user-not-found'));
      
      await expect(
        signInWithEmailAndPassword(auth, 'notfound@example.com', 'password')
      ).rejects.toThrow();
    });
  });

  describe('signUp', () => {
    it('successfully creates new user', async () => {
      const mockSignUp = createUserWithEmailAndPassword as jest.Mock;
      mockSignUp.mockResolvedValue({ user: { uid: '456', email: 'new@example.com' } });
      
      const result = await createUserWithEmailAndPassword(auth, 'new@example.com', 'password123');
      
      expect(result.user.uid).toBe('456');
      expect(mockSignUp).toHaveBeenCalledWith(auth, 'new@example.com', 'password123');
    });

    it('throws error on duplicate email', async () => {
      const mockSignUp = createUserWithEmailAndPassword as jest.Mock;
      mockSignUp.mockRejectedValue(new Error('auth/email-already-in-use'));
      
      await expect(
        createUserWithEmailAndPassword(auth, 'existing@example.com', 'password')
      ).rejects.toThrow();
    });

    it('throws error on weak password', async () => {
      const mockSignUp = createUserWithEmailAndPassword as jest.Mock;
      mockSignUp.mockRejectedValue(new Error('auth/weak-password'));
      
      await expect(
        createUserWithEmailAndPassword(auth, 'test@example.com', '123')
      ).rejects.toThrow();
    });
  });

  describe('signOut', () => {
    it('successfully signs out user', async () => {
      const mockSignOut = signOut as jest.Mock;
      mockSignOut.mockResolvedValue(undefined);
      
      await signOut(auth);
      
      expect(mockSignOut).toHaveBeenCalledWith(auth);
    });

    it('handles sign out errors', async () => {
      const mockSignOut = signOut as jest.Mock;
      mockSignOut.mockRejectedValue(new Error('Network error'));
      
      await expect(signOut(auth)).rejects.toThrow();
    });
  });
});
