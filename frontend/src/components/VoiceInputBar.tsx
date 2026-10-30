'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, X, AlertTriangle, Check, Loader2, Sparkles, RotateCcw, Square } from 'lucide-react';
import { Language } from '../types';
import { getDictionary } from '../lib/i18n';
import { sendAudioForSTT } from '../lib/api';

interface VoiceInputBarProps {
  language: Language;
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

export const VoiceInputBar: React.FC<VoiceInputBarProps> = ({
  language,
  onSendMessage,
  isLoading
}) => {
  const dict = getDictionary(language);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const [previewTranscript, setPreviewTranscript] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const actualMimeTypeRef = useRef<string>('audio/webm');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);
  const accumulatedTranscriptRef = useRef<string>('');

  const MAX_RECORDING_SECONDS = 30;

  const speechLangMap: Record<Language, string> = {
    kn: 'kn-IN',
    hi: 'hi-IN',
    mr: 'mr-IN',
    te: 'te-IN',
    en: 'en-US'
  };

  const stopStreamTracks = () => {
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach((t) => t.stop());
      } catch (e) {}
      streamRef.current = null;
    }
  };

  // Clear timer and recognition on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
      }
      stopStreamTracks();
    };
  }, []);

  // Primary: MediaRecorder Voice Engine with Parallel Real-Time Speech Preview
  const startRecording = async () => {
    setPreviewTranscript(null);
    setInputText('');
    accumulatedTranscriptRef.current = '';
    audioChunksRef.current = [];

    if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const notSupportedMap: Record<Language, string> = {
        kn: 'ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಪಠ್ಯದಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ.',
        hi: 'आपके ब्राउज़र में वॉइस इनपुट समर्थित नहीं है। कृपया लिखकर भेजें।',
        mr: 'आपल्या ब्राउझरमध्ये व्हॉइस इनपुट समर्थित नाही. कृपया मजकूर टाइप करा.',
        te: 'మీ బ్రౌజర్‌లో వాయిస్ ఇన్‌పుట్ అందుబాటులో లేదు. దయచేసి టైప్ చేయండి.',
        en: 'Speech recognition is not supported in this browser. Please type your message.'
      };
      alert(notSupportedMap[language] || notSupportedMap.en);
      setIsRecording(false);
      return;
    }

    try {
      // 1. Audio stream with acoustic constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000
        }
      });
      streamRef.current = stream;

      // 2. Select container MIME
      let preferredMime = 'audio/webm;codecs=opus';
      if (typeof MediaRecorder !== 'undefined') {
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          preferredMime = 'audio/webm;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/webm')) {
          preferredMime = 'audio/webm';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          preferredMime = 'audio/mp4';
        } else {
          preferredMime = '';
        }
      }
      actualMimeTypeRef.current = preferredMime || 'audio/webm';

      const mediaRecorder = preferredMime
        ? new MediaRecorder(stream, { mimeType: preferredMime })
        : new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stopStreamTracks();
        const audioBlob = new Blob(audioChunksRef.current, {
          type: actualMimeTypeRef.current
        });
        await handleAudioCaptured(audioBlob);
      };

      // 3. Start capturing chunks every 250ms
      mediaRecorder.start(250);
      setIsRecording(true);
      setRecordingSeconds(0);

      // 4. Timer up to 30 seconds
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= MAX_RECORDING_SECONDS - 1) {
            stopRecording();
            return MAX_RECORDING_SECONDS;
          }
          return prev + 1;
        });
      }, 1000);

      // 5. Parallel Continuous Web Speech preview (continuous = true so natural pauses do not abort)
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        try {
          if (recognitionRef.current) {
            try { recognitionRef.current.abort(); } catch (e) {}
          }
          const recognition = new SpeechRecognition();
          recognitionRef.current = recognition;
          recognition.lang = speechLangMap[language] || 'kn-IN';
          recognition.interimResults = true;
          recognition.continuous = true;
          recognition.maxAlternatives = 1;

          recognition.onresult = (event: any) => {
            let combined = '';
            for (let i = 0; i < event.results.length; i++) {
              combined += event.results[i][0].transcript + ' ';
            }
            const spoken = combined.trim();
            if (spoken) {
              accumulatedTranscriptRef.current = spoken;
              setPreviewTranscript(spoken);
              setInputText(spoken);
            }
          };

          recognition.onerror = (e: any) => {
            console.warn('VoiceInputBar live preview error:', e.error);
          };

          // Continuous onend: DO NOT auto-submit, wait for farmer or 30s limit
          recognition.onend = () => {};

          recognition.start();
        } catch (recErr) {
          console.warn('SpeechRecognition fallback warning:', recErr);
        }
      }
    } catch (err) {
      console.warn('Microphone capture error:', err);
      stopStreamTracks();
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try { mediaRecorderRef.current.stop(); } catch (e) {}
    }
    setIsRecording(false);
  };

  const cancelRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch (e) {}
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try { mediaRecorderRef.current.stop(); } catch (e) {}
    }
    stopStreamTracks();
    audioChunksRef.current = [];
    accumulatedTranscriptRef.current = '';
    setIsRecording(false);
    setPreviewTranscript(null);
  };

  const handleAudioCaptured = async (audioBlob: Blob) => {
    setIsProcessingAudio(true);
    try {
      const result = await sendAudioForSTT(audioBlob, language);
      const recognized =
        (result && result.transcript && result.transcript.trim()) ||
        accumulatedTranscriptRef.current.trim();

      if (recognized && recognized.length > 0) {
        setPreviewTranscript(recognized);
        setInputText(recognized);
      }
    } catch (err) {
      console.error('Error sending audio to backend STT:', err);
      const fallbackText = accumulatedTranscriptRef.current.trim();
      if (fallbackText) {
        setPreviewTranscript(fallbackText);
        setInputText(fallbackText);
      }
    } finally {
      setIsProcessingAudio(false);
    }
  };

  const handleSend = () => {
    const textToSend = (previewTranscript || inputText).trim();
    if (!textToSend || isLoading) return;

    onSendMessage(textToSend);
    setInputText('');
    setPreviewTranscript(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-emerald-200/90 p-3 sm:p-4 transition">
      {/* State 6: Transcript Review Card if speech was recognized */}
      {previewTranscript && !isRecording && (
        <div className="mb-3 p-3.5 bg-emerald-50/90 rounded-xl border border-emerald-300 text-xs sm:text-sm flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              {dict.voiceStateReview || dict.transcriptPreview}
            </span>
            <span className="text-[11px] text-emerald-700/70">
              {dict.editTranscript}
            </span>
          </div>
          
          <input
            type="text"
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setPreviewTranscript(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-emerald-300 rounded-lg text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              onClick={handleSend}
              disabled={!inputText.trim() || isLoading}
              className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs flex items-center justify-center space-x-1.5 transition cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{dict.submitQuestion || dict.send}</span>
            </button>
            <button
              onClick={startRecording}
              className="py-2 px-3 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-semibold rounded-lg flex items-center space-x-1 transition cursor-pointer"
              title={dict.retryRecording}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="text-xs">{dict.retryRecording}</span>
            </button>
            <button
              onClick={() => {
                setPreviewTranscript(null);
                setInputText('');
              }}
              className="py-2 px-2.5 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition cursor-pointer"
              title={dict.clearInput}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* State 2: Recording in progress overlay bar with 30s countdown */}
      {isRecording ? (
        <div className="flex flex-col space-y-2.5 bg-rose-50/90 border border-rose-200 rounded-xl p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
              <div>
                <span className="text-xs sm:text-sm font-bold text-rose-900">
                  {dict.voiceStateRecording || dict.recording} ({recordingSeconds}s / {MAX_RECORDING_SECONDS}s)
                </span>
                <p className="text-[11px] text-rose-700">
                  {dict.recordingTip || dict.recordingInstruction}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={cancelRecording}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 transition cursor-pointer"
              >
                {dict.clearInput || dict.cancelRecording}
              </button>
              <button
                onClick={stopRecording}
                className="px-4 py-1.5 text-xs font-bold rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-sm flex items-center space-x-1.5 transition cursor-pointer"
              >
                <Square className="w-3.5 h-3.5 fill-white" />
                <span>{dict.stopRecording || dict.stopAndSend}</span>
              </button>
            </div>
          </div>

          {/* 30-Second Countdown Progress Bar */}
          <div className="w-full bg-rose-200/60 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-rose-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (recordingSeconds / MAX_RECORDING_SECONDS) * 100)}%` }}
            />
          </div>

          {previewTranscript && (
            <div className="p-2 bg-white/80 rounded-lg text-xs text-gray-800 italic border border-rose-200">
              "{previewTranscript}"
            </div>
          )}
        </div>
      ) : isProcessingAudio ? (
        <div className="flex items-center justify-center space-x-2 py-3 text-emerald-800 bg-emerald-50 rounded-xl border border-emerald-200">
          <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
          <span className="text-xs sm:text-sm font-bold">
            {dict.voiceStateTranscribing || dict.voiceStateProcessing}
          </span>
        </div>
      ) : (
        /* Normal Voice & Text Input Form */
        <div className="flex items-center space-x-2">
          {/* Prominent Microphone Button */}
          <button
            onClick={startRecording}
            disabled={isLoading}
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 text-white flex items-center justify-center shadow-md transition transform active:scale-95 shrink-0 focus:ring-2 focus:ring-emerald-400 group cursor-pointer"
            title={dict.voiceInstruction}
          >
            <Mic className="w-6 h-6 group-hover:scale-110 transition duration-200 text-white" />
          </button>

          {/* Text input for manual typing or editing */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder={dict.typePlaceholder || dict.inputPlaceholder}
            suppressHydrationWarning
            className="flex-1 px-4 py-3 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent bg-gray-50/70 focus:bg-white text-gray-900 transition"
          />

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isLoading}
            className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm transition shrink-0 cursor-pointer ${
              inputText.trim() && !isLoading
                ? 'bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold active:scale-95'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            title={dict.submitQuestion || dict.send}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
