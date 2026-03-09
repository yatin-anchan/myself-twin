'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "yo, what's up? ask me anything 👋" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [listening, setListening] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const send = async (text?: string) => {
        const content = (text ?? input).trim();
        if (!content || loading) return;
        const userMsg: Message = { role: 'user', content };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages }),
            });
            const data = await res.json();
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.message ?? "hmm something went wrong, try again"
            }]);
        } catch {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "connection lost lol, try again"
            }]);
        } finally {
            setLoading(false);
        }
    };

    const toggleVoice = () => {
        if (typeof window === 'undefined') return;
        const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Voice not supported in this browser. Use Chrome or Edge.');
            return;
        }

        if (listening) {
            recognitionRef.current?.stop();
            setListening(false);
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-IN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => setListening(true);
        recognition.onend = () => setListening(false);
        recognition.onerror = () => setListening(false);

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            const transcript = event.results[0][0].transcript;
            send(transcript);
        };

        recognitionRef.current = recognition;
        recognition.start();
    };

    return (
        <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '0 0 24px 0', zIndex: 10, pointerEvents: 'none'
        }}>
            {/* Title */}
            <div style={{
                color: '#00ffff', fontFamily: 'monospace', fontSize: '11px',
                letterSpacing: '4px', textTransform: 'uppercase',
                marginBottom: '12px', opacity: 0.6, pointerEvents: 'none'
            }}>
                yatin — digital twin v1.0
            </div>

            {/* Messages */}
            <div style={{
                width: '100%', maxWidth: '560px',
                maxHeight: '240px', overflowY: 'auto',
                display: 'flex', flexDirection: 'column', gap: '8px',
                marginBottom: '12px', padding: '0 16px',
                pointerEvents: 'all'
            }}>
                {messages.map((msg, i) => (
                    <div key={i} style={{
                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '80%',
                        background: msg.role === 'user'
                            ? 'rgba(0,255,255,0.12)'
                            : 'rgba(255,255,255,0.06)',
                        border: msg.role === 'user'
                            ? '1px solid rgba(0,255,255,0.3)'
                            : '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        padding: '8px 14px',
                        color: msg.role === 'user' ? '#00ffff' : '#e0e0e0',
                        fontFamily: 'monospace',
                        fontSize: '13px',
                        lineHeight: '1.5',
                    }}>
                        {msg.content}
                    </div>
                ))}
                {loading && (
                    <div style={{
                        alignSelf: 'flex-start',
                        color: '#00ffff', fontFamily: 'monospace',
                        fontSize: '13px', opacity: 0.6, padding: '4px 14px'
                    }}>
                        typing...
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input Row */}
            <div style={{
                display: 'flex', gap: '8px', width: '100%',
                maxWidth: '560px', padding: '0 16px',
                pointerEvents: 'all'
            }}>
                {/* Mic Button */}
                <button
                    onClick={toggleVoice}
                    style={{
                        background: listening
                            ? 'rgba(255,50,50,0.3)'
                            : 'rgba(0,255,255,0.08)',
                        border: listening
                            ? '1px solid rgba(255,50,50,0.6)'
                            : '1px solid rgba(0,255,255,0.2)',
                        borderRadius: '8px', padding: '10px 14px',
                        color: listening ? '#ff5555' : '#00ffff',
                        fontFamily: 'monospace', fontSize: '16px',
                        cursor: 'pointer', transition: 'all 0.2s',
                        animation: listening ? 'pulse 1s infinite' : 'none',
                    }}
                >
                    {listening ? '⏹' : '🎤'}
                </button>

                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && send()}
                    placeholder={listening ? 'listening...' : 'talk to yatin...'}
                    style={{
                        flex: 1, background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(0,255,255,0.3)',
                        borderRadius: '8px', padding: '10px 14px',
                        color: '#fff', fontFamily: 'monospace', fontSize: '13px',
                        outline: 'none',
                    }}
                />
                <button
                    onClick={() => send()}
                    disabled={loading}
                    style={{
                        background: 'rgba(0,255,255,0.15)',
                        border: '1px solid rgba(0,255,255,0.4)',
                        borderRadius: '8px', padding: '10px 18px',
                        color: '#00ffff', fontFamily: 'monospace',
                        fontSize: '13px', cursor: 'pointer',
                    }}
                >
                    send
                </button>
            </div>

            <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,50,50,0.4); }
          50% { box-shadow: 0 0 0 8px rgba(255,50,50,0); }
        }
      `}</style>
        </div>
    );
}