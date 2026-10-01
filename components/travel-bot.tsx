'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Bot,
  Sparkles,
  X,
  Send,
  RefreshCw,
  Maximize2,
  Minimize2,
  Phone,
  ArrowRight,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Trip, pkr } from '@/lib/travel-data';
import { siteConfig } from '@/lib/site-config';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  matchedTrips?: Trip[];
  isFallback?: boolean;
  timestamp: string;
};

const INITIAL_GREETING: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: `👋 **As-salamu alaykum!** Welcome to **Nodebook Travels**.\n\nI'm **Zainab**, your AI Travel Consultant. I have complete details on all our **21 curated domestic & international packages**, day-by-day itineraries, seasonal weather advisory, and real-time quotes in **PKR**.\n\nHow can I help you plan your dream vacation today?`,
  timestamp: 'Just now',
};

const SUGGESTION_CHIPS = [
  { label: '🏔️ Hunza 6-Day Plan', query: 'Tell me about the 6-day Hunza Valley package and itinerary' },
  { label: '⭐ Skardu & Deosai', query: 'What is included in the Skardu & Deosai 7-day trip?' },
  { label: '💰 Tours Under 30k', query: 'Which Northern Pakistan tour packages are under PKR 30,000?' },
  { label: '🇦🇿 Baku Azerbaijan', query: 'What are the visa requirements and itinerary for the Baku Azerbaijan package?' },
  { label: '🕋 Umrah 10-Day', query: 'Provide details and pricing for the 10-day Umrah package' },
  { label: '📲 How to Book', query: 'How can I confirm a booking and customize hotels via WhatsApp?' },
];

let messageCounter = 0;
function nextId(prefix: string) {
  messageCounter += 1;
  return `${prefix}-${messageCounter}`;
}

