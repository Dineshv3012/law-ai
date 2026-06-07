import { useState } from 'react'
import { fileReport } from '../api'

const INCIDENT_TYPES = [
  'Workplace Discrimination',
  'Police Misconduct',
  'Consumer Rights Violation',
  'Digital Privacy Breach',
  'Wage Theft / Non-Payment',
  'Housing Rights Violation',
  'Public Service Denial',
  'Other',
]

const STEPS = ['Incident Details', 'Your Information', 'Review & Submit']

export default function Report() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    incident_type: '',
    description: '',
    location: '',
    date_of_incident: '',
    contact_email: '',
    anonymous: false,
  })
  const [submitted, setSubmitted] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const canNext = () => {
    if (step === 0) return form.incident_type && form.description && form.location && form.date_of_incident
    if (step === 1) return form.anonymous || form.contact_email
    return true
  }

  const submit = async () => {
    setLoading(true)
    setError('')
    try {
      const result = await fileReport(form)
      setSubmitted(result)
    } catch (e) {
      setError('Failed to submit. Please try again.')
    }
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-lg w-full bg-surface-container rounded-2xl border border-tertiary/30 p-10 text-center fade-up">
          <div className="w-20 h-20 rounded-full bg-tertiary/10 flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-tertiary text-5xl">check_circle</span>
          </div>
          <h2 className="text-2xl font-bold text-inverse-surface font-headline mb-3">Report Submitted</h2>
          <p className="text-on-surface-variant mb-6">Your report has been filed successfully. You will receive updates within 24–48 hours.</p>
          <div className="bg-surface-container-high rounded-xl p-4 mb-6 border border-outline-variant/20">
            <div className="text-xs text-outline mb-1">Report ID</div>
            <div className="text-primary font-bold font-mono text-lg">{submitted.report_id}</div>
          </div>
          <p className="text-xs text-outline">Keep this ID to track your report status.</p>
          <button
            onClick={() => { setSubmitted(null); setStep(0); setForm({ incident_type: '', description: '', location: '', date_of_incident: '', contact_email: '', anonymous: false }) }}
            className="mt-6 border border-primary/40 text-primary px-6 py-2 rounded-lg text-sm hover:bg-primary/10 transition-colors"
          >
            File Another Report
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 min-h-screen">
      <div className="max-w-3xl mx-auto px-6 md:px-16 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary border border-secondary/20 px-3 py-1 rounded-full text-xs font-semibold mb-4">
            <span className="material-symbols-outlined text-[14px]">gavel</span>
            Incident Reporting
          </div>
          <h1 className="text-4xl font-bold text-inverse-surface font-headline mb-3">File a Report</h1>
          <p className="text-on-surface-variant">We guide you through each step. Your information is handled with confidentiality and care.</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                i < step ? 'bg-tertiary border-tertiary text-on-tertiary' :
                i === step ? 'bg-primary border-primary text-on-primary' :
                'bg-transparent border-outline-variant/40 text-outline'
              }`}>
                {i < step ? <span className="material-symbols-outlined text-[16px]">check</span> : i + 1}
              </div>
              <span className={`text-sm font-medium hidden md:block ${i === step ? 'text-inverse-surface' : 'text-outline'}`}>{s}</span>
              {i < STEPS.length - 1 && <div className={`flex-1 h-px mx-2 ${i < step ? 'bg-tertiary' : 'bg-outline-variant/30'}`} style={{ width: '40px' }} />}
            </div>
          ))}
        </div>

        {/* Form Steps */}
        <div className="bg-surface-container rounded-2xl border border-outline-variant/20 p-8">
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-inverse-surface mb-2">Incident Type *</label>
                <div className="grid grid-cols-2 gap-3">
                  {INCIDENT_TYPES.map(t => (
                    <button
                      key={t}
                      onClick={() => update('incident_type', t)}
                      className={`text-left p-3 rounded-lg border text-sm transition-all ${
                        form.incident_type === t
                          ? 'bg-primary/10 border-primary text-primary'
                          : 'bg-surface-container-high border-outline-variant/20 text-on-surface-variant hover:border-primary/40'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-inverse-surface mb-2">Description *</label>
                <textarea
                  rows={5}
                  value={form.description}
                  onChange={e => update('description', e.target.value)}
                  placeholder="Describe what happened in as much detail as possible..."
                  className="w-full bg-surface-container-high border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface placeholder-outline focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 resize-none transition-all"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-inverse-surface mb-2">Location *</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={e => update('location', e.target.value)}
                    placeholder="City, State or Address"
                    className="w-full bg-surface-container-high border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface placeholder-outline focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-inverse-surface mb-2">Date of Incident *</label>
                  <input
                    type="date"
                    value={form.date_of_incident}
                    onChange={e => update('date_of_incident', e.target.value)}
                    className="w-full bg-surface-container-high border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div className="bg-surface-container-high rounded-xl p-4 flex items-start gap-3 border border-outline-variant/20">
                <span className="material-symbols-outlined text-primary text-xl">lock</span>
                <p className="text-on-surface-variant text-sm">Your information is protected. We never share personal data without consent. You may also report anonymously.</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => update('anonymous', !form.anonymous)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${form.anonymous ? 'bg-primary' : 'bg-surface-container-highest'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${form.anonymous ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
                <label className="text-sm text-on-surface-variant">Submit anonymously</label>
              </div>
              {!form.anonymous && (
                <div>
                  <label className="block text-sm font-medium text-inverse-surface mb-2">Contact Email</label>
                  <input
                    type="email"
                    value={form.contact_email}
                    onChange={e => update('contact_email', e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-surface-container-high border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface placeholder-outline focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all"
                  />
                  <p className="text-xs text-outline mt-2">We'll use this to send you updates on your report status.</p>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-inverse-surface font-headline">Review Your Report</h3>
              {[
                { label: 'Incident Type', value: form.incident_type },
                { label: 'Location', value: form.location },
                { label: 'Date', value: form.date_of_incident },
                { label: 'Contact', value: form.anonymous ? 'Anonymous' : (form.contact_email || 'Not provided') },
              ].map(row => (
                <div key={row.label} className="flex gap-4 py-3 border-b border-outline-variant/10">
                  <span className="text-outline text-sm w-32 shrink-0">{row.label}</span>
                  <span className="text-on-surface text-sm">{row.value}</span>
                </div>
              ))}
              <div className="pt-2">
                <div className="text-outline text-sm mb-1">Description</div>
                <div className="bg-surface-container-high rounded-lg p-4 text-on-surface-variant text-sm">{form.description}</div>
              </div>
              {error && <div className="text-error text-sm bg-error-container/20 border border-error/20 rounded-lg px-4 py-3">{error}</div>}
            </div>
          )}

          {/* Nav buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-outline-variant/10">
            <button
              onClick={() => setStep(s => s - 1)}
              disabled={step === 0}
              className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span> Previous
            </button>
            {step < 2 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={!canNext()}
                className="bg-primary text-on-primary px-6 py-2 rounded-lg text-sm font-semibold hover:bg-primary-fixed transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Next <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            ) : (
              <button
                onClick={submit}
                disabled={loading}
                className="bg-secondary text-on-secondary px-8 py-2 rounded-lg text-sm font-semibold hover:bg-secondary/90 transition-colors disabled:opacity-50 flex items-center gap-2 glow-secondary"
              >
                {loading ? 'Submitting...' : 'Submit Report'}
                <span className="material-symbols-outlined text-[16px]">send</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
