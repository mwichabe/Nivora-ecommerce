import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

const PRIMARY = '#ea2e0e';

const SECTIONS = [
  { num: '01', title: 'Introduction', content: `Welcome to ONE MAN Boutique. We are committed to protecting your privacy and personal information. This policy explains how we collect, use, disclose, and safeguard your information when you visit our website, including any other media form, media channel, mobile website, or mobile application related or connected thereto (collectively, the "Site"). Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.` },
  { num: '02', title: 'Information We Collect', content: `We collect personal information that you voluntarily provide to us when you register on the Site, place an order, or contact us.\n\n• Personal Data: Name, email address, phone number, shipping address, and billing address.\n\n• Financial Data: Payment card information processed securely by third-party payment processors. We do not store sensitive financial data on our servers.\n\n• Usage Data: Information about how you access and use the Site, such as IP address, browser type, and pages viewed.` },
  { num: '03', title: 'Use of Your Information', content: `We use the information we collect to:\n\n• Process transactions and fulfill your orders.\n\n• Manage your account and registration.\n\n• Send you product updates and marketing communications (if consented to).\n\n• Improve the functionality and user experience of the Site.\n\n• Respond to customer service requests and contact inquiries.` },
  { num: '04', title: 'Disclosure of Your Information', content: `We may share information with third parties only when necessary to provide our services, including:\n\n• Service Providers: Third parties who perform services for us, such as payment processing, shipping carriers, and email delivery.\n\n• Legal Obligations: When required by law or in response to a valid court order.` },
  { num: '05', title: 'Cookies & Tracking', content: `We use cookies (small text files placed on your device) and similar tracking technologies — including the JWT cookie used for authentication — to help customize the Site and improve your experience. You may disable cookies through your browser settings, though this may affect Site functionality such as logging in or maintaining your shopping cart.` },
  { num: '06', title: 'Your Privacy Rights', content: `You have the right to access, update, or delete your personal information at any time by logging into your account or contacting us directly via the details on our Contact page. We respond to all privacy-related requests within 72 hours.` },
  { num: '07', title: 'Contact Us', content: `If you have questions or comments about this Privacy Policy, please contact us directly:\n\nEmail: support@onemanboutique.com\nPhone: +254 704 858 069\nAddress: MidTown, Kitale, Kenya` },
];