export default function TravelBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_GREETING]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewPrompt, setHasNewPrompt] = useState(false);
  const [showNotice, setShowNotice] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const streamAccRef = useRef<{ content: string; matchedTrips?: Trip[] }>({ content: '' });

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Pulse teaser notification after 5 seconds on first visit
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasNewPrompt(true);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  const handleResetChat = () => {
    setMessages([
      {
        ...INITIAL_GREETING,
        id: nextId('welcome'),
      },
    ]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: nextId('user'),
      role: 'user',
      content: text,
      timestamp: 'Now',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const assistantMsgId = nextId('bot');
    const initialAssistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: 'Now',
    };

    setMessages((prev) => [...prev, initialAssistantMsg]);
    streamAccRef.current = { content: '', matchedTrips: undefined };

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const contentType = response.headers.get('content-type') || '';

      if (contentType.includes('text/event-stream')) {
        // SSE Streaming response
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (reader) {
          let buffer = '';
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || !trimmed.startsWith('data: ')) continue;
              if (trimmed === 'data: [DONE]') continue;

              try {
                const payload = JSON.parse(trimmed.slice(6));
                if (payload.meta && payload.matchedTrips) {
                  streamAccRef.current.matchedTrips = payload.matchedTrips;
                }
                if (payload.content) {
                  streamAccRef.current.content += payload.content;
                  const currentContent = streamAccRef.current.content;
                  const currentTrips = streamAccRef.current.matchedTrips;
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMsgId
                        ? { ...msg, content: currentContent, matchedTrips: currentTrips }
                        : msg
                    )
                  );
                }
              } catch {
                // Ignore parse errors on partial frames
              }
            }
          }
        }
      } else {
        // Standard JSON response (e.g. offline knowledge base fallback)
        const data = await response.json();
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId
              ? {
                ...msg,
                content: data.content || data.reply || 'Thank you for reaching out! How else can I assist you?',
                matchedTrips: data.matchedTrips,
                isFallback: data.isFallback,
              }
              : msg
          )
        );
        if (data.isFallback) {
          setShowNotice(true);
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId
            ? {
              ...msg,
              content: `⚠️ I encountered a temporary connection issue. However, our dedicated human travel consultants are always online to assist you directly!\n\nFeel free to call or WhatsApp us directly at **${siteConfig.phone}**.`,
            }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const cleanPhone = siteConfig.phone.replace(/[^0-9]/g, '');

  const createWhatsAppUrl = (customText?: string) => {
    const text = encodeURIComponent(
      customText || `Hello Nodebook Travels, I was chatting with your AI assistant and would like to customize an itinerary and get a quote.`
    );
    return `https://wa.me/${cleanPhone}?text=${text}`;
  };

  const renderFormattedText = (raw: string) => {
    // Basic Markdown formatting helper for bold, bullet points, headers, and code
    const lines = raw.split('\n');
    return (
      <div className="space-y-1.5 text-[13.5px] leading-relaxed break-words">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) {
            return <div key={idx} className="h-1.5" />;
          }

          // Header ###
          if (trimmed.startsWith('### ')) {
            return (
              <h4 key={idx} className="font-bold text-[#0c2a72] text-[14.5px] mt-2 mb-1">
                {trimmed.replace('### ', '')}
              </h4>
            );
          }

          // Header ##
          if (trimmed.startsWith('## ')) {
            return (
              <h3 key={idx} className="font-extrabold text-[#0c2a72] text-[15.5px] mt-2 mb-1">
                {trimmed.replace('## ', '')}
              </h3>
            );
          }

          // Bullets
          const isBullet = trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ');
          const content = isBullet ? trimmed.replace(/^([•\-*]\s*)/, '') : trimmed;

          // Parse **bold** and *italic*
          const formattedParts = parseInlineStyles(content);

          if (isBullet) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-1 my-0.5">
                <span className="text-[#08bdc7] text-[13px] font-bold leading-5">•</span>
                <span className="flex-1">{formattedParts}</span>
              </div>
            );
          }

          return <p key={idx}>{formattedParts}</p>;
        })}
      </div>
    );
  };

  const parseInlineStyles = (text: string) => {
    // Match **bold**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-[#0c2a72]">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <>
      {/* Floating Launcher Button - Positioned above the existing contact button */}
      <div className="fixed bottom-[74px] sm:bottom-[86px] right-4 sm:right-5.5 z-50 flex items-center gap-3">
        {/* Teaser pill on desktop before opening */}
        {!isOpen && hasNewPrompt && (
          <div
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2.5 bg-white text-[#0c2a72] px-4 py-2.5 rounded-full shadow-[0_8px_30px_rgba(11,39,108,0.18)] border border-[#08bdc7]/30 cursor-pointer hover:border-[#08bdc7] transition-all duration-300 animate-in fade-in slide-in-from-right-4"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#08bdc7] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#08bdc7]"></span>
            </span>
            <p className="text-xs font-bold leading-none">
              Plan your journey with AI <span className="text-[#08bdc7] font-extrabold">Zainab</span>
            </p>
          </div>
        )}

        <button
          onClick={() => {
            setIsOpen((prev) => !prev);
            setHasNewPrompt(false);
          }}
          aria-label={isOpen ? 'Close Travel Assistant' : 'Open Travel Assistant'}
          className={`relative group flex items-center justify-center rounded-full transition-all duration-300 shadow-[0_10px_35px_rgba(12,42,114,0.35)] ${isOpen
              ? 'w-12 h-12 sm:w-13 sm:h-13 bg-[#0c2a72] text-white hover:bg-[#082260]'
              : 'w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-tr from-[#0c2a72] via-[#0f358a] to-[#08bdc7] text-white hover:scale-105 hover:shadow-[0_12px_40px_rgba(8,189,199,0.4)]'
            }`}
        >
          {isOpen ? (
            <X className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:rotate-90" />
          ) : (
            <div className="relative flex items-center justify-center">
              <Bot className="w-6 h-6 sm:w-7 sm:h-7" />
              <Sparkles className="w-3.5 h-3.5 text-[#38f3fc] absolute -top-1 -right-1 animate-pulse" />
              <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-400 border-2 border-white rounded-full"></span>
            </div>
          )}
        </button>
      </div>

      {/* Main Chat Drawer / Window */}
      {isOpen && (
        <div
          className={`fixed z-50 bottom-[136px] sm:bottom-[152px] right-3 sm:right-5.5 bg-white border border-[#dce6ed] rounded-2xl shadow-[0_20px_60px_rgba(11,39,108,0.22)] overflow-hidden flex flex-col transition-all duration-300 ${isExpanded
              ? 'w-[calc(100vw-24px)] sm:w-[620px] h-[75vh] max-h-[760px]'
              : 'w-[calc(100vw-24px)] sm:w-[410px] h-[560px] max-h-[calc(100vh-170px)]'
            }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0c2a72] to-[#0f3898] text-white px-4 py-3.5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white font-bold">
                  <Bot className="w-5 h-5 text-[#0bdfe8]" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#0c2a72] rounded-full"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold leading-tight">Zainab</h3>
                  <span className="bg-[#08bdc7]/25 text-[#38f3fc] text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wider">
                    AI Agent
                  </span>
                </div>
                <p className="text-[11.5px] text-white/80 leading-tight">Nodebook Travels Concierge</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                title="Restart conversation"
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsExpanded((prev) => !prev)}
                title={isExpanded ? 'Collapse' : 'Expand window'}
                className="hidden sm:inline-flex p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Fallback notification notice if key not set */}
          {showNotice && (
            <div className="bg-amber-50 border-b border-amber-200 px-3 py-1.5 flex items-center justify-between text-[11px] text-amber-800">
              <span className="flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                Knowledge Base Offline Mode (Add GROQ_API_KEY in .env.local)
              </span>
              <button
                onClick={() => setShowNotice(false)}
                className="text-amber-700 hover:text-amber-900 font-bold ml-2"
              >
                ✕
              </button>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#f8fafc]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm ${msg.role === 'user'
                      ? 'bg-[#0c2a72] text-white rounded-br-xs'
                      : 'bg-white text-[#1e293b] border border-[#e2e8f0] rounded-bl-xs'
                    }`}
                >
                  {msg.role === 'assistant' ? (
                    <div>
                      {renderFormattedText(msg.content)}

                      {/* If package cards are matched, render compact interactive cards */}
                      {msg.matchedTrips && msg.matchedTrips.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-[#f1f5f9] space-y-2">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
                            Recommended Packages:
                          </p>
                          <div className="grid gap-2">
                            {msg.matchedTrips.map((trip) => (
                              <div
                                key={trip.slug}
                                className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-2.5 flex items-center gap-3 hover:border-[#08bdc7] transition-all"
                              >
                                <div className="w-14 h-14 relative rounded-lg overflow-hidden flex-shrink-0 bg-slate-200">
                                  <Image
                                    src={trip.image}
                                    alt={trip.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-xs font-bold text-[#0c2a72] truncate">
                                    {trip.title}
                                  </h4>
                                  <div className="flex items-center gap-2 text-[11px] text-[#64748b] mt-0.5">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="w-3 h-3 text-[#08bdc7]" />
                                      {trip.days} Days
                                    </span>
                                    <span className="font-bold text-[#0c2a72]">
                                      {pkr(trip.price)}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 mt-1.5">
                                    <a
                                      href={createWhatsAppUrl(`Hi Nodebook Travels, I want to book or customize the ${trip.title} (${trip.days} Days) starting from ${pkr(trip.price)}.`)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-[10.5px] font-bold bg-[#25D366] text-white px-2 py-0.5 rounded hover:bg-[#20ba59] transition-colors"
                                    >
                                      WhatsApp Book
                                      <ArrowRight className="w-2.5 h-2.5" />
                                    </a>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  )}
                </div>
                <span className="text-[10px] text-[#94a3b8] mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 text-[#0c2a72] bg-white border border-[#e2e8f0] rounded-2xl rounded-bl-xs px-3.5 py-2.5 w-fit shadow-sm">
                <Bot className="w-4 h-4 text-[#08bdc7] animate-spin" />
                <span className="text-xs text-[#64748b] font-medium">Zainab is thinking...</span>
                <span className="flex gap-1 ml-1">
                  <span className="w-1.5 h-1.5 bg-[#08bdc7] rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-[#08bdc7] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-[#08bdc7] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3 py-2 bg-white border-t border-[#f1f5f9] overflow-x-auto no-scrollbar flex items-center gap-1.5">
            {SUGGESTION_CHIPS.map((chip, i) => (
              <button
                key={i}
                disabled={isLoading}
                onClick={() => handleSendMessage(chip.query)}
                className="whitespace-nowrap flex-shrink-0 text-[11px] font-semibold bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#0c2a72] px-2.5 py-1 rounded-full transition-colors disabled:opacity-50"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-[#e2e8f0] flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Hunza, Skardu, Baku, prices..."
              disabled={isLoading}
              className="flex-1 bg-[#f8fafc] border border-[#e2e8f0] focus:border-[#08bdc7] rounded-xl px-3.5 py-2.5 text-xs text-[#1e293b] outline-none transition-all placeholder:text-[#94a3b8] disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
              className="w-10 h-10 bg-[#0c2a72] hover:bg-[#08bdc7] text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-40 disabled:hover:bg-[#0c2a72]"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Bottom Branding / Direct WhatsApp Link */}
          <div className="bg-[#f8fafc] px-3 py-1.5 border-t border-[#f1f5f9] flex items-center justify-between text-[10.5px] text-[#64748b]">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#08bdc7]" />
              Nodebook AI
            </span>
            <a
              href={createWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0c2a72] font-bold hover:text-[#08bdc7] flex items-center gap-1 transition-colors"
            >
              <Phone className="w-2.5 h-2.5 text-[#25D366]" />
              WhatsApp: {siteConfig.phone}
            </a>
          </div>
        </div>
      )}
    </>
  );
}
