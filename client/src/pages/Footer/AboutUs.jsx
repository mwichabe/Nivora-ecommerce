import React, { useState, useEffect, useRef } from 'react';
import { Award, Zap, Heart } from 'lucide-react';
import founder1 from '../../assets/Collins.png';
import founder2 from '../../assets/keny.png';

const PRIMARY = '#ea2e0e';

/* ─── useInView ─── */
const useInView = () => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
};

const Reveal = ({ children, delay = 0, style = {} }) => {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(28px)',
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
};

const AboutUs = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#111' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* ── Hero Banner ── */}
      <section style={{ background: '#111', position: 'relative', overflow: 'hidden', padding: '80px 32px 72px' }}>
        {/* Grid */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }} />
        {/* Ghost text */}
        <div style={{ position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%)', fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(120px, 18vw, 220px)', color: 'rgba(255,255,255,0.03)', userSelect: 'none', letterSpacing: '0.04em', lineHeight: 1, zIndex: 0 }}>STORY</div>

        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: PRIMARY, marginBottom: 20, animation: 'fadeUp 0.6s ease both' }}>◆ Our Legacy</p>
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(56px, 8vw, 110px)',
            lineHeight: 0.9, letterSpacing: '0.02em', color: '#fff', marginBottom: 28,
            animation: 'fadeUp 0.7s ease 0.1s both', maxWidth: 800,
          }}>
            THE STORY BEHIND<br />
            <span style={{ color: PRIMARY }}>ONE MAN</span> BOUTIQUE
          </h1>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 18, fontStyle: 'italic', color: 'rgba(255,255,255,0.55)', maxWidth: 560, lineHeight: 1.75, animation: 'fadeUp 0.7s ease 0.2s both' }}>
            Founded on the principle of accessible, high-quality style — curating collections that embody modern sophistication and lasting value.
          </p>
        </div>
      </section>

      {/* ── Ticker ── */}
      <div style={{ background: PRIMARY, overflow: 'hidden', height: 36, display: 'flex', alignItems: 'center' }}>
        <style>{`@keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
        <div style={{ display: 'flex', animation: 'ticker 20s linear infinite', whiteSpace: 'nowrap' }}>
          {[...Array(4)].map((_, i) => (
            <span key={i} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.18em', color: '#fff', textTransform: 'uppercase', paddingRight: 80 }}>
              EST. 2025 &nbsp;·&nbsp; NAIROBI, KENYA &nbsp;·&nbsp; PREMIUM FASHION &nbsp;·&nbsp; CURATED WITH CARE &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ── Guiding Principles ── */}
      <section style={{ background: '#fafafa', borderTop: '1px solid #ebebeb', borderBottom: '1px solid #ebebeb', padding: '72px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <Reveal>
            <div style={{ marginBottom: 52 }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: PRIMARY, marginBottom: 12 }}>◆ What Drives Us</p>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(36px, 5vw, 64px)', letterSpacing: '0.02em', color: '#111', lineHeight: 1 }}>Guiding Principles</h2>
            </div>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 0 }}>
            {[
              { Icon: Zap,   title: 'Our Mission',        body: 'To provide men and women with expertly chosen apparel that blends comfort, durability, and contemporary trends without the high-end price tag.' },
              { Icon: Award, title: 'Quality Commitment', body: 'We believe in ethical sourcing and meticulous craftsmanship. Every item is inspected to ensure it meets our strict standards for excellence and longevity.' },
              { Icon: Heart, title: 'Customer Focus',     body: 'Our customers are the heart of the boutique. We strive to provide personalized service and a seamless shopping experience from start to finish.' },
            ].map(({ Icon, title, body }, i) => (
              <Reveal key={title} delay={i * 0.1}>
                <div style={{
                  padding: '44px 40px',
                  borderLeft: i > 0 ? '1px solid #e4e4e4' : 'none',
                  borderTop: `3px solid ${i === 0 ? PRIMARY : 'transparent'}`,
                  background: '#fff',
                  transition: 'border-top-color 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.borderTopColor = PRIMARY}
                  onMouseLeave={e => e.currentTarget.style.borderTopColor = i === 0 ? PRIMARY : 'transparent'}
                >
                  <div style={{ width: 44, height: 44, border: `1.5px solid ${PRIMARY}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                    <Icon size={20} color={PRIMARY} />
                  </div>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, letterSpacing: '0.04em', color: '#111', marginBottom: 14 }}>{title}</h3>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 16, color: '#666', lineHeight: 1.75 }}>{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Numbers bar ── */}
      <section style={{ background: '#111', padding: '52px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
          {[
            ['2025', 'Founded'],
            ['50+', 'Products'],
            ['0+',  'Members'],
            ['%',  'Satisfaction'],
          ].map(([val, lbl], i) => (
            <Reveal key={lbl} delay={i * 0.08}>
              <div style={{ padding: '24px 32px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 44, color: '#fff', letterSpacing: '0.04em', lineHeight: 1 }}>{val}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 6 }}>{lbl}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Meet the Founders ── */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 32px' }}>
        <Reveal>
          <div style={{ marginBottom: 56 }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: PRIMARY, marginBottom: 12 }}>◆ The People</p>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(36px, 5vw, 64px)', letterSpacing: '0.02em', color: '#111', lineHeight: 1 }}>Meet the Founders</h2>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {[
            { img: founder1, name: 'Collins Mwichabe', role: 'Co-Founder & Visionary', quote: '"My passion is to create a seamless bridge between timeless elegance and modern functionality, ensuring every piece empowers our customers."' },
            { img: founder2, name: 'Keny Mateka',      role: 'Co-Founder & Head of Operations', quote: '"Bringing our vision to life requires meticulous attention to detail, from sourcing to delivery, ensuring every customer experience is exceptional."' },
          ].map(({ img, name, role, quote }, i) => (
            <Reveal key={name} delay={i * 0.12}>
              <div style={{ border: '1px solid #ebebeb', overflow: 'hidden', background: '#fff', transition: 'border-color 0.2s', cursor: 'default' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#111'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#ebebeb'}
              >
                {/* Photo */}
                <div style={{ aspectRatio: '4/3', overflow: 'hidden', background: '#f5f4f2', position: 'relative' }}>
                  <img src={img} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', transition: 'transform 0.5s ease', display: 'block' }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                  />
                  {/* Role badge */}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, background: PRIMARY, padding: '6px 14px' }}>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#fff' }}>{role}</span>
                  </div>
                </div>

                {/* Info */}
                <div style={{ padding: '28px 28px 32px' }}>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 30, letterSpacing: '0.03em', color: '#111', marginBottom: 16 }}>{name}</h3>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 300, fontSize: 16, color: '#666', lineHeight: 1.75 }}>{quote}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <Reveal>
        <section style={{ borderTop: '1px solid #ebebeb', padding: '64px 32px', textAlign: 'center', background: '#fafafa' }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: PRIMARY, marginBottom: 16 }}>◆ Join Us</p>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(36px, 5vw, 60px)', letterSpacing: '0.02em', color: '#111', marginBottom: 12 }}>Be Part of the Story</h2>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 17, color: '#888', marginBottom: 32 }}>
            Discover collections curated with intention, worn with confidence.
          </p>
          <a href="/signup" style={{
            display: 'inline-block', background: '#111', color: '#fff',
            padding: '14px 40px', fontFamily: "'DM Sans', sans-serif",
            fontSize: 12, fontWeight: 500, letterSpacing: '0.12em',
            textTransform: 'uppercase', textDecoration: 'none', transition: 'background 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = PRIMARY}
            onMouseLeave={e => e.currentTarget.style.background = '#111'}>
            Shop the Collection →
          </a>
        </section>
      </Reveal>
    </div>
  );
};

export default AboutUs;