import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import logo from '../assets/logo.png';

const PRIMARY = '#ea2e0e';
const API_URL = 'https://one-man-server.onrender.com/api/users';

/* ─── Subtle grid background ─── */
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

/* ─── Password strength meter ─── */
const getStrength = (pw) => {
  if (!pw) return { score: 0, label: '', color: '#e0e0e0' };
  let score = 0;
  if (pw.length >= 8)              score++;
  if (/[A-Z]/.test(pw))           score++;
  if (/[0-9]/.test(pw))           score++;
  if (/[^A-Za-z0-9]/.test(pw))   score++;
  const map = [
    { label: '',         color: '#e0e0e0' },
    { label: 'Weak',     color: PRIMARY },
    { label: 'Fair',     color: '#f59e0b' },
    { label: 'Good',     color: '#3b82f6' },
    { label: 'Strong',   color: '#22c55e' },
  ];
  return { score, ...map[score] };
};

/* ─── Step indicator ─── */
const StepDot = ({ active, done, num }) => (
  <div style={{
    width: 28, height: 28, borderRadius: '50%',
    background: done ? '#111' : active ? PRIMARY : 'transparent',
    border: done ? '2px solid #111' : active ? `2px solid ${PRIMARY}` : '2px solid #e0e0e0',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.3s',
    flexShrink: 0,
  }}>
    {done
      ? <span style={{ color: '#fff', fontSize: 12 }}>✓</span>
      : <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, color: active ? '#fff' : '#ccc' }}>{num}</span>
    }
  </div>
);

