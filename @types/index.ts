// TypeScript types and interfaces

export interface User {
  id: string;
  name: string;
  email: string;
}

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};
