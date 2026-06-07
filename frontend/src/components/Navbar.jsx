import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

export default function Navbar() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { to: '/explorer', label: 'Explorer' },
    { to: '/report', label: 'Reports' },
    { to: '/assistant', label: 'Assistant' },
    { to: '/', label: 'About' },
  ]

  return (
    <header className="fixed top-0 w-full z-50 border-b border-outline-variant/10 bg-surface-container-low/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 md:px-16 h-20 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-primary font-headline tracking-tight text-glow">
          EchoRights
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-8">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium transition-colors duration-200 ${
                pathname === l.to ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/assistant"
            className="bg-primary text-on-primary px-5 py-2 rounded-lg text-sm font-semibold hover:bg-primary-fixed transition-colors duration-200 glow-primary"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-on-surface-variant p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="material-symbols-outlined">{menuOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-surface-container-low border-t border-outline-variant/10 px-6 py-4 flex flex-col gap-4">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className="text-on-surface-variant hover:text-primary font-medium"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/assistant"
            className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-semibold text-center"
            onClick={() => setMenuOpen(false)}
          >
            Get Started
          </Link>
        </div>
      )}
    </header>
  )
}
