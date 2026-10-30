'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Sprout,
  Sparkles,
  Loader2,
  AlertCircle,
  Clock,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { SupportedLanguage, getDictionary } from '../lib/i18n';
import { ChatMessage, FarmerProfile } from '../types';
import { sendAudioForSTT, requestTTS } from '../lib/api';

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

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Sync external loading state to voice state
  useEffect(() => {
    if (isLoading) {
      setVoiceState('processing');
    } else if (voiceState === 'processing') {
      setVoiceState('idle');
    }
  }, [isLoading]);

  // Clean up
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
    };
  }, []);

  // Quick chips
  const quickQueryChips = [
    { label: 'PM-KISAN', text: language === 'kn' ? 'PM-KISAN ಯೋಜನೆ ಮಾಹಿತಿ ನೀಡಿ' : 'Tell me about PM-KISAN' },
    { label: 'PMFBY', text: language === 'kn' ? 'PMFBY ಬೆಳೆ ವಿಮೆ ವಿವರಣೆ ಕೊಡಿ' : 'Explain PMFBY crop insurance' },
    { label: language === 'kn' ? 'ಸೂಕ್ಷ್ಮ ನೀರಾವರಿ' : 'Micro-Irrigation', text: language === 'kn' ? 'ಹನಿ ನೀರಾವರಿ ಸಬ್ಸಿಡಿ ಹೇಗೆ?' : 'How to get drip irrigation subsidy?' },
    { label: language === 'kn' ? 'ಯಂತ್ರೋಪಕರಣ' : 'Machinery', text: language === 'kn' ? 'ಟ್ರ್ಯಾಕ್ಟರ್ ಮತ್ತು ಟಿಲ್ಲರ್ ನೆರವು ವಿವರ' : 'Farm machinery subsidy details' },
    { label: language === 'kn' ? 'ಅರ್ಹತೆ ಪರಿಶೀಲನೆ' : 'Check Eligibility', text: language === 'kn' ? 'ನನ್ನ ಜಮೀನಿಗೆ ಯಾವ ಯೋಜನೆ ಸಿಗುತ್ತದೆ?' : 'Which schemes do I qualify for?' }
  ];

  // Recent simulated conversation items for right sidebar matching Panel 3
  const recentTopics = [
    { title: dict.recentQ1, time: '10:24 AM' },
    { title: dict.recentQ2, time: '10:12 AM' },
    { title: dict.recentQ3, time: '09:48 AM' },
    { title: dict.recentQ4, time: '09:32 AM' }
  ];

  const startVoiceRecording = async () => {
    setLiveTranscript(null);
    audioChunksRef.current = [];

    // Try MediaRecorder
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
      // 1. Send to Sarvam STT
      const result = await sendAudioForSTT(audioBlob, language);
      if (result && result.transcript && result.transcript.trim()) {
        const text = result.transcript.trim();
        setLiveTranscript(text);
        setInputText(text);
        setVoiceState('idle');
        onSendMessage(text);
      } else {
        // Fallback to browser recognition
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

  // State styling helper for the glowing orb
  const getOrbStateClass = () => {
    switch (voiceState) {
      case 'listening':
        return 'animate-orb-listening from-emerald-400 via-green-500 to-emerald-600 scale-105';
      case 'processing':
        return 'animate-orb-processing from-sky-400 via-emerald-500 to-teal-600';
      case 'speaking':
        return 'animate-orb-speaking from-emerald-400 via-green-500 to-purple-600';
      case 'error':
        return 'from-amber-500 via-rose-600 to-red-700 shadow-rose-900/50';
      case 'idle':
      default:
        return 'animate-orb-idle from-emerald-500 via-green-600 to-emerald-700';
    }
  };

  // State status message
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
    <section id="voice-core" className="relative py-16 sm:py-24 bg-gradient-to-b from-[#07160b] via-[#092211] to-[#07160b] text-white overflow-hidden border-t border-emerald-900/40">
      {/* Background radial spotlights */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Left/Center: Luminous AI Voice Assistant Orb & Controls (8 cols) */}
          <div className="lg:col-span-8 flex flex-col items-center text-center space-y-6">
            {/* Header Titles */}
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
                {dict.voiceHeading}
              </h2>
              <p className="text-lg sm:text-xl text-emerald-300 font-semibold drop-shadow-sm">
                {dict.voiceSubheading}
              </p>
            </div>

            {/* The Central Breathing Luminous Green Orb & Audio Visualizers */}
            <div className="relative my-6 py-6 w-full flex items-center justify-center">
              {/* Left Audio Waveform Bars */}
              <div className="hidden sm:flex items-center space-x-1.5 px-4 opacity-85">
                {[40, 24, 60, 32, 52, 20, 68, 36].map((h, i) => (
                  <div
                    key={`w-left-${i}`}
                    className={`w-1 rounded-full bg-gradient-to-t from-emerald-600 to-green-300 transition-all duration-300 ${
                      voiceState === 'listening' || voiceState === 'speaking'
                        ? 'animate-pulse'
                        : 'opacity-40'
                    }`}
                    style={{
                      height:
                        voiceState === 'listening'
                          ? `${Math.max(12, (h * 1.3) % 70)}px`
                          : voiceState === 'speaking'
                          ? `${Math.max(10, (h * 1.1) % 60)}px`
                          : '16px'
                    }}
                  />
                ))}
              </div>

              {/* The Breathing Luminous Orb */}
              <div className="relative group cursor-pointer" onClick={handleOrbClick}>
                {/* Outer Ripple Wave Rings when recording */}
                {voiceState === 'listening' && (
                  <>
                    <div className="absolute -inset-6 rounded-full border border-emerald-400/40 animate-ping opacity-60" />
                    <div className="absolute -inset-12 rounded-full border border-emerald-400/20 animate-pulse" />
                  </>
                )}

                {/* Main Orb Body */}
                <div
                  className={`w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr ${getOrbStateClass()} flex flex-col items-center justify-center shadow-2xl transition-all duration-500 relative z-10 border-2 border-emerald-300/40`}
                >
                  {/* Subtle inner reflection */}
                  <div className="absolute top-3 left-6 w-16 h-8 bg-white/25 rounded-full blur-xs transform -rotate-25 pointer-events-none" />

                  {/* Centered Sprout & Microphone Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-emerald-950/40 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner group-hover:scale-110 transition duration-300">
                    {voiceState === 'listening' ? (
                      <Mic className="w-8 h-8 text-white animate-pulse" />
                    ) : (
                      <Sprout className="w-9 h-9 text-emerald-100 stroke-[2.2]" />
                    )}
                  </div>

                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-950 bg-white/90 px-3 py-0.5 rounded-full mt-2.5 shadow-sm">
                    {voiceState === 'listening' ? 'Speaking...' : 'Krishi Mitra'}
                  </span>
                </div>
              </div>

              {/* Right Audio Waveform Bars */}
              <div className="hidden sm:flex items-center space-x-1.5 px-4 opacity-85">
                {[36, 68, 20, 52, 32, 60, 24, 40].map((h, i) => (
                  <div
                    key={`w-right-${i}`}
                    className={`w-1 rounded-full bg-gradient-to-t from-emerald-600 to-green-300 transition-all duration-300 ${
                      voiceState === 'listening' || voiceState === 'speaking'
                        ? 'animate-pulse'
                        : 'opacity-40'
                    }`}
                    style={{
                      height:
                        voiceState === 'listening'
                          ? `${Math.max(12, (h * 1.3) % 70)}px`
                          : voiceState === 'speaking'
                          ? `${Math.max(10, (h * 1.1) % 60)}px`
                          : '16px'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Live State & Transcript Indicator */}
            <div className="space-y-2 max-w-md w-full">
              <button
                onClick={handleOrbClick}
                className="px-5 py-2 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-xs sm:text-sm font-bold text-emerald-300 hover:bg-emerald-900 transition shadow-md flex items-center justify-center space-x-2 mx-auto"
              >
                {voiceState === 'listening' ? (
                  <MicOff className="w-4 h-4 text-rose-400" />
                ) : (
                  <Mic className="w-4 h-4 text-emerald-400" />
                )}
                <span>{getStateText()}</span>
              </button>

              {/* Recognized Live Speech Preview */}
              {liveTranscript && (
                <div className="p-3 bg-emerald-950/90 border border-emerald-500/40 rounded-2xl text-xs sm:text-sm text-emerald-100 shadow-xl animate-in fade-in">
                  <span className="text-[11px] text-emerald-400 font-bold block mb-0.5">
                    ಗುರುತಿಸಿದ ಧ್ವನಿ / Recognized Voice:
                  </span>
                  <p className="font-semibold italic">"{liveTranscript}"</p>
                </div>
              )}
            </div>

            {/* Quick Query Pills */}
            <div className="flex items-center justify-center flex-wrap gap-2 pt-2 max-w-2xl">
              {quickQueryChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(chip.text)}
                  className="px-3 py-1.5 rounded-full bg-emerald-950/60 hover:bg-emerald-800 text-xs font-semibold text-emerald-200 border border-emerald-500/30 shadow-sm transition active:scale-95"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Bottom Input Dock */}
            <div className="w-full max-w-xl glass-panel p-2.5 rounded-2xl flex items-center space-x-2 shadow-2xl border border-emerald-500/30">
              <button
                onClick={handleOrbClick}
                className={`p-2.5 rounded-xl transition ${
                  voiceState === 'listening'
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
                title="Voice input"
              >
                {voiceState === 'listening' ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
                placeholder={dict.typePlaceholder}
                className="flex-1 bg-transparent text-sm text-white placeholder-emerald-300/40 focus:outline-none px-2"
              />

              <button
                onClick={() => setSpeakerMuted(!speakerMuted)}
                className="p-2 rounded-xl text-emerald-300 hover:bg-emerald-900/60 transition"
                title={speakerMuted ? 'Muted' : 'Sound On'}
              >
                {speakerMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                onClick={handleSendText}
                disabled={!inputText.trim() || isLoading}
                className={`p-2.5 rounded-xl transition ${
                  inputText.trim() && !isLoading
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold'
                    : 'bg-white/5 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Recent Conversation Card Deck (Panel 3 Sidebar) */}
          <div className="lg:col-span-4 glass-panel p-5 rounded-3xl border border-emerald-500/20 space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-800/40 pb-3">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white tracking-wide">
                  {dict.recentConversations}
                </h3>
              </div>
              <span className="text-[10px] text-emerald-300 bg-emerald-900/60 px-2 py-0.5 rounded-full font-mono">
                Live Feed
              </span>
            </div>

            {/* Conversation History Cards */}
            <div className="space-y-2.5">
              {recentTopics.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => onSendMessage(item.title)}
                  className="p-3 rounded-2xl bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-800/30 cursor-pointer transition flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-2.5">
                    <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0 group-hover:scale-110 transition" />
                    <div>
                      <span className="text-xs font-semibold text-emerald-100 group-hover:text-emerald-300 transition block">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-emerald-400/60 font-mono">
                        {item.time}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-emerald-500/50 group-hover:text-emerald-300 group-hover:translate-x-0.5 transition" />
                </div>
              ))}
            </div>

            {/* Real-time dialogue bubble if active messages exist */}
            {messages.length > 0 && (
              <div className="pt-3 border-t border-emerald-800/40">
                <span className="text-[11px] font-bold text-emerald-400 block mb-1">
                  ಸಕ್ರಿಯ ಪ್ರತಿಕ್ರಿಯೆ / Latest AI Response:
                </span>
                <p className="text-xs text-emerald-200/90 bg-emerald-950/70 p-3 rounded-xl border border-emerald-700/30 leading-relaxed max-h-36 overflow-y-auto">
                  {messages[messages.length - 1].content}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
