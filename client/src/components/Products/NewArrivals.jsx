import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Search, X, ShoppingBag, ArrowRight, Check } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ProductModal } from "../Common/ProductModal";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { API_BASE } from '../../config';

const PRIMARY = '#ea2e0e';
const API_URL = `${API_BASE}/admin/products`;
const CART_API_URL = `${API_BASE}/cart`;

/* ─── Inject Styles ─── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Search ── */
  .na-search-wrap { position: relative; width: 280px; }
  .na-search-input {
    width: 100%;
    padding: 11px 40px 11px 14px;
    border: 1.5px solid #d8d4ce;
    background: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: #111;
    outline: none;
    border-radius: 0;
    transition: border-color 0.2s, box-shadow 0.2s;
    letter-spacing: 0.01em;
  }
  .na-search-input:focus { border-color: #111; box-shadow: inset 0 0 0 1px #111; }
  .na-search-input::placeholder { color: #bbb; }

  /* ── Filter chips ── */
  .na-chip {
    padding: 6px 14px;
    border: 1.5px solid #d8d4ce;
    background: transparent;
    font-family: 'DM Sans', sans-serif;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #666;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
  }
  .na-chip:hover { border-color: #111; color: #111; }
  .na-chip.active { border-color: #111; background: #111; color: #fff; }

  /* ── Product card ── */
  .na-card {
    background: #fff;
    border: 1px solid #e8e4de;
    overflow: hidden;
    cursor: pointer;
    transition: border-color 0.25s, box-shadow 0.25s;
    position: relative;
    display: flex;
    flex-direction: column;
  }
  .na-card:hover { border-color: #111; box-shadow: 0 4px 24px rgba(0,0,0,0.07); }
  .na-card:hover .na-card-img { transform: scale(1.06); }
  .na-card:hover .na-quick-actions { opacity: 1; transform: translateY(0); }

  .na-card-img-wrap {
    aspect-ratio: 3/4;
    overflow: hidden;
    background: #f2f0ed;
    position: relative;
  }
  .na-card-img {
    width: 100%; height: 100%;
    object-fit: cover; object-position: top;
    display: block;
    transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  /* Quick actions overlay */
  .na-quick-actions {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    padding: 12px;
    background: rgba(17,17,17,0.92);
    opacity: 0;
    transform: translateY(8px);
    transition: opacity 0.25s ease, transform 0.25s ease;
    backdrop-filter: blur(4px);
  }

  /* Sold out overlay */
  .na-sold-out-overlay {
    position: absolute; inset: 0;
    background: rgba(250,249,247,0.75);
    display: flex; align-items: center; justify-content: center;
  }
  .na-sold-out-label {
    padding: 6px 16px;
    border: 1px solid #999;
    font-family: 'DM Sans', sans-serif;
    font-size: 9px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #555;
    background: rgba(255,255,255,0.9);
  }

  /* NEW badge */
  .na-badge-new {
    position: absolute; top: 12px; left: 12px;
    padding: 3px 9px;
    background: #111;
    font-family: 'DM Sans', sans-serif;
    font-size: 8px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #fff;
  }

  /* Size buttons */
  .na-size-btn {
    padding: 4px 9px;
    border: 1px solid #e0ddd8;
    background: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 10px;
    letter-spacing: 0.04em;
    color: #555;
    cursor: pointer;
    transition: all 0.12s;
  }
  .na-size-btn:hover:not(:disabled) { border-color: #555; }
  .na-size-btn.selected { border-color: #111; background: #111; color: #fff; }
  .na-size-btn:disabled { opacity: 0.35; cursor: not-allowed; }

  /* Add to cart button */
  .na-atc-btn {
    width: 100%; padding: 11px 0;
    background: #111; border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 10px; font-weight: 500;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: #fff; cursor: pointer;
    transition: background 0.18s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .na-atc-btn:hover:not(:disabled) { background: ${PRIMARY}; }
  .na-atc-btn:disabled { background: #d8d4ce; color: #999; cursor: not-allowed; }
  .na-atc-btn.adding { background: #333; }

  /* Quick add (overlay) */
  .na-quick-atc-btn {
    width: 100%; padding: 10px 0;
    background: #fff; border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 10px; font-weight: 600;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: #111; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: background 0.15s, color 0.15s;
  }
  .na-quick-atc-btn:hover { background: ${PRIMARY}; color: #fff; }

  /* ── Snackbar ── */
  @keyframes snack-in  { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  @keyframes snack-out { from { transform: translateY(0); opacity: 1; } to { transform: translateY(100%); opacity: 0; } }
  @keyframes progress  { from { width: 100%; } to { width: 0%; } }
  @keyframes check-pop { 0%{transform:scale(0)} 60%{transform:scale(1.2)} 100%{transform:scale(1)} }

  .na-snackbar {
    position: fixed;
    bottom: 32px; left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    background: #111;
    color: #fff;
    display: flex; align-items: center; gap: 16px;
    padding: 0;
    width: 420px; max-width: calc(100vw - 32px);
    box-shadow: 0 8px 40px rgba(0,0,0,0.22);
    overflow: hidden;
  }
  .na-snackbar.entering { animation: snack-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
  .na-snackbar.leaving  { animation: snack-out 0.25s ease forwards; }
  .na-snackbar-icon {
    width: 52px; min-width: 52px; height: 52px;
    background: ${PRIMARY};
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .na-snackbar-icon svg { animation: check-pop 0.4s ease 0.1s both; }
  .na-snackbar-body { flex: 1; padding: 12px 0; }
  .na-snackbar-title {
    font-family: 'DM Sans', sans-serif;
    font-size: 12px; font-weight: 600;
    letter-spacing: 0.06em; text-transform: uppercase;
    color: #fff; margin-bottom: 2px;
  }
  .na-snackbar-sub {
    font-family: 'DM Sans', sans-serif;
    font-size: 12px; color: #999;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    max-width: 220px;
  }
  .na-snackbar-actions { display: flex; align-items: center; gap: 0; padding-right: 12px; }
  .na-snackbar-view {
    padding: 6px 12px;
    border: 1px solid rgba(255,255,255,0.2);
    font-family: 'DM Sans', sans-serif;
    font-size: 10px; font-weight: 500;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: #fff; background: transparent;
    cursor: pointer; white-space: nowrap;
    transition: background 0.15s, border-color 0.15s;
    display: flex; align-items: center; gap: 6px;
    text-decoration: none;
  }
  .na-snackbar-view:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.4); }
  .na-snackbar-close {
    width: 32px; height: 32px;
    background: transparent; border: none;
    color: #666; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: color 0.15s;
    flex-shrink: 0;
  }
  .na-snackbar-close:hover { color: #fff; }
  .na-snackbar-progress {
    position: absolute; bottom: 0; left: 0; height: 2px;
    background: ${PRIMARY};
  }
  .na-snackbar-progress.running { animation: progress 3.5s linear forwards; }

  /* ── Skeleton ── */
  @keyframes shimmer { from { background-position: -400px 0; } to { background-position: 400px 0; } }
  .na-skeleton {
    background: linear-gradient(90deg, #ede9e3 25%, #f5f2ee 50%, #ede9e3 75%);
    background-size: 400px 100%;
    animation: shimmer 1.5s ease-in-out infinite;
  }

  /* ── Empty state ── */
  .na-empty {
    grid-column: 1 / -1;
    padding: 80px 24px;
    text-align: center;
    border: 1px solid #e8e4de;
    background: #fff;
  }

  /* ── Count badge on search ── */
  .na-result-count {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    color: #bbb;
    letter-spacing: 0.06em;
  }

  /* Hover detail link */
  .na-detail-link {
    display: flex; align-items: center; gap: 6px;
    font-family: 'DM Sans', sans-serif;
    font-size: 10px; font-weight: 500;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: #ccc; text-decoration: none;
    transition: color 0.15s;
    cursor: pointer; background: none; border: none;
  }
  .na-detail-link:hover { color: #fff; }

  @media (max-width: 640px) {
    .na-header-row { flex-direction: column !important; align-items: flex-start !important; gap: 20px !important; }
    .na-search-wrap { width: 100% !important; }
    .na-snackbar { bottom: 0; width: 100%; max-width: 100%; }
  }
`;

/* ─── Snackbar ─── */
const Snackbar = ({ item, onClose }) => {
  const [phase, setPhase] = useState('entering'); // entering | visible | leaving
  const [progressKey, setProgressKey] = useState(0);
  const timerRef = useRef(null);

  const dismiss = useCallback(() => {
    clearTimeout(timerRef.current);
    setPhase('leaving');
    setTimeout(onClose, 260);
  }, [onClose]);

  useEffect(() => {
    setPhase('entering');
    setProgressKey(k => k + 1);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(dismiss, 3500);
    return () => clearTimeout(timerRef.current);
  }, [item, dismiss]);

  if (!item) return null;

  return (
    <div className={`na-snackbar ${phase}`}>
      <div className="na-snackbar-icon">
        <Check size={20} color="#fff" strokeWidth={2.5} />
      </div>
      <div className="na-snackbar-body">
        <div className="na-snackbar-title">Added to Cart</div>
        <div className="na-snackbar-sub">{item.name}{item.size !== 'One Size' ? ` — ${item.size}` : ''}</div>
      </div>
      <div className="na-snackbar-actions">
        <button className="na-snackbar-close" onClick={dismiss} aria-label="Dismiss">
          <X size={14} />
        </button>
      </div>
      <div key={progressKey} className="na-snackbar-progress running" />
    </div>
  );
};

/* ─── Skeleton Card ─── */
const SkeletonCard = () => (
  <div style={{ background: '#fff', border: '1px solid #e8e4de', overflow: 'hidden' }}>
    <div className="na-skeleton" style={{ aspectRatio: '3/4' }} />
    <div style={{ padding: '14px 14px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div className="na-skeleton" style={{ height: 10, width: '50%', borderRadius: 2 }} />
      <div className="na-skeleton" style={{ height: 17, width: '75%', borderRadius: 2 }} />
      <div className="na-skeleton" style={{ height: 14, width: '35%', borderRadius: 2 }} />
      <div style={{ display: 'flex', gap: 5, marginTop: 4 }}>
        {[1,2,3].map(i => <div key={i} className="na-skeleton" style={{ width: 32, height: 26, borderRadius: 2 }} />)}
      </div>
      <div className="na-skeleton" style={{ height: 38, borderRadius: 2, marginTop: 4 }} />
    </div>
  </div>
);

/* ─── Product Card ─── */
const ProductCard = ({ product, selectedSizes, onSizeSelect, onQuickAdd, addingProductId, onCardClick }) => {
  const isAdding = addingProductId === product._id;
  const isOneSize = !product.sizes || product.sizes.length === 0;
  const currentSize = isOneSize ? 'One Size' : selectedSizes[product._id];
  const canAdd = product.stock > 0 && !isAdding && (isOneSize || currentSize);
  const isSoldOut = product.stock === 0;

  return (
    <div
      className="na-card"
      onClick={() => onCardClick(product)}
    >
      {/* Image */}
      <div className="na-card-img-wrap">
        <img
          src={product.imageUrls?.[0] || 'https://placehold.co/600x800/f2f0ed/999?text=No+Image'}
          alt={product.name}
          className="na-card-img"
          onError={e => { e.currentTarget.src = 'https://placehold.co/600x800/f2f0ed/999?text=No+Image'; }}
        />

        {/* Sold out */}
        {isSoldOut && (
          <div className="na-sold-out-overlay">
            <span className="na-sold-out-label">Sold Out</span>
          </div>
        )}

        {/* NEW badge */}
        {!isSoldOut && <div className="na-badge-new">New</div>}

        {/* Quick actions on hover */}
        {!isSoldOut && (
          <div className="na-quick-actions" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isOneSize ? 0 : 8 }}>
              <button className="na-detail-link" onClick={() => onCardClick(product)}>
                View Details <ArrowRight size={10} />
              </button>
              {!isOneSize && currentSize && (
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: '#888', letterSpacing: '0.08em' }}>
                  SIZE: {currentSize}
                </span>
              )}
            </div>
            <button
              className="na-quick-atc-btn"
              onClick={() => canAdd && onQuickAdd(product)}
              disabled={!canAdd}
            >
              {isAdding ? (
                <>
                  <span style={{ display: 'inline-block', width: 10, height: 10, border: '1.5px solid #666', borderTopColor: '#111', borderRadius: '50%', animation: 'na-spin 0.7s linear infinite' }} />
                  Adding
                </>
              ) : !isOneSize && !currentSize ? (
                'Select Size Below'
              ) : (
                <><ShoppingBag size={12} /> Add to Cart</>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '14px 14px 16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#bbb', marginBottom: 4 }}>
          {product.category || 'Fashion'}
        </p>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 16, color: '#111', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.3 }}>
          {product.name}
        </h3>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 500, color: '#111', marginBottom: 12 }}>
          Ksh {product.price?.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
        </p>

        {/* Sizes */}
        {!isOneSize && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }} onClick={e => e.stopPropagation()}>
            {product.sizes.map(size => (
              <button
                key={size}
                className={`na-size-btn ${currentSize === size ? 'selected' : ''}`}
                onClick={e => { e.stopPropagation(); onSizeSelect(product._id, size); }}
                disabled={isSoldOut}
              >
                {size}
              </button>
            ))}
          </div>
        )}
        {isOneSize && (
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, color: '#ccc', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>One Size</p>
        )}

        {/* Add to cart */}
        <div style={{ marginTop: 'auto' }} onClick={e => e.stopPropagation()}>
          <button
            className={`na-atc-btn${isAdding ? ' adding' : ''}`}
            onClick={() => canAdd && onQuickAdd(product)}
            disabled={!canAdd}
          >
            {isAdding ? (
              <>
                <span style={{ display: 'inline-block', width: 10, height: 10, border: '1.5px solid #666', borderTopColor: '#fff', borderRadius: '50%', animation: 'na-spin 0.7s linear infinite' }} />
                Adding
              </>
            ) : isSoldOut ? 'Sold Out'
              : !isOneSize && !currentSize ? 'Select Size'
              : <><ShoppingBag size={12} /> Add to Cart</>
            }
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Main ─── */
const NewArrivals = () => {
  const { isLoggedIn } = useAuth();
  const { refreshCart } = useCart();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedSizes, setSelectedSizes] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addingProductId, setAddingProductId] = useState(null);
  const [snackItem, setSnackItem] = useState(null);

  /* Inject styles once */
  useEffect(() => {
    const id = 'na-styles';
    if (!document.getElementById(id)) {
      const s = document.createElement('style');
      s.id = id;
      s.textContent = STYLES + `
        @keyframes na-spin { to { transform: rotate(360deg); } }
      `;
      document.head.appendChild(s);
    }
  }, []);

  /* Fetch */
  useEffect(() => {
    const fetchNewArrivals = async () => {
      const token = localStorage.getItem('token');
      try {
        setLoading(true);
        const { data } = await axios.get(API_URL, {
          headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
        });
        const sorted = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setProducts(sorted.slice(0, 12).map(p => ({
          ...p,
          imageUrls: p.imageUrls?.length ? p.imageUrls : ['https://placehold.co/600x800/f2f0ed/999?text=No+Image'],
        })));
      } catch (err) {
        if (err.response?.status === 401) { localStorage.removeItem('token'); navigate('/signup'); }
        else setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNewArrivals();
  }, [navigate]);

  /* Categories derived from products */
  const categories = useMemo(() => {
    const cats = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];
    return cats;
  }, [products]);

  /* Filtered products */
  const filteredProducts = useMemo(() => {
    const t = searchTerm.toLowerCase();
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(t) || p.description?.toLowerCase().includes(t);
      const matchesCat = activeCategory === 'All' || p.category === activeCategory;
      return matchesSearch && matchesCat;
    });
  }, [products, searchTerm, activeCategory]);

  /* Add to cart */
  const handleQuickAdd = async (product) => {
    if (addingProductId) return;
    if (!isLoggedIn) {
      setSnackItem({ name: 'Please log in to add items.', size: '', isError: true });
      return;
    }
    const size = product.sizes?.length > 0 ? selectedSizes[product._id] : 'One Size';
    if (product.sizes?.length > 0 && !size) {
      setSnackItem({ name: 'Select a size first.', size: '', isError: true });
      return;
    }

    setAddingProductId(product._id);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(CART_API_URL,
        { productId: product._id, size, quantity: 1, price: parseFloat(product.price.toFixed(2)) },
        { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
      );
      if (res.status === 201) {
        setSnackItem({ name: product.name, size: size || 'One Size' });
        refreshCart();
      } else {
        setSnackItem({ name: 'Failed to add to cart.', size: '', isError: true });
      }
    } catch (err) {
      setSnackItem({ name: err.response?.data?.message || 'Network error.', size: '', isError: true });
    } finally {
      setAddingProductId(null);
    }
  };

  return (
    <section style={{ background: '#faf9f7', borderTop: '1px solid #e8e4de', padding: '80px 32px 96px' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>

        {/* ── Header ── */}
        <div className="na-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36, gap: 24 }}>
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: PRIMARY, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ display: 'inline-block', width: 16, height: 1, background: PRIMARY }} />
              Just Dropped
            </p>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px, 5vw, 68px)', letterSpacing: '0.03em', lineHeight: 1, color: '#111' }}>
              New Arrivals
            </h2>
          </div>

          {/* Search */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
            <div className="na-search-wrap">
              <input
                type="text"
                placeholder="Search arrivals…"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="na-search-input"
              />
              {searchTerm ? (
                <button
                  onClick={() => setSearchTerm('')}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#999', cursor: 'pointer', display: 'flex' }}
                >
                  <X size={14} />
                </button>
              ) : (
                <Search size={14} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#bbb', pointerEvents: 'none' }} />
              )}
            </div>
            {!loading && (
              <span className="na-result-count">
                {filteredProducts.length} / {products.length} items
              </span>
            )}
          </div>
        </div>

        {/* ── Category Chips ── */}
        {!loading && categories.length > 1 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
            {categories.map(cat => (
              <button
                key={cat}
                className={`na-chip ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* ── Divider ── */}
        <div style={{ height: 1, background: '#e8e4de', marginBottom: 32 }} />

        {/* ── Grid ── */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 16 }}>
            {Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 16 }}>
            {filteredProducts.map((product, i) => (
              <div key={product._id} style={{ animation: `fadeUp 0.4s ease ${i * 0.04}s both` }}>
                <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }`}</style>
                <ProductCard
                  product={product}
                  selectedSizes={selectedSizes}
                  onSizeSelect={(id, size) => setSelectedSizes(p => ({ ...p, [id]: p[id] === size ? null : size }))}
                  onQuickAdd={handleQuickAdd}
                  addingProductId={addingProductId}
                  onCardClick={p => { setSelectedProduct(p); setIsModalOpen(true); }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="na-empty">
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, letterSpacing: '0.06em', color: '#d8d4ce', marginBottom: 10 }}>
              No Results
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 17, color: '#aaa' }}>
              {searchTerm ? `Nothing matched "${searchTerm}"` : 'Check back soon for new drops.'}
            </p>
            {(searchTerm || activeCategory !== 'All') && (
              <button
                onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}
                style={{ marginTop: 20, padding: '8px 20px', border: '1.5px solid #d8d4ce', background: 'transparent', fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#666', cursor: 'pointer' }}
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Product Modal ── */}
      {isModalOpen && (
        <ProductModal
          product={selectedProduct}
          onClose={() => { setIsModalOpen(false); setSelectedProduct(null); }}
        />
      )}

      {/* ── Snackbar ── */}
      {snackItem && (
        <Snackbar
          item={snackItem}
          onClose={() => setSnackItem(null)}
          onViewCart={() => navigate('#')}
        />
      )}
    </section>
  );
};

export default NewArrivals;