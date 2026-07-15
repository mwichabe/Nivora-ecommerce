import React, { useState } from "react";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";
import { TbBrandMeta } from "react-icons/tb";
import { FiPhoneCall } from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE } from '../../config';

const PRIMARY = '#ea2e0e';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  .ft-root {
    background: #111;
    font-family: 'DM Sans', sans-serif;
    color: #fff;
  }

  /* ── Top band ── */
  .ft-top {
    border-bottom: 1px solid rgba(255,255,255,0.08);
    padding: 48px 32px 40px;
  }
  .ft-top-inner {
    max-width: 1320px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1.6fr 1fr 1fr 1fr;
    gap: 48px;
  }
  @media (max-width: 900px) {
    .ft-top-inner { grid-template-columns: 1fr 1fr; gap: 32px; }
  }
  @media (max-width: 560px) {
    .ft-top-inner { grid-template-columns: 1fr; }
    .ft-top { padding: 40px 20px 32px; }
  }

  /* ── Section label ── */
  .ft-label {
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.26em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.3);
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .ft-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.07);
  }

  /* ── Newsletter ── */
  .ft-newsletter-text {
    font-size: 13px;
    color: rgba(255,255,255,0.45);
    line-height: 1.65;
    margin-bottom: 20px;
  }
  .ft-input-row {
    display: flex;
    border: 1px solid rgba(255,255,255,0.12);
  }
  .ft-email-input {
    flex: 1;
    height: 44px;
    padding: 0 14px;
    background: rgba(255,255,255,0.05);
    border: none;
    outline: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: #fff;
    transition: background 0.15s;
    min-width: 0;
  }
  .ft-email-input::placeholder { color: rgba(255,255,255,0.25); }
  .ft-email-input:focus { background: rgba(255,255,255,0.08); }
  .ft-email-input:disabled { opacity: 0.5; cursor: not-allowed; }

  .ft-sub-btn {
    height: 44px;
    padding: 0 18px;
    background: ${PRIMARY};
    border: none;
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    cursor: pointer;
    white-space: nowrap;
    transition: opacity 0.15s;
    flex-shrink: 0;
  }
  .ft-sub-btn:hover:not(:disabled) { opacity: 0.85; }
  .ft-sub-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .ft-sub-msg {
    margin-top: 10px;
    font-size: 11.5px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .ft-sub-msg.success { color: #4ade80; }
  .ft-sub-msg.error   { color: #f87171; }

  /* ── Nav links ── */
  .ft-nav-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
  .ft-nav-link {
    font-size: 13px;
    color: rgba(255,255,255,0.5);
    text-decoration: none;
    transition: color 0.15s;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .ft-nav-link::before {
    content: '';
    display: inline-block;
    width: 12px; height: 1px;
    background: rgba(255,255,255,0.15);
    transition: width 0.18s, background 0.18s;
    flex-shrink: 0;
  }
  .ft-nav-link:hover { color: #fff; }
  .ft-nav-link:hover::before { width: 18px; background: ${PRIMARY}; }

  /* ── Social + contact ── */
  .ft-socials {
    display: flex;
    gap: 4px;
    margin-bottom: 24px;
  }
  .ft-social-btn {
    width: 34px; height: 34px;
    display: flex; align-items: center; justify-content: center;
    border: 1px solid rgba(255,255,255,0.1);
    background: transparent;
    color: rgba(255,255,255,0.45);
    cursor: pointer;
    text-decoration: none;
    transition: all 0.15s;
  }
  .ft-social-btn:hover { border-color: rgba(255,255,255,0.4); color: #fff; background: rgba(255,255,255,0.06); }

  .ft-phones { display: flex; flex-direction: column; gap: 8px; }
  .ft-phone-link {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: rgba(255,255,255,0.5);
    text-decoration: none;
    transition: color 0.15s;
  }
  .ft-phone-link:hover { color: #fff; }
  .ft-phone-icon {
    width: 26px; height: 26px;
    border: 1px solid rgba(255,255,255,0.1);
    display: flex; align-items: center; justify-content: center;
    color: ${PRIMARY};
    flex-shrink: 0;
    transition: border-color 0.15s;
  }
  .ft-phone-link:hover .ft-phone-icon { border-color: rgba(255,255,255,0.25); }

  /* ── Bottom bar ── */
  .ft-bottom {
    padding: 18px 32px;
    border-top: 1px solid rgba(255,255,255,0.06);
  }
  .ft-bottom-inner {
    max-width: 1320px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }
  .ft-wordmark {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 18px;
    letter-spacing: 0.1em;
    color: rgba(255,255,255,0.2);
    line-height: 1;
  }
  .ft-copyright {
    font-size: 10.5px;
    color: rgba(255,255,255,0.2);
    letter-spacing: 0.06em;
  }
  .ft-bottom-links {
    display: flex;
    gap: 20px;
  }
  .ft-bottom-link {
    font-size: 10.5px;
    color: rgba(255,255,255,0.2);
    text-decoration: none;
    letter-spacing: 0.06em;
    transition: color 0.15s;
  }
  .ft-bottom-link:hover { color: rgba(255,255,255,0.5); }

  @media (max-width: 560px) {
    .ft-bottom { padding: 16px 20px; }
    .ft-bottom-inner { justify-content: center; text-align: center; }
    .ft-bottom-links { justify-content: center; }
  }
`;

const Footer = () => {
  const [email, setEmail]       = useState('');
  const [message, setMessage]   = useState('');
  const [isError, setIsError]   = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); setIsError(false); setIsLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE}/subscribe`, { email });
      setMessage(data.message || 'You\'re subscribed!');
      setIsError(false);
      setEmail('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Subscription failed. Please try again.');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="ft-root">
      <style>{STYLES}</style>

      <div className="ft-top">
        <div className="ft-top-inner">

          {/* ── Newsletter ── */}
          <div>
            <div className="ft-label">Newsletter</div>
            <p className="ft-newsletter-text">
              Be the first to hear about new drops, exclusive events and offers from ONE MAN.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="ft-input-row">
                <input
                  type="email"
                  className="ft-email-input"
                  placeholder="Your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <button type="submit" className="ft-sub-btn" disabled={isLoading}>
                  {isLoading ? 'Wait…' : 'Subscribe'}
                </button>
              </div>
              {message && (
                <p className={`ft-sub-msg ${isError ? 'error' : 'success'}`}>
                  <span>{isError ? '✕' : '✓'}</span> {message}
                </p>
              )}
            </form>
          </div>

          {/* ── Shop links ── */}
          <div>
            <div className="ft-label">Shop</div>
            <ul className="ft-nav-list">
              {[
                { label: "Men's Wear",    to: '/category/men' },
                { label: "Women's Wear",  to: '/category/women' },
                { label: 'Top Wear',      to: '/category/top-wear' },
                { label: 'Bottom Wear',   to: '/category/bottom-wear' },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="ft-nav-link">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Support links ── */}
          <div>
            <div className="ft-label">Support</div>
            <ul className="ft-nav-list">
              {[
                { label: 'Contact Us', to: '/contact' },
                { label: 'About Us',   to: '/about' },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="ft-nav-link">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Follow + Call ── */}
          <div>
            <div className="ft-label">Follow Us</div>
            <div className="ft-socials">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="ft-social-btn" aria-label="Meta">
                <TbBrandMeta size={16} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="ft-social-btn" aria-label="Instagram">
                <IoLogoInstagram size={16} />
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="ft-social-btn" aria-label="X / Twitter">
                <RiTwitterXLine size={14} />
              </a>
            </div>

            <div className="ft-label">Call Us</div>
            <div className="ft-phones">
              {['+254 704 858 069', '+254 707 392 813'].map(num => (
                <a key={num} href={`tel:${num.replace(/\s/g, '')}`} className="ft-phone-link">
                  <span className="ft-phone-icon"><FiPhoneCall size={12} /></span>
                  {num}
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="ft-bottom">
        <div className="ft-bottom-inner">
          <span className="ft-wordmark">ONE MAN</span>
          <span className="ft-copyright">© {new Date().getFullYear()} ONE MAN BOUTIQUE. ALL RIGHTS RESERVED.</span>
          <div className="ft-bottom-links">
            <Link to="/privacy" className="ft-bottom-link">Privacy</Link>
            <Link to="/terms"   className="ft-bottom-link">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;