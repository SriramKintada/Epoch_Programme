
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Hero from './components/Hero';
import Manifesto from './components/Manifesto';
import WhatYouGet from './components/WhatYouGet';
import Tracks from './components/Tracks';
import Partners from './components/Partners';
import FAQ from './components/FAQ';
import ApplyForm from './components/ApplyForm';
import AdminDashboard from './components/AdminDashboard';
import './admin.css';

function LandingPage() {
  return (
    <>
      <Hero />
      <Manifesto />
      <WhatYouGet />

      {/* Origin Quote */}
      <section className="section epoch-origin">
        <div className="container container-narrow" style={{ textAlign: 'center', padding: '6rem 2rem' }}>
          <p className="fade-in" style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(1.4rem, 3vw, 2.2rem)',
            lineHeight: 1.6,
            color: '#fff',
            letterSpacing: '0.01em',
            maxWidth: '700px',
            margin: '0 auto',
            fontWeight: 400,
            fontStyle: 'italic'
          }}>
            "Every generation gets one epoch that rewrites the rules. This is ours. The underscore means it's not finished."
          </p>
        </div>
      </section>

      <Tracks />
      <Partners />
      <FAQ />

      {/* Initiation Section */}
      <section className="section apply-section" id="initiate">
        <div className="apply-container">
          <h1 className="massive-text fade-in">INITIATE</h1>
          <div className="apply-box fade-in" style={{ transitionDelay: '0.2s' }}>
            <div className="sys-message">
              <p className="prompt">&gt; SYSTEM: INITIATE STAGE 0 SEQUENCE...</p>
              <p>Epoch is not a hackathon. It is a crucible for outliers.</p>
              <p>If you are looking for networking, exit now. If you are looking to build the foundation of India's technical future, proceed.</p>
            </div>
            <ul className="specs">
              <li><span className="lbl">COHORT:</span> 001</li>
              <li><span className="lbl">CAPACITY:</span> HIGHLY RESTRICTED</li>
              <li><span className="lbl">STATUS:</span> ACCEPTING ANOMALIES</li>
            </ul>
            <Link to="/apply" className="btn-primary huge-btn">
              <div className="btn-edge-left"></div>
              [ EXECUTE // APPLY ]
              <div className="btn-edge-right"></div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="grid-bg"></div>
      <div className="crt-overlay"></div>

      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            EPOCH<span className="logo-mark">_</span>
            <span className="nav-logo-sub">PROGRAMME<br />V1.0</span>
          </Link>
          <div className="nav-links">
            <a href="/#manifesto">MANIFESTO</a>
            <a href="/#exchange">WHAT YOU GET</a>
            <a href="/#tracks">TRACKS</a>
            <a href="/#partners">PARTNERS</a>
            <Link to="/apply" className="btn-secondary nav-cta">INITIATE [ ]</Link>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/apply" element={<ApplyForm />} />
        <Route path="/admin/epoch-mavericks-2026" element={<AdminDashboard />} />
      </Routes>

      {/* Footer */}
      <footer className="footer">
        <div className="container container-footer">
          <div className="f-brand">EPOCH_</div>
          <div className="f-socials">
            <a href="https://x.com/Ep0ch__" target="_blank" rel="noreferrer" aria-label="Twitter / X" className="social-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://www.linkedin.com/company/joinepoch" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="social-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="https://www.youtube.com/@Epoch_emon" target="_blank" rel="noreferrer" aria-label="YouTube" className="social-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>
          <div className="f-links">
            <p>BUILT FOR OUTLIERS.<br />OPERATING AT THE EDGE.</p>
          </div>
        </div>
      </footer>
    </Router>
  );
}

export default App;
