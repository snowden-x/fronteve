"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api-client';
import { User, UserRole, LoginCredentials, RegistrationData, AuthResponse, ApiError } from '@/lib/types';
import { setCookie, deleteCookie } from 'cookies-next';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (credentials: LoginCredentials, callbackUrl?: string | null) => Promise<void>;
  register: (data: RegistrationData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Cookie options
const cookieOptions = {
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: '/',
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check if user is already authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user_data');
      
      if (token && userData) {
        try {
          // Validate the token by fetching user data
          const response = await apiClient.get('/auth/users/me/');
          setUser(response.data);
          // Update stored user data with fresh data
          const updatedUserData = JSON.stringify(response.data);
          localStorage.setItem('user_data', updatedUserData);
          
          // Also update cookies
          setCookie('auth_token', token, cookieOptions);
          setCookie('user_data', updatedUserData, cookieOptions);
        } catch (error) {
          // Token is invalid, clear storage
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user_data');
          
          // Also clear cookies
          deleteCookie('auth_token');
          deleteCookie('user_data');
          
          setUser(null);
        }
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials, callbackUrl?: string | null): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get token from the token endpoint
      const tokenResponse = await apiClient.post<AuthResponse>('/auth/token/', {
        username: credentials.username,
        password: credentials.password
      });
      
      console.log('Token response:', tokenResponse.data);
      
      const { access, refresh } = tokenResponse.data;
      
      // Store tokens in localStorage
      localStorage.setItem('auth_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      // Also store token in cookies for middleware
      setCookie('auth_token', access, cookieOptions);
      
      // Fetch full user data
      const userResponse = await apiClient.get('/auth/users/me/', {
        headers: { Authorization: `Bearer ${access}` }
      });
      
      console.log('User data:', userResponse.data);
      
      const userData = userResponse.data;
      const userDataString = JSON.stringify(userData);
      
      // Store user data in localStorage
      localStorage.setItem('user_data', userDataString);
      
      // Also store user data in cookies for middleware
      setCookie('user_data', userDataString, cookieOptions);
      
      setUser(userData);
      
      // Determine redirect path based on user role
      let redirectPath = '/';
      if (userData.role === UserRole.ADMIN) {
        redirectPath = '/dashboard/admin';
      } else if (userData.role === UserRole.PHARMACY_STAFF) {
        redirectPath = '/dashboard';
      }
      
      // Redirect based on callback URL or user role
      if (callbackUrl && callbackUrl !== '/auth/login') {
        console.log('Redirecting to callback URL:', callbackUrl);
        router.push(decodeURIComponent(callbackUrl));
      } else {
        console.log('Redirecting to role-based path:', redirectPath);
        router.push(redirectPath);
      }
    } catch (error: any) {
      console.error('Login error full details:', error);
      const apiError = error.response?.data as ApiError;
      setError(apiError?.detail || 'Login failed. Please check your credentials.');
      console.error('Login error:', error.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegistrationData): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await apiClient.post('/auth/register/', data);
      router.replace('/auth/login?registered=true');
    } catch (error: any) {
      const apiError = error.response?.data as ApiError;
      setError(apiError?.detail || 'Registration failed. Please try again.');
      console.error('Registration error:', error.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    // Clear localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    
    // Also clear cookies
    deleteCookie('auth_token');
    deleteCookie('user_data');
    
    setUser(null);
    router.replace('/auth/login');
  };

  const clearError = (): void => {
    setError(null);
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