/* ─── Active section tracker ─── */
const Policy = () => {
  const [activeSection, setActiveSection] = useState(0);
  const sectionRefs = useRef([]);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = sectionRefs.current.indexOf(entry.target);
          if (idx !== -1) setActiveSection(idx);
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });

    sectionRefs.current.forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const scrollTo = (idx) => {
    sectionRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#111' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #f0f0f0; }
        ::-webkit-scrollbar-thumb { background: #111; }
        .policy-nav-item { transition: all 0.2s; }
        .policy-nav-item:hover { color: #111 !important; }
      `}</style>

      {/* ── Minimal nav ── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: '#fff', borderBottom: '1px solid #ebebeb', padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 30, height: 30, borderRadius: 3, overflow: 'hidden', border: `1.5px solid ${PRIMARY}` }}>
            <img src={logo} alt="ONE MAN" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { e.target.src = 'https://placehold.co/30x30/ea2e0e/ffffff?text=1M'; }} />
          </div>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: '0.12em', color: '#111' }}>ONE MAN</span>
        </Link>
        <Link to="/" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', textDecoration: 'none', transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = '#111'}
          onMouseLeave={e => e.currentTarget.style.color = '#888'}>
          ← Back to Home
        </Link>
      </nav>

      {/* ── Hero ── */}
      <section style={{ background: '#111', position: 'relative', overflow: 'hidden', padding: '60px 32px 52px' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`, backgroundSize: '48px 48px' }} />
        <div style={{ position: 'absolute', right: -10, top: '50%', transform: 'translateY(-50%)', fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(80px, 14vw, 180px)', color: 'rgba(255,255,255,0.03)', userSelect: 'none', letterSpacing: '0.04em', lineHeight: 1 }}>POLICY</div>

        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: PRIMARY, marginBottom: 16, animation: 'fadeUp 0.6s ease both' }}>◆ Legal</p>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(48px, 7vw, 88px)', lineHeight: 0.9, letterSpacing: '0.02em', color: '#fff', marginBottom: 18, animation: 'fadeUp 0.7s ease 0.1s both' }}>
            PRIVACY<br /><span style={{ color: PRIMARY }}>POLICY</span>
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', animation: 'fadeUp 0.7s ease 0.2s both' }}>Last Updated: October 21, 2025</p>
        </div>
      </section>

      {/* ── Ticker ── */}
      <div style={{ background: PRIMARY, overflow: 'hidden', height: 36, display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', animation: 'ticker 22s linear infinite', whiteSpace: 'nowrap' }}>
          {[...Array(4)].map((_, i) => (
            <span key={i} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.18em', color: '#fff', textTransform: 'uppercase', paddingRight: 80 }}>
              YOUR PRIVACY MATTERS &nbsp;·&nbsp; 256-BIT SSL ENCRYPTION &nbsp;·&nbsp; WE NEVER SELL YOUR DATA &nbsp;·&nbsp; GDPR COMPLIANT &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ── Main: Sidebar + Content ── */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 32px', display: 'grid', gridTemplateColumns: '260px 1fr', gap: 72 }}>

        {/* ── Sticky Sidebar TOC ── */}
        <aside style={{ position: 'sticky', top: 80, alignSelf: 'flex-start', height: 'fit-content' }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#888', marginBottom: 20 }}>Contents</div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {SECTIONS.map((s, i) => (
              <button key={s.num} onClick={() => scrollTo(i)} className="policy-nav-item"
                style={{
                  background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                  padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 12,
                  borderLeft: `2px solid ${activeSection === i ? PRIMARY : '#e8e8e8'}`,
                  transition: 'border-color 0.2s',
                }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: activeSection === i ? PRIMARY : '#ccc', transition: 'color 0.2s', flexShrink: 0 }}>{s.num}</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: activeSection === i ? '#111' : '#888', fontWeight: activeSection === i ? 500 : 400, transition: 'color 0.2s', lineHeight: 1.3 }}>{s.title}</span>
              </button>
            ))}
          </nav>

          {/* Trust badges */}
          <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {['🔒 SSL Encrypted', '✦ No Data Selling', '◎ GDPR Aligned'].map(badge => (
              <div key={badge} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#888', letterSpacing: '0.04em' }}>{badge}</div>
            ))}
          </div>
        </aside>

        {/* ── Policy Content ── */}
        <main>
          {SECTIONS.map((section, i) => (
            <div
              key={section.num}
              ref={el => (sectionRefs.current[i] = el)}
              style={{ marginBottom: 56, paddingTop: 8, scrollMarginTop: 90 }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 20 }}>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: PRIMARY, letterSpacing: '0.06em', flexShrink: 0 }}>{section.num}</span>
                <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, letterSpacing: '0.03em', color: '#111', lineHeight: 1 }}>{section.title}</h2>
              </div>
              <div style={{ borderTop: '1px solid #ebebeb', paddingTop: 20 }}>
                {section.content.split('\n\n').map((para, j) => (
                  <p key={j} style={{
                    fontFamily: para.startsWith('•') ? "'DM Sans', sans-serif" : "'Cormorant Garamond', serif",
                    fontSize: para.startsWith('•') ? 14 : 17,
                    fontWeight: 300,
                    color: para.startsWith('•') ? '#555' : '#444',
                    lineHeight: para.startsWith('•') ? 1.55 : 1.85,
                    marginBottom: 14,
                    paddingLeft: para.startsWith('•') ? 16 : 0,
                    borderLeft: para.startsWith('•') ? '2px solid #f0f0f0' : 'none',
                  }}>
                    {para}
                  </p>
                ))}
              </div>
            </div>
          ))}

          {/* Final CTA */}
          <div style={{ borderTop: '1px solid #ebebeb', paddingTop: 40, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 17, color: '#888' }}>
                Questions about this policy? We're happy to help.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <Link to="/contact" style={{
                display: 'inline-block', background: '#111', color: '#fff', padding: '12px 28px',
                fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: '0.12em',
                textTransform: 'uppercase', textDecoration: 'none', transition: 'background 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = PRIMARY}
                onMouseLeave={e => e.currentTarget.style.background = '#111'}>
                Contact Us →
              </Link>
              <Link to="/" style={{
                display: 'inline-block', background: 'transparent', color: '#111', padding: '11px 28px',
                fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: '0.12em',
                textTransform: 'uppercase', textDecoration: 'none', border: '1.5px solid #e0e0e0', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#111'; e.currentTarget.style.background = '#111'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#111'; }}>
                Back to Home
              </Link>
            </div>
          </div>
        </main>
      </div>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid #ebebeb', padding: '28px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafafa' }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#bbb', letterSpacing: '0.06em' }}>
          © {new Date().getFullYear()} ONE MAN Boutique. All rights reserved.
        </p>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 13, color: '#ccc' }}>
          A place for all your modern fashion needs.
        </p>
      </footer>
    </div>
  );
};

export default Policy;