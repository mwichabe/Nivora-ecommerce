import React, { useState, useEffect } from "react";
import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";

const PRIMARY = '#ea2e0e';

const MESSAGES = [
  "Worldwide shipping — fast & reliable",
  "Free returns on all orders over Ksh 5,000",
  "New arrivals every Friday — shop the drop",
];

const TopBar = () => {
  const [msgIndex, setMsgIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const id = 'topbar-styles';
    if (!document.getElementById(id)) {
      const s = document.createElement('style');
      s.id = id;
      s.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap');

        .tb-root {
          background: ${PRIMARY};
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* subtle noise texture overlay */
        .tb-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.18;
          pointer-events: none;
        }

        .tb-inner {
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 24px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          position: relative;
          z-index: 1;
        }

        /* Social icons */
        .tb-socials {
          display: flex;
          align-items: center;
          gap: 2px;
          flex-shrink: 0;
        }
        .tb-social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px; height: 28px;
          color: rgba(255,255,255,0.7);
          transition: color 0.15s, background 0.15s;
          border-radius: 2px;
          text-decoration: none;
        }
        .tb-social-link:hover {
          color: #fff;
          background: rgba(255,255,255,0.12);
        }

        /* Divider */
        .tb-divider {
          width: 1px;
          height: 14px;
          background: rgba(255,255,255,0.2);
          flex-shrink: 0;
        }

        /* Rotating message */
        .tb-msg-wrap {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          height: 100%;
        }
        .tb-msg {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 11.5px;
          font-weight: 400;
          letter-spacing: 0.06em;
          color: #fff;
          white-space: nowrap;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .tb-msg.fading {
          opacity: 0;
          transform: translateY(-6px);
        }
        .tb-msg-dot {
          display: inline-block;
          width: 4px; height: 4px;
          border-radius: 50%;
          background: rgba(255,255,255,0.5);
          flex-shrink: 0;
        }

        /* Dots indicator */
        .tb-dots {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .tb-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: rgba(255,255,255,0.3);
          transition: background 0.2s, transform 0.2s;
          cursor: pointer;
          border: none;
          padding: 0;
          flex-shrink: 0;
        }
        .tb-dot.active {
          background: rgba(255,255,255,0.9);
          transform: scale(1.4);
        }

        /* Phone links */
        .tb-phones {
          display: flex;
          align-items: center;
          gap: 0;
          flex-shrink: 0;
        }
        .tb-phone-link {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.04em;
          color: rgba(255,255,255,0.75);
          text-decoration: none;
          padding: 4px 10px;
          border-left: 1px solid rgba(255,255,255,0.18);
          transition: color 0.15s, background 0.15s;
          line-height: 1;
        }
        .tb-phone-link:first-child { border-left: none; }
        .tb-phone-link:hover { color: #fff; background: rgba(255,255,255,0.1); }

        @media (max-width: 768px) {
          .tb-socials, .tb-phones, .tb-divider { display: none !important; }
          .tb-msg { font-size: 11px; }
          .tb-dots { display: none !important; }
        }
      `;
      document.head.appendChild(s);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setMsgIndex(i => (i + 1) % MESSAGES.length);
        setFading(false);
      }, 320);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="tb-root">
      <div className="tb-inner">

        {/* Left: Socials */}
        <div className="tb-socials">
          <a href="#" className="tb-social-link" aria-label="Meta">
            <TbBrandMeta size={16} />
          </a>
          <a href="#" className="tb-social-link" aria-label="Instagram">
            <IoLogoInstagram size={16} />
          </a>
          <a href="#" className="tb-social-link" aria-label="X / Twitter">
            <RiTwitterXLine size={14} />
          </a>
          <span className="tb-divider" style={{ marginLeft: 6 }} />
          {/* Dots */}
          <div className="tb-dots" style={{ marginLeft: 10 }}>
            {MESSAGES.map((_, i) => (
              <button
                key={i}
                className={`tb-dot${msgIndex === i ? ' active' : ''}`}
                onClick={() => { setFading(true); setTimeout(() => { setMsgIndex(i); setFading(false); }, 320); }}
                aria-label={`Message ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Center: Rotating message */}
        <div className="tb-msg-wrap">
          <div className={`tb-msg${fading ? ' fading' : ''}`}>
            <span className="tb-msg-dot" />
            {MESSAGES[msgIndex]}
            <span className="tb-msg-dot" />
          </div>
        </div>

        {/* Right: Phone numbers */}
        <div className="tb-phones">
          <a href="tel:+254704858069" className="tb-phone-link">
            +254 704 858 069
          </a>
          <a href="tel:+254707392813" className="tb-phone-link">
            +254 707 392 813
          </a>
        </div>

      </div>
    </div>
  );
};

export default TopBar;