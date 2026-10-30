'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ShieldCheck,
  User,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  Trees,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';
import { FarmerProfile } from '../types';

interface SignupModalProps {
  onProfileSynced?: (profile: FarmerProfile) => void;
}

export const SignupModal: React.FC<SignupModalProps> = ({ onProfileSynced }) => {
  const { isSignupOpen, closeAllModals, switchToLogin, signup, prefilledIdentifier } = useAuth();
  const { dict, language } = useTranslation();

  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorAlert, setErrorAlert] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Step 2: Farm Profile
  const [district, setDistrict] = useState('Belagavi');
  const [landArea, setLandArea] = useState('2.5');
  const [selectedCrops, setSelectedCrops] = useState<string[]>(['Paddy', 'Wheat']);
  const [ownershipType, setOwnershipType] = useState<'owner' | 'tenant'>('owner');

  // Pre-fill if redirected from Login
  useEffect(() => {
    if (isSignupOpen) {
      setStep(1);
      setErrorAlert(null);
      setIsLoading(false);
      if (prefilledIdentifier) {
        setIdentifier(prefilledIdentifier);
      }
    }
  }, [isSignupOpen, prefilledIdentifier]);

  if (!isSignupOpen) return null;

  // Real-time password strength calculation (0 to 100)
  const calculateStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: dict.strengthWeak, color: 'bg-rose-500' };
    let score = 0;
    if (pwd.length >= 6) score += 30;
    if (pwd.length >= 8) score += 20;
    if (/\d/.test(pwd)) score += 20;
    if (/[A-Z]/.test(pwd)) score += 15;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 15;

    if (score < 50) return { score, label: dict.strengthWeak, color: 'bg-rose-500' };
    if (score < 80) return { score, label: dict.strengthMedium, color: 'bg-amber-400' };
    return { score, label: dict.strengthStrong, color: 'bg-lime-400' };
  };

  const strength = calculateStrength(password);

  const handleStep1Proceed = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim()) {
      setErrorAlert('Please enter your full name.');
      return;
    }
    const cleanId = identifier.trim();
    if (!cleanId || cleanId.length < 10) {
      setErrorAlert(dict.invalidPhone);
      return;
    }
    if (!password || password.length < 6) {
      setErrorAlert('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorAlert(dict.passwordsMismatch);
      return;
    }

    setErrorAlert(null);
    setStep(2);
  };

  const handleFinalSignup = async () => {
    setErrorAlert(null);
    setIsLoading(true);

    const isEmail = identifier.includes('@');
    const phoneVal = isEmail ? '9876543210' : identifier.replace(/\D/g, '').slice(-10);
    const emailVal = isEmail ? identifier : undefined;
    const parsedAcres = parseFloat(landArea) || 2.5;

    try {
      const res = await signup({
        name: name.trim() || 'Farmer Friend',
        phone: phoneVal,
        email: emailVal,
        password,
        district: district.trim() || 'Belagavi',
        land_area_acres: parsedAcres,
        crops: selectedCrops.length > 0 ? selectedCrops : ['Paddy'],
        ownership_type: ownershipType,
        has_irrigation: true
      });

      if (res.success) {
        if (onProfileSynced) {
          onProfileSynced({
            district: district.trim() || 'Belagavi',
            land_area_acres: parsedAcres,
            crops: selectedCrops,
            ownership_type: ownershipType,
            has_irrigation: true
          });
        }
      } else {
        setErrorAlert(res.error || 'Registration failed. Please try again.');
        setStep(1);
      }
    } catch (e) {
      setErrorAlert('An unexpected error occurred during signup.');
      setStep(1);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCrop = (crop: string) => {
    if (selectedCrops.includes(crop)) {
      if (selectedCrops.length > 1) {
        setSelectedCrops(selectedCrops.filter((c) => c !== crop));
      }
    } else {
      setSelectedCrops([...selectedCrops, crop]);
    }
  };

  const cropOptions = [
    { name: 'Paddy', label: language === 'kn' ? 'ಭತ್ತ (Paddy)' : 'Paddy / Rice' },
    { name: 'Wheat', label: language === 'kn' ? 'ಗೋಧಿ (Wheat)' : 'Wheat' },
    { name: 'Cotton', label: language === 'kn' ? 'ಹತ್ತಿ (Cotton)' : 'Cotton' },
    { name: 'Sugarcane', label: language === 'kn' ? 'ಕಬ್ಬು (Sugarcane)' : 'Sugarcane' },
    { name: 'Maize', label: language === 'kn' ? 'ಮೆಕ್ಕೆಜೋಳ (Maize)' : 'Maize' },
    { name: 'Ragi', label: language === 'kn' ? 'ರಾಗಿ (Ragi)' : 'Ragi' },
    { name: 'Groundnut', label: language === 'kn' ? 'ಕಡಲೆಕಾಯಿ (Groundnut)' : 'Groundnut' },
    { name: 'Soybean', label: language === 'kn' ? 'ಸೋಯಾಬೀನ್ (Soybean)' : 'Soybean' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl overflow-hidden bg-[#041409]/95 backdrop-blur-2xl border border-emerald-500/40 shadow-[0_0_70px_rgba(16,185,129,0.3)] text-white">
        {/* Ambient Top Glow Orbs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/15 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-lime-500/10 rounded-full blur-[90px] pointer-events-none" />

        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-emerald-800/40 flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center text-white shadow-md border border-emerald-400/40">
              <Sparkles className="w-5 h-5 text-lime-300 stroke-[2.4]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {dict.signupTitle}
              </h3>
              <p className="text-[11px] text-emerald-300/80 font-medium">
                {dict.signupSubtitle}
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

        {/* Modal Body */}
        <div className="p-6 sm:p-7 relative z-10">
          {errorAlert && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs flex items-center space-x-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span className="font-semibold leading-relaxed">{errorAlert}</span>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {/* ================= STEP 1: CREDENTIALS ================= */}
            {step === 1 && (
              <motion.form
                key="step-1"
                onSubmit={handleStep1Proceed}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between border-b border-emerald-800/40 pb-2">
                  <span className="text-xs font-bold text-lime-400 uppercase tracking-wider">
                    {dict.step1Credentials}
                  </span>
                  <span className="text-[11px] text-emerald-300/80 font-mono">1 / 2</span>
                </div>

                {/* Farmer Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-emerald-200 flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5 text-lime-400" />
                    <span>{dict.farmerNameLabel}</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setErrorAlert(null);
                    }}
                    placeholder={dict.farmerNamePlaceholder}
                    autoFocus
                    suppressHydrationWarning
                    className="w-full px-4 py-2.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-white placeholder-emerald-400/40 text-sm font-medium focus:outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-400/40 shadow-inner"
                  />
                </div>

                {/* Registered Phone / Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-emerald-200 flex items-center space-x-1.5">
                    <Phone className="w-3.5 h-3.5 text-lime-400" />
                    <span>{dict.identifierLabel}</span>
                  </label>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      setErrorAlert(null);
                    }}
                    placeholder={dict.identifierPlaceholder}
                    suppressHydrationWarning
                    className="w-full px-4 py-2.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-white placeholder-emerald-400/40 text-sm font-medium focus:outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-400/40 shadow-inner"
                  />
                </div>

                {/* Password Input with Show/Hide */}
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
                      suppressHydrationWarning
                      className="w-full px-4 py-2.5 pr-11 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-white placeholder-emerald-400/40 text-sm font-medium focus:outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-400/40 shadow-inner font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-400/70 hover:text-emerald-200 transition"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Real-Time Password Strength Meter */}
                  {password && (
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[10px] text-emerald-300/80 font-bold">
                        <span>{dict.passwordStrengthLabel}:</span>
                        <span className="capitalize">{strength.label}</span>
                      </div>
                      <div className="h-1.5 w-full bg-emerald-950 rounded-full overflow-hidden border border-emerald-700/50">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${strength.score}%` }}
                          className={`h-full ${strength.color} transition-all duration-300`}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-emerald-200 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                    <span>{dict.confirmPasswordLabel}</span>
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setErrorAlert(null);
                    }}
                    placeholder={dict.confirmPasswordPlaceholder}
                    suppressHydrationWarning
                    className="w-full px-4 py-2.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-white placeholder-emerald-400/40 text-sm font-medium focus:outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-400/40 shadow-inner font-mono"
                  />
                </div>

                {/* Proceed to Step 2 Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-green-600 to-lime-600 hover:from-emerald-500 hover:to-lime-500 text-white font-extrabold text-sm shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer border border-emerald-400/40"
                >
                  <span>{dict.nextStepBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Switch to Login Link */}
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={switchToLogin}
                    className="text-xs text-lime-300 font-bold hover:underline cursor-pointer"
                  >
                    {dict.alreadyHaveAccount}
                  </button>
                </div>
              </motion.form>
            )}

            {/* ================= STEP 2: FARM PROFILE & SCHEME MAPPING ================= */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                className="space-y-4 max-h-[65vh] overflow-y-auto pr-1"
              >
                <div className="flex items-center justify-between border-b border-emerald-800/40 pb-2">
                  <span className="text-xs font-bold text-lime-400 uppercase tracking-wider">
                    {dict.step2FarmProfile}
                  </span>
                  <span className="text-[11px] text-emerald-300/80 font-mono">2 / 2</span>
                </div>

                {/* District & Land Area in 2-Column Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* District */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-emerald-200 flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-lime-400" />
                      <span>{dict.districtLabel}</span>
                    </label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder={dict.districtPlaceholder}
                      suppressHydrationWarning
                      className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-white placeholder-emerald-400/40 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400/40"
                    />
                  </div>

                  {/* Land Area Acres */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-emerald-200 flex items-center space-x-1.5">
                      <Trees className="w-3.5 h-3.5 text-lime-400" />
                      <span>{dict.landSizeLabel}</span>
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.1"
                      value={landArea}
                      onChange={(e) => setLandArea(e.target.value)}
                      placeholder={dict.landSizePlaceholder}
                      suppressHydrationWarning
                      className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-white placeholder-emerald-400/40 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400/40"
                    />
                  </div>
                </div>

                {/* Primary Crops Toggle Pills */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-emerald-200 block">
                    {dict.cropsLabel}:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {cropOptions.map((crop) => {
                      const isSelected = selectedCrops.includes(crop.name);
                      return (
                        <button
                          key={crop.name}
                          type="button"
                          onClick={() => toggleCrop(crop.name)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border cursor-pointer ${
                            isSelected
                              ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white border-lime-400/60 shadow-xs'
                              : 'bg-emerald-950/70 text-emerald-200 border-emerald-600/30 hover:bg-emerald-900/60'
                          }`}
                        >
                          {crop.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Land Ownership */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-emerald-200 block">
                    {dict.ownershipLabel}:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setOwnershipType('owner')}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition text-center cursor-pointer ${
                        ownershipType === 'owner'
                          ? 'bg-emerald-600 text-white border-lime-400 shadow-sm'
                          : 'bg-emerald-950/60 text-emerald-300 border-emerald-700/40 hover:bg-emerald-900/40'
                      }`}
                    >
                      {dict.ownerOption}
                    </button>
                    <button
                      type="button"
                      onClick={() => setOwnershipType('tenant')}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition text-center cursor-pointer ${
                        ownershipType === 'tenant'
                          ? 'bg-emerald-600 text-white border-lime-400 shadow-sm'
                          : 'bg-emerald-950/60 text-emerald-300 border-emerald-700/40 hover:bg-emerald-900/40'
                      }`}
                    >
                      {dict.tenantOption}
                    </button>
                  </div>
                </div>

                {/* Actions: Back & Complete Signup */}
                <div className="pt-2 flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="py-3 px-4 rounded-xl bg-emerald-950 border border-emerald-600/40 text-emerald-200 font-bold text-xs hover:bg-emerald-900 transition flex items-center space-x-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{dict.backBtn}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleFinalSignup}
                    disabled={isLoading}
                    className="flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-green-600 to-lime-600 hover:from-emerald-500 hover:to-lime-500 text-white font-extrabold text-xs sm:text-sm shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer border border-emerald-400/40"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>ಖಾತೆ ರಚಿಸಲಾಗುತ್ತಿದೆ... / Registering...</span>
                      </>
                    ) : (
                      <>
                        <span>{dict.completeSignupBtn}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

