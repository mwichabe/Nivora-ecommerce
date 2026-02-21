import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, LayoutDashboard } from 'lucide-react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ProductModal } from '../components/Common/ProductModal';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const PRIMARY = '#ea2e0e';
const API_URL = 'https://one-man-server.onrender.com/api/admin/products';
const CART_API_URL = 'https://one-man-server.onrender.com/api/cart';

/* ─── useInView ─── */
const useInView = () => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
};

/* ─── Reveal wrapper ─── */
const Reveal = ({ children, delay = 0, style = {} }) => {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(24px)',
      transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
};

/* ─── Skeleton Card ─── */
const SkeletonCard = () => (
  <div style={{ background: '#fafafa', border: '1px solid #ebebeb', overflow: 'hidden' }}>
    <div style={{ aspectRatio: '3/4', background: '#f0f0f0', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.6),transparent)', animation: 'shimmer 1.4s infinite' }} />
    </div>
    <div style={{ padding: '14px 14px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {[['65%', 13], ['40%', 16], ['100%', 38]].map(([w, h], i) => (
        <div key={i} style={{ height: h, width: w, background: '#ebebeb', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.6),transparent)', animation: `shimmer 1.4s infinite ${i * 0.1}s` }} />
        </div>
      ))}
    </div>
  </div>
);

