import React from "react";
import { Link } from "react-router-dom";
import mensCollectionImage from "../../assets/men.png";
import womensCollectionImage from "../../assets/women.png";

const PRIMARY = '#ea2e0e';

const GenderCollectionSection = () => {
  return (
    <section style={{ padding: '72px 32px', background: '#fff', fontFamily: "'Cormorant Garamond', serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300&family=DM+Sans:wght@300;400;500&display=swap');
        .gender-card { position: relative; overflow: hidden; }
        .gender-card img { transition: transform 0.6s ease; display: block; width: 100%; }
        .gender-card:hover img { transform: scale(1.04); }
        .gender-shop-link { display: inline-flex; align-items: center; gap: 6px; font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: #111; text-decoration: none; border-bottom: 1px solid #111; padding-bottom: 2px; transition: color 0.2s, border-color 0.2s; }
        .gender-shop-link:hover { color: ${PRIMARY}; border-color: ${PRIMARY}; }
      `}</style>

      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Section header */}
        <div style={{ marginBottom: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: PRIMARY, marginBottom: 10 }}>◆ Shop By Category</p>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(36px, 5vw, 60px)', letterSpacing: '0.02em', lineHeight: 1, color: '#111' }}>Collections</h2>
          </div>
          <Link to="/shop" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', textDecoration: 'none', borderBottom: '1px solid #ccc', paddingBottom: 2, transition: 'color 0.2s, border-color 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#111'; e.currentTarget.style.borderColor = '#111'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#888'; e.currentTarget.style.borderColor = '#ccc'; }}>
            View All →
          </Link>
        </div>

        {/* Two-column grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

          {/* Women's */}
          <div className="gender-card">
            <div style={{ aspectRatio: '3/4', overflow: 'hidden', background: '#f5f4f2' }}>
              <img src={womensCollectionImage} alt="Women's Collection" style={{ height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
            </div>
            {/* Overlay info bar */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(255,255,255,0.96)', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `2px solid ${PRIMARY}` }}>
              <div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#888', marginBottom: 4 }}>Category</div>
                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, letterSpacing: '0.04em', color: '#111', lineHeight: 1 }}>Women's Collection</h3>
              </div>
              <Link to="/category/women" className="gender-shop-link">Shop →</Link>
            </div>

            {/* Top-left label badge */}
            <div style={{ position: 'absolute', top: 16, left: 16, background: '#111', padding: '6px 12px' }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff' }}>Women</span>
            </div>
          </div>

          {/* Men's */}
          <div className="gender-card">
            <div style={{ aspectRatio: '3/4', overflow: 'hidden', background: '#f0efed' }}>
              <img src={mensCollectionImage} alt="Men's Collection" style={{ height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
            </div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(255,255,255,0.96)', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `2px solid ${PRIMARY}` }}>
              <div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#888', marginBottom: 4 }}>Category</div>
                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, letterSpacing: '0.04em', color: '#111', lineHeight: 1 }}>Men's Collection</h3>
              </div>
              <Link to="/category/men" className="gender-shop-link">Shop →</Link>
            </div>

            <div style={{ position: 'absolute', top: 16, left: 16, background: '#111', padding: '6px 12px' }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff' }}>Men</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GenderCollectionSection;