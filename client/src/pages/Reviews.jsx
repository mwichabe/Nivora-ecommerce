import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { HiOutlinePencil, HiOutlineTrash, HiOutlineXMark, HiOutlineChatBubbleLeftEllipsis } from 'react-icons/hi2';

const PRIMARY = '#ea2e0e';
const REVIEWS_API_URL = 'https://one-man-server.onrender.com/api/reviews';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  .rv-root {
    min-height: 100vh;
    background: #faf9f7;
    font-family: 'DM Sans', sans-serif;
    padding: 48px 24px 80px;
  }
  .rv-wrap { max-width: 1100px; margin: 0 auto; }

  /* ── Header ── */
  .rv-eyebrow {
    font-size: 9px; font-weight: 700;
    letter-spacing: 0.28em; text-transform: uppercase;
    color: ${PRIMARY};
    display: flex; align-items: center; gap: 8px;
    margin-bottom: 8px;
  }
  .rv-eyebrow-line { display: inline-block; width: 20px; height: 1.5px; background: ${PRIMARY}; }
  .rv-page-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 48px; letter-spacing: 0.04em; color: #111; line-height: 1;
    margin-bottom: 40px;
  }

  /* ── Layout grid ── */
  .rv-grid {
    display: grid;
    grid-template-columns: 380px 1fr;
    gap: 24px;
    align-items: start;
  }
  @media (max-width: 900px) { .rv-grid { grid-template-columns: 1fr; } }

  /* ── Card ── */
  .rv-card {
    background: #fff;
    border: 1px solid #e8e4de;
  }
  .rv-card-header {
    padding: 18px 24px;
    border-bottom: 1px solid #f0ede8;
    display: flex; align-items: center; justify-content: space-between;
  }
  .rv-card-title {
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.18em; text-transform: uppercase; color: #555;
  }
  .rv-card-body { padding: 24px; }

  /* ── Form fields ── */
  .rv-label {
    display: block;
    font-size: 9.5px; font-weight: 700;
    letter-spacing: 0.16em; text-transform: uppercase; color: #aaa;
    margin-bottom: 7px;
  }
  .rv-input, .rv-textarea {
    width: 100%;
    border: 1.5px solid #e8e4de;
    background: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; color: #111;
    outline: none;
    transition: border-color 0.18s, box-shadow 0.18s;
    border-radius: 0;
    -webkit-appearance: none;
  }
  .rv-input { height: 44px; padding: 0 14px; }
  .rv-textarea { padding: 12px 14px; resize: none; line-height: 1.6; }
  .rv-input:focus, .rv-textarea:focus { border-color: #111; box-shadow: inset 0 0 0 1px #111; }
  .rv-input::placeholder, .rv-textarea::placeholder { color: #ccc; }
  .rv-input:disabled { background: #faf9f7; color: #aaa; border-color: #f0ede8; }
  .rv-field { margin-bottom: 18px; }
  .rv-field:last-of-type { margin-bottom: 0; }

  /* ── Stars ── */
  .rv-stars { display: flex; gap: 4px; }
  .rv-star-btn {
    background: none; border: none; padding: 2px; cursor: pointer;
    transition: transform 0.12s; line-height: 1;
  }
  .rv-star-btn:hover { transform: scale(1.15); }
  .rv-star-btn:disabled { cursor: default; }
  .rv-star { width: 20px; height: 20px; fill: currentColor; }
  .rv-star.filled { color: #f59e0b; }
  .rv-star.empty  { color: #e0ddd8; }

  /* ── Buttons ── */
  .rv-btn-primary {
    height: 46px; width: 100%;
    background: #111; border: none; color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.18em; text-transform: uppercase;
    cursor: pointer; transition: background 0.18s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .rv-btn-primary:hover:not(:disabled) { background: ${PRIMARY}; }
  .rv-btn-primary:disabled { background: #ccc; cursor: not-allowed; }

  .rv-btn-ghost {
    height: 46px; padding: 0 18px;
    border: 1.5px solid #e8e4de; background: transparent;
    font-family: 'DM Sans', sans-serif;
    font-size: 10px; font-weight: 600;
    letter-spacing: 0.14em; text-transform: uppercase; color: #888;
    cursor: pointer; transition: all 0.15s;
  }
  .rv-btn-ghost:hover { border-color: #111; color: #111; }

  .rv-btn-icon {
    width: 30px; height: 30px;
    display: flex; align-items: center; justify-content: center;
    border: 1px solid transparent; background: transparent;
    cursor: pointer; transition: all 0.13s; color: #ccc; border-radius: 2px;
  }
  .rv-btn-icon.edit:hover  { color: #111; border-color: #ddd; background: #f5f5f5; }
  .rv-btn-icon.delete:hover { color: ${PRIMARY}; border-color: ${PRIMARY}; background: #fff5f4; }

  /* ── Review cards ── */
  .rv-review-item {
    padding: 18px 0;
    border-bottom: 1px solid #f0ede8;
  }
  .rv-review-item:first-child { padding-top: 0; }
  .rv-review-item:last-child  { border-bottom: none; padding-bottom: 0; }

  .rv-review-meta {
    display: flex; align-items: flex-start; justify-content: space-between;
    gap: 8px; margin-bottom: 8px;
  }
  .rv-reviewer-name {
    font-size: 13px; font-weight: 600; color: #111; margin-bottom: 2px;
  }
  .rv-review-date {
    font-family: 'DM Mono', monospace;
    font-size: 10px; color: #bbb; letter-spacing: 0.04em;
  }
  .rv-review-comment {
    font-family: 'Cormorant Garamond', serif;
    font-size: 15px; font-style: italic;
    color: #444; line-height: 1.65;
  }
  .rv-your-badge {
    display: inline-block;
    padding: 2px 8px;
    border: 1px solid #e8e4de;
    font-size: 8.5px; font-weight: 700;
    letter-spacing: 0.14em; text-transform: uppercase; color: #999;
  }

  /* ── All reviews grid ── */
  .rv-all-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2px;
    margin-top: 2px;
  }
  .rv-all-item {
    background: #fff;
    border: 1px solid #e8e4de;
    padding: 22px;
    transition: border-color 0.18s;
  }
  .rv-all-item:hover { border-color: #ccc; }
  .rv-all-comment {
    font-family: 'Cormorant Garamond', serif;
    font-size: 15px; font-style: italic;
    color: #444; line-height: 1.65;
    margin: 10px 0 14px;
  }
  .rv-all-divider { height: 1px; background: #f0ede8; margin-bottom: 12px; }
  .rv-all-author { font-size: 12px; font-weight: 600; color: #111; margin-bottom: 2px; }
  .rv-all-date   { font-family: 'DM Mono', monospace; font-size: 10px; color: #bbb; }

  /* ── Section divider ── */
  .rv-section-header {
    display: flex; align-items: center; gap: 16px; margin-bottom: 16px;
  }
  .rv-section-title {
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.18em; text-transform: uppercase; color: #555;
    white-space: nowrap;
  }
  .rv-section-line { flex: 1; height: 1px; background: #e8e4de; }

  /* ── Empty state ── */
  .rv-empty {
    padding: 40px 24px; text-align: center;
    border: 1px dashed #e0ddd8; background: #fff;
  }
  .rv-empty-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px; letter-spacing: 0.06em; color: #ccc; margin-bottom: 6px;
  }
  .rv-empty-sub { font-size: 13px; color: #bbb; }

  /* ── Alert ── */
  .rv-alert {
    display: flex; align-items: center; gap: 10px;
    padding: 12px 16px; margin-bottom: 20px;
    font-size: 13px; font-weight: 500;
    animation: rv-fade-in 0.2s ease;
  }
  @keyframes rv-fade-in { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; } }
  .rv-alert.success { background: #f0faf4; border: 1px solid #b8e8cc; color: #166534; }
  .rv-alert.error   { background: #fff5f4; border: 1px solid #fecaca; color: #991b1b; }

  /* ── Spinner ── */
  @keyframes rv-spin { to { transform: rotate(360deg); } }
  .rv-spinner {
    width: 13px; height: 13px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: rv-spin 0.7s linear infinite;
    display: inline-block;
  }

  /* ── Loading screen ── */
  .rv-loading {
    min-height: 60vh; display: flex; align-items: center; justify-content: center;
  }
  .rv-loading-ring {
    width: 32px; height: 32px;
    border: 2px solid #e8e4de; border-top-color: ${PRIMARY};
    border-radius: 50%;
    animation: rv-spin 0.8s linear infinite;
  }
`;

/* ── Star Rating ── */
const StarRating = ({ rating, onChange, interactive = false, size = 18 }) => (
  <div className="rv-stars">
    {[1, 2, 3, 4, 5].map(star => (
      <button
        key={star}
        type="button"
        className="rv-star-btn"
        onClick={interactive ? () => onChange(star) : undefined}
        disabled={!interactive}
        aria-label={`${star} star${star !== 1 ? 's' : ''}`}
      >
        <svg viewBox="0 0 20 20" className={`rv-star ${star <= rating ? 'filled' : 'empty'}`} style={{ width: size, height: size }}>
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      </button>
    ))}
  </div>
);

/* ── Confirm dialog (replaces window.confirm) ── */
const useConfirm = () => {
  const [state, setState] = useState({ open: false, resolve: null, msg: '' });
  const confirm = (msg) => new Promise(resolve => setState({ open: true, resolve, msg }));
  const handleChoice = (val) => { state.resolve(val); setState({ open: false, resolve: null, msg: '' }); };
  const Dialog = state.open ? (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#fff', border: '1px solid #e8e4de', padding: '28px 28px 24px', maxWidth: 360, width: '100%' }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#333', marginBottom: 24, lineHeight: 1.6 }}>{state.msg}</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button className="rv-btn-ghost" style={{ height: 38 }} onClick={() => handleChoice(false)}>Cancel</button>
          <button className="rv-btn-primary" style={{ width: 'auto', padding: '0 20px', height: 38, background: PRIMARY }} onClick={() => handleChoice(true)}>Delete</button>
        </div>
      </div>
    </div>
  ) : null;
  return { confirm, Dialog };
};

/* ── Main ── */
const Reviews = () => {
  const { user, isLoggedIn } = useAuth();
  const { confirm, Dialog: ConfirmDialog } = useConfirm();

  const [reviews, setReviews]       = useState([]);
  const [myReviews, setMyReviews]   = useState([]);
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, comment: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [loading, setLoading]       = useState(true);
  const [alert, setAlert]           = useState(null); // { type, msg }

  const showAlert = (type, msg) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert(null), 4000);
  };

  const authConfig = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  const fetchReviews = async () => {
    const { data } = await axios.get(REVIEWS_API_URL);
    setReviews(data);
  };

  const fetchMyReviews = async () => {
    if (!isLoggedIn) return;
    const { data } = await axios.get(`${REVIEWS_API_URL}/my-reviews`, authConfig());
    setMyReviews(data);
  };

  useEffect(() => {
    (async () => {
      try { await Promise.all([fetchReviews(), fetchMyReviews()]); }
      catch { /* silent */ }
      finally { setLoading(false); }
    })();
  }, [isLoggedIn]);

  useEffect(() => {
    if (user?.name) setReviewForm(f => ({ ...f, name: user.name }));
  }, [user]);

  const resetForm = () => {
    setEditingReview(null);
    setReviewForm({ name: user?.name || '', rating: 5, comment: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) { showAlert('error', 'Please log in to submit a review.'); return; }
    if (!reviewForm.comment.trim()) { showAlert('error', 'Please write a comment.'); return; }

    setIsSubmitting(true);
    try {
      const payload = { name: reviewForm.name.trim(), rating: reviewForm.rating, comment: reviewForm.comment.trim() };
      if (editingReview) {
        await axios.put(`${REVIEWS_API_URL}/${editingReview._id}`, payload, authConfig());
        showAlert('success', 'Review updated successfully.');
      } else {
        await axios.post(REVIEWS_API_URL, payload, authConfig());
        showAlert('success', 'Review submitted — thank you!');
      }
      await Promise.all([fetchReviews(), fetchMyReviews()]);
      resetForm();
    } catch (err) {
      showAlert('error', err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = await confirm('Delete this review? This action cannot be undone.');
    if (!ok) return;
    try {
      await axios.delete(`${REVIEWS_API_URL}/${id}`, authConfig());
      await Promise.all([fetchReviews(), fetchMyReviews()]);
      showAlert('success', 'Review deleted.');
    } catch (err) {
      showAlert('error', err.response?.data?.message || 'Failed to delete review.');
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setReviewForm({ name: review.name, rating: review.rating, comment: review.comment });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <div className="rv-loading"><div className="rv-loading-ring" /></div>;
  }

  const formatDate = (d) => new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="rv-root">
      <style>{STYLES}</style>
      {ConfirmDialog}

      <div className="rv-wrap">

        {/* ── Page header ── */}
        <div className="rv-eyebrow">
          <span className="rv-eyebrow-line" /> Reviews
        </div>
        <h1 className="rv-page-title">Customer Reviews</h1>

        {/* ── Alert ── */}
        {alert && (
          <div className={`rv-alert ${alert.type}`}>
            {alert.type === 'success' ? '✓' : '✕'} {alert.msg}
          </div>
        )}

        {/* ── Top grid: form + my reviews ── */}
        <div className="rv-grid">

          {/* Form */}
          <div className="rv-card">
            <div className="rv-card-header">
              <span className="rv-card-title">
                {editingReview ? 'Edit Review' : 'Write a Review'}
              </span>
              {editingReview && (
                <button className="rv-btn-icon" onClick={resetForm} aria-label="Cancel edit">
                  <HiOutlineXMark size={16} />
                </button>
              )}
            </div>
            <div className="rv-card-body">
              <form onSubmit={handleSubmit}>
                <div className="rv-field">
                  <label className="rv-label" htmlFor="name">Name</label>
                  <input
                    id="name" type="text" className="rv-input"
                    value={reviewForm.name}
                    onChange={e => setReviewForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Your name"
                    disabled={!!user}
                    required
                  />
                </div>

                <div className="rv-field">
                  <label className="rv-label">Rating</label>
                  <StarRating
                    rating={reviewForm.rating}
                    onChange={r => setReviewForm(f => ({ ...f, rating: r }))}
                    interactive
                    size={22}
                  />
                </div>

                <div className="rv-field">
                  <label className="rv-label" htmlFor="comment">Your Experience</label>
                  <textarea
                    id="comment" className="rv-textarea" rows={5}
                    value={reviewForm.comment}
                    onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                    placeholder="Share your experience with ONE MAN…"
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
                  <button type="submit" className="rv-btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? <><span className="rv-spinner" /> Saving…</> : editingReview ? 'Update Review' : 'Submit Review'}
                  </button>
                  {editingReview && (
                    <button type="button" className="rv-btn-ghost" onClick={resetForm}>Cancel</button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* My reviews */}
          <div className="rv-card">
            <div className="rv-card-header">
              <span className="rv-card-title">Your Reviews</span>
              {myReviews.length > 0 && (
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#bbb' }}>
                  {myReviews.length} review{myReviews.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            <div className="rv-card-body">
              {myReviews.length === 0 ? (
                <div className="rv-empty">
                  <HiOutlineChatBubbleLeftEllipsis size={28} style={{ color: '#ddd', marginBottom: 10 }} />
                  <div className="rv-empty-title">No Reviews Yet</div>
                  <p className="rv-empty-sub">Share your first experience using the form.</p>
                </div>
              ) : (
                myReviews.map(review => (
                  <div key={review._id} className="rv-review-item">
                    <div className="rv-review-meta">
                      <div>
                        <StarRating rating={review.rating} size={14} />
                        <div className="rv-review-date" style={{ marginTop: 4 }}>{formatDate(review.createdAt)}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                        <button className="rv-btn-icon edit" onClick={() => handleEdit(review)} aria-label="Edit">
                          <HiOutlinePencil size={14} />
                        </button>
                        <button className="rv-btn-icon delete" onClick={() => handleDelete(review._id)} aria-label="Delete">
                          <HiOutlineTrash size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="rv-review-comment">"{review.comment}"</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ── All reviews ── */}
        <div style={{ marginTop: 48 }}>
          <div className="rv-section-header">
            <span className="rv-section-title">All Reviews</span>
            <div className="rv-section-line" />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#bbb', whiteSpace: 'nowrap' }}>
              {reviews.length} total
            </span>
          </div>

          {reviews.length === 0 ? (
            <div className="rv-empty">
              <div className="rv-empty-title">No Reviews Yet</div>
              <p className="rv-empty-sub">Be the first to share your experience.</p>
            </div>
          ) : (
            <div className="rv-all-grid">
              {reviews.map(review => {
                const isOwn = isLoggedIn && user && review.user && review.user._id === user._id;
                return (
                  <div key={review._id} className="rv-all-item">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <StarRating rating={review.rating} size={14} />
                      {isOwn && <span className="rv-your-badge">Yours</span>}
                    </div>
                    <p className="rv-all-comment">"{review.comment}"</p>
                    <div className="rv-all-divider" />
                    <div className="rv-all-author">{review.name}</div>
                    <div className="rv-all-date">{formatDate(review.createdAt)}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Reviews;