import React, { useState, useEffect, useRef } from 'react';
import { Mic, Bot, X, Send, Square } from 'lucide-react';

export default function ChatBotModal({ onClose }) {
    const [messages, setMessages] = useState([
        { id: 1, sender: 'ai', text: 'Hello! I am CareSync Voice Assistant. How can I help you manage your health today?' }
    ]);
    const [input, setInput] = useState("");
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isListening) {
            const timer = setTimeout(() => {
                setIsListening(false);
                handleSend("What should I do about my blood pressure?");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isListening]);

    const handleSend = (overrideText = null) => {
        const textToUse = typeof overrideText === 'string' ? overrideText : input;
        if (!textToUse.trim()) return;

        const newMsgid = Date.now();
        setMessages(prev => [...prev, { id: newMsgid, sender: 'user', text: textToUse }]);
        setInput("");

        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                sender: 'ai',
                text: getResponse(textToUse)
            }]);
        }, 1500);
    };

    const getResponse = (phrase) => {
        const lower = phrase.toLowerCase();
        if (lower.includes("blood pressure")) return "Your current blood pressure is elevated at 140/90. I recommend taking your scheduled medication, resting for 30 minutes, and rechecking. Should I notify Dr. Reeves?";
        if (lower.includes("medication") || lower.includes("medicine")) return "It looks like you missed your Metoprolol dose yesterday. Taking it on a consistent schedule helps maintain steady blood levels.";
        if (lower.includes("doctor") || lower.includes("yes")) return "I will log this and send a message securely to Dr. Reeves' office. A nurse will reach out if further action is needed.";
        return "I've noted that down in your care log. Is there anything else you'd like to check? You can ask me about your vitals or next medication time.";
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm transition-opacity">
            <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[80vh] sm:h-[600px] animate-fade-in-up">

                <div className="px-6 py-4 flex items-center justify-between shadow-sm relative z-10" style={{ background: "linear-gradient(135deg, #0F2942 0%, #1A3A5C 100%)", color: "white" }}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-500/30 border border-blue-400/50 shadow-inner">
                            <Mic className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <div className="font-extrabold text-lg" style={{ fontFamily: "'Georgia', serif" }}>CareSync AI+</div>
                            <div className="text-blue-300 text-xs flex items-center gap-1 font-semibold tracking-wide uppercase">
                                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Online
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                        <X className="w-4 h-4 text-white" />
                    </button>
                </div>

                <div className="flex-1 p-5 overflow-y-auto bg-slate-50 flex flex-col gap-4">
                    {messages.map((m) => (
                        <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                            {m.sender === 'ai' && (
                                <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center shadow-sm mr-2 flex-shrink-0 mt-auto">
                                    <Bot className="w-4 h-4 text-blue-600" />
                                </div>
                            )}
                            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${m.sender === 'user'
                                ? 'bg-gradient-to-br from-sky-500 to-blue-600 text-white rounded-br-none font-medium'
                                : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none font-medium'
                                }`}>
                                {m.text}
                            </div>
                        </div>
                    ))}
                    {isListening && (
                        <div className="flex justify-start animate-fade-in">
                            <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center shadow-sm mr-2 flex-shrink-0 mt-auto">
                                <Bot className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="max-w-[80%] rounded-2xl px-5 py-4 bg-white border border-gray-100 flex items-center gap-2 rounded-bl-none shadow-sm">
                                <span className="text-gray-500 text-sm italic mr-2 font-semibold">Listening to you...</span>
                                <div className="flex gap-1 h-3 items-end">
                                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 bg-white border-t border-gray-100 flex items-center gap-3 shadow-[0_-4px_15px_-4px_rgba(0,0,0,0.05)]">
                    <button
                        onClick={() => setIsListening(!isListening)}
                        className={`w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-105 active:scale-95 ${isListening ? 'bg-red-500 animate-[pulse_1.5s_infinite] ring-4 ring-red-100' : 'bg-gradient-to-r from-sky-500 to-blue-600'}`}
                    >
                        {isListening ? <Square className="w-4 h-4" fill="currentColor" /> : <Mic className="w-5 h-5" />}
                    </button>
                    <div className="flex-1 bg-slate-50 rounded-full border border-gray-200 px-4 py-1 flex items-center focus-within:ring-2 focus-within:ring-sky-200 focus-within:border-sky-400 transition-all">
                        <input
                            type="text"
                            className="w-full bg-transparent outline-none py-2 text-sm text-gray-700 placeholder-gray-400 font-medium"
                            placeholder="Type a message or tap mic..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' ? handleSend() : null}
                            disabled={isListening}
                        />
                    </div>
                    {input.trim() && (
                        <button onClick={() => handleSend()} className="w-10 h-10 flex items-center justify-center rounded-full bg-sky-50 text-sky-600 hover:bg-sky-100 border border-sky-100 transition-colors shadow-sm">
                            <Send className="w-4 h-4 ml-0.5" />
                        </button>
                    )}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(50px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-fade-in-up { animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .animate-fade-in { animation: fadeInUp 0.3s ease forwards; }
            `}} />
        </div>
    );
}