const SignUp = () => {
  const [step, setStep]                   = useState(1); // 1 = personal, 2 = security
  const [username, setUsername]           = useState('');
  const [email, setEmail]                 = useState('');
  const [phone, setPhone]                 = useState('');
  const [password, setPassword]           = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass]           = useState(false);
  const [showConfirm, setShowConfirm]     = useState(false);
  const [error, setError]                 = useState(null);
  const [isLoading, setIsLoading]         = useState(false);
  const [focused, setFocused]             = useState(null);
  const [mounted, setMounted]             = useState(false);

  const navigate = useNavigate();
  const { checkAuthStatus } = useAuth();

  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

  const strength = getStrength(password);
  const passwordsMatch = confirmPassword && password === confirmPassword;
  const passwordsMismatch = confirmPassword && password !== confirmPassword;

  const handleStep1 = (e) => {
    e.preventDefault();
    setError(null);
    if (!username.trim() || !email.trim() || !phone.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }
    if (strength.score < 2) {
      setError('Please choose a stronger password.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: username, email, phone, password }),
      });
      const data = await response.json();

      if (response.ok) {
        await checkAuthStatus();
        navigate('/login');
      } else {
        setError(data.message || 'Registration failed. Please try a different email.');
      }
    } catch {
      setError('Could not connect to the server. Please check your connection.');
    } finally {
      setIsLoading(false);
      setPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#fafafa', fontFamily: "'Cormorant Garamond', Georgia, serif", position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeUp  { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(16px); } to { opacity: 1; transform: translateX(0); } }
        .field-input {
          width: 100%; padding: 13px 16px; border: 1.5px solid #e0e0e0; background: #fff;
          font-family: 'DM Sans', sans-serif; font-size: 14px; color: #111; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s; appearance: none; border-radius: 0;
        }
        .field-input:focus  { border-color: #111; box-shadow: 0 0 0 3px rgba(0,0,0,0.04); }
        .field-input.valid  { border-color: #22c55e; }
        .field-input.error  { border-color: ${PRIMARY}; }
        .field-input::placeholder { color: #ccc; }
        .submit-btn {
          width: 100%; padding: 15px; background: #111; border: none; color: #fff;
          font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500;
          letter-spacing: 0.14em; text-transform: uppercase; cursor: pointer;
          transition: background 0.2s, transform 0.12s; border-radius: 0;
        }
        .submit-btn:hover:not(:disabled)  { background: ${PRIMARY}; transform: translateY(-1px); }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled              { background: #ccc; cursor: not-allowed; }
        .eye-btn { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #bbb; font-size: 13px; padding: 4px; transition: color 0.15s; }
        .eye-btn:hover { color: #111; }
      `}</style>

      {/* ══ LEFT PANEL — branding ══ */}
      <div style={{
        width: '44%', background: '#111', position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '48px 52px',
        opacity: mounted ? 1 : 0, transform: mounted ? 'translateX(0)' : 'translateX(-20px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
      }}>
        {/* Grid */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }} />

        {/* Logo */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 3, overflow: 'hidden', border: '1.5px solid rgba(255,255,255,0.15)' }}>
              <img src={logo} alt="ONE MAN" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => { e.target.src = 'https://placehold.co/36x36/ea2e0e/ffffff?text=1M'; }} />
            </div>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: '0.14em', color: '#fff' }}>ONE MAN</span>
          </div>
        </div>

        {/* Headline */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: PRIMARY, marginBottom: 20 }}>◆ Join the Community</p>
          <h2 style={{
            fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(52px, 5vw, 84px)',
            lineHeight: 0.9, letterSpacing: '0.02em', color: '#fff', marginBottom: 28,
          }}>
            DEFINE<br />
            YOUR<br />
            <span style={{ color: PRIMARY }}>STYLE.</span>
          </h2>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 16, fontStyle: 'italic', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: 280 }}>
            Join thousands of members who've discovered their signature look with ONE MAN.
          </p>
        </div>

        {/* Benefits list */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              ['✦', 'Exclusive member-only drops'],
              ['⚡', 'Early access to new arrivals'],
              ['◎', 'Personalised recommendations'],
            ].map(([icon, text]) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ color: PRIMARY, fontSize: 12, flexShrink: 0, width: 16 }}>{icon}</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.02em' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ghost text */}
        <div style={{
          position: 'absolute', bottom: -24, right: -16, zIndex: 0,
          fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(90px, 11vw, 150px)',
          color: 'rgba(255,255,255,0.03)', letterSpacing: '0.04em', userSelect: 'none', lineHeight: 1,
        }}>JOIN</div>
      </div>

      {/* ══ RIGHT PANEL — form ══ */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 32px',
        position: 'relative', overflowY: 'auto',
        opacity: mounted ? 1 : 0, transform: mounted ? 'translateX(0)' : 'translateX(20px)',
        transition: 'opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s',
      }}>
        <GridBackground />
        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 420 }}>

          {/* Header */}
          <div style={{ marginBottom: 36 }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: PRIMARY, marginBottom: 12 }}>◆ New Account</p>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 40, letterSpacing: '0.04em', color: '#111', lineHeight: 1, marginBottom: 8 }}>
              Create Account
            </h1>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontStyle: 'italic', color: '#888' }}>
              Start your journey with ONE MAN
            </p>
          </div>

          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 32 }}>
            <StepDot num={1} active={step === 1} done={step > 1} />
            <div style={{ flex: 1, height: 2, background: step > 1 ? '#111' : '#e0e0e0', transition: 'background 0.4s', margin: '0 8px' }} />
            <StepDot num={2} active={step === 2} done={false} />
            <div style={{ marginLeft: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#888', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Step {step} of 2 — {step === 1 ? 'Your Info' : 'Security'}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: '#fff5f5', border: `1.5px solid ${PRIMARY}`, padding: '12px 16px',
              marginBottom: 24, display: 'flex', alignItems: 'flex-start', gap: 10,
              animation: 'fadeUp 0.3s ease both',
            }}>
              <span style={{ color: PRIMARY, fontSize: 16, flexShrink: 0 }}>✕</span>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#b91c1c', lineHeight: 1.4 }}>{error}</p>
            </div>
          )}

          {/* ── STEP 1: Personal Info ── */}
          {step === 1 && (
            <form onSubmit={handleStep1} style={{ animation: 'slideIn 0.3s ease both' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                {/* Full Name */}
                <div>
                  <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: focused === 'name' ? '#111' : '#999', display: 'block', marginBottom: 8, transition: 'color 0.2s' }}>Full Name</label>
                  <input
                    type="text" autoComplete="name" required
                    value={username} onChange={e => setUsername(e.target.value)}
                    onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
                    placeholder="John Doe"
                    className={`field-input ${username.trim().length > 1 ? 'valid' : ''}`}
                  />
                </div>

                {/* Email */}
                <div>
                  <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: focused === 'email' ? '#111' : '#999', display: 'block', marginBottom: 8, transition: 'color 0.2s' }}>Email Address</label>
                  <input
                    type="email" autoComplete="email" required
                    value={email} onChange={e => setEmail(e.target.value)}
                    onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                    placeholder="you@example.com"
                    className={`field-input ${email.includes('@') && email.includes('.') ? 'valid' : ''}`}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: focused === 'phone' ? '#111' : '#999', display: 'block', marginBottom: 8, transition: 'color 0.2s' }}>Phone Number</label>
                  <input
                    type="tel" required
                    value={phone} onChange={e => setPhone(e.target.value)}
                    onFocus={() => setFocused('phone')} onBlur={() => setFocused(null)}
                    placeholder="+254 700 000 000"
                    className={`field-input ${phone.length > 9 ? 'valid' : ''}`}
                  />
                </div>
              </div>

              <div style={{ marginTop: 28 }}>
                <button type="submit" className="submit-btn">
                  Continue →
                </button>
              </div>
            </form>
          )}

          {/* ── STEP 2: Security ── */}
          {step === 2 && (
            <form onSubmit={handleSubmit} style={{ animation: 'slideIn 0.3s ease both' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                {/* Password */}
                <div>
                  <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: focused === 'password' ? '#111' : '#999', display: 'block', marginBottom: 8, transition: 'color 0.2s' }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPass ? 'text' : 'password'} autoComplete="new-password" required
                      value={password} onChange={e => setPassword(e.target.value)}
                      onFocus={() => setFocused('password')} onBlur={() => setFocused(null)}
                      placeholder="••••••••" className="field-input"
                      style={{ paddingRight: 48 }}
                    />
                    <button type="button" className="eye-btn" onClick={() => setShowPass(v => !v)} tabIndex={-1}>
                      {showPass ? '◯' : '●'}
                    </button>
                  </div>

                  {/* Strength meter */}
                  {password && (
                    <div style={{ marginTop: 10 }}>
                      <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
                        {[1,2,3,4].map(i => (
                          <div key={i} style={{
                            flex: 1, height: 3,
                            background: i <= strength.score ? strength.color : '#e0e0e0',
                            transition: 'background 0.3s',
                          }} />
                        ))}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: strength.color, fontWeight: 500 }}>{strength.label}</span>
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: '#ccc' }}>Use A-Z, 0-9, symbols</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: focused === 'confirm' ? '#111' : '#999', display: 'block', marginBottom: 8, transition: 'color 0.2s' }}>Confirm Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showConfirm ? 'text' : 'password'} autoComplete="new-password" required
                      value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                      onFocus={() => setFocused('confirm')} onBlur={() => setFocused(null)}
                      placeholder="••••••••"
                      className={`field-input ${passwordsMatch ? 'valid' : ''} ${passwordsMismatch ? 'error' : ''}`}
                      style={{ paddingRight: 48 }}
                    />
                    <button type="button" className="eye-btn" onClick={() => setShowConfirm(v => !v)} tabIndex={-1}>
                      {showConfirm ? '◯' : '●'}
                    </button>
                  </div>
                  {passwordsMismatch && (
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: PRIMARY, marginTop: 6 }}>Passwords do not match</p>
                  )}
                  {passwordsMatch && (
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#22c55e', marginTop: 6 }}>✓ Passwords match</p>
                  )}
                </div>
              </div>

              {/* Summary of step 1 */}
              <div style={{ margin: '24px 0', padding: '14px 16px', background: '#f9f9f9', border: '1px solid #ebebeb' }}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#888', marginBottom: 8 }}>Registering as</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#111', fontWeight: 500 }}>{username}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#888', marginTop: 2 }}>{email} · {phone}</div>
                <button type="button" onClick={() => setStep(1)}
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: PRIMARY, background: 'none', border: 'none', padding: 0, marginTop: 8, cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  ← Edit Info
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button type="submit" disabled={isLoading || passwordsMismatch} className="submit-btn">
                  {isLoading ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                      <span style={{ width: 14, height: 14, border: '1.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                      Creating Account
                    </span>
                  ) : 'Create Account →'}
                </button>
              </div>
            </form>
          )}

          {/* Divider + sign in link */}
          <div style={{ marginTop: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <div style={{ flex: 1, height: 1, background: '#e8e8e8' }} />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#ccc', letterSpacing: '0.08em' }}>OR</span>
              <div style={{ flex: 1, height: 1, background: '#e8e8e8' }} />
            </div>
            <Link to="/login" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '13px', border: '1.5px solid #e0e0e0', background: 'transparent',
              fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500,
              letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none',
              color: '#111', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#111'; e.currentTarget.style.background = '#111'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#111'; }}>
              Already have an account? Sign In
              <HiOutlineArrowNarrowRight size={14} />
            </Link>
          </div>

          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#bbb', textAlign: 'center', marginTop: 28, lineHeight: 1.6 }}>
            By signing up you agree to our{' '}
            <Link to="/policy" style={{ color: '#888', textDecoration: 'underline' }}>Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;