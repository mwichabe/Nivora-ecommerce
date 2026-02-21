import React, { useState, useEffect } from "react";
import heroImg from "../../assets/hero.png";
import { Link } from "react-router-dom";

const Hero = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, []);

  return (
    <section style={{ position: 'relative', overflow: 'hidden', background: '#111' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;1,300&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes heroFade { from { opacity: 0; transform: scale(1.04); } to { opacity: 1; transform: scale(1); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .hero-shop-btn { display: inline-block; background: #fff; color: #111; padding: 14px 40px; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; text-decoration: none; transition: background 0.2s, color 0.2s, transform 0.15s; }
        .hero-shop-btn:hover { background: #ea2e0e; color: #fff; transform: translateY(-1px); }
        .hero-outline-btn { display: inline-block; background: transparent; color: #fff; padding: 13px 40px; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; text-decoration: none; border: 1.5px solid rgba(255,255,255,0.5); transition: all 0.2s; }
        .hero-outline-btn:hover { border-color: #fff; background: rgba(255,255,255,0.08); }
      `}</style>

      {/* Background image */}
      <div style={{ position: 'relative', height: 'clamp(480px, 90vh, 820px)', overflow: 'hidden' }}>
        <img
          src={heroImg}
          alt="ONE MAN — Vacation Ready"
          style={{
            width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top',
            display: 'block', animation: 'heroFade 1.2s ease both',
          }}
        />

        {/* Dark overlay — stronger at bottom for text legibility */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.82) 100%)',
        }} />

        {/* Subtle grid texture */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }} />

        {/* Content */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, display: 'flex', alignItems: 'flex-end', padding: 'clamp(32px, 6vw, 80px)' }}>
          <div style={{ maxWidth: 720 }}>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.22em',
              textTransform: 'uppercase', color: '#ea2e0e', marginBottom: 16,
              opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s',
            }}>◆ SS 2025 Collection</p>

            <h1 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(72px, 12vw, 148px)',
              lineHeight: 0.88, letterSpacing: '0.02em', color: '#fff',
              marginBottom: 24,
              opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s',
            }}>
              VACATION<br />
              <span style={{ color: '#ea2e0e' }}>READY</span>
            </h1>

            <p style={{
              fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 300,
              fontSize: 'clamp(15px, 2vw, 19px)', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7,
              maxWidth: 440, marginBottom: 36,
              opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.8s ease 0.45s, transform 0.8s ease 0.45s',
            }}>
              Explore our vacation-ready outfits with fast, countrywide shipping.
            </p>

            <div style={{
              display: 'flex', gap: 14, flexWrap: 'wrap',
              opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.7s ease 0.55s, transform 0.7s ease 0.55s',
            }}>
              <Link to="/shop" className="hero-shop-btn">Shop Now →</Link>
              <Link to="#" className="hero-outline-btn">New Arrivals</Link>
            </div>
          </div>
        </div>

        {/* Corner accent */}
        <div style={{ position: 'absolute', top: 24, right: 24, zIndex: 3, textAlign: 'right' }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 11, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>ONE MAN BOUTIQUE</div>
        </div>
      </div>

      {/* Ticker below hero */}
      <div style={{ background: '#ea2e0e', overflow: 'hidden', height: 36, display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', animation: 'ticker 22s linear infinite', whiteSpace: 'nowrap' }}>
          {[...Array(4)].map((_, i) => (
            <span key={i} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.18em', color: '#fff', textTransform: 'uppercase', paddingRight: 80 }}>
              FAST SHIPPING COUNTRYWIDE &nbsp;·&nbsp; NEW ARRIVALS WEEKLY &nbsp;·&nbsp; PREMIUM QUALITY &nbsp;·&nbsp; FAST DELIVERY &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;