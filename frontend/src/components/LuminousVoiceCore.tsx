'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Sprout,
  Sparkles,
  Loader2,
  Clock,
  ChevronRight,
  MessageSquare,
  Activity
} from 'lucide-react';
import { SupportedLanguage, getDictionary } from '../lib/i18n';
import { ChatMessage, FarmerProfile } from '../types';
import { sendAudioForSTT } from '../lib/api';

interface LuminousVoiceCoreProps {
  language: SupportedLanguage;
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  messages: ChatMessage[];
  currentProfile: FarmerProfile;
}

export type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking' | 'error';

export const LuminousVoiceCore: React.FC<LuminousVoiceCoreProps> = ({
  language,
  onSendMessage,
  isLoading,
  messages,
  currentProfile
}) => {
  const dict = getDictionary(language);

  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [inputText, setInputText] = useState('');
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState<string | null>(null);
  const [speakerMuted, setSpeakerMuted] = useState(false);
  const [audioAmplitudes, setAudioAmplitudes] = useState<number[]>([30, 45, 20, 60, 40, 75, 50, 35]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);

  // Sync external loading state to voice state
  useEffect(() => {
    if (isLoading) {
      setVoiceState('processing');
    } else if (voiceState === 'processing') {
      setVoiceState('idle');
    }
  }, [isLoading]);

  // Dynamic Audio Visualizer simulation when active
  useEffect(() => {
    if (voiceState === 'listening' || voiceState === 'speaking') {
      animIntervalRef.current = setInterval(() => {
        setAudioAmplitudes([
          Math.floor(20 + Math.random() * 65),
          Math.floor(15 + Math.random() * 70),
          Math.floor(30 + Math.random() * 60),
          Math.floor(25 + Math.random() * 80),
          Math.floor(20 + Math.random() * 75),
          Math.floor(35 + Math.random() * 60),
          Math.floor(15 + Math.random() * 65),
          Math.floor(25 + Math.random() * 70)
        ]);
      }, 120);
    } else {
      if (animIntervalRef.current) clearInterval(animIntervalRef.current);
      setAudioAmplitudes([16, 16, 16, 16, 16, 16, 16, 16]);
    }

    return () => {
      if (animIntervalRef.current) clearInterval(animIntervalRef.current);
    };
  }, [voiceState]);

  // Clean up
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
    };
  }, []);

  const quickQueryChips = [
    { label: 'PM-KISAN', text: language === 'kn' ? 'PM-KISAN ಯೋಜನೆ ಮಾಹಿತಿ ನೀಡಿ' : 'Tell me about PM-KISAN' },
    { label: 'PMFBY', text: language === 'kn' ? 'PMFBY ಬೆಳೆ ವಿಮೆ ವಿವರಣೆ ಕೊಡಿ' : 'Explain PMFBY crop insurance' },
    { label: language === 'kn' ? 'ಸೂಕ್ಷ್ಮ ನೀರಾವರಿ' : 'Micro-Irrigation', text: language === 'kn' ? 'ಹನಿ ನೀರಾವರಿ ಸಬ್ಸಿಡಿ ಹೇಗೆ?' : 'How to get drip irrigation subsidy?' },
    { label: language === 'kn' ? 'ಯಂತ್ರೋಪಕರಣ' : 'Machinery', text: language === 'kn' ? 'ಟ್ರ್ಯಾಕ್ಟರ್ ಮತ್ತು ಟಿಲ್ಲರ್ ನೆರವು ವಿವರ' : 'Farm machinery subsidy details' },
    { label: language === 'kn' ? 'ಅರ್ಹತೆ ಪರಿಶೀಲನೆ' : 'Check Eligibility', text: language === 'kn' ? 'ನನ್ನ ಜಮೀನಿಗೆ ಯಾವ ಯೋಜನೆ ಸಿಗುತ್ತದೆ?' : 'Which schemes do I qualify for?' }
  ];

  const recentTopics = [
    { title: dict.recentQ1, time: '10:24 AM' },
    { title: dict.recentQ2, time: '10:12 AM' },
    { title: dict.recentQ3, time: '09:48 AM' },
    { title: dict.recentQ4, time: '09:32 AM' }
  ];

  const startVoiceRecording = async () => {
    setLiveTranscript(null);
    audioChunksRef.current = [];

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('MediaDevices not supported');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : ''
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processCapturedAudio(audioBlob);
      };

      mediaRecorder.start(250);
      setVoiceState('listening');
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Falling back to Web Speech recognition:', err);
      startBrowserWebSpeech();
    }
  };

  const stopVoiceRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setVoiceState('processing');
  };

  const processCapturedAudio = async (audioBlob: Blob) => {
    setVoiceState('processing');
    try {
      const result = await sendAudioForSTT(audioBlob, language);
      if (result && result.transcript && result.transcript.trim()) {
        const text = result.transcript.trim();
        setLiveTranscript(text);
        setInputText(text);
        setVoiceState('idle');
        onSendMessage(text);
      } else {
        startBrowserWebSpeech();
      }
    } catch (e) {
      console.error('Audio STT failure:', e);
      startBrowserWebSpeech();
    }
  };

  const startBrowserWebSpeech = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceState('error');
      alert(language === 'kn' ? 'ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ಲಭ್ಯವಿಲ್ಲ, ಟೈಪ್ ಮಾಡಿ.' : 'Voice recognition unavailable, please type.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = language === 'kn' ? 'kn-IN' : language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';
      recognition.interimResults = true;
      recognition.continuous = false;

      setVoiceState('listening');
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

      recognition.onresult = (e: any) => {
        const transcript = Array.from(e.results)
          .map((r: any) => r[0].transcript)
          .join('');
        setLiveTranscript(transcript);
        setInputText(transcript);
      };

      recognition.onerror = () => {
        setVoiceState('error');
        if (timerRef.current) clearInterval(timerRef.current);
      };

      recognition.onend = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setVoiceState('idle');
        if (inputText.trim()) {
          onSendMessage(inputText.trim());
        }
      };

      recognition.start();
    } catch (e) {
      setVoiceState('error');
    }
  };

  const handleSendText = () => {
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText('');
    setLiveTranscript(null);
  };

  const handleOrbClick = () => {
    if (voiceState === 'listening') {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
  };

  const getStateText = () => {
    switch (voiceState) {
      case 'listening':
        return `${dict.voiceStateListening} (${recordingSeconds}s)`;
      case 'processing':
        return dict.voiceStateProcessing;
      case 'speaking':
        return dict.voiceStateSpeaking;
      case 'error':
        return 'ದೋಷ / Error - Retry';
      case 'idle':
      default:
        return dict.voiceStateIdle;
    }
  };

  return (
    <section
      id="voice-core"
      className="relative py-24 sm:py-32 bg-gradient-to-b from-[#041209] via-[#092211] to-[#041209] text-white overflow-hidden border-t border-emerald-950/80"
    >
      {/* Background radial spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] bg-emerald-500/12 rounded-full blur-[170px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Main Left/Center: Luminous AI Voice Assistant Orb & Kinetic Waves (8 cols) */}
          <div className="lg:col-span-8 flex flex-col items-center text-center space-y-8">
            {/* Header Titles with Editorial Styling */}
            <div className="space-y-3">
              <h2 className="font-editorial text-3xl sm:text-5xl font-normal text-white tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
                {dict.voiceHeading}
              </h2>
              <p className="font-editorial italic text-xl sm:text-3xl text-lime-300 font-light drop-shadow-sm">
                {dict.voiceSubheading}
              </p>
            </div>

            {/* THE LIVING, BREATHING, HYPER-REALISTIC GLOWING GREEN CORE */}
            <div className="relative my-4 py-8 w-full flex items-center justify-center">
              {/* Left Bilateral Waveform Bars */}
              <div className="hidden sm:flex items-center space-x-2 px-6">
                {audioAmplitudes.map((amp, i) => (
                  <motion.div
                    key={`w-left-${i}`}
                    animate={{ height: `${amp}px` }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    className="w-1.5 rounded-full bg-gradient-to-t from-emerald-600 via-green-400 to-emerald-200 shadow-[0_0_12px_rgba(74,222,128,0.5)]"
                  />
                ))}
              </div>

              {/* Central Glowing Core Area with Expanding Rings */}
              <div
                className="relative group cursor-pointer select-none"
                onClick={handleOrbClick}
              >
                {/* LISTENING STATE: Concentric Kinetic Sound Rings Expanding Outward */}
                {voiceState === 'listening' && (
                  <>
                    <motion.div
                      animate={{ scale: [1, 2.2], opacity: [0.8, 0] }}
                      transition={{ repeat: Infinity, duration: 1.8, ease: 'easeOut' }}
                      className="absolute inset-0 rounded-full border-2 border-emerald-400"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                      transition={{ repeat: Infinity, duration: 1.8, delay: 0.5, ease: 'easeOut' }}
                      className="absolute inset-0 rounded-full border border-green-300"
                    />
                  </>
                )}

                {/* PROCESSING STATE: Fast Spinning Cosmic Data Ring */}
                {voiceState === 'processing' && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                    className="absolute -inset-4 rounded-full border-2 border-dashed border-emerald-300 shadow-[0_0_25px_rgba(52,211,153,0.8)]"
                  />
                )}

                {/* Frosted Glassmorphism Outer Glow Container */}
                <div className="w-52 h-52 sm:w-64 sm:h-64 rounded-full p-3 backdrop-blur-xl bg-black/40 border border-emerald-500/30 shadow-[0_0_60px_rgba(16,185,129,0.35)] flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                  {/* Living Breathing Glowing Core Sphere */}
                  <div
                    className={`w-full h-full rounded-full flex flex-col items-center justify-center relative overflow-hidden transition-all duration-500 ${
                      voiceState === 'listening'
                        ? 'animate-orb-listening bg-gradient-to-tr from-emerald-400 via-green-500 to-emerald-600'
                        : voiceState === 'processing'
                        ? 'animate-orb-processing bg-gradient-to-tr from-sky-400 via-emerald-500 to-teal-500'
                        : voiceState === 'speaking'
                        ? 'animate-orb-speaking bg-gradient-to-tr from-emerald-400 via-green-500 to-purple-500'
                        : voiceState === 'error'
                        ? 'bg-gradient-to-tr from-amber-500 to-red-600 shadow-[0_0_50px_rgba(239,68,68,0.7)]'
                        : 'animate-orb-idle bg-gradient-to-tr from-emerald-500 via-green-600 to-emerald-700'
                    }`}
                  >
                    {/* Inner Organic Glass Highlight */}
                    <div className="absolute top-4 left-8 w-20 h-10 bg-white/30 rounded-full blur-xs transform -rotate-25 pointer-events-none" />

                    {/* Icon Core */}
                    <motion.div
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      className="w-20 h-20 rounded-2xl bg-black/40 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-2xl"
                    >
                      {voiceState === 'listening' ? (
                        <Mic className="w-10 h-10 text-white animate-pulse" />
                      ) : voiceState === 'processing' ? (
                        <Loader2 className="w-10 h-10 text-emerald-200 animate-spin" />
                      ) : (
                        <Sprout className="w-11 h-11 text-emerald-100 stroke-[2.4]" />
                      )}
                    </motion.div>

                    {/* State Tag */}
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-950 bg-white/95 px-3 py-0.5 rounded-full mt-3 shadow-md">
                      {voiceState === 'listening'
                        ? 'Listening'
                        : voiceState === 'processing'
                        ? 'Evaluating'
                        : voiceState === 'speaking'
                        ? 'Speaking'
                        : 'Krishi Mitra AI'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Bilateral Waveform Bars */}
              <div className="hidden sm:flex items-center space-x-2 px-6">
                {[...audioAmplitudes].reverse().map((amp, i) => (
                  <motion.div
                    key={`w-right-${i}`}
                    animate={{ height: `${amp}px` }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    className="w-1.5 rounded-full bg-gradient-to-t from-emerald-600 via-green-400 to-emerald-200 shadow-[0_0_12px_rgba(74,222,128,0.5)]"
                  />
                ))}
              </div>
            </div>

            {/* Live State & Spoken Transcript Banner */}
            <div className="space-y-3 max-w-lg w-full">
              <motion.button
                onClick={handleOrbClick}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="px-6 py-2.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-xs sm:text-sm font-black text-emerald-200 hover:bg-emerald-900 transition shadow-xl flex items-center justify-center space-x-2 mx-auto cursor-pointer"
              >
                {voiceState === 'listening' ? (
                  <MicOff className="w-4 h-4 text-rose-400 animate-pulse" />
                ) : (
                  <Mic className="w-4 h-4 text-emerald-400" />
                )}
                <span>{getStateText()}</span>
              </motion.button>

              {/* Editable / Recognized Live Speech Preview */}
              <AnimatePresence>
                {liveTranscript && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3.5 bg-emerald-950/90 border border-emerald-400/50 rounded-2xl text-xs sm:text-sm text-emerald-100 shadow-2xl backdrop-blur-xl"
                  >
                    <span className="text-[11px] text-emerald-400 font-bold block mb-1">
                      ಗುರುತಿಸಿದ ಧ್ವನಿ / Recognized Voice:
                    </span>
                    <p className="font-semibold italic leading-relaxed">
                      "{liveTranscript}"
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Action Suggestion Chips */}
            <div className="flex items-center justify-center flex-wrap gap-2 pt-1 max-w-2xl">
              {quickQueryChips.map((chip, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => onSendMessage(chip.text)}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  className="px-3.5 py-1.5 rounded-full bg-emerald-950/70 hover:bg-emerald-800 text-xs font-bold text-emerald-200 border border-emerald-500/40 shadow-md transition cursor-pointer"
                >
                  {chip.label}
                </motion.button>
              ))}
            </div>

            {/* Frosted Glassmorphism Bottom Input Dock */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-xl p-3 rounded-2xl backdrop-blur-xl bg-black/50 border border-emerald-500/40 shadow-[0_0_50px_rgba(16,185,129,0.25)] flex items-center space-x-2"
            >
              <motion.button
                onClick={handleOrbClick}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className={`p-3 rounded-xl transition cursor-pointer ${
                  voiceState === 'listening'
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
                title="Toggle microphone"
              >
                {voiceState === 'listening' ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </motion.button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
                placeholder={dict.typePlaceholder}
                className="flex-1 bg-transparent text-sm text-white placeholder-emerald-300/45 focus:outline-none px-2 font-medium"
              />

              <motion.button
                onClick={() => setSpeakerMuted(!speakerMuted)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2.5 rounded-xl text-emerald-300 hover:bg-emerald-900/60 transition cursor-pointer"
                title={speakerMuted ? 'Muted' : 'Sound Active'}
              >
                {speakerMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </motion.button>

              <motion.button
                onClick={handleSendText}
                disabled={!inputText.trim() || isLoading}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.92 }}
                className={`p-3 rounded-xl transition cursor-pointer ${
                  inputText.trim() && !isLoading
                    ? 'bg-gradient-to-r from-emerald-500 to-green-400 text-emerald-950 font-black shadow-lg shadow-emerald-500/30'
                    : 'bg-white/5 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </div>

          {/* Right Column: Recent Conversations Feed Deck (Panel 3 Sidebar) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-4 p-5 sm:p-6 rounded-3xl backdrop-blur-xl bg-black/40 border border-emerald-500/30 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-emerald-800/50 pb-3">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white tracking-wide">
                  {dict.recentConversations}
                </h3>
              </div>
              <span className="text-[10px] text-emerald-300 bg-emerald-900/70 px-2.5 py-0.5 rounded-full font-mono border border-emerald-500/30">
                Live Feed
              </span>
            </div>

            {/* Conversation History Cards with Spring Hover */}
            <div className="space-y-2.5">
              {recentTopics.map((item, idx) => (
                <motion.div
                  key={idx}
                  onClick={() => onSendMessage(item.title)}
                  whileHover={{ x: 4, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  className="p-3.5 rounded-2xl bg-emerald-950/60 hover:bg-emerald-900/70 border border-emerald-800/40 cursor-pointer transition flex items-center justify-between group shadow-sm"
                >
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0 group-hover:scale-110 transition" />
                    <div>
                      <span className="text-xs font-bold text-emerald-100 group-hover:text-emerald-300 transition block">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-emerald-400/70 font-mono">
                        {item.time}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-emerald-500/60 group-hover:text-emerald-300 group-hover:translate-x-1 transition" />
                </motion.div>
              ))}
            </div>

            {/* Real-time Dialogue History Bubble */}
            {messages.length > 0 && (
              <div className="pt-3 border-t border-emerald-800/50">
                <span className="text-[11px] font-bold text-emerald-400 block mb-1.5 flex items-center space-x-1">
                  <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>ಸಕ್ರಿಯ ಪ್ರತಿಕ್ರಿಯೆ / Latest AI Response:</span>
                </span>
                <div className="text-xs text-emerald-100/90 bg-emerald-950/80 p-3.5 rounded-2xl border border-emerald-600/40 leading-relaxed max-h-40 overflow-y-auto shadow-inner">
                  {messages[messages.length - 1].content}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