/* ─── Product Card ─── */
const ProductCard = ({ product, selectedSizes, onSizeSelect, onQuickAdd, addingProductId, onCardClick }) => {
  const isAdding = addingProductId === product._id;
  const isOneSize = !product.sizes || product.sizes.length === 0;
  const currentSize = isOneSize ? 'One Size' : selectedSizes[product._id];
  const canAdd = product.stock > 0 && !isAdding && (isOneSize || currentSize);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{ background: '#fff', border: '1px solid #e8e8e8', overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.2s' }}
      onClick={() => onCardClick(product)}
      onMouseEnter={e => { setHovered(true); e.currentTarget.style.borderColor = '#111'; }}
      onMouseLeave={e => { setHovered(false); e.currentTarget.style.borderColor = '#e8e8e8'; }}
    >
      {/* Image */}
      <div style={{ aspectRatio: '3/4', overflow: 'hidden', background: '#f5f4f2', position: 'relative' }}>
        <img
          src={product.imageUrls[0]} alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block', transition: 'transform 0.55s ease', transform: hovered ? 'scale(1.05)' : 'scale(1)' }}
        />
        {product.stock === 0 && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff', border: '1px solid #fff', padding: '5px 12px' }}>Sold Out</span>
          </div>
        )}
        {/* Category label */}
        <div style={{ position: 'absolute', top: 10, left: 10, background: '#111', padding: '4px 10px' }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#fff' }}>{product.category}</span>
        </div>
        {/* Low stock badge */}
        {product.stock > 0 && product.stock <= 5 && (
          <div style={{ position: 'absolute', top: 10, right: 10, background: PRIMARY, padding: '4px 10px' }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff' }}>Only {product.stock} left</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '14px 14px 18px' }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 16, color: '#111', marginBottom: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {product.name}
        </h3>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 600, color: '#111', marginBottom: 12 }}>
          Ksh {product.price.toFixed(2)}
        </p>

        {/* Sizes */}
        {!isOneSize ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
            {product.sizes.map(size => (
              <button key={size}
                onClick={e => { e.stopPropagation(); onSizeSelect(product._id, size); }}
                disabled={product.stock === 0}
                style={{
                  padding: '4px 10px', fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.06em',
                  cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                  border: currentSize === size ? `1.5px solid ${PRIMARY}` : '1.5px solid #e0e0e0',
                  background: currentSize === size ? PRIMARY : '#fff',
                  color: currentSize === size ? '#fff' : '#777',
                  transition: 'all 0.12s',
                }}>
                {size}
              </button>
            ))}
          </div>
        ) : (
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: '#bbb', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>One Size</p>
        )}

        {/* Add button */}
        <button
          onClick={e => { e.stopPropagation(); if (canAdd) onQuickAdd(product); }}
          disabled={!canAdd}
          style={{
            width: '100%', padding: '11px 0', background: canAdd ? '#111' : '#f0f0f0',
            border: 'none', cursor: canAdd ? 'pointer' : 'not-allowed',
            fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: canAdd ? '#fff' : '#bbb', transition: 'background 0.18s',
          }}
          onMouseEnter={e => { if (canAdd) e.currentTarget.style.background = PRIMARY; }}
          onMouseLeave={e => { if (canAdd) e.currentTarget.style.background = '#111'; }}
        >
          {isAdding ? 'Adding…'
            : product.stock === 0 ? 'Sold Out'
            : !isOneSize && !currentSize ? 'Select Size'
            : 'Quick Add →'}
        </button>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   MAIN CATEGORY PAGE
═══════════════════════════════════════════════ */
const CategoryPage = ({ categoryName }) => {
  const { isLoggedIn } = useAuth();
  const { refreshCart } = useCart();
  const navigate = useNavigate();

  const [products, setProducts]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [searchTerm, setSearchTerm]       = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen]     = useState(false);
  const [addingProductId, setAddingProductId] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [toast, setToast]                 = useState(null);
  const [scrolled, setScrolled]           = useState(false);
  const [sortBy, setSortBy]               = useState('default');
  const [viewMode, setViewMode]           = useState('grid'); // 'grid' | 'wide'
  const [mounted, setMounted]             = useState(false);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/signup'); return; }
      try {
        setLoading(true);
        const { data } = await axios.get(API_URL, {
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        });
        setProducts(data.map(p => ({
          ...p,
          imageUrls: p.imageUrls?.length ? p.imageUrls : ['https://placehold.co/600x800/f5f4f2/999999?text=No+Image'],
        })));
      } catch (err) {
        if (err.response?.status === 401) { localStorage.removeItem('token'); navigate('/signup'); }
        else setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [navigate]);

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => p.category === categoryName);
    if (searchTerm) {
      const t = searchTerm.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(t) || p.description?.toLowerCase().includes(t));
    }
    if (sortBy === 'price-asc')  result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') result = [...result].sort((a, b) => b.price - a.price);
    if (sortBy === 'name')       result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === 'stock')      result = [...result].sort((a, b) => b.stock - a.stock);
    return result;
  }, [products, searchTerm, categoryName, sortBy]);

  const handleQuickAdd = async (product) => {
    if (addingProductId) return;
    if (!isLoggedIn) { showToast('Please log in to add items to cart.', 'error'); return; }
    const size = product.sizes?.length > 0 ? selectedSizes[product._id] : 'One Size';
    if (product.sizes?.length > 0 && !size) { showToast('Please select a size first.', 'error'); return; }
    setAddingProductId(product._id);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(CART_API_URL,
        { productId: product._id, size, quantity: 1, price: parseFloat(product.price.toFixed(2)) },
        { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
      );
      if (res.status === 201) { showToast(`Added: ${product.name} (${size})`); refreshCart(); }
      else showToast('Failed to add to cart.', 'error');
    } catch (err) {
      showToast(err.response?.data?.message || 'Network error.', 'error');
    } finally {
      setAddingProductId(null);
    }
  };

  // Derived stats
  const inStockCount = filteredProducts.filter(p => p.stock > 0).length;
  const avgPrice = filteredProducts.length
    ? (filteredProducts.reduce((s, p) => s + p.price, 0) / filteredProducts.length).toFixed(0)
    : 0;

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', fontFamily: "'Cormorant Garamond', serif", color: '#111' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        @keyframes shimmer { from { transform: translateX(-100%); } to { transform: translateX(200%); } }
        @keyframes fadeUp  { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ticker  { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .search-input { width: 100%; padding: 12px 44px 12px 16px; border: 1.5px solid #e0e0e0; background: #fff; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #111; outline: none; border-radius: 0; transition: border-color 0.2s, box-shadow 0.2s; }
        .search-input:focus { border-color: #111; box-shadow: 0 0 0 3px rgba(0,0,0,0.04); }
        .search-input::placeholder { color: #ccc; }
        .sort-select { padding: 8px 32px 8px 14px; font-family: 'DM Sans', sans-serif; font-size: 11px; letter-spacing: 0.08em; border: 1.5px solid #e0e0e0; background: #fff; color: #888; outline: none; cursor: pointer; appearance: none; border-radius: 0; transition: border-color 0.15s; }
        .sort-select:focus { border-color: #111; }
        .view-btn { width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; border: 1.5px solid #e0e0e0; background: #fff; cursor: pointer; transition: all 0.15s; }
        .view-btn.active { background: #111; border-color: #111; }
        .view-btn:hover:not(.active) { border-color: #111; }
      `}</style>

      {/* ── Hero header ── */}
      <div style={{
        background: '#111', padding: '52px 32px 44px', position: 'relative', overflow: 'hidden',
        opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(-12px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
      }}>
        {/* Grid texture */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`, backgroundSize: '48px 48px' }} />
        {/* Ghost text */}
        <div style={{ position: 'absolute', right: -10, top: '50%', transform: 'translateY(-50%)', fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(80px, 14vw, 180px)', color: 'rgba(255,255,255,0.03)', userSelect: 'none', letterSpacing: '0.04em', lineHeight: 1 }}>
          {categoryName.toUpperCase()}
        </div>

        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: PRIMARY, marginBottom: 14, animation: 'fadeUp 0.6s ease both' }}>◆ Browse Category</p>
              <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(52px, 8vw, 96px)', lineHeight: 0.9, letterSpacing: '0.02em', color: '#fff', animation: 'fadeUp 0.7s ease 0.1s both' }}>
                {categoryName}<br /><span style={{ color: PRIMARY }}>Collection</span>
              </h1>
            </div>
            <Link to="/app"
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'transparent', border: '1.5px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)', fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', transition: 'all 0.2s', animation: 'fadeUp 0.7s ease 0.2s both' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}>
              <LayoutDashboard size={14} /> Dashboard
            </Link>
          </div>

          {/* Stats strip */}
          {!loading && (
            <div style={{ display: 'flex', gap: 40, marginTop: 36, paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.08)', animation: 'fadeUp 0.7s ease 0.3s both' }}>
              {[
                [filteredProducts.length, 'Products'],
                [inStockCount, 'In Stock'],
                [`Ksh ${Number(avgPrice).toLocaleString()}`, 'Avg Price'],
              ].map(([val, lbl]) => (
                <div key={lbl}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#fff', letterSpacing: '0.04em', lineHeight: 1 }}>{val}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 3 }}>{lbl}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Red ticker ── */}
      <div style={{ background: PRIMARY, overflow: 'hidden', height: 34, display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', animation: 'ticker 22s linear infinite', whiteSpace: 'nowrap' }}>
          {[...Array(4)].map((_, i) => (
            <span key={i} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.18em', color: '#fff', textTransform: 'uppercase', paddingRight: 80 }}>
              {categoryName.toUpperCase()} COLLECTION &nbsp;·&nbsp; PREMIUM QUALITY &nbsp;·&nbsp; FAST SHIPPING COUNTRYWIDE &nbsp;·&nbsp; NEW ARRIVALS WEEKLY &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ── Sticky controls ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50, background: '#fff',
        borderBottom: '1px solid #e8e8e8',
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.07)' : 'none',
        transition: 'box-shadow 0.3s',
        padding: '14px 32px',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          {/* Search + sort + view toggle */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                placeholder={`Search within ${categoryName}…`}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <Search size={14} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#bbb', pointerEvents: 'none' }} />
            </div>

            {/* Sort */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="sort-select">
                <option value="default">Default</option>
                <option value="price-asc">Price ↑</option>
                <option value="price-desc">Price ↓</option>
                <option value="name">Name A–Z</option>
                <option value="stock">In Stock</option>
              </select>
              <svg width="10" height="6" viewBox="0 0 10 6" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#bbb' }}>
                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              </svg>
            </div>

            {/* View mode toggles */}
            <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
              <button onClick={() => setViewMode('grid')} className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} title="Grid view">
                <svg width="13" height="13" viewBox="0 0 13 13" fill={viewMode === 'grid' ? '#fff' : '#aaa'}>
                  <rect x="0" y="0" width="5.5" height="5.5" /><rect x="7.5" y="0" width="5.5" height="5.5" />
                  <rect x="0" y="7.5" width="5.5" height="5.5" /><rect x="7.5" y="7.5" width="5.5" height="5.5" />
                </svg>
              </button>
              <button onClick={() => setViewMode('wide')} className={`view-btn ${viewMode === 'wide' ? 'active' : ''}`} title="Wide view">
                <svg width="13" height="13" viewBox="0 0 13 13" fill={viewMode === 'wide' ? '#fff' : '#aaa'}>
                  <rect x="0" y="0" width="13" height="5.5" /><rect x="0" y="7.5" width="13" height="5.5" />
                </svg>
              </button>
            </div>

            {/* Count */}
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#aaa', letterSpacing: '0.06em', flexShrink: 0 }}>
              {loading ? '—' : filteredProducts.length} items
            </div>
          </div>

          {/* Active filter pills */}
          {(searchTerm || sortBy !== 'default') && !loading && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#bbb', marginRight: 4 }}>Active:</span>
              {searchTerm && (
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, background: '#111', color: '#fff', padding: '3px 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
                  "{searchTerm}"
                  <button onClick={() => setSearchTerm('')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: 0, fontSize: 11 }}>✕</button>
                </span>
              )}
              {sortBy !== 'default' && (
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, background: '#111', color: '#fff', padding: '3px 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
                  Sorted: {sortBy === 'price-asc' ? 'Price ↑' : sortBy === 'price-desc' ? 'Price ↓' : sortBy === 'name' ? 'Name A–Z' : 'In Stock'}
                  <button onClick={() => setSortBy('default')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: 0, fontSize: 11 }}>✕</button>
                </span>
              )}
              <button onClick={() => { setSearchTerm(''); setSortBy('default'); }}
                style={{ padding: '3px 10px', fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'transparent', border: `1px solid ${PRIMARY}`, color: PRIMARY, cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = PRIMARY; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = PRIMARY; }}>
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 32px 80px' }}>

        {/* Toast */}
        {toast && (
          <div style={{
            padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10,
            background: toast.type === 'success' ? '#f0fdf4' : '#fff5f5',
            border: `1.5px solid ${toast.type === 'success' ? '#22c55e' : PRIMARY}`,
            fontFamily: "'DM Sans', sans-serif", fontSize: 13,
            color: toast.type === 'success' ? '#166534' : '#b91c1c',
            animation: 'fadeUp 0.3s ease',
          }}>
            <span>{toast.type === 'success' ? '✓' : '✕'}</span>
            {toast.msg}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: viewMode === 'wide' ? 'repeat(auto-fill, minmax(300px, 1fr))' : 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: viewMode === 'wide' ? 'repeat(auto-fill, minmax(300px, 1fr))' : 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {filteredProducts.map((product, i) => (
              <Reveal key={product._id} delay={Math.min(i * 0.04, 0.3)}>
                <ProductCard
                  product={product}
                  selectedSizes={selectedSizes}
                  onSizeSelect={(id, size) => setSelectedSizes(p => ({ ...p, [id]: size }))}
                  onQuickAdd={handleQuickAdd}
                  addingProductId={addingProductId}
                  onCardClick={p => { setSelectedProduct(p); setIsModalOpen(true); }}
                />
              </Reveal>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 24px', border: '1px solid #ebebeb', background: '#fff' }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, color: '#ebebeb', letterSpacing: '0.04em', marginBottom: 8 }}>NO RESULTS</div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 18, color: '#aaa', marginBottom: 8 }}>
              {searchTerm
                ? `Nothing matched "${searchTerm}" in ${categoryName}`
                : `No products currently listed in ${categoryName}`}
            </p>
            {searchTerm && (
              <button onClick={() => setSearchTerm('')}
                style={{ marginTop: 20, padding: '12px 32px', background: '#111', border: 'none', color: '#fff', fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = PRIMARY}
                onMouseLeave={e => e.currentTarget.style.background = '#111'}>
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* Browse other categories */}
        {!loading && filteredProducts.length > 0 && (
          <Reveal style={{ marginTop: 64 }}>
            <div style={{ borderTop: '1px solid #ebebeb', paddingTop: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#888', marginBottom: 6 }}>Browse More</p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 16, color: '#aaa' }}>Explore the full collection</p>
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Link to="/shop"
                  style={{ display: 'inline-block', padding: '11px 28px', background: '#111', color: '#fff', fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = PRIMARY}
                  onMouseLeave={e => e.currentTarget.style.background = '#111'}>
                  All Products →
                </Link>
                {categoryName !== 'Women' && (
                  <Link to="/category/women"
                    style={{ display: 'inline-block', padding: '10px 24px', background: 'transparent', color: '#111', fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', border: '1.5px solid #e0e0e0', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#111'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e0e0e0'; }}>
                    Women's
                  </Link>
                )}
                {categoryName !== 'Men' && (
                  <Link to="/category/men"
                    style={{ display: 'inline-block', padding: '10px 24px', background: 'transparent', color: '#111', fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', border: '1.5px solid #e0e0e0', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#111'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e0e0e0'; }}>
                    Men's
                  </Link>
                )}
              </div>
            </div>
          </Reveal>
        )}
      </div>

      {isModalOpen && <ProductModal product={selectedProduct} onClose={() => { setIsModalOpen(false); setSelectedProduct(null); }} />}
    </div>
  );
};

export default CategoryPage;