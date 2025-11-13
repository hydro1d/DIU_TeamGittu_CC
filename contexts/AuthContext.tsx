import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { User } from '../types';
import { 
  login as apiLogin, 
  register as apiRegister, 
  getLoggedInUser,
  updateUserProfile 
} from '../services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<User | null>;
  logout: () => void;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<User | null>;
  updateUser: (updatedUser: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const loggedInUser = await getLoggedInUser();
        setUser(loggedInUser);
      } catch (error) {
        console.log("No user session found or session expired.");
        localStorage.removeItem('authToken');
      } finally {
        setLoading(false);
      }
    };
    checkLoggedIn();
  }, []);

  const login = useCallback(async (email: string, pass: string) => {
    setLoading(true);
    try {
      const { user: loggedInUser, token } = await apiLogin(email, pass);
      localStorage.setItem('authToken', token);
      setUser(loggedInUser);
      return loggedInUser;
    } catch (error) {
      console.error(error);
      setUser(null);
      localStorage.removeItem('authToken');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    setUser(null);
  }, []);

  const register = useCallback(async (userData: Omit<User, 'id'> & { password: string }) => {
    setLoading(true);
    try {
      const { user: newUser, token } = await apiRegister(userData);
      localStorage.setItem('authToken', token);
      setUser(newUser);
      return newUser;
    } catch (error) {
      console.error(error);
      setUser(null);
      localStorage.removeItem('authToken');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const updateUser = useCallback(async (updatedUser: User) => {
    try {
        const savedUser = await updateUserProfile(updatedUser);
        setUser(savedUser);
    } catch (error) {
        console.error("Failed to update user:", error);
        throw error;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
