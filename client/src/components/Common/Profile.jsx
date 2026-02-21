import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  HiOutlinePencil,
  HiOutlineCheckCircle,
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineShieldCheck,
  HiOutlineXMark,
} from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

const PRIMARY = '#ea2e0e';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  .pf-root {
    min-height: 100vh;
    background: #faf9f7;
    font-family: 'DM Sans', sans-serif;
    padding: 48px 24px 80px;
  }

  .pf-wrap {
    max-width: 600px;
    margin: 0 auto;
  }

  /* ── Page header ── */
  .pf-page-header {
    margin-bottom: 32px;
  }
  .pf-eyebrow {
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: ${PRIMARY};
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }
  .pf-eyebrow-line {
    display: inline-block;
    width: 20px; height: 1.5px;
    background: ${PRIMARY};
  }
  .pf-page-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 48px;
    letter-spacing: 0.04em;
    color: #111;
    line-height: 1;
  }

  /* ── Avatar card ── */
  .pf-avatar-card {
    background: #111;
    padding: 28px 28px;
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 2px;
    position: relative;
    overflow: hidden;
  }
  .pf-avatar-card::after {
    content: '';
    position: absolute;
    right: -20px; top: -20px;
    width: 120px; height: 120px;
    border-radius: 50%;
    border: 30px solid rgba(255,255,255,0.03);
  }
  .pf-avatar {
    width: 64px; height: 64px;
    border-radius: 50%;
    background: ${PRIMARY};
    display: flex; align-items: center; justify-content: center;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 26px;
    letter-spacing: 0.06em;
    color: #fff;
    flex-shrink: 0;
    position: relative;
    z-index: 1;
  }
  .pf-avatar-info { position: relative; z-index: 1; }
  .pf-avatar-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 600;
    color: #fff;
    line-height: 1.2;
    margin-bottom: 4px;
  }
  .pf-avatar-role {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 10px;
    border: 1px solid rgba(255,255,255,0.15);
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.55);
  }
  .pf-avatar-role.admin {
    border-color: rgba(234,46,14,0.5);
    color: ${PRIMARY};
  }

  /* ── Section card ── */
  .pf-card {
    background: #fff;
    border: 1px solid #e8e4de;
    margin-bottom: 2px;
  }
  .pf-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 24px;
    border-bottom: 1px solid #f0ede8;
  }
  .pf-card-title {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #555;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .pf-card-title svg { color: #bbb; }
  .pf-card-body { padding: 24px; }

  /* Edit / Cancel button */
  .pf-edit-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    border: 1.5px solid #e8e4de;
    background: transparent;
    font-family: 'DM Sans', sans-serif;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #555;
    cursor: pointer;
    transition: all 0.15s;
    border-radius: 2px;
  }
  .pf-edit-btn:hover { border-color: #111; color: #111; }
  .pf-edit-btn.cancel { border-color: #e8e4de; color: #999; }
  .pf-edit-btn.cancel:hover { border-color: ${PRIMARY}; color: ${PRIMARY}; }

  /* ── Field ── */
  .pf-field { margin-bottom: 20px; }
  .pf-field:last-child { margin-bottom: 0; }
  .pf-label {
    display: block;
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #aaa;
    margin-bottom: 8px;
  }
  .pf-input-wrap { position: relative; }
  .pf-input-icon {
    position: absolute;
    left: 14px; top: 50%;
    transform: translateY(-50%);
    color: #ccc;
    pointer-events: none;
    display: flex;
  }
  .pf-input {
    width: 100%;
    height: 46px;
    padding: 0 14px 0 40px;
    border: 1.5px solid #e8e4de;
    background: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #111;
    outline: none;
    transition: border-color 0.18s, box-shadow 0.18s;
    border-radius: 0;
    -webkit-appearance: none;
  }
  .pf-input:focus { border-color: #111; box-shadow: inset 0 0 0 1px #111; }
  .pf-input:disabled {
    background: #faf9f7;
    color: #888;
    border-color: #f0ede8;
    cursor: default;
  }
  .pf-input::placeholder { color: #ccc; }

  /* Read-only email */
  .pf-readonly {
    height: 46px;
    padding: 0 14px 0 40px;
    background: #faf9f7;
    border: 1.5px solid #f0ede8;
    display: flex; align-items: center;
    font-size: 14px;
    color: #999;
    font-family: 'DM Mono', monospace;
  }
  .pf-readonly-note {
    font-size: 10.5px;
    color: #bbb;
    margin-top: 5px;
    letter-spacing: 0.02em;
  }

  /* Password section divider */
  .pf-pwd-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    margin-top: 4px;
  }
  .pf-pwd-label {
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #ccc;
    white-space: nowrap;
  }
  .pf-pwd-line { flex: 1; height: 1px; background: #f0ede8; }

  /* ── Alerts ── */
  .pf-alert {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 14px 16px;
    margin-bottom: 20px;
    font-size: 13px;
    font-weight: 500;
    border-radius: 0;
    animation: pf-fade-in 0.25s ease;
  }
  @keyframes pf-fade-in { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
  .pf-alert.success { background: #f0faf4; border: 1px solid #b8e8cc; color: #166534; }
  .pf-alert.error   { background: #fff5f4; border: 1px solid #fecaca; color: #991b1b; }
  .pf-alert svg { flex-shrink: 0; margin-top: 1px; }

  /* ── Submit button ── */
  .pf-submit-btn {
    width: 100%;
    height: 50px;
    background: #111;
    border: none;
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.18s;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    margin-top: 8px;
  }
  .pf-submit-btn:hover:not(:disabled) { background: ${PRIMARY}; }
  .pf-submit-btn:disabled { background: #ccc; cursor: not-allowed; }

  /* ── Spinner ── */
  @keyframes pf-spin { to { transform: rotate(360deg); } }
  .pf-spinner {
    width: 14px; height: 14px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: pf-spin 0.7s linear infinite;
  }

  /* ── Admin card ── */
  .pf-admin-card {
    background: #111;
    padding: 20px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }
  .pf-admin-text h4 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 17px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 3px;
  }
  .pf-admin-text p {
    font-size: 12px;
    color: #888;
    letter-spacing: 0.02em;
  }
  .pf-admin-btn {
    padding: 10px 20px;
    background: ${PRIMARY};
    border: none;
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    cursor: pointer;
    white-space: nowrap;
    transition: opacity 0.15s;
    flex-shrink: 0;
  }
  .pf-admin-btn:hover { opacity: 0.85; }

  /* ── Loading screen ── */
  .pf-loading {
    min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    background: #faf9f7;
  }
  .pf-loading-ring {
    width: 36px; height: 36px;
    border: 2px solid #e8e4de;
    border-top-color: ${PRIMARY};
    border-radius: 50%;
    animation: pf-spin 0.8s linear infinite;
  }
`;

const Profile = () => {
  const { user, isLoggedIn, authLoading, updateUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  /* Inject styles */
  useEffect(() => {
    const id = 'pf-styles';
    if (!document.getElementById(id)) {
      const s = document.createElement('style');
      s.id = id;
      s.textContent = STYLES;
      document.head.appendChild(s);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && user) {
      setName(user.name || '');
      setPhone(user.phone || '');
    }
    if (!authLoading && !isLoggedIn) navigate('/login');
  }, [user, authLoading, isLoggedIn, navigate]);

  const handleCancel = () => {
    setIsEditing(false);
    setPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
    if (user) { setName(user.name || ''); setPhone(user.phone || ''); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (password && password !== confirmPassword) { setError('Passwords do not match.'); return; }
    setIsLoading(true);
    const updateData = { name, phone };
    if (password) updateData.password = password;
    try {
      const result = await updateUser(updateData);
      if (result.success) {
        setSuccess(result.message || 'Profile updated successfully.');
        setIsEditing(false);
        setPassword(''); setConfirmPassword('');
      } else {
        setError(result.message || 'Update failed. Please try again.');
      }
    } catch {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || !isLoggedIn || !user) {
    return <div className="pf-loading"><div className="pf-loading-ring" /></div>;
  }

  const userInitial = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    : 'U';

  return (
    <div className="pf-root">
      <style>{STYLES}</style>
      <div className="pf-wrap">

        {/* ── Page Header ── */}
        <div className="pf-page-header">
          <div className="pf-eyebrow">
            <span className="pf-eyebrow-line" />
            Account
          </div>
          <h1 className="pf-page-title">My Profile</h1>
        </div>

        {/* ── Avatar card ── */}
        <div className="pf-avatar-card">
          <div className="pf-avatar">{userInitial}</div>
          <div className="pf-avatar-info">
            <div className="pf-avatar-name">{user.name}</div>
            <div className={`pf-avatar-role${user.isAdmin ? ' admin' : ''}`}>
              <HiOutlineShieldCheck size={10} />
              {user.isAdmin ? 'Administrator' : 'Member'}
            </div>
          </div>
        </div>

        {/* ── Alerts ── */}
        {success && (
          <div className="pf-alert success">
            <HiOutlineCheckCircle size={16} />
            {success}
          </div>
        )}
        {error && (
          <div className="pf-alert error">
            <HiOutlineXMark size={16} />
            {error}
          </div>
        )}

        {/* ── Personal info card ── */}
        <div className="pf-card" style={{ marginTop: 2 }}>
          <div className="pf-card-header">
            <span className="pf-card-title">
              <HiOutlineUser size={14} /> Personal Information
            </span>
            {!isEditing ? (
              <button className="pf-edit-btn" onClick={() => setIsEditing(true)} disabled={isLoading}>
                <HiOutlinePencil size={12} /> Edit
              </button>
            ) : (
              <button className="pf-edit-btn cancel" onClick={handleCancel} disabled={isLoading}>
                <HiOutlineXMark size={12} /> Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="pf-card-body">

              {/* Name */}
              <div className="pf-field">
                <label className="pf-label" htmlFor="name">Full Name</label>
                <div className="pf-input-wrap">
                  <span className="pf-input-icon"><HiOutlineUser size={15} /></span>
                  <input
                    id="name" type="text" value={name}
                    onChange={e => setName(e.target.value)}
                    disabled={!isEditing || isLoading}
                    className="pf-input"
                    placeholder="Your full name"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="pf-field">
                <label className="pf-label" htmlFor="phone">Phone Number</label>
                <div className="pf-input-wrap">
                  <span className="pf-input-icon"><HiOutlinePhone size={15} /></span>
                  <input
                    id="phone" type="text" value={phone}
                    onChange={e => setPhone(e.target.value)}
                    disabled={!isEditing || isLoading}
                    className="pf-input"
                    placeholder="+254 700 000 000"
                  />
                </div>
              </div>

              {/* Email (read-only) */}
              <div className="pf-field">
                <label className="pf-label">Email Address</label>
                <div className="pf-input-wrap">
                  <span className="pf-input-icon"><HiOutlineEnvelope size={15} /></span>
                  <div className="pf-readonly">{user.email}</div>
                </div>
                <p className="pf-readonly-note">Email address cannot be changed.</p>
              </div>

              {/* Password section (edit mode only) */}
              {isEditing && (
                <>
                  <div className="pf-pwd-header" style={{ marginTop: 28 }}>
                    <div className="pf-pwd-line" />
                    <span className="pf-pwd-label">Change Password</span>
                    <div className="pf-pwd-line" />
                  </div>

                  <div className="pf-field">
                    <label className="pf-label" htmlFor="password">New Password</label>
                    <div className="pf-input-wrap">
                      <span className="pf-input-icon"><HiOutlineLockClosed size={15} /></span>
                      <input
                        id="password" type="password" value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="pf-input"
                        placeholder="Leave blank to keep current"
                      />
                    </div>
                  </div>

                  <div className="pf-field">
                    <label className="pf-label" htmlFor="confirmPassword">Confirm New Password</label>
                    <div className="pf-input-wrap">
                      <span className="pf-input-icon"><HiOutlineLockClosed size={15} /></span>
                      <input
                        id="confirmPassword" type="password" value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        className="pf-input"
                        placeholder="Re-enter new password"
                      />
                    </div>
                  </div>

                  <button type="submit" className="pf-submit-btn" disabled={isLoading}>
                    {isLoading ? (
                      <><div className="pf-spinner" /> Saving…</>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </>
              )}
            </div>
          </form>
        </div>

        {/* ── Admin panel ── */}
        {user.isAdmin && (
          <div className="pf-admin-card" style={{ marginTop: 2 }}>
            <div className="pf-admin-text">
              <h4>Admin Dashboard</h4>
              <p>You have elevated privileges to manage the shop.</p>
            </div>
            <button className="pf-admin-btn" onClick={() => navigate('/admin')}>
              Open Dashboard
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;