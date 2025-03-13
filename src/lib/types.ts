/**
 * User role types
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  PHARMACY_STAFF = 'STAFF',
  CUSTOMER = 'CUSTOMER',
}

/**
 * User interface
 */
export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: UserRole;
  phone_number?: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Authentication response from the API
 */
export interface AuthResponse {
  access: string;
  refresh: string;
  username: string;
  email: string;
  role: UserRole;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Registration data
 */
export interface RegistrationData {
  username: string;
  email: string;
  password: string;
  password2: string;
  role?: UserRole;
  phone_number?: string;
  address?: string;
  first_name?: string;
  last_name?: string;
}

/**
 * API Error response
 */
export interface ApiError {
  message?: string;
  detail?: string;
  errors?: Record<string, string[]>;
  status?: number;
}
