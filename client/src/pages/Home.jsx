import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Layout/Hero';
import GenderCollectionSection from '../components/Products/GenderCollectionSection';
import NewArrivals from '../components/Products/NewArrivals';
import ProductDetail from '../components/Products/ProductDetail';

const PRIMARY = '#ea2e0e';

/* ─── Section Divider ─── */
const SectionLabel = ({ eyebrow, title, subtitle, align = 'left' }) => (
  <div style={{ textAlign: align, marginBottom: 48 }}>
    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: PRIMARY, marginBottom: 12 }}>◆ {eyebrow}</p>
    <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(36px, 5vw, 64px)', letterSpacing: '0.02em', lineHeight: 1, color: '#111', marginBottom: subtitle ? 12 : 0 }}>{title}</h2>
    {subtitle && <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 300, fontSize: 17, color: '#888', maxWidth: 520, margin: align === 'center' ? '0 auto' : 0, lineHeight: 1.7 }}>{subtitle}</p>}
  </div>
);

const Home = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>

      {/* ── 1. Hero ── */}
      <Hero />

      {/* ── 2. Gender Collections ── */}
      <GenderCollectionSection />

      {/* ── 3. Feature Strip ── */}
      <div style={{ background: '#111', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {[
            ['✦', 'Premium Quality', 'Handpicked from top designers'],
            ['⚡', 'Fast Shipping', 'Countrywide delivery, tracked'],
            ['⚿', 'Secure Payments', '256-bit SSL encryption'],
            ['◎', 'Easy Returns', '24/7 support & hassle-free returns'],
          ].map(([icon, title, desc], i) => (
            <div key={title} style={{ padding: '28px 32px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: PRIMARY, marginBottom: 8, letterSpacing: '0.06em' }}>{icon} {title}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. New Arrivals ── */}
      <NewArrivals />

      {/* ── 5. Best Seller / Product Detail ── */}
      <section style={{ borderTop: '1px solid #ebebeb', padding: '72px 32px', background: '#fff' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <SectionLabel
            eyebrow="Trending Now"
            title="Best Seller"
            subtitle="Our most-loved piece, selected by the community."
            align="center"
          />
          <ProductDetail />
        </div>
      </section>

      {/* ── 6. Editorial CTA Banner ── */}
      <section style={{ background: '#111', padding: '80px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(100px, 18vw, 250px)', color: 'rgba(255,255,255,0.03)', whiteSpace: 'nowrap', userSelect: 'none', letterSpacing: '0.04em', lineHeight: 1 }}>STYLE</div>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 580, margin: '0 auto' }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: PRIMARY, marginBottom: 20 }}>◆ The ONE MAN Way</p>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(48px, 7vw, 88px)', color: '#fff', letterSpacing: '0.02em', lineHeight: 0.95, marginBottom: 20 }}>
            FASHION IS<br />A LANGUAGE
          </h2>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontStyle: 'italic', fontSize: 18, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: 36 }}>
            Every garment tells a story. Every choice defines you.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/shop" style={{ display: 'inline-block', background: PRIMARY, color: '#fff', padding: '14px 36px', fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#c72409'} onMouseLeave={e => e.currentTarget.style.background = PRIMARY}>
              Shop the Collection →
            </Link>
            <Link to="/signup" style={{ display: 'inline-block', background: 'transparent', color: '#fff', padding: '13px 36px', fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.35)', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; e.currentTarget.style.background = 'transparent'; }}>
              Join the Community
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;