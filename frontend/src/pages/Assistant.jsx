import { useState, useRef, useEffect } from 'react'
import { queryAssistant, getLanguages } from '../api'

const SUGGESTIONS = [
  "What are my rights if arrested?",
  "How do I file a consumer complaint?",
  "What is the minimum wage in India?",
  "My employer is not paying my salary",
  "How can I protect my digital privacy?",
  "What are my tenant rights?",
]

export default function Assistant() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am EchoRights AI. I can help you understand your legal rights and guide you through civic processes. What would you like to know?',
      sources: [],
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [language, setLanguage] = useState('en')
  const [languages, setLanguages] = useState([])
  const [listening, setListening] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const bottomRef = useRef(null)
  const recognitionRef = useRef(null)

  useEffect(() => {
    getLanguages().then(d => setLanguages(d.languages || []))
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (text) => {
    if (!text.trim() || loading) return
    const userMsg = { role: 'user', content: text }
    setMessages(m => [...m, userMsg])
    setInput('')
    setLoading(true)
    try {
      const res = await queryAssistant(text, language)
      setMessages(m => [...m, { role: 'assistant', content: res.answer, sources: res.sources || [] }])
      // TTS
      if ('speechSynthesis' in window) {
        setSpeaking(true)
        const utter = new SpeechSynthesisUtterance(res.answer)
        utter.onend = () => setSpeaking(false)
        window.speechSynthesis.speak(utter)
      }
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'Sorry, I could not process your request. Please try again.', sources: [] }])
    }
    setLoading(false)
  }

  const startVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice input not supported in this browser.')
      return
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    const rec = new SR()
    rec.lang = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-IN'
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript
      setInput(transcript)
      setListening(false)
    }
    rec.onerror = () => setListening(false)
    rec.onend = () => setListening(false)
    recognitionRef.current = rec
    rec.start()
    setListening(true)
  }

  const stopVoice = () => {
    recognitionRef.current?.stop()
    setListening(false)
  }

  const stopSpeaking = () => {
    window.speechSynthesis?.cancel()
    setSpeaking(false)
  }

  return (
    <div className="pt-20 h-screen flex flex-col">
      {/* Header bar */}
      <div className="border-b border-outline-variant/10 bg-surface-container-low px-6 md:px-16 py-4 flex items-center justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
            <span className="text-xs text-tertiary font-medium">AI Assistant Online</span>
          </div>
          <h1 className="text-lg font-bold text-inverse-surface font-headline">EchoRights Assistant</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-on-surface-variant text-sm">Language:</span>
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-1.5 text-sm text-on-surface focus:outline-none focus:border-primary/60"
          >
            {languages.map(l => (
              <option key={l.code} value={l.code}>{l.name}</option>
            ))}
          </select>
          {speaking && (
            <button onClick={stopSpeaking} className="text-secondary text-sm flex items-center gap-1 hover:text-secondary/70">
              <span className="material-symbols-outlined text-[16px]">stop</span> Stop
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 md:px-16 py-8 space-y-6 max-w-4xl mx-auto w-full">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-4 fade-up ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {msg.role === 'assistant' && (
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary text-xl">smart_toy</span>
              </div>
            )}
            <div className={`max-w-2xl ${msg.role === 'user' ? 'text-right' : ''}`}>
              <div className={`rounded-2xl px-5 py-4 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-primary text-on-primary rounded-tr-sm'
                  : 'bg-surface-container border border-outline-variant/20 text-on-surface rounded-tl-sm'
              }`}>
                {msg.content}
              </div>
              {msg.sources && msg.sources.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {msg.sources.map(s => (
                    <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-primary/5 text-primary border border-primary/20">
                      <span className="material-symbols-outlined text-[11px] align-middle mr-1">link</span>{s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary text-xl">smart_toy</span>
            </div>
            <div className="bg-surface-container border border-outline-variant/20 rounded-2xl rounded-tl-sm px-5 py-4 flex gap-1 items-center">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-2 h-2 rounded-full bg-outline animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div className="px-6 md:px-16 pb-4 max-w-4xl mx-auto w-full">
          <p className="text-xs text-outline mb-3">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                onClick={() => send(s)}
                className="text-xs px-3 py-1.5 rounded-full bg-surface-container border border-outline-variant/20 text-on-surface-variant hover:border-primary/40 hover:text-primary transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input bar */}
      <div className="border-t border-outline-variant/10 bg-surface-container-low px-6 md:px-16 py-4 shrink-0">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          {/* Voice button */}
          <button
            onClick={listening ? stopVoice : startVoice}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shrink-0 relative ${
              listening
                ? 'bg-tertiary text-on-tertiary pulse-ring'
                : 'bg-surface-container border border-outline-variant/30 text-on-surface-variant hover:border-primary/40 hover:text-primary'
            }`}
          >
            {listening ? (
              <div className="flex gap-0.5 items-end h-5">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-1 rounded-full bg-on-tertiary wave-bar" style={{ height: `${8 + i * 3}px` }} />
                ))}
              </div>
            ) : (
              <span className="material-symbols-outlined text-xl">mic</span>
            )}
          </button>

          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send(input)}
            placeholder={listening ? 'Listening...' : 'Ask about your rights...'}
            className="flex-1 bg-surface-container border border-outline-variant/30 rounded-xl px-5 py-3 text-on-surface placeholder-outline focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all text-sm"
          />

          <button
            onClick={() => send(input)}
            disabled={!input.trim() || loading}
            className="w-11 h-11 rounded-full bg-primary text-on-primary flex items-center justify-center hover:bg-primary-fixed transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <span className="material-symbols-outlined text-xl">send</span>
          </button>
        </div>
      </div>
    </div>
  )
}
