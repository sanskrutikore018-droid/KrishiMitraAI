'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ShieldCheck,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  KeyRound,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';

export const LoginModal: React.FC = () => {
  const { isLoginOpen, closeAllModals, switchToSignup, login } = useAuth();
  const { dict } = useTranslation();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorAlert, setErrorAlert] = useState<string | null>(null);
  const [isNotRegistered, setIsNotRegistered] = useState(false);
  const [lockoutSec, setLockoutSec] = useState<number | null>(null);

  // Clear states when modal opens
  useEffect(() => {
    if (isLoginOpen) {
      setErrorAlert(null);
      setIsNotRegistered(false);
      setIsLoading(false);
    }
  }, [isLoginOpen]);

  // Lockout countdown
  useEffect(() => {
    if (lockoutSec !== null && lockoutSec > 0) {
      const timer = setInterval(() => {
        setLockoutSec((prev) => (prev && prev > 1 ? prev - 1 : null));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [lockoutSec]);

  if (!isLoginOpen) return null;

  const handleLoginSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setErrorAlert('Please fill in both mobile number/email and password.');
      return;
    }

    if (lockoutSec && lockoutSec > 0) {
      setErrorAlert(`${dict.bruteForceLocked} ${lockoutSec}s`);
      return;
    }

    setIsLoading(true);
    setErrorAlert(null);
    setIsNotRegistered(false);

    try {
      const result = await login(identifier, password, rememberMe);
      if (!result.success) {
        if (result.notRegistered) {
          setIsNotRegistered(true);
          setErrorAlert(dict.accountNotFoundAlert);
        } else if (result.lockedRemainingSec) {
          setLockoutSec(result.lockedRemainingSec);
          setErrorAlert(`${dict.bruteForceLocked} ${result.lockedRemainingSec}s`);
        } else {
          setErrorAlert(result.error || dict.invalidCredentialsAlert);
        }
      }
    } catch (err) {
      setErrorAlert('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setIdentifier('9876543210');
    setPassword('Krishi@2026');
    setErrorAlert(null);
    setIsNotRegistered(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl overflow-hidden bg-[#041209]/95 backdrop-blur-2xl border border-emerald-500/40 shadow-[0_0_60px_rgba(16,185,129,0.3)] text-white">
        {/* Ambient Top Glow Orbs */}
        <div className="absolute top-0 right-0 w-60 h-60 bg-emerald-500/15 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-lime-500/10 rounded-full blur-[90px] pointer-events-none" />

        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-emerald-800/40 flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center text-white shadow-md border border-emerald-400/40">
              <ShieldCheck className="w-5 h-5 text-lime-300 stroke-[2.4]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {dict.loginTitle}
              </h3>
              <p className="text-[11px] text-emerald-300/80 font-medium">
                {dict.loginSubtitle}
              </p>
            </div>
          </div>

          <button
            onClick={closeAllModals}
            className="p-1.5 rounded-full hover:bg-emerald-800/60 text-emerald-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleLoginSubmit} className="p-6 sm:p-7 space-y-4 relative z-10">
          {/* Prominent High-Security Error / Account Not Found Alert */}
          {errorAlert && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3.5 rounded-2xl border text-xs flex flex-col space-y-2 ${
                isNotRegistered
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                  : 'bg-rose-500/15 border-rose-500/40 text-rose-200'
              }`}
            >
              <div className="flex items-start space-x-2">
                <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${isNotRegistered ? 'text-amber-400' : 'text-rose-400'}`} />
                <span className="font-semibold leading-relaxed">{errorAlert}</span>
              </div>

              {/* Automatic Redirect Call to Action when user is not found */}
              {isNotRegistered && (
                <button
                  type="button"
                  onClick={() => switchToSignup(identifier)}
                  className="mt-1 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-lime-500 text-emerald-950 font-extrabold text-xs shadow-md transition-all hover:scale-[1.02] flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{dict.signupTitle} →</span>
                </button>
              )}
            </motion.div>
          )}

          {/* Identifier Input (Phone or Email) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-emerald-200 flex items-center space-x-1.5">
              <Phone className="w-3.5 h-3.5 text-lime-400" />
              <span>{dict.identifierLabel}</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  setErrorAlert(null);
                  setIsNotRegistered(false);
                }}
                placeholder={dict.identifierPlaceholder}
                autoFocus
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-white placeholder-emerald-400/40 text-sm font-medium focus:outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-400/40 shadow-inner transition"
              />
            </div>
          </div>

          {/* Secure Password Input with Show/Hide Toggle */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-emerald-200 flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-lime-400" />
              <span>{dict.passwordLabel}</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorAlert(null);
                }}
                placeholder={dict.passwordPlaceholder}
                disabled={isLoading}
                className="w-full px-4 py-3 pr-11 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-white placeholder-emerald-400/40 text-sm font-medium focus:outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-400/40 shadow-inner transition font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-400/70 hover:text-emerald-200 transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me & Fast Demo Autofill */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center space-x-2 text-emerald-200/90 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-lime-500 focus:ring-lime-400 focus:ring-offset-0 border-emerald-600 bg-emerald-950"
              />
              <span>{dict.rememberMe}</span>
            </label>

            <button
              type="button"
              onClick={handleFillDemo}
              className="text-lime-300 font-bold hover:underline cursor-pointer text-[11px]"
            >
              {dict.fillDemoBtn}
            </button>
          </div>

          {/* Demo Credentials Notice Banner */}
          <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-600/30 text-[11px] text-emerald-300/80 flex items-center justify-between">
            <span className="font-mono">{dict.demoCredentialsPill}</span>
            <span className="text-lime-400 font-bold text-[10px] uppercase">Verified</span>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isLoading || (lockoutSec !== null && lockoutSec > 0)}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-green-600 to-lime-600 hover:from-emerald-500 hover:to-lime-500 text-white font-extrabold text-sm shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer border border-emerald-400/40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ... / Verifying...</span>
              </>
            ) : (
              <>
                <span>{dict.loginTitle} →</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Bottom Security Assurance & Switch to Signup */}
          <div className="pt-2 text-center space-y-3">
            <button
              type="button"
              onClick={() => switchToSignup()}
              className="text-xs text-lime-300 font-bold hover:underline cursor-pointer block mx-auto"
            >
              {dict.dontHaveAccount}
            </button>

            <div className="flex items-center justify-center space-x-1.5 text-[10px] text-emerald-400/70 font-mono pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-lime-400/80" />
              <span>{dict.securityBadgeText}</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
