import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Explorer from './pages/Explorer'
import Report from './pages/Report'
import Assistant from './pages/Assistant'

function Layout() {
  const { pathname } = useLocation()
  const isAssistant = pathname === '/assistant'

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background">
      <Navbar />
      <main className={`flex-1 flex flex-col ${isAssistant ? '' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explorer" element={<Explorer />} />
          <Route path="/report" element={<Report />} />
          <Route path="/assistant" element={<Assistant />} />
        </Routes>
      </main>
      {!isAssistant && <Footer />}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}
