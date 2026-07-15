import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { API_BASE } from '../../config';

/* ─── Constants ─── */
const PRIMARY = '#ea2e0e';
const PRODUCT_API_BASE_URL = `${API_BASE}/admin/products`;
const CART_API_URL = `${API_BASE}/cart`;
const ORDERS_API_URL = `${API_BASE}/orders`;
const PLACEHOLDER = 'https://placehold.co/800x1000/f5f4f2/999999?text=No+Image';
const DISCOUNT_RATE = 0.20;
const DISCOUNT_THRESHOLD = 5000;

/* ─── Styles ─── */
const injectStyles = () => {
  const id = 'product-detail-styles';
  if (document.getElementById(id)) return;
  const style = document.createElement('style');
  style.id = id;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

    .pd-root {
      font-family: 'DM Sans', sans-serif;
      background: #faf9f7;
      min-height: 100vh;
      color: #111;
    }

    /* ── Skeleton ── */
    @keyframes shimmer {
      0% { background-position: -400px 0; }
      100% { background-position: 400px 0; }
    }
    .skeleton-block {
      background: linear-gradient(90deg, #ece9e4 25%, #f5f3ef 50%, #ece9e4 75%);
      background-size: 400px 100%;
      animation: shimmer 1.6s ease-in-out infinite;
      border-radius: 4px;
    }

    /* ── Toast ── */
    @keyframes toastIn {
      from { opacity: 0; transform: translateY(20px) scale(0.95); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes toastOut {
      from { opacity: 1; transform: translateY(0) scale(1); }
      to   { opacity: 0; transform: translateY(-10px) scale(0.95); }
    }
    .pd-toast {
      position: fixed;
      bottom: 32px;
      right: 32px;
      z-index: 9999;
      padding: 14px 22px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 10px;
      max-width: 320px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.15);
      animation: toastIn 0.3s ease forwards;
    }
    .pd-toast.success { background: #111; color: #fff; }
    .pd-toast.error   { background: ${PRIMARY}; color: #fff; }
    .pd-toast-icon {
      width: 22px; height: 22px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; font-weight: 700; flex-shrink: 0;
    }
    .pd-toast.success .pd-toast-icon { background: rgba(255,255,255,0.2); }
    .pd-toast.error   .pd-toast-icon { background: rgba(255,255,255,0.25); }

    /* ── Thumbnails ── */
    .pd-thumb {
      width: 72px; height: 72px;
      object-fit: cover;
      cursor: pointer;
      border-radius: 8px;
      border: 2px solid transparent;
      transition: all 0.2s ease;
      opacity: 0.65;
      flex-shrink: 0;
    }
    .pd-thumb:hover  { opacity: 1; border-color: #ccc; }
    .pd-thumb.active { opacity: 1; border-color: ${PRIMARY}; }

    /* ── Size buttons ── */
    .pd-size-btn {
      padding: 10px 18px;
      border-radius: 8px;
      border: 1.5px solid #ddd;
      background: #fff;
      font-family: 'DM Sans', sans-serif;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.18s ease;
      color: #111;
    }
    .pd-size-btn:hover:not(:disabled) { border-color: #111; background: #f5f5f5; }
    .pd-size-btn.selected { border-color: ${PRIMARY}; background: ${PRIMARY}; color: #fff; }
    .pd-size-btn:disabled { opacity: 0.4; cursor: not-allowed; }

    /* ── Add to Cart button ── */
    .pd-cart-btn {
      width: 100%;
      padding: 16px;
      border-radius: 12px;
      border: none;
      font-family: 'DM Sans', sans-serif;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      letter-spacing: 0.02em;
    }
    .pd-cart-btn:not(:disabled):hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(234,46,14,0.35);
    }
    .pd-cart-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none !important; }

    /* ── Spinner ── */
    @keyframes spin { to { transform: rotate(360deg); } }
    .pd-spinner {
      width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }

    /* ── Image zoom ── */
    .pd-main-img-wrap {
      position: relative;
      overflow: hidden;
      border-radius: 16px;
      background: #f0ede8;
    }
    .pd-main-img {
      width: 100%;
      display: block;
      transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      object-fit: cover;
    }
    .pd-main-img-wrap:hover .pd-main-img { transform: scale(1.04); }

    /* ── Loyalty badge ── */
    .pd-loyalty-badge {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 12px 16px;
      border-radius: 10px;
      font-size: 12.5px;
      line-height: 1.5;
    }
    .pd-loyalty-badge.earned { background: #f0faf4; border: 1px solid #b8e8cc; color: #1a6b3a; }

    /* ── Breadcrumb link ── */
    .pd-bc-link {
      color: #999;
      text-decoration: none;
      transition: color 0.15s;
      font-size: 13px;
    }
    .pd-bc-link:hover { color: #111; }

    /* ── Back link ── */
    .pd-back-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      font-weight: 500;
      color: #999;
      text-decoration: none;
      transition: color 0.15s;
      margin-top: 20px;
    }
    .pd-back-link:hover { color: #111; }

    /* ── Error/Auth screens ── */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(30px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .pd-center-card {
      animation: fadeUp 0.5s ease both;
    }

    /* ── Scrollbar for thumbs ── */
    .pd-thumb-scroll::-webkit-scrollbar { height: 4px; }
    .pd-thumb-scroll::-webkit-scrollbar-track { background: transparent; }
    .pd-thumb-scroll::-webkit-scrollbar-thumb { background: #ddd; border-radius: 2px; }

    @media (max-width: 768px) {
      .pd-grid { grid-template-columns: 1fr !important; }
      .pd-toast { left: 16px; right: 16px; bottom: 16px; max-width: none; }
    }
  `;
  document.head.appendChild(style);
};

/* ─── Skeleton ─── */
const DetailSkeleton = () => (
  <div className="pd-root" style={{ padding: '32px 24px', maxWidth: 1100, margin: '0 auto' }}>
    {/* breadcrumb */}
    <div className="skeleton-block" style={{ height: 14, width: 220, marginBottom: 32 }} />
    <div className="pd-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
      <div>
        <div className="skeleton-block" style={{ height: 520, borderRadius: 16, marginBottom: 12 }} />
        <div style={{ display: 'flex', gap: 8 }}>
          {[0,1,2].map(i => <div key={i} className="skeleton-block" style={{ width: 72, height: 72, borderRadius: 8 }} />)}
        </div>
      </div>
      <div style={{ paddingTop: 16 }}>
        {[80, 280, 60, 40, 160, 120, 56].map((w, i) => (
          <div key={i} className="skeleton-block" style={{ height: i === 2 ? 40 : i === 6 ? 52 : 18, width: `${w}%` > '100%' ? '100%' : w < 100 ? `${w}%` : '100%', marginBottom: i === 1 ? 24 : 16, borderRadius: i === 6 ? 12 : 4 }} />
        ))}
      </div>
    </div>
  </div>
);

/* ─── Toast ─── */
const Toast = ({ msg, type }) => (
  <div className={`pd-toast ${type}`}>
    <span className="pd-toast-icon">{type === 'success' ? '✓' : '✕'}</span>
    <span>{msg}</span>
  </div>
);

/* ─── Main Component ─── */
const ProductDetail = () => {
  const { isLoggedIn } = useAuth();
  const { refreshCart } = useCart();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [toast, setToast] = useState(null);
  const [discountEligible, setDiscountEligible] = useState(false);
  const [checkingEligibility, setCheckingEligibility] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => { injectStyles(); }, []);

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const checkDiscountEligibility = useCallback(async () => {
    if (!isLoggedIn) return;
    setCheckingEligibility(true);
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      const res = await fetch(
        `${ORDERS_API_URL}?user=${userId}&startDate=${sixMonthsAgo.toISOString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        const orders = await res.json();
        // Handle both array and paginated response shapes
        const list = Array.isArray(orders) ? orders : (orders.data || orders.orders || []);
        const totalSpent = list.reduce((sum, order) => sum + (order.total || 0), 0);
        setDiscountEligible(totalSpent >= DISCOUNT_THRESHOLD);
      }
    } catch (err) {
      console.warn('Could not check discount eligibility:', err);
      setDiscountEligible(false);
    } finally {
      setCheckingEligibility(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      setProduct(null);
      setSelectedSize(null);
      setImgError(false);

      const timeoutId = id ? setTimeout(() => controller.abort(), 20000) : null;

      try {
        let pid = id;
        if (!pid) {
          const r = await fetch(`${PRODUCT_API_BASE_URL}/random`, { signal: controller.signal });
          if (!r.ok) throw new Error('Could not fetch product');
          const rData = await r.json();
          pid = rData._id;
        }

        const res = await fetch(`${PRODUCT_API_BASE_URL}/${pid}`, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (res.status === 404) { setError('Product not found'); return; }
        if (!res.ok) throw new Error(`Server error: ${res.status}`);

        const data = await res.json();
        if (!data?.name) { setError('Product not found'); return; }

        setProduct(data);
        setSelectedImage(data.imageUrls?.[0] || PLACEHOLDER);
      } catch (err) {
        clearTimeout(timeoutId);
        if (err.name === 'AbortError') return;
        setError(err.message || 'Failed to load product.');
      } finally {
        setLoading(false);
      }
    };

    checkDiscountEligibility();
    fetchProduct();

    return () => controller.abort();
  }, [id, isLoggedIn, checkDiscountEligibility]);

  const handleAddToCart = async () => {
    if (!isLoggedIn) { showToast('Please log in to add items to cart.', 'error'); return; }
    if (product?.sizes?.length > 0 && !selectedSize) { showToast('Please select a size first.', 'error'); return; }

    setIsAdding(true);
    try {
      const token = localStorage.getItem('token');
      const finalSize = selectedSize || (product.sizes.length === 0 ? 'One Size' : null);
      const priceToSend = discountEligible
        ? parseFloat((product.price * (1 - DISCOUNT_RATE)).toFixed(2))
        : product.price;

      const res = await fetch(CART_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ product: product._id, size: finalSize, quantity: 1, price: priceToSend, imageUrls: product.imageUrls }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message || 'Added to cart!');
        refreshCart();
      } else {
        showToast(data.message || 'Failed to add to cart.', 'error');
      }
    } catch {
      showToast('A network error occurred.', 'error');
    } finally {
      setIsAdding(false);
    }
  };

  /* ── Not logged in ── */
  if (!isLoggedIn) {
    return (
      <div className="pd-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 24 }}>
        <div className="pd-center-card" style={{ textAlign: 'center', maxWidth: 420, width: '100%' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#fff0ee', border: `2px solid ${PRIMARY}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 28 }}>🔒</div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 700, margin: '0 0 8px', letterSpacing: '-0.02em' }}>Access Required</h1>
          <p style={{ color: '#777', fontSize: 15, margin: '0 0 32px', lineHeight: 1.6 }}>
            You need to be logged in to view product details and make purchases.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', borderRadius: 10, background: '#111', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: 14, transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = PRIMARY}
              onMouseLeave={e => e.currentTarget.style.background = '#111'}>
              Log In →
            </Link>
            <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', borderRadius: 10, border: '1.5px solid #ddd', color: '#111', textDecoration: 'none', fontWeight: 600, fontSize: 14, transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#111'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#111'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#111'; e.currentTarget.style.borderColor = '#ddd'; }}>
              Create Account
            </Link>
          </div>
          <Link to="/" className="pd-back-link" style={{ justifyContent: 'center', marginTop: 24 }}>← Back to Home</Link>
        </div>
      </div>
    );
  }

  /* ── Loading ── */
  if (loading) return <DetailSkeleton />;

  /* ── Error / Not found ── */
  if (error || !product) {
    const isNotFound = error === 'Product not found';
    return (
      <div className="pd-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 24 }}>
        <div className="pd-center-card" style={{ textAlign: 'center', maxWidth: 400, width: '100%' }}>
          <div style={{ fontSize: 52, marginBottom: 20 }}>{isNotFound ? '🔍' : '⚠️'}</div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, fontWeight: 700, margin: '0 0 10px', letterSpacing: '-0.02em' }}>
            {isNotFound ? 'Product Not Found' : 'Something Went Wrong'}
          </h1>
          <p style={{ color: '#777', fontSize: 14, margin: '0 0 28px', lineHeight: 1.6 }}>{error}</p>
          <Link to="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', borderRadius: 10, background: '#111', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: 14 }}
            onMouseEnter={e => e.currentTarget.style.background = PRIMARY}
            onMouseLeave={e => e.currentTarget.style.background = '#111'}>
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const { name, description, imageUrls, sizes = [], stock, category, price } = product;
  const images = imageUrls?.length ? imageUrls : [PLACEHOLDER];
  const originalPrice = price;
  const discountedPrice = discountEligible ? originalPrice * (1 - DISCOUNT_RATE) : originalPrice;
  const isAvailable = stock > 0;
  const isButtonDisabled = isAdding || !isAvailable || (sizes.length > 0 && !selectedSize);

  const btnLabel = () => {
    if (isAdding) return null;
    if (!isAvailable) return 'Out of Stock';
    if (sizes.length > 0 && !selectedSize) return 'Select a Size';
    return 'Add to Cart';
  };

  return (
    <div className="pd-root">
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '32px 24px 64px' }}>

        {/* ── Breadcrumb ── */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 40 }}>
          <Link to="/" className="pd-bc-link">Home</Link>
          <span style={{ color: '#ccc', fontSize: 13 }}>/</span>
          <Link to="/shop" className="pd-bc-link">Shop</Link>
          <span style={{ color: '#ccc', fontSize: 13 }}>/</span>
          <span style={{ fontSize: 13, color: '#111', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>{name}</span>
        </nav>

        {/* ── Main Grid ── */}
        <div className="pd-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'start' }}>

          {/* ── Left: Images ── */}
          <div>
            <div className="pd-main-img-wrap" style={{ aspectRatio: '4/5' }}>
              <img
                src={imgError ? PLACEHOLDER : (selectedImage || PLACEHOLDER)}
                alt={name}
                className="pd-main-img"
                style={{ height: '100%' }}
                onError={() => setImgError(true)}
              />
              {!isAvailable && (
                <div style={{ position: 'absolute', top: 16, left: 16, background: '#111', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '6px 12px', borderRadius: 6 }}>
                  Sold Out
                </div>
              )}
              {discountEligible && (
                <div style={{ position: 'absolute', top: 16, right: 16, background: PRIMARY, color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '6px 12px', borderRadius: 6 }}>
                  -{(DISCOUNT_RATE * 100).toFixed(0)}% Loyalty
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="pd-thumb-scroll" style={{ display: 'flex', gap: 8, marginTop: 12, overflowX: 'auto', paddingBottom: 4 }}>
                {images.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`${name} view ${i + 1}`}
                    className={`pd-thumb ${selectedImage === url ? 'active' : ''}`}
                    onClick={() => { setSelectedImage(url); setImgError(false); }}
                    onError={e => { e.currentTarget.src = PLACEHOLDER; }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Details ── */}
          <div style={{ paddingTop: 8 }}>

            {/* Category pill */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 20, background: '#f0ede8', marginBottom: 16 }}>
              <span style={{ fontSize: 8, color: PRIMARY }}>◆</span>
              <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#555' }}>{category || 'Fashion'}</span>
            </div>

            {/* Name */}
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 34, fontWeight: 700, margin: '0 0 24px', lineHeight: 1.2, letterSpacing: '-0.02em' }}>{name}</h1>

            {/* Divider */}
            <div style={{ height: 1, background: '#eee', marginBottom: 24 }} />

            {/* Pricing */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <span style={{ fontSize: 30, fontWeight: 700, color: discountEligible ? PRIMARY : '#111', letterSpacing: '-0.02em' }}>
                  Ksh {discountedPrice.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                {discountEligible && discountedPrice < originalPrice && (
                  <span style={{ fontSize: 17, color: '#aaa', textDecoration: 'line-through', fontWeight: 400 }}>
                    Ksh {originalPrice.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                )}
              </div>
              {discountEligible && (
                <div style={{ fontSize: 13, color: '#1a6b3a', fontWeight: 500, marginTop: 4 }}>
                  You save Ksh {(originalPrice - discountedPrice).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              )}
            </div>

            {/* Stock */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: isAvailable ? '#22c55e' : '#f87171', flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: isAvailable ? '#166534' : '#991b1b', fontWeight: 500 }}>
                {isAvailable ? `In Stock — ${stock} item${stock !== 1 ? 's' : ''} available` : 'Currently Sold Out'}
              </span>
            </div>

            {/* Loyalty — only visible when checking or confirmed eligible */}
            {checkingEligibility ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 10, background: '#f8f8f8', marginBottom: 20, fontSize: 13, color: '#777' }}>
                <div className="pd-spinner" style={{ borderTopColor: '#999', borderColor: '#ddd' }} />
                Checking discount eligibility…
              </div>
            ) : discountEligible ? (
              <div className="pd-loyalty-badge earned" style={{ marginBottom: 20 }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>🏆</span>
                <span><strong>Loyalty discount applied!</strong> You've spent over Ksh {DISCOUNT_THRESHOLD.toLocaleString()} in the last 6 months.</span>
              </div>
            ) : null}

            {/* Divider */}
            <div style={{ height: 1, background: '#eee', marginBottom: 24 }} />

            {/* Size */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#555' }}>
                  {sizes.length > 0 ? 'Select Size' : 'Size'}
                </span>
                {selectedSize && (
                  <span style={{ fontSize: 13, color: PRIMARY, fontWeight: 600 }}>Selected: {selectedSize}</span>
                )}
              </div>
              {sizes.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {sizes.map(size => (
                    <button
                      key={size}
                      className={`pd-size-btn ${selectedSize === size ? 'selected' : ''}`}
                      onClick={() => setSelectedSize(prev => prev === size ? null : size)}
                      disabled={!isAvailable}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              ) : (
                <span style={{ fontSize: 13, color: '#777', background: '#f5f5f5', padding: '8px 14px', borderRadius: 8, display: 'inline-block' }}>
                  One Size Fits All
                </span>
              )}
            </div>

            {/* Add to Cart */}
            <button
              className="pd-cart-btn"
              style={{
                background: isButtonDisabled ? '#ddd' : '#111',
                color: isButtonDisabled ? '#999' : '#fff',
                marginBottom: 12,
              }}
              onClick={handleAddToCart}
              disabled={isButtonDisabled}
              onMouseEnter={e => { if (!isButtonDisabled) e.currentTarget.style.background = PRIMARY; }}
              onMouseLeave={e => { if (!isButtonDisabled) e.currentTarget.style.background = '#111'; }}
            >
              {isAdding ? (
                <><div className="pd-spinner" /> Adding to Cart…</>
              ) : (
                <>{btnLabel()} {!isButtonDisabled && '→'}</>
              )}
            </button>

            {/* Description */}
            {description && (
              <>
                <div style={{ height: 1, background: '#eee', margin: '24px 0' }} />
                <div>
                  <h3 style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#555', margin: '0 0 10px' }}>Description</h3>
                  <p style={{ fontSize: 14.5, color: '#555', lineHeight: 1.75, margin: 0 }}>{description}</p>
                </div>
              </>
            )}

            {/* Back link */}
            <Link to="/shop" className="pd-back-link">← Continue Shopping</Link>
          </div>
        </div>
      </div>

      {/* ── Toast ── */}
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
};

export default ProductDetail;