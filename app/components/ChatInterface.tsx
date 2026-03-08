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
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const send = async () => {
        if (!input.trim() || loading) return;
        const userMsg: Message = { role: 'user', content: input.trim() };
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

            {/* Input */}
            <div style={{
                display: 'flex', gap: '8px', width: '100%',
                maxWidth: '560px', padding: '0 16px',
                pointerEvents: 'all'
            }}>
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && send()}
                    placeholder="talk to yatin..."
                    style={{
                        flex: 1, background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(0,255,255,0.3)',
                        borderRadius: '8px', padding: '10px 14px',
                        color: '#fff', fontFamily: 'monospace', fontSize: '13px',
                        outline: 'none',
                    }}
                />
                <button
                    onClick={send}
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
        </div>
    );
}