import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-outline-variant/10 bg-surface-container-lowest mt-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-16 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <div className="text-2xl font-bold text-primary font-headline mb-3">EchoRights</div>
          <p className="text-on-surface-variant text-sm leading-relaxed max-w-sm">
            Empowering citizens through AI-driven legal clarity. Know your rights, file reports, and get guided support in your language.
          </p>
          <p className="text-outline text-xs mt-4">© 2024 EchoRights. All rights reserved.</p>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-inverse-surface uppercase tracking-widest mb-4">Platform</h4>
          <div className="flex flex-col gap-3">
            <Link to="/explorer" className="text-on-surface-variant hover:text-secondary text-sm transition-colors">Rights Explorer</Link>
            <Link to="/report" className="text-on-surface-variant hover:text-secondary text-sm transition-colors">File a Report</Link>
            <Link to="/assistant" className="text-on-surface-variant hover:text-secondary text-sm transition-colors">Voice Assistant</Link>
          </div>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-inverse-surface uppercase tracking-widest mb-4">Resources</h4>
          <div className="flex flex-col gap-3">
            <a href="#" className="text-on-surface-variant hover:text-secondary text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-on-surface-variant hover:text-secondary text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-on-surface-variant hover:text-secondary text-sm transition-colors">Contact Support</a>
            <a href="#" className="text-on-surface-variant hover:text-secondary text-sm transition-colors">Regional Offices</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
