import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '@/services/auth.service';
import type { User } from '@/services/auth.service';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const ROLES = {
  ADMIN: 1,
  USER: 2
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restaurar sesión desde localStorage al cargar
    const storedUser = localStorage.getItem('userSession');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser) {
          parsedUser.roleId = Number(parsedUser.roleId);
          setUser(parsedUser);
        }
      } catch (e) {
        localStorage.removeItem('userSession');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const loggedInUser = await authService.login(credentials);
    setUser(loggedInUser);
    localStorage.setItem('userSession', JSON.stringify(loggedInUser));
  };

  const register = async (userData: any) => {
    const registeredUser = await authService.register(userData);
    setUser(registeredUser);
    localStorage.setItem('userSession', JSON.stringify(registeredUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userSession');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.roleId === ROLES.ADMIN,
    loading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
