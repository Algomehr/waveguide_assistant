
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types.ts';
import { chatWithGemini } from '../services/geminiService.ts';
import MarkdownRenderer from './MarkdownRenderer.tsx';
import { PaperAirplaneIcon, MicrophoneIcon, StopIcon } from '@heroicons/react/24/solid';
import { GoogleGenAI, Modality } from '@google/genai';

const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'سلام! ستاپ آماده است؟ من دستیار هوشمند شما در گروه طراحی موج‌بر هستم. می‌توانید به صورت صوتی با من گفتگو کنید یا سوالات فنی‌تان را اینجا بپرسید.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLiveActive, setIsLiveActive] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Live API State
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Fix: Manual base64 decoding following guidelines
  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  // Fix: Manual base64 encoding following guidelines
  const encode = (bytes: Uint8Array) => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  // Fix: Manual raw PCM decoding following guidelines
  async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }

  const startLiveAssistant = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const outCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outCtx;
      let nextStartTime = 0;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } },
          systemInstruction: 'You are a senior expert at the Waveguide and Grating design group. Help the researchers while they work on their optical setup. Respond warmly in Persian.'
        },
        callbacks: {
          onopen: () => setIsLiveActive(true),
          onmessage: async (message) => {
            const audioBase64 = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioBase64 && audioContextRef.current) {
              const audioBuffer = await decodeAudioData(decode(audioBase64), audioContextRef.current, 24000, 1);
              const source = audioContextRef.current.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(audioContextRef.current.destination);
              nextStartTime = Math.max(nextStartTime, audioContextRef.current.currentTime);
              source.start(nextStartTime);
              nextStartTime += audioBuffer.duration;
            }
          },
          onclose: () => setIsLiveActive(false),
          onerror: (e) => console.error('Live API Error:', e)
        }
      });

      sessionRef.current = await sessionPromise;
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const inCtx = new AudioContext({ sampleRate: 16000 });
      const source = inCtx.createMediaStreamSource(stream);
      const processor = inCtx.createScriptProcessor(4096, 1, 1);
      
      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const int16 = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
        
        // Fix: Always use sessionPromise.then to send real-time input to avoid stale closures and race conditions
        sessionPromise.then((session) => {
          session.sendRealtimeInput({
            media: { 
              data: encode(new Uint8Array(int16.buffer)), 
              mimeType: 'audio/pcm;rate=16000' 
            }
          });
        });
      };

      source.connect(processor);
      processor.connect(inCtx.destination);
    } catch (err) {
      console.error('Failed to start Live Assistant:', err);
    }
  };

  const stopLiveAssistant = () => {
    sessionRef.current?.close();
    setIsLiveActive(false);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    try {
      const response = await chatWithGemini([...messages, userMsg], "You are a professional assistant for waveguide researchers.");
      setMessages(prev => [...prev, { role: 'model', text: response || 'متاسفم.' }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: 'خطا در شبکه.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950">
      <header className="p-4 lg:p-6 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-center bg-slate-900/50 backdrop-blur-md sticky top-0 z-10 gap-4">
        <div className="text-center sm:text-right w-full sm:w-auto">
          <h2 className="text-lg lg:text-xl font-bold text-white">گفتگو با هوش مصنوعی</h2>
          <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
            <div className={`w-2 h-2 rounded-full ${isLiveActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></div>
            <p className="text-[10px] lg:text-xs text-slate-400">{isLiveActive ? 'دستیار صوتی فعال است' : 'آماده برای راهنمایی'}</p>
          </div>
        </div>
        <button 
          onClick={isLiveActive ? stopLiveAssistant : startLiveAssistant}
          className={`flex items-center gap-2 lg:gap-3 px-4 lg:px-6 py-2 lg:py-3 rounded-xl lg:rounded-2xl border transition-all shadow-lg text-xs lg:text-sm font-bold uppercase tracking-wider ${
            isLiveActive 
              ? 'bg-rose-500/20 border-rose-500 text-rose-500 hover:bg-rose-500/30' 
              : 'bg-cyan-500/10 border-cyan-500 text-cyan-400 hover:bg-cyan-500/20'
          }`}
        >
          {isLiveActive ? <StopIcon className="w-5 h-5" /> : <MicrophoneIcon className="w-5 h-5" />}
          <span>{isLiveActive ? 'توقف دستیار صوتی' : 'گفتگوی صوتی (Live)'}</span>
        </button>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 lg:space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[90%] sm:max-w-[85%] p-4 lg:p-5 rounded-2xl lg:rounded-[2rem] shadow-sm ${
              msg.role === 'user' 
                ? 'bg-slate-800 text-slate-200 rounded-tr-none' 
                : 'bg-cyan-900/30 text-cyan-50 border border-cyan-800/50 rounded-tl-none'
            }`}>
              <MarkdownRenderer content={msg.text} className="text-sm" />
            </div>
          </div>
        ))}
        {isLoading && <div className="text-cyan-500 animate-pulse text-xs pr-4">در حال پردازش...</div>}
      </div>

      <div className="p-4 lg:p-6 border-t border-slate-800">
        <div className="relative flex items-center max-w-5xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="سوال فنی..."
            className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl lg:rounded-2xl px-4 lg:px-6 py-3 lg:py-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all pr-12 lg:pr-16 text-right text-sm"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="absolute left-2 bg-cyan-600 hover:bg-cyan-500 text-white p-2 lg:p-3 rounded-lg lg:rounded-xl transition-all shadow-lg"
          >
            <PaperAirplaneIcon className="w-5 h-5 lg:w-6 lg:h-6 rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
