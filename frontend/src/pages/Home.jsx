import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getStats } from '../api'

const features = [
  {
    icon: 'menu_book',
    color: 'text-primary',
    bg: 'bg-surface-container-high',
    title: 'Simplified Explanations',
    desc: 'Complex legal jargon translated into plain, understandable language. Our AI breaks down laws, rights, and procedures so you know exactly where you stand.',
    span: 'md:col-span-2',
  },
  {
    icon: 'record_voice_over',
    color: 'text-tertiary',
    bg: 'bg-surface-container-high',
    title: 'Voice Assistance',
    desc: 'Get guided help in your regional language. Speak directly to our AI assistant and receive spoken explanations, making legal access truly inclusive.',
    span: 'md:col-span-1',
  },
  {
    icon: 'gavel',
    color: 'text-secondary',
    bg: 'bg-surface-container-highest',
    title: 'Incident Report Guidance',
    desc: 'Filing a report can be daunting. EchoRights provides step-by-step guidance on how to document incidents, which authorities to contact, and what forms to fill out.',
    span: 'md:col-span-3',
  },
]

const categories = [
  { key: 'civil', icon: 'balance', label: 'Civil Rights', color: 'text-primary', border: 'border-primary/30' },
  { key: 'labor', icon: 'engineering', label: 'Labor Rights', color: 'text-secondary', border: 'border-secondary/30' },
  { key: 'consumer', icon: 'shopping_bag', label: 'Consumer Rights', color: 'text-tertiary', border: 'border-tertiary/30' },
  { key: 'digital', icon: 'devices', label: 'Digital Rights', color: 'text-primary', border: 'border-primary/30' },
]

export default function Home() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    getStats().then(setStats).catch(() => {})
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 md:px-16 max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center gap-16">
        <div className="w-full md:w-1/2 flex flex-col gap-6 fade-up">
          <div className="inline-flex items-center gap-2 bg-primary-container/20 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-semibold w-max">
            <span className="material-symbols-outlined text-[14px]">verified</span>
            Civic AI Platform
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-primary leading-tight text-glow">
            Your Rights,<br />Simplified by AI.
          </h1>
          <p className="text-on-surface-variant text-lg leading-relaxed max-w-xl">
            Access legal information, report incidents, and get voice-guided help in your regional language. Empowering citizens through clarity.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/explorer"
              className="bg-primary text-on-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary-fixed transition-colors glow-primary"
            >
              Explore Your Rights
            </Link>
            <Link
              to="/assistant"
              className="border border-primary/40 text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary/10 transition-colors"
            >
              Ask AI Assistant
            </Link>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="w-full md:w-1/2 h-80 rounded-2xl overflow-hidden border border-outline-variant/20 bg-surface-container relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="w-40 h-40 rounded-full bg-primary/10 flex items-center justify-center">
                <div className="w-28 h-28 rounded-full bg-primary/15 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-7xl">balance</span>
                </div>
              </div>
              {/* orbiting dots */}
              {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-primary/40"
                  style={{
                    top: '50%', left: '50%',
                    transform: `rotate(${deg}deg) translateX(80px)`,
                    marginTop: '-4px', marginLeft: '-4px'
                  }}
                />
              ))}
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-background to-transparent" />
        </div>
      </section>

      {/* Stats */}
      {stats && (
        <section className="py-10 border-y border-outline-variant/10 bg-surface-container-low/50">
          <div className="max-w-7xl mx-auto px-6 md:px-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Reports Filed', value: stats.reports_filed?.toLocaleString() },
              { label: 'Rights Explained', value: stats.rights_explained?.toLocaleString() },
              { label: 'Languages', value: stats.languages_supported },
              { label: 'Success Rate', value: `${stats.success_rate}%` },
            ].map(s => (
              <div key={s.label}>
                <div className="text-3xl font-bold text-primary font-headline">{s.value}</div>
                <div className="text-on-surface-variant text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-20 px-6 md:px-16 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-inverse-surface font-headline mb-3">Browse Rights by Category</h2>
          <p className="text-on-surface-variant max-w-lg mx-auto">Explore legal frameworks across different domains of civic life.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map(c => (
            <Link
              key={c.key}
              to={`/explorer?cat=${c.key}`}
              className={`bg-surface-container rounded-xl p-6 border ${c.border} card-hover flex flex-col items-center gap-3 text-center`}
            >
              <span className={`material-symbols-outlined text-4xl ${c.color}`}>{c.icon}</span>
              <span className="text-inverse-surface font-semibold text-sm">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 md:px-16 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-inverse-surface font-headline mb-3">Comprehensive Legal Support</h2>
          <p className="text-on-surface-variant max-w-lg mx-auto">Navigate complex legal landscapes with intuitive, AI-driven tools designed for everyone.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className={`${f.span} bg-surface-container rounded-xl p-6 border border-outline-variant/20 card-hover relative overflow-hidden`}>
              <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl bg-primary/5" />
              <div className={`${f.bg} p-3 rounded-lg w-max mb-4 border border-outline-variant/10`}>
                <span className={`material-symbols-outlined text-3xl ${f.color}`}>{f.icon}</span>
              </div>
              <h3 className="text-xl font-semibold text-inverse-surface font-headline mb-2">{f.title}</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 md:px-16">
        <div className="max-w-7xl mx-auto bg-surface-container-highest rounded-2xl p-12 border border-outline-variant/20 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl font-bold text-inverse-surface font-headline mb-2">Need to file an incident report?</h2>
            <p className="text-on-surface-variant">We guide you through every step of the process clearly and confidentially.</p>
          </div>
          <Link
            to="/report"
            className="border-2 border-secondary text-secondary px-8 py-3 rounded-lg font-semibold hover:bg-secondary/10 transition-colors whitespace-nowrap glow-secondary"
          >
            Start a Report
          </Link>
        </div>
      </section>
    </div>
  )
}
