import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import logo from '../assets/logo.png';

const PRIMARY = '#ea2e0e';

/* ─── Tiny animated background grid ─── */
const GridBackground = () => (
  <div style={{
    position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0,
    backgroundImage: `
      linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)
    `,
    backgroundSize: '48px 48px',
  }} />
);

/* ─── Animated counter for the stat numbers ─── */
const AnimatedStat = ({ target, suffix = '' }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseInt(target);
    const dur = 1800;
    const step = (end / dur) * 16;
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setVal(end); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <>{val.toLocaleString()}{suffix}</>;
};

const Login = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [focused, setFocused]   = useState(null); // 'email' | 'password'
  const [mounted, setMounted]   = useState(false);

  const navigate = useNavigate();
  const { login, isLoggedIn, user, authLoading } = useAuth();

  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        result.user?.isAdmin === true ? navigate('/admin') : navigate('/app');
      } else {
        setError(result.message);
      }
    } catch {
      setError('Could not connect to the server. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Auth loading ── */
  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: `2px solid #e0e0e0`, borderTopColor: PRIMARY, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Checking credentials</p>
        </div>
      </div>
    );
  }

  /* ── Already logged in as admin ── */
  if (isLoggedIn && user?.isAdmin) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', position: 'relative', overflow: 'hidden' }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400;500&display=swap');
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
        <GridBackground />
        <div style={{ position: 'relative', zIndex: 1, background: '#fff', border: '1px solid #e8e8e8', padding: '56px 48px', maxWidth: 440, width: '100%', textAlign: 'center', animation: 'fadeUp 0.6s ease both' }}>
          <div style={{ width: 64, height: 64, borderRadius: 4, overflow: 'hidden', margin: '0 auto 24px', border: `2px solid ${PRIMARY}` }}>
            <img src={logo} alt="ONE MAN" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.src = `https://placehold.co/64x64/${PRIMARY.replace('#','')}/ffffff?text=1M`; }} />
          </div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: PRIMARY, marginBottom: 12 }}>◆ Admin Access</p>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, letterSpacing: '0.04em', color: '#111', marginBottom: 8 }}>
            Welcome Back, {user?.name?.split(' ')[0]}
          </h2>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 16, color: '#888', marginBottom: 36 }}>
            You have full administrative access.
          </p>
          <Link to="/admin" style={{
            display: 'block', background: PRIMARY, color: '#fff', padding: '14px 32px',
            fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500, letterSpacing: '0.1em',
            textTransform: 'uppercase', textDecoration: 'none', transition: 'background 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#c72409'}
            onMouseLeave={e => e.currentTarget.style.background = PRIMARY}>
            Go to Dashboard →
          </Link>
        </div>
      </div>
    );
  }

  /* ── Main login form ── */
  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#fafafa', fontFamily: "'Cormorant Garamond', Georgia, serif", position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideLeft { from { opacity: 0; transform: translateX(32px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideRight { from { opacity: 0; transform: translateX(-32px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes pulse-dot { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
        .field-input { width: 100%; padding: 14px 16px; border: 1.5px solid #e0e0e0; background: #fff; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #111; outline: none; transition: border-color 0.2s, box-shadow 0.2s; appearance: none; border-radius: 0; }
        .field-input:focus { border-color: #111; box-shadow: 0 0 0 3px rgba(0,0,0,0.04); }
        .field-input.error { border-color: ${PRIMARY}; }
        .field-input::placeholder { color: #ccc; }
        .submit-btn { width: 100%; padding: 15px; background: #111; border: none; color: #fff; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; cursor: pointer; transition: background 0.2s, transform 0.12s; position: relative; overflow: hidden; }
        .submit-btn:hover:not(:disabled) { background: ${PRIMARY}; transform: translateY(-1px); }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { background: #ccc; cursor: not-allowed; }
        .eye-btn { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #bbb; font-size: 13px; padding: 4px; transition: color 0.15s; font-family: 'DM Sans', sans-serif; }
        .eye-btn:hover { color: #111; }
      `}</style>

      {/* ══ LEFT PANEL — branding ══ */}
      <div style={{
        width: '44%', background: '#111', position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '48px 52px',
        opacity: mounted ? 1 : 0, transform: mounted ? 'translateX(0)' : 'translateX(-20px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
      }}>
        {/* Subtle grid on dark */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }} />

        {/* Top — logo */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 3, overflow: 'hidden', border: `1.5px solid rgba(255,255,255,0.15)` }}>
              <img src={logo} alt="ONE MAN" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => { e.target.src = `https://placehold.co/36x36/ea2e0e/ffffff?text=1M`; }} />
            </div>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: '0.14em', color: '#fff' }}>ONE MAN</span>
          </div>
        </div>

        {/* Mid — big editorial headline */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: PRIMARY, marginBottom: 20 }}>◆ Member Access</p>
          <h2 style={{
            fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(56px, 5.5vw, 88px)',
            lineHeight: 0.9, letterSpacing: '0.02em', color: '#fff', marginBottom: 28,
          }}>
            YOUR<br />
            STYLE<br />
            <span style={{ color: PRIMARY }}>AWAITS.</span>
          </h2>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 16, fontStyle: 'italic', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: 280 }}>
            Sign in to access your curated collection and exclusive member benefits.
          </p>
        </div>

        {/* Bottom — stats */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 28, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {[
              { value: '0+', suffix: '+', label: 'Members' },
              { value: '50+',  suffix: '+', label: 'Products' },
              { value: '50',   suffix: '%', label: 'Satisfied' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#fff', letterSpacing: '0.04em', lineHeight: 1 }}>
                  <AnimatedStat target={s.value} suffix={s.suffix} />
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Oversized ghost text */}
        <div style={{
          position: 'absolute', bottom: -20, right: -20, zIndex: 0,
          fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(100px, 12vw, 160px)',
          color: 'rgba(255,255,255,0.03)', letterSpacing: '0.04em', userSelect: 'none', lineHeight: 1,
        }}>ONE</div>
      </div>

      {/* ══ RIGHT PANEL — form ══ */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 32px',
        position: 'relative',
        opacity: mounted ? 1 : 0, transform: mounted ? 'translateX(0)' : 'translateX(20px)',
        transition: 'opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s',
      }}>
        <GridBackground />
        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 420 }}>

          {/* Mobile logo (hidden on desktop via the left panel) */}
          <div style={{ marginBottom: 40 }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: PRIMARY, marginBottom: 12 }}>◆ Welcome back</p>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 40, letterSpacing: '0.04em', color: '#111', lineHeight: 1, marginBottom: 8 }}>
              Sign In
            </h1>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontStyle: 'italic', color: '#888' }}>
              Enter your credentials to continue
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div style={{
              background: '#fff5f5', border: `1.5px solid ${PRIMARY}`, padding: '12px 16px',
              marginBottom: 24, display: 'flex', alignItems: 'flex-start', gap: 10,
              animation: 'fadeUp 0.3s ease both',
            }}>
              <span style={{ color: PRIMARY, fontSize: 16, flexShrink: 0, marginTop: 1 }}>✕</span>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#b91c1c', lineHeight: 1.4 }}>{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

            {/* Email field */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: focused === 'email' ? '#111' : '#999', display: 'block', marginBottom: 8, transition: 'color 0.2s' }}>
                Email Address
              </label>
              <input
                type="email" autoComplete="email" required
                value={email} onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
                placeholder="you@example.com"
                className={`field-input ${error ? 'error' : ''}`}
              />
            </div>

            {/* Password field */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: focused === 'password' ? '#111' : '#999', transition: 'color 0.2s' }}>
                  Password
                </label>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password" required
                  value={password} onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  placeholder="••••••••"
                  className={`field-input ${error ? 'error' : ''}`}
                  style={{ paddingRight: 48 }}
                />
                <button type="button" className="eye-btn" onClick={() => setShowPass(v => !v)} tabIndex={-1}>
                  {showPass ? '◯' : '●'}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={isLoading} className="submit-btn" style={{ marginBottom: 24 }}>
              {isLoading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  <span style={{ width: 14, height: 14, border: '1.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                  Authenticating
                </span>
              ) : 'Sign In →'}
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <div style={{ flex: 1, height: 1, background: '#e8e8e8' }} />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#ccc', letterSpacing: '0.08em' }}>OR</span>
              <div style={{ flex: 1, height: 1, background: '#e8e8e8' }} />
            </div>

            {/* Sign up link */}
            <Link to="/signup" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '14px', border: '1.5px solid #e0e0e0', background: 'transparent',
              fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500,
              letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none',
              color: '#111', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#111'; e.currentTarget.style.background = '#111'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#111'; }}>
              Create an Account
              <HiOutlineArrowNarrowRight size={15} />
            </Link>
          </form>

          {/* Footer note */}
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#bbb', textAlign: 'center', marginTop: 36, lineHeight: 1.6 }}>
            By signing in you agree to our{' '}
            <Link to="/policy" style={{ color: '#888', textDecoration: 'underline' }}>Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;