'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { FarmerUser, FarmerProfile } from '../types';

interface AuthContextType {
  user: FarmerUser | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'signup';
  openLogin: () => void;
  openSignup: () => void;
  closeAuthModal: () => void;
  sendOtp: (phone: string) => Promise<{ success: boolean; simulatedOtp: string }>;
  verifyOtp: (phone: string, otp: string) => Promise<{ success: boolean; isExistingUser: boolean }>;
  completeOnboarding: (data: {
    name: string;
    phone: string;
    district?: string;
    land_area_acres?: number;
    crops?: string[];
    ownership_type?: 'owner' | 'tenant' | 'sharecropper';
    has_irrigation?: boolean;
    is_income_tax_payer?: boolean;
  }) => void;
  logout: () => void;
  updateUserProfile: (data: Partial<FarmerUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = 'krishi_mitra_farmer_session';
const FARMERS_DB_KEY = 'krishi_mitra_farmers_db';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FarmerUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [generatedOtp, setGeneratedOtp] = useState<string>('123456');

  // Load session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as FarmerUser;
        if (parsed && parsed.isLoggedIn) {
          setUser(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to restore farmer auth session:', e);
    }
  }, []);

  const openLogin = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  const openSignup = () => {
    setAuthModalMode('signup');
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const sendOtp = async (phone: string): Promise<{ success: boolean; simulatedOtp: string }> => {
    // Clean phone number (strip whitespace & non-digits)
    const cleaned = phone.replace(/\D/g, '');
    const otp = '123456'; // Default deterministic simulated OTP for zero-friction testing
    setGeneratedOtp(otp);

    // Simulated network delay (400ms)
    await new Promise((resolve) => setTimeout(resolve, 400));
    return { success: true, simulatedOtp: otp };
  };

  const verifyOtp = async (phone: string, otp: string): Promise<{ success: boolean; isExistingUser: boolean }> => {
    await new Promise((resolve) => setTimeout(resolve, 350));
    const cleanedPhone = phone.replace(/\D/g, '').slice(-10);

    // Accept deterministic simulated OTP or generated OTP
    if (otp !== '123456' && otp !== generatedOtp) {
      return { success: false, isExistingUser: false };
    }

    // Check if farmer was already registered
    try {
      const dbStr = localStorage.getItem(FARMERS_DB_KEY);
      const db: Record<string, FarmerUser> = dbStr ? JSON.parse(dbStr) : {};
      const existing = db[cleanedPhone];

      if (existing) {
        const activeUser: FarmerUser = {
          ...existing,
          isLoggedIn: true,
          loginTimestamp: Date.now()
        };
        setUser(activeUser);
        localStorage.setItem(SESSION_KEY, JSON.stringify(activeUser));
        return { success: true, isExistingUser: true };
      }
    } catch (e) {
      console.error('Error querying farmers db:', e);
    }

    return { success: true, isExistingUser: false };
  };

  const completeOnboarding = (data: {
    name: string;
    phone: string;
    district?: string;
    land_area_acres?: number;
    crops?: string[];
    ownership_type?: 'owner' | 'tenant' | 'sharecropper';
    has_irrigation?: boolean;
    is_income_tax_payer?: boolean;
  }) => {
    const cleanedPhone = data.phone.replace(/\D/g, '').slice(-10);
    const newUser: FarmerUser = {
      phone: cleanedPhone,
      name: data.name.trim() || 'Farmer Friend',
      district: data.district?.trim() || 'Belagavi',
      land_area_acres: data.land_area_acres !== undefined ? Number(data.land_area_acres) : 2.5,
      crops: data.crops && data.crops.length > 0 ? data.crops : ['Paddy', 'Wheat'],
      ownership_type: data.ownership_type || 'owner',
      has_irrigation: data.has_irrigation !== undefined ? data.has_irrigation : true,
      is_income_tax_payer: data.is_income_tax_payer || false,
      isLoggedIn: true,
      loginTimestamp: Date.now()
    };

    setUser(newUser);

    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));

      // Save to farmers db
      const dbStr = localStorage.getItem(FARMERS_DB_KEY);
      const db: Record<string, FarmerUser> = dbStr ? JSON.parse(dbStr) : {};
      db[cleanedPhone] = newUser;
      localStorage.setItem(FARMERS_DB_KEY, JSON.stringify(db));
    } catch (e) {
      console.warn('Failed to persist farmer profile:', e);
    }

    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch (e) {}
  };

  const updateUserProfile = (data: Partial<FarmerUser>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
      const dbStr = localStorage.getItem(FARMERS_DB_KEY);
      const db: Record<string, FarmerUser> = dbStr ? JSON.parse(dbStr) : {};
      db[user.phone] = updated;
      localStorage.setItem(FARMERS_DB_KEY, JSON.stringify(db));
    } catch (e) {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && user.isLoggedIn,
        isAuthModalOpen,
        authModalMode,
        openLogin,
        openSignup,
        closeAuthModal,
        sendOtp,
        verifyOtp,
        completeOnboarding,
        logout,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
