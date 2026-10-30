'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, X, AlertTriangle, Check, Loader2, Sparkles } from 'lucide-react';
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
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);
  const accumulatedTranscriptRef = useRef<string>('');

  const speechLangMap: Record<Language, string> = {
    kn: 'kn-IN',
    hi: 'hi-IN',
    mr: 'mr-IN',
    te: 'te-IN',
    en: 'en-US'
  };

  // Clear timer and recognition on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
      }
    };
  }, []);

  // Primary: Client-Side Browser Speech Recognition
  const startRecording = () => {
    setPreviewTranscript(null);
    accumulatedTranscriptRef.current = '';

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
        recognition.continuous = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsRecording(true);
          setRecordingSeconds(0);
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = setInterval(() => {
            setRecordingSeconds((prev) => prev + 1);
          }, 1000);
        };

        recognition.onresult = (event: any) => {
          let interim = '';
          let final = '';
          for (let i = 0; i < event.results.length; i++) {
            const item = event.results[i];
            if (item.isFinal) {
              final += item[0].transcript;
            } else {
              interim += item[0].transcript;
            }
          }
          const spoken = (final || interim).trim();
          accumulatedTranscriptRef.current = spoken;
          setPreviewTranscript(spoken);
          setInputText(spoken);
        };

        recognition.onerror = (e: any) => {
          console.warn('SpeechRecognition error:', e.error);
          if (timerRef.current) clearInterval(timerRef.current);
          if (e.error === 'no-speech') {
            setIsRecording(false);
          } else {
            fallbackMediaRecorder();
          }
        };

        recognition.onend = () => {
          setIsRecording(false);
          if (timerRef.current) clearInterval(timerRef.current);
          const finalSpoken = accumulatedTranscriptRef.current.trim();
          if (finalSpoken) {
            setInputText(finalSpoken);
            setPreviewTranscript(finalSpoken);
          }
        };

        recognition.start();
        return;
      } catch (err) {
        console.warn('Direct SpeechRecognition failed, falling back to MediaRecorder:', err);
        fallbackMediaRecorder();
      }
    } else {
      fallbackMediaRecorder();
    }
  };

  // Secondary Fallback: MediaRecorder
  const fallbackMediaRecorder = async () => {
    audioChunksRef.current = [];
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert(
          language === 'kn'
            ? 'ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಪಠ್ಯದಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ.'
            : 'Speech recognition is not supported in this browser. Please type your message.'
        );
        setIsRecording(false);
        return;
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
        await handleAudioCaptured(audioBlob);
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('MediaRecorder error or mic permission denied:', err);
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
    audioChunksRef.current = [];
    accumulatedTranscriptRef.current = '';
    setIsRecording(false);
    setPreviewTranscript(null);
  };

  const handleAudioCaptured = async (audioBlob: Blob) => {
    setIsProcessingAudio(true);
    try {
      const result = await sendAudioForSTT(audioBlob, language);
      if (result && result.transcript && result.transcript.trim().length > 0) {
        setPreviewTranscript(result.transcript.trim());
        setInputText(result.transcript.trim());
      }
    } catch (err) {
      console.error('Error sending audio to backend:', err);
    } finally {
      setIsProcessingAudio(false);
    }
  };

  const handleSend = () => {
    const textToSend = previewTranscript || inputText;
    if (!textToSend.trim() || isLoading) return;

    onSendMessage(textToSend.trim());
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
      {/* Transcript Preview Banner if recorded */}
      {previewTranscript && (
        <div className="mb-3 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <span className="font-bold text-amber-900 block mb-0.5">
              {dict.transcriptPreview}
            </span>
            <span className="text-gray-900 font-medium">{previewTranscript}</span>
          </div>
          <div className="flex items-center space-x-1.5 shrink-0 self-end sm:self-auto">
            <button
              onClick={handleSend}
              className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 shadow-xs flex items-center space-x-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{dict.send}</span>
            </button>
            <button
              onClick={() => setPreviewTranscript(null)}
              className="p-1 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-amber-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Recording in progress overlay bar */}
      {isRecording ? (
        <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-xl px-4 py-3 animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="w-3.5 h-3.5 rounded-full bg-red-600 animate-ping" />
            <div>
              <span className="text-xs sm:text-sm font-bold text-red-900">
                {dict.recording} ({recordingSeconds}s)
              </span>
              <p className="text-[11px] text-red-700 hidden sm:block">
                {dict.recordingInstruction}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={cancelRecording}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 transition"
            >
              {dict.cancelRecording}
            </button>
            <button
              onClick={stopRecording}
              className="px-4 py-1.5 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-sm flex items-center space-x-1.5"
            >
              <MicOff className="w-3.5 h-3.5" />
              <span>{dict.stopAndSend}</span>
            </button>
          </div>
        </div>
      ) : isProcessingAudio ? (
        <div className="flex items-center justify-center space-x-2 py-3 text-emerald-800 bg-emerald-50 rounded-xl border border-emerald-200">
          <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
          <span className="text-xs sm:text-sm font-bold">
            ಧ್ವನಿ ಸಂಸ್ಕರಿಸಲಾಗುತ್ತಿದೆ (Sarvam AI STT)... / Converting Voice to Text...
          </span>
        </div>
      ) : (
        /* Normal Voice & Text Input Form */
        <div className="flex items-center space-x-2">
          {/* Prominent Microphone Button */}
          <button
            onClick={startRecording}
            disabled={isLoading}
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 text-white flex items-center justify-center shadow-md transition transform active:scale-95 shrink-0 focus:ring-2 focus:ring-emerald-400 group"
            title="Click to speak (Kannada / English)"
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
            placeholder={dict.inputPlaceholder}
            suppressHydrationWarning
            className="flex-1 px-4 py-3 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent bg-gray-50/70 focus:bg-white text-gray-900 transition"
          />

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isLoading}
            className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm transition shrink-0 ${
              inputText.trim() && !isLoading
                ? 'bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold active:scale-95'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            title={dict.send}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

