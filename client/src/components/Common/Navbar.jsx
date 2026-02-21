import React, { useState, useEffect, useRef } from "react";
import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiBars3BottomRight,
  HiOutlineTag,
  HiOutlineArrowRightOnRectangle,
} from "react-icons/hi2";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.png";
import CartDrawer from "./CartDrawer";
import { useCart } from "../../context/CartContext";

const PRIMARY = '#ea2e0e';

const NAV_LINKS = [
  { label: 'Men',         to: '/category/men' },
  { label: 'Women',       to: '/category/women' },
  { label: 'Top Wear',    to: '/category/top-wear' },
  { label: 'Bottom Wear', to: '/category/bottom-wear' },
];

/* ─── Styles ─── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');

  .nb-root {
    position: sticky;
    top: 0;
    z-index: 40;
    background: #fff;
    border-bottom: 1px solid #e8e4de;
    font-family: 'DM Sans', sans-serif;
  }

  /* thin accent line at very top */
  .nb-root::before {
    content: '';
    display: block;
    height: 2px;
    background: ${PRIMARY};
  }

  .nb-inner {
    max-width: 1320px;
    margin: 0 auto;
    padding: 0 28px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }

  /* ── Logo ── */
  .nb-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    flex-shrink: 0;
  }
  .nb-logo-wordmark {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px;
    letter-spacing: 0.12em;
    color: #111;
    line-height: 1;
  }

  /* ── Nav links ── */
  .nb-links {
    display: flex;
    align-items: center;
    gap: 0;
    height: 100%;
  }
  .nb-link {
    position: relative;
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 18px;
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #555;
    text-decoration: none;
    transition: color 0.15s;
    white-space: nowrap;
  }
  .nb-link::after {
    content: '';
    position: absolute;
    bottom: 0; left: 18px; right: 18px;
    height: 2px;
    background: ${PRIMARY};
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.22s ease;
  }
  .nb-link:hover { color: #111; }
  .nb-link:hover::after { transform: scaleX(1); }
  .nb-link.active { color: #111; }
  .nb-link.active::after { transform: scaleX(1); }

  /* ── Right actions ── */
  .nb-actions {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
  }

  /* Icon buttons */
  .nb-icon-btn {
    position: relative;
    width: 40px; height: 40px;
    display: flex; align-items: center; justify-content: center;
    background: transparent;
    border: none;
    color: #555;
    cursor: pointer;
    transition: color 0.15s, background 0.15s;
    border-radius: 2px;
  }
  .nb-icon-btn:hover { color: #111; background: #f5f3ef; }

  /* Cart badge */
  .nb-cart-badge {
    position: absolute;
    top: 4px; right: 4px;
    min-width: 16px; height: 16px;
    padding: 0 3px;
    background: ${PRIMARY};
    color: #fff;
    font-size: 9px;
    font-weight: 700;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    letter-spacing: 0;
    line-height: 1;
    pointer-events: none;
  }

  /* User avatar */
  .nb-avatar {
    width: 32px; height: 32px;
    border-radius: 50%;
    background: #111;
    color: #fff;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.03em;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.15s;
    flex-shrink: 0;
  }
  .nb-avatar:hover { background: ${PRIMARY}; }

  /* ── Profile dropdown ── */
  @keyframes nb-drop-in {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .nb-dropdown {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    width: 200px;
    background: #fff;
    border: 1px solid #e8e4de;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    z-index: 50;
    animation: nb-drop-in 0.2s ease both;
    overflow: hidden;
  }
  .nb-dropdown-header {
    padding: 14px 16px 12px;
    border-bottom: 1px solid #f0ede8;
  }
  .nb-dropdown-greeting {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #aaa;
    margin-bottom: 2px;
  }
  .nb-dropdown-name {
    font-size: 15px;
    font-weight: 600;
    color: #111;
    font-family: 'DM Sans', sans-serif;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .nb-dropdown-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 11px 16px;
    font-size: 12.5px;
    font-weight: 500;
    color: #444;
    text-decoration: none;
    background: transparent;
    border: none;
    width: 100%;
    text-align: left;
    cursor: pointer;
    transition: background 0.12s, color 0.12s;
    letter-spacing: 0.01em;
  }
  .nb-dropdown-item:hover { background: #faf9f7; color: #111; }
  .nb-dropdown-item.danger { color: ${PRIMARY}; }
  .nb-dropdown-item.danger:hover { background: #fff5f4; }
  .nb-dropdown-divider { height: 1px; background: #f0ede8; }

  /* ── Mobile drawer ── */
  @keyframes nb-drawer-in  { from { transform: translateX(-100%); } to { transform: translateX(0); } }
  @keyframes nb-drawer-out { from { transform: translateX(0); } to { transform: translateX(-100%); } }

  .nb-drawer {
    position: fixed;
    top: 0; left: 0;
    width: min(320px, 80vw);
    height: 100%;
    background: #fff;
    z-index: 50;
    display: flex;
    flex-direction: column;
    box-shadow: 4px 0 32px rgba(0,0,0,0.12);
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .nb-drawer.open { transform: translateX(0); }

  .nb-drawer-top {
    padding: 0 24px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f0ede8;
    flex-shrink: 0;
  }
  .nb-drawer-accent { width: 100%; height: 2px; background: ${PRIMARY}; flex-shrink: 0; }

  .nb-drawer-body {
    flex: 1;
    overflow-y: auto;
    padding: 8px 0;
  }

  .nb-drawer-link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 15px 24px;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #333;
    text-decoration: none;
    background: transparent;
    border: none;
    width: 100%;
    text-align: left;
    cursor: pointer;
    transition: background 0.12s, color 0.12s;
    position: relative;
  }
  .nb-drawer-link::before {
    content: '';
    position: absolute;
    left: 0; top: 25%; bottom: 25%;
    width: 2px;
    background: ${PRIMARY};
    transform: scaleY(0);
    transition: transform 0.15s;
  }
  .nb-drawer-link:hover { background: #faf9f7; color: #111; }
  .nb-drawer-link:hover::before { transform: scaleY(1); }
  .nb-drawer-link.active { color: ${PRIMARY}; background: #fff5f4; }
  .nb-drawer-link.active::before { transform: scaleY(1); }
  .nb-drawer-link.danger { color: ${PRIMARY}; }
  .nb-drawer-link.danger:hover { background: #fff5f4; }

  .nb-drawer-section-label {
    padding: 16px 24px 6px;
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #ccc;
  }
  .nb-drawer-sep { height: 1px; background: #f0ede8; margin: 8px 0; }

  /* User card in drawer */
  .nb-drawer-user-card {
    margin: 16px 24px;
    padding: 14px 16px;
    border: 1px solid #e8e4de;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .nb-drawer-user-info h4 {
    font-size: 14px;
    font-weight: 600;
    color: #111;
    margin-bottom: 2px;
  }
  .nb-drawer-user-info p {
    font-size: 11px;
    color: #aaa;
    letter-spacing: 0.04em;
  }

  /* Backdrop */
  .nb-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.35);
    z-index: 45;
    animation: nb-fade-in 0.25s ease;
  }
  @keyframes nb-fade-in { from { opacity: 0; } to { opacity: 1; } }

  /* Hamburger button */
  .nb-hamburger {
    display: none;
  }
  @media (max-width: 768px) {
    .nb-links { display: none !important; }
    .nb-hamburger { display: flex !important; }
  }
`;

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, logout, authLoading, user } = useAuth();
  const { totalItems } = useCart();

  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef(null);

  /* Inject styles */
  useEffect(() => {
    const id = 'nb-styles';
    if (!document.getElementById(id)) {
      const s = document.createElement('style');
      s.id = id;
      s.textContent = STYLES;
      document.head.appendChild(s);
    }
  }, []);

  /* Close profile menu on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* Close drawers on route change */
  useEffect(() => {
    setNavDrawerOpen(false);
    setProfileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setProfileMenuOpen(false);
    setNavDrawerOpen(false);
    navigate('/login');
  };

  const userInitial = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    : 'U';
  const firstName = user?.name?.split(' ')[0] || 'User';

  if (authLoading) return null;

  return (
    <>
      <style>{STYLES}</style>

      <nav className="nb-root">
        <div className="nb-inner">

          {/* ── Logo ── */}
          <Link to="/app" className="nb-logo">
            <img
              src={logo}
              alt="ONE MAN"
              style={{ height: 28, width: 'auto' }}
              onError={e => { e.target.onerror = null; e.target.src = 'https://placehold.co/120x28/111111/ffffff?text=ONE+MAN'; }}
            />
            <span className="nb-logo-wordmark" style={{ display: 'none' }}>ONE MAN</span>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <div className="nb-links">
            {NAV_LINKS.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className={`nb-link${location.pathname === to ? ' active' : ''}`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* ── Right Actions ── */}
          <div className="nb-actions">

            {/* Cart */}
            <button
              className="nb-icon-btn"
              onClick={() => { setCartDrawerOpen(true); setProfileMenuOpen(false); }}
              aria-label="View Cart"
            >
              <HiOutlineShoppingBag size={22} />
              {totalItems > 0 && (
                <span className="nb-cart-badge">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>

            {/* Auth / Profile */}
            <div ref={profileRef} style={{ position: 'relative' }}>
              <button
                className="nb-icon-btn"
                onClick={() => {
                  if (!isLoggedIn) { navigate('/login'); return; }
                  setProfileMenuOpen(o => !o);
                }}
                aria-label={isLoggedIn ? 'Profile' : 'Sign In'}
                style={{ width: 'auto', padding: '0 4px' }}
              >
                {isLoggedIn && user ? (
                  <div className="nb-avatar">{userInitial}</div>
                ) : (
                  <HiOutlineUser size={22} />
                )}
              </button>

              {isLoggedIn && user && profileMenuOpen && (
                <div className="nb-dropdown">
                  <div className="nb-dropdown-header">
                    <div className="nb-dropdown-greeting">Welcome back</div>
                    <div className="nb-dropdown-name">{user.name}</div>
                  </div>
                  <Link
                    to="/app/profile"
                    className="nb-dropdown-item"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    <HiOutlineUser size={15} /> My Profile
                  </Link>
                  <Link
                    to="/app/reviews"
                    className="nb-dropdown-item"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    <HiOutlineTag size={15} /> My Reviews
                  </Link>
                  <div className="nb-dropdown-divider" />
                  <button className="nb-dropdown-item danger" onClick={handleLogout}>
                    <HiOutlineArrowRightOnRectangle size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Hamburger */}
            <button
              className="nb-icon-btn nb-hamburger"
              onClick={() => { setNavDrawerOpen(true); setProfileMenuOpen(false); }}
              aria-label="Open Menu"
            >
              <HiBars3BottomRight size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Cart Drawer ── */}
      <CartDrawer drawerOpen={cartDrawerOpen} toggleCartDrawer={() => setCartDrawerOpen(false)} />

      {/* ── Mobile Nav Drawer ── */}
      {navDrawerOpen && (
        <div className="nb-backdrop" onClick={() => setNavDrawerOpen(false)} />
      )}

      <div className={`nb-drawer${navDrawerOpen ? ' open' : ''}`}>
        <div className="nb-drawer-accent" />
        <div className="nb-drawer-top">
          <Link to="/app" className="nb-logo" onClick={() => setNavDrawerOpen(false)}>
            <img
              src={logo}
              alt="ONE MAN"
              style={{ height: 26, width: 'auto' }}
              onError={e => { e.target.onerror = null; e.target.src = 'https://placehold.co/120x26/111111/ffffff?text=ONE+MAN'; }}
            />
          </Link>
          <button
            className="nb-icon-btn"
            onClick={() => setNavDrawerOpen(false)}
            aria-label="Close Menu"
          >
            <IoMdClose size={22} />
          </button>
        </div>

        <div className="nb-drawer-body">

          {/* User card (if logged in) */}
          {isLoggedIn && user && (
            <div className="nb-drawer-user-card">
              <div className="nb-avatar" style={{ width: 40, height: 40, fontSize: 14, flexShrink: 0, background: '#111' }}>
                {userInitial}
              </div>
              <div className="nb-drawer-user-info">
                <h4>{user.name}</h4>
                <p>Loyalty Member</p>
              </div>
            </div>
          )}

          <div className="nb-drawer-section-label">Shop</div>
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className={`nb-drawer-link${location.pathname === to ? ' active' : ''}`}
              onClick={() => setNavDrawerOpen(false)}
            >
              {label}
            </Link>
          ))}

          <div className="nb-drawer-sep" />
          <div className="nb-drawer-section-label">Account</div>

          {isLoggedIn && user ? (
            <>
              <Link to="/app/profile" className="nb-drawer-link" onClick={() => setNavDrawerOpen(false)}>
                <HiOutlineUser size={16} /> My Profile
              </Link>
              <Link to="/app/reviews" className="nb-drawer-link" onClick={() => setNavDrawerOpen(false)}>
                <HiOutlineTag size={16} /> My Reviews
              </Link>
              <div className="nb-drawer-sep" />
              <button className="nb-drawer-link danger" onClick={handleLogout}>
                <HiOutlineArrowRightOnRectangle size={16} /> Sign Out
              </button>
            </>
          ) : (
            <Link to="/login" className="nb-drawer-link" onClick={() => setNavDrawerOpen(false)}
              style={{ color: PRIMARY }}>
              <HiOutlineUser size={16} /> Sign In / Register
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;