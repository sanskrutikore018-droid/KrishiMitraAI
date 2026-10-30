'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, RotateCcw, Bot, User, Sparkles } from 'lucide-react';
import { ChatMessage, Language } from '../types';
import { getDictionary } from '../lib/i18n';

interface ConversationFeedProps {
  messages: ChatMessage[];
  language: Language;
  quickReplies: string[];
  onSelectQuickReply: (reply: string) => void;
  isLoading: boolean;
}

export const ConversationFeed: React.FC<ConversationFeedProps> = ({
  messages,
  language,
  quickReplies,
  onSelectQuickReply,
  isLoading
}) => {
  const dict = getDictionary(language);
  const feedEndRef = useRef<HTMLDivElement>(null);

  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handlePlayAudio = (msg: ChatMessage) => {
    // If already playing this message, stop it
    if (currentPlayingId === msg.id) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.currentTime = 0;
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setCurrentPlayingId(null);
      return;
    }

    // Stop existing audio
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    // 1. Try Sarvam AI Base64 audio if present
    if (msg.audioBase64) {
      const audioUrl = `data:audio/wav;base64,${msg.audioBase64}`;
      const audio = new Audio(audioUrl);
      audioPlayerRef.current = audio;
      setCurrentPlayingId(msg.id);

      audio.onended = () => {
        setCurrentPlayingId(null);
      };
      audio.onerror = () => {
        setCurrentPlayingId(null);
        fallbackBrowserTTS(msg.content);
      };
      audio.play().catch(() => {
        fallbackBrowserTTS(msg.content);
      });
      return;
    }

    // 2. Fallback to Browser SpeechSynthesis
    fallbackBrowserTTS(msg.content, msg.id);
  };

  const fallbackBrowserTTS = (text: string, msgId?: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    // Clean markdown formatting, asterisks, URLs
    const cleanText = text
      .replace(/https?:\/\/\S+/g, '')
      .replace(/[*#_~`]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[\(\)\{\}\<\>]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const speechLangMap: Record<string, string> = {
      kn: 'kn-IN',
      hi: 'hi-IN',
      mr: 'mr-IN',
      te: 'te-IN',
      en: 'en-US'
    };
    utterance.lang = speechLangMap[language] || 'kn-IN';
    utterance.rate = 0.94;
    utterance.pitch = 1.0;

    if (msgId) setCurrentPlayingId(msgId);

    utterance.onend = () => {
      setCurrentPlayingId(null);
    };
    utterance.onerror = () => {
      setCurrentPlayingId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 flex flex-col h-[460px] overflow-hidden">
      {/* Feed Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-emerald-50 to-green-50/70 border-b border-emerald-100 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-emerald-700" />
          <h3 className="text-sm font-bold text-emerald-950">
            {dict.chatTitle}
          </h3>
        </div>
        <span className="text-[11px] text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full font-medium">
          Kannada & English Supported
        </span>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gray-50/40">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const isPlaying = currentPlayingId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-2.5 ${
                isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                  isUser
                    ? 'bg-amber-500 text-white'
                    : 'bg-emerald-700 text-white'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Box */}
              <div
                className={`max-w-[82%] sm:max-w-[75%] rounded-2xl px-4 py-3 shadow-xs ${
                  isUser
                    ? 'bg-gradient-to-br from-emerald-700 to-green-800 text-white rounded-tr-none'
                    : 'bg-white border border-emerald-100 text-gray-900 rounded-tl-none shadow-sm'
                }`}
              >
                <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed font-normal">
                  {msg.content}
                </p>

                {/* Footer with Audio Speaker Button */}
                <div
                  className={`flex items-center justify-between mt-2 pt-1 border-t text-[10px] ${
                    isUser
                      ? 'border-emerald-600/60 text-emerald-200'
                      : 'border-gray-100 text-gray-400'
                  }`}
                >
                  <span>{msg.timestamp}</span>

                  {!isUser && (
                    <button
                      onClick={() => handlePlayAudio(msg)}
                      className={`flex items-center space-x-1 px-2 py-0.5 rounded-full font-semibold transition ${
                        isPlaying
                          ? 'bg-emerald-600 text-white animate-pulse'
                          : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      }`}
                      title={isPlaying ? dict.pauseVoice : dict.playVoice}
                    >
                      {isPlaying ? (
                        <>
                          <VolumeX className="w-3 h-3 text-white" />
                          <span>{dict.pauseVoice}</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3 h-3 text-emerald-700" />
                          <span>{dict.playVoice}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex items-center space-x-2 text-emerald-700 text-xs py-2 px-3 bg-emerald-50/80 rounded-xl w-fit">
            <Sparkles className="w-4 h-4 animate-spin text-emerald-600" />
            <span className="font-medium">ಕೃಷಿ ಮಿತ್ರ ಯೋಚಿಸುತ್ತಿದೆ... / Processing...</span>
          </div>
        )}

        <div ref={feedEndRef} />
      </div>

      {/* Suggested Quick Replies */}
      {quickReplies && quickReplies.length > 0 && !isLoading && (
        <div className="p-2.5 bg-emerald-50/50 border-t border-emerald-100 flex items-center space-x-2 overflow-x-auto">
          <span className="text-[11px] font-bold text-emerald-900 shrink-0">
            ತ್ವರಿತ ಉತ್ತರ:
          </span>
          <div className="flex items-center space-x-1.5 flex-nowrap">
            {quickReplies.map((reply, idx) => (
              <button
                key={idx}
                onClick={() => onSelectQuickReply(reply)}
                className="shrink-0 text-xs px-2.5 py-1 rounded-full bg-white hover:bg-emerald-100 text-emerald-900 font-semibold border border-emerald-200 shadow-2xs transition active:scale-95"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

