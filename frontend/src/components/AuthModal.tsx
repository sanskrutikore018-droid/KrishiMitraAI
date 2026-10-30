'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ShieldCheck,
  Phone,
  KeyRound,
  User,
  MapPin,
  Trees,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';
import { FarmerProfile } from '../types';

interface AuthModalProps {
  onProfileSynced?: (profile: FarmerProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onProfileSynced }) => {
  const { isAuthModalOpen, closeAuthModal, authModalMode, sendOtp, verifyOtp, completeOnboarding } = useAuth();
  const { dict, language } = useTranslation();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [phone, setPhone] = useState('');
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Onboarding profile fields
  const [farmerName, setFarmerName] = useState('');
  const [district, setDistrict] = useState('Belagavi');
  const [landArea, setLandArea] = useState('2.5');
  const [selectedCrops, setSelectedCrops] = useState<string[]>(['Paddy', 'Wheat']);
  const [ownershipType, setOwnershipType] = useState<'owner' | 'tenant'>('owner');

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Reset modal state on opening
  useEffect(() => {
    if (isAuthModalOpen) {
      setStep(1);
      setPhone('');
      setOtpValues(['', '', '', '', '', '']);
      setErrorMessage(null);
      setTimerSeconds(30);
    }
  }, [isAuthModalOpen]);

  // Countdown timer for OTP
  useEffect(() => {
    if (step === 2 && timerSeconds > 0) {
      countdownIntervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [step, timerSeconds]);

  if (!isAuthModalOpen) return null;

  // Step 1: Send OTP
  const handleSendOtp = async () => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length < 10) {
      setErrorMessage(dict.invalidPhone);
      return;
    }

    setErrorMessage(null);
    setIsSendingOtp(true);

    try {
      await sendOtp(cleaned);
      setStep(2);
      setTimerSeconds(30);
      setOtpValues(['', '', '', '', '', '']);
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 150);
    } catch (err) {
      setErrorMessage('Failed to send OTP. Please retry.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Step 2: Handle individual digit input and auto-focus forwarding
  const handleOtpChange = (index: number, val: string) => {
    const char = val.slice(-1);
    if (!/^\d*$/.test(char)) return;

    const newArr = [...otpValues];
    newArr[index] = char;
    setOtpValues(newArr);
    setErrorMessage(null);

    // Shift focus forward
    if (char && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const newArr = [...otpValues];
    for (let i = 0; i < pastedData.length; i++) {
      newArr[i] = pastedData[i];
    }
    setOtpValues(newArr);
    if (pastedData.length === 6) {
      otpInputsRef.current[5]?.focus();
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    const fullOtp = otpValues.join('');
    if (fullOtp.length !== 6) {
      setErrorMessage(dict.invalidOtp);
      return;
    }

    setErrorMessage(null);
    setIsVerifyingOtp(true);

    try {
      const res = await verifyOtp(phone, fullOtp);
      if (res.success) {
        if (res.isExistingUser) {
          // User already has profile setup -> finish and sync
          if (onProfileSynced) {
            onProfileSynced({
              district,
              land_area_acres: parseFloat(landArea) || 2.5,
              crops: selectedCrops,
              ownership_type: ownershipType,
              has_irrigation: true
            });
          }
          closeAuthModal();
        } else {
          // New farmer -> move to onboarding profile setup
          setStep(3);
        }
      } else {
        setErrorMessage(dict.invalidOtp);
      }
    } catch (e) {
      setErrorMessage(dict.invalidOtp);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Step 3: Complete Onboarding Profile Setup
  const handleCompleteOnboarding = () => {
    const parsedAcres = parseFloat(landArea) || 2.5;
    const finalProfile: FarmerProfile = {
      district: district.trim() || 'Belagavi',
      land_area_acres: parsedAcres,
      crops: selectedCrops.length > 0 ? selectedCrops : ['Paddy'],
      ownership_type: ownershipType,
      has_irrigation: true
    };

    completeOnboarding({
      phone,
      name: farmerName.trim() || 'Ramesh Patil',
      district: finalProfile.district || 'Belagavi',
      land_area_acres: parsedAcres,
      crops: finalProfile.crops,
      ownership_type: ownershipType,
      has_irrigation: true,
      is_income_tax_payer: false
    });

    if (onProfileSynced) {
      onProfileSynced(finalProfile);
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
      <div className="relative w-full max-w-lg rounded-3xl overflow-hidden bg-[#041409]/95 backdrop-blur-3xl border border-emerald-500/35 shadow-[0_0_80px_rgba(16,185,129,0.25)] text-white">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/15 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-lime-500/10 rounded-full blur-[90px] pointer-events-none" />

        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-emerald-800/40 flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center text-white shadow-md border border-emerald-400/40">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {dict.authModalTitle}
              </h3>
              <p className="text-[11px] text-emerald-300/80 font-medium">
                {dict.authModalSubtitle}
              </p>
            </div>
          </div>

          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-full hover:bg-emerald-800/60 text-emerald-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Steps */}
        <div className="p-6 sm:p-7 relative z-10">
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs flex items-center space-x-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {/* ================= STEP 1: MOBILE NUMBER ================= */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                className="space-y-5"
              >
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white">
                    {dict.mobileInputTitle}
                  </h4>
                  <p className="text-xs text-emerald-200/80 mt-1">
                    {dict.mobileInputDesc}
                  </p>
                </div>

                {/* Country Code & Phone Input Group */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="px-3.5 py-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-sm font-bold flex items-center space-x-1.5 shrink-0 shadow-inner">
                      <span className="text-base">🇮🇳</span>
                      <span>+91</span>
                    </div>

                    <div className="relative flex-1">
                      <input
                        type="tel"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value.replace(/\D/g, ''));
                          setErrorMessage(null);
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
                        placeholder={dict.mobilePlaceholder}
                        autoFocus
                        className="w-full px-4 py-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-white placeholder-emerald-400/40 text-base font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-400/60 shadow-inner"
                      />
                      <Phone className="w-4 h-4 text-emerald-400/60 absolute right-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  {/* One-click Demo Preset Pill */}
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-emerald-400/80 font-mono">
                      {dict.simulatedOtpNotice}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPhone('9876543210')}
                      className="text-lime-300 font-bold hover:underline cursor-pointer"
                    >
                      Fill Demo: 9876543210
                    </button>
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  onClick={handleSendOtp}
                  disabled={isSendingOtp}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-green-600 to-lime-600 hover:from-emerald-500 hover:to-lime-500 text-white font-extrabold text-sm shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer border border-emerald-400/40"
                >
                  {isSendingOtp ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ... / Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>{dict.sendOtpBtn}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.div>
            )}

            {/* ================= STEP 2: OTP VERIFICATION ================= */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                className="space-y-5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white">
                      {dict.otpVerificationTitle}
                    </h4>
                    <p className="text-xs text-emerald-200/80 mt-0.5">
                      {dict.otpSentTo} <span className="font-mono font-bold text-white">+91 {phone}</span>
                    </p>
                  </div>

                  <button
                    onClick={() => setStep(1)}
                    className="text-xs text-lime-300 hover:underline flex items-center space-x-1"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    <span>{dict.changeNumber}</span>
                  </button>
                </div>

                {/* 6-Digit Boxes */}
                <div className="flex items-center justify-between gap-2 sm:gap-3 py-2">
                  {otpValues.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        otpInputsRef.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      onPaste={idx === 0 ? handleOtpPaste : undefined}
                      className="w-11 h-13 sm:w-13 sm:h-14 text-center rounded-2xl bg-emerald-950/80 border-2 border-emerald-500/40 text-xl font-mono font-black text-white focus:outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-400/30 transition shadow-inner"
                    />
                  ))}
                </div>

                {/* Fast Fill Demo Code Pill */}
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-between text-xs">
                  <span className="text-amber-300 font-medium">
                    {dict.simulatedOtpNotice}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpValues(['1', '2', '3', '4', '5', '6']);
                      setErrorMessage(null);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-200 font-bold hover:bg-amber-500/30 transition text-[11px]"
                  >
                    Fill 123456
                  </button>
                </div>

                {/* Resend & Timer */}
                <div className="flex items-center justify-between text-xs text-emerald-300/80">
                  <span>
                    {timerSeconds > 0 ? (
                      `ಮರುಕಳುಹಿಸಲು ಕಾಯಿರಿ / Wait: ${timerSeconds}s`
                    ) : (
                      <button
                        onClick={handleSendOtp}
                        className="text-lime-300 font-bold hover:underline"
                      >
                        {dict.resendOtp}
                      </button>
                    )}
                  </span>
                </div>

                {/* Submit Action */}
                <button
                  onClick={handleVerifyOtp}
                  disabled={isVerifyingOtp}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-green-600 to-lime-600 hover:from-emerald-500 hover:to-lime-500 text-white font-extrabold text-sm shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer border border-emerald-400/40"
                >
                  {isVerifyingOtp ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ... / Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>{dict.verifyOtpBtn}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.div>
            )}

            {/* ================= STEP 3: FARMER ONBOARDING ================= */}
            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                className="space-y-4 max-h-[65vh] overflow-y-auto pr-1"
              >
                <div>
                  <div className="flex items-center space-x-1.5 text-xs text-lime-400 font-bold uppercase tracking-wider mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-lime-400" />
                    <span>ಹೊಸ ರೈತರ ನೋಂದಣಿ / Instant Setup</span>
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-white">
                    {dict.farmerOnboardingTitle}
                  </h4>
                  <p className="text-xs text-emerald-200/80 mt-0.5">
                    {dict.farmerOnboardingDesc}
                  </p>
                </div>

                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-emerald-200 flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5 text-lime-400" />
                    <span>{dict.farmerNameLabel}</span>
                  </label>
                  <input
                    type="text"
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    placeholder={dict.farmerNamePlaceholder}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-white placeholder-emerald-400/40 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400/40"
                  />
                </div>

                {/* District & Land Area in Grid */}
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

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    onClick={handleCompleteOnboarding}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-green-600 to-lime-600 hover:from-emerald-500 hover:to-lime-500 text-white font-extrabold text-xs sm:text-sm shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer border border-emerald-400/40"
                  >
                    <span>{dict.completeSetupBtn}</span>
                    <ArrowRight className="w-4 h-4" />
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
