import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FiMail, FiUser, FiMessageSquare, FiPhoneCall } from 'react-icons/fi';
import { FaMapMarkerAlt } from 'react-icons/fa';

const PRIMARY = '#ea2e0e';
const CONTACT_API_URL = 'https://one-man-server.onrender.com/api/contact';

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading]   = useState(false);
  const [status, setStatus]     = useState({ message: '', type: '' });
  const [focused, setFocused]   = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ message: '', type: '' });
    try {
      const response = await axios.post(CONTACT_API_URL, formData);
      setStatus({ message: response.data.message || 'Message sent successfully! We\'ll be in touch soon.', type: 'success' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setStatus({ message: error.response?.data?.message || 'Failed to send message. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
      setTimeout(() => setStatus({ message: '', type: '' }), 5000);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#111' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .field-input {
          width: 100%; padding: 13px 16px; border: 1.5px solid #e0e0e0; background: #fff;
          font-family: 'DM Sans', sans-serif; font-size: 14px; color: #111;
          outline: none; border-radius: 0; transition: border-color 0.2s, box-shadow 0.2s;
          appearance: none;
        }
        .field-input:focus  { border-color: #111; box-shadow: 0 0 0 3px rgba(0,0,0,0.04); }
        .field-input::placeholder { color: #ccc; }
        .contact-info-item:hover .contact-icon { color: ${PRIMARY}; }
        .submit-btn {
          width: 100%; padding: 15px; background: #111; border: none; color: #fff;
          font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500;
          letter-spacing: 0.14em; text-transform: uppercase; cursor: pointer;
          transition: background 0.2s, transform 0.12s; border-radius: 0;
        }
        .submit-btn:hover:not(:disabled) { background: ${PRIMARY}; transform: translateY(-1px); }
        .submit-btn:disabled { background: #ccc; cursor: not-allowed; }
      `}</style>

      {/* ── Hero ── */}
      <section style={{ background: '#111', position: 'relative', overflow: 'hidden', padding: '72px 32px 64px' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`, backgroundSize: '48px 48px' }} />
        <div style={{ position: 'absolute', right: -10, top: '50%', transform: 'translateY(-50%)', fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(100px, 16vw, 200px)', color: 'rgba(255,255,255,0.03)', userSelect: 'none', letterSpacing: '0.04em', lineHeight: 1, zIndex: 0 }}>TALK</div>

        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: PRIMARY, marginBottom: 20, animation: 'fadeUp 0.6s ease both' }}>◆ Reach Out</p>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(52px, 8vw, 100px)', lineHeight: 0.9, letterSpacing: '0.02em', color: '#fff', marginBottom: 24, animation: 'fadeUp 0.7s ease 0.1s both' }}>
            GET IN<br /><span style={{ color: PRIMARY }}>TOUCH.</span>
          </h1>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 18, fontStyle: 'italic', color: 'rgba(255,255,255,0.5)', maxWidth: 480, lineHeight: 1.75, animation: 'fadeUp 0.7s ease 0.2s both' }}>
            We're here to answer your questions and help you with anything you need.
          </p>
        </div>
      </section>

      {/* ── Ticker ── */}
      <div style={{ background: PRIMARY, overflow: 'hidden', height: 36, display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', animation: 'ticker 20s linear infinite', whiteSpace: 'nowrap' }}>
          {[...Array(4)].map((_, i) => (
            <span key={i} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.18em', color: '#fff', textTransform: 'uppercase', paddingRight: 80 }}>
              WE REPLY WITHIN 24HRS &nbsp;·&nbsp; KITALE, KENYA &nbsp;·&nbsp; MON–SAT 9AM–6PM &nbsp;·&nbsp; SUPPORT@ONEMANBOUTIQUE.COM &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ── Main Content ── */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '72px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 64 }}>

          {/* ── Left: Contact Info ── */}
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: PRIMARY, marginBottom: 12 }}>◆ Details</p>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, letterSpacing: '0.03em', color: '#111', marginBottom: 36 }}>Our Details</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                {
                  icon: <FiMail size={18} />,
                  heading: 'Email Us',
                  content: <a href="mailto:support@onemanboutique.com" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#666', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = PRIMARY} onMouseLeave={e => e.currentTarget.style.color = '#666'}>support@onemanboutique.com</a>,
                },
                {
                  icon: <FiPhoneCall size={18} />,
                  heading: 'Call Us',
                  content: (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {['+254 704 858 069', '+254 707 392 813'].map(n => (
                        <a key={n} href={`tel:${n.replace(/\s/g,'')}`} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#666', textDecoration: 'none', display: 'block', transition: 'color 0.2s' }}
                          onMouseEnter={e => e.currentTarget.style.color = PRIMARY} onMouseLeave={e => e.currentTarget.style.color = '#666'}>{n}</a>
                      ))}
                    </div>
                  ),
                },
                {
                  icon: <FaMapMarkerAlt size={18} />,
                  heading: 'Visit Us',
                  content: <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#666' }}>MidTown, Kitale, Kenya</span>,
                },
              ].map(({ icon, heading, content }, i) => (
                <div key={heading} className="contact-info-item" style={{ display: 'flex', gap: 18, padding: '24px 0', borderBottom: '1px solid #ebebeb' }}>
                  <div className="contact-icon" style={{ color: '#ccc', flexShrink: 0, marginTop: 2, transition: 'color 0.2s' }}>{icon}</div>
                  <div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#888', marginBottom: 6 }}>{heading}</div>
                    {content}
                  </div>
                </div>
              ))}
            </div>

            {/* Hours card */}
            <div style={{ marginTop: 36, padding: '24px', background: '#111', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: 3, height: '100%', background: PRIMARY }} />
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 14 }}>Business Hours</div>
              {[['Mon – Fri', '9:00 AM – 6:00 PM'], ['Saturday', '10:00 AM – 4:00 PM'], ['Sunday', 'Closed']].map(([day, hours]) => (
                <div key={day} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{day}</span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: hours === 'Closed' ? PRIMARY : '#fff', fontWeight: 500 }}>{hours}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Form ── */}
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: PRIMARY, marginBottom: 12 }}>◆ Message</p>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, letterSpacing: '0.03em', color: '#111', marginBottom: 36 }}>Send Us a Message</h2>

            {/* Status */}
            {status.message && (
              <div style={{
                padding: '14px 16px', marginBottom: 24, animation: 'fadeUp 0.3s ease both',
                background: status.type === 'success' ? '#f0fdf4' : '#fff5f5',
                border: `1.5px solid ${status.type === 'success' ? '#22c55e' : PRIMARY}`,
                display: 'flex', gap: 10, alignItems: 'flex-start',
              }}>
                <span style={{ color: status.type === 'success' ? '#22c55e' : PRIMARY, fontSize: 16, flexShrink: 0 }}>
                  {status.type === 'success' ? '✓' : '✕'}
                </span>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: status.type === 'success' ? '#166534' : '#b91c1c', lineHeight: 1.4 }}>{status.message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                {/* Name */}
                <div>
                  <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: focused === 'name' ? '#111' : '#999', display: 'block', marginBottom: 8, transition: 'color 0.2s' }}>Full Name</label>
                  <input name="name" type="text" required placeholder="John Doe"
                    value={formData.name} onChange={handleChange}
                    onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
                    className="field-input" />
                </div>
                {/* Email */}
                <div>
                  <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: focused === 'email' ? '#111' : '#999', display: 'block', marginBottom: 8, transition: 'color 0.2s' }}>Email Address</label>
                  <input name="email" type="email" required placeholder="you@example.com"
                    value={formData.email} onChange={handleChange}
                    onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                    className="field-input" />
                </div>
              </div>

              {/* Subject */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: focused === 'subject' ? '#111' : '#999', display: 'block', marginBottom: 8, transition: 'color 0.2s' }}>Subject</label>
                <input name="subject" type="text" required placeholder="What's this about?"
                  value={formData.subject} onChange={handleChange}
                  onFocus={() => setFocused('subject')} onBlur={() => setFocused(null)}
                  className="field-input" />
              </div>

              {/* Message */}
              <div style={{ marginBottom: 28 }}>
                <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: focused === 'message' ? '#111' : '#999', display: 'block', marginBottom: 8, transition: 'color 0.2s' }}>Message</label>
                <textarea name="message" required rows={7} placeholder="Write your message here..."
                  value={formData.message} onChange={handleChange}
                  onFocus={() => setFocused('message')} onBlur={() => setFocused(null)}
                  className="field-input" style={{ resize: 'vertical', fontFamily: "'Cormorant Garamond', serif", fontSize: 16, lineHeight: 1.65 }} />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#ccc' }}>{formData.message.length} chars</span>
                </div>
              </div>

              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    <span style={{ width: 14, height: 14, border: '1.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                    Sending
                  </span>
                ) : 'Send Message →'}
              </button>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </form>
          </div>
        </div>
      </section>

      {/* ── Back to home ── */}
      <section style={{ borderTop: '1px solid #ebebeb', padding: '40px 32px', textAlign: 'center', background: '#fafafa' }}>
        <Link to="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase',
          color: '#111', textDecoration: 'none', borderBottom: '1px solid #111', paddingBottom: 2, transition: 'color 0.2s, border-color 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.color = PRIMARY; e.currentTarget.style.borderColor = PRIMARY; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#111'; e.currentTarget.style.borderColor = '#111'; }}>
          ← Back to Home
        </Link>
      </section>
    </div>
  );
};

export default ContactUs;