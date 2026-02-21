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
const CATEGORIES = ['All', 'Men', 'Women', 'Top Wear', 'Bottom Wear', 'Accessories'];

/* ─── Skeleton Card ─── */
const SkeletonCard = () => (
  <div style={{ background: '#fafafa', border: '1px solid #ebebeb', overflow: 'hidden' }}>
    <div style={{ aspectRatio: '3/4', background: '#f0f0f0', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.6),transparent)', animation: 'shimmer 1.4s infinite' }} />
    </div>
    <div style={{ padding: '14px 14px 18px' }}>
      {[['65%', 13], ['40%', 18], ['100%', 40]].map(([w, h], i) => (
        <div key={i} style={{ height: h, width: w, background: '#ebebeb', marginBottom: 8, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.6),transparent)', animation: `shimmer 1.4s infinite ${i * 0.1}s` }} />
        </div>
      ))}
    </div>
  </div>
);

/* ─── Product Card ─── */
const ProductCard = ({ product, selectedSizes, onSizeSelect, onQuickAdd, addingProductId, onCardClick }) => {
  const isAdding = addingProductId === product._id;
  const isOneSize = product.sizes.length === 0;
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
        {/* Category badge */}
        <div style={{ position: 'absolute', top: 10, left: 10, background: '#111', padding: '4px 10px' }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#fff' }}>{product.category}</span>
        </div>
        {/* Stock badge */}
        {product.stock > 0 && product.stock <= 5 && (
          <div style={{ position: 'absolute', top: 10, right: 10, background: PRIMARY, padding: '4px 10px' }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#fff' }}>Only {product.stock} left</span>
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
   MAIN SHOP PAGE
═══════════════════════════════════════════════ */
const ShopPage = () => {
  const { isLoggedIn } = useAuth();
  const { refreshCart } = useCart();
  const navigate = useNavigate();
  const controlsRef = useRef(null);

  const [products, setProducts]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [searchTerm, setSearchTerm]     = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [addingProductId, setAddingProductId] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [toast, setToast]               = useState(null);
  const [scrolled, setScrolled]         = useState(false);
  const [sortBy, setSortBy]             = useState('default'); // default | price-asc | price-desc | name

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem('token');
      try {
        setLoading(true);
        const { data } = await axios.get(API_URL, {
          headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
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
    let result = [...products];
    if (activeCategory !== 'All') result = result.filter(p => p.category === activeCategory);
    if (searchTerm) {
      const t = searchTerm.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(t) || p.description?.toLowerCase().includes(t));
    }
    if (sortBy === 'price-asc')  result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    if (sortBy === 'name')       result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [products, activeCategory, searchTerm, sortBy]);

  const handleQuickAdd = async (product) => {
    if (addingProductId) return;
    if (!isLoggedIn) { showToast('Please log in to add items to cart.', 'error'); return; }
    const size = product.sizes.length > 0 ? selectedSizes[product._id] : 'One Size';
    if (product.sizes.length > 0 && !size) { showToast('Please select a size first.', 'error'); return; }
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

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', fontFamily: "'Cormorant Garamond', serif", color: '#111' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        @keyframes shimmer { from { transform: translateX(-100%); } to { transform: translateX(200%); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .search-input { width: 100%; padding: 12px 44px 12px 16px; border: 1.5px solid #e0e0e0; background: #fff; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #111; outline: none; border-radius: 0; transition: border-color 0.2s, box-shadow 0.2s; }
        .search-input:focus { border-color: #111; box-shadow: 0 0 0 3px rgba(0,0,0,0.04); }
        .search-input::placeholder { color: #ccc; }
        .cat-btn { padding: 8px 18px; font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; border: 1.5px solid #e0e0e0; background: #fff; cursor: pointer; transition: all 0.15s; color: #888; border-radius: 0; }
        .cat-btn:hover { border-color: #111; color: #111; }
        .cat-btn.active { background: #111; border-color: #111; color: #fff; }
        .sort-select { padding: 8px 32px 8px 14px; font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 400; letter-spacing: 0.08em; border: 1.5px solid #e0e0e0; background: #fff; color: #888; outline: none; cursor: pointer; appearance: none; border-radius: 0; transition: border-color 0.15s; }
        .sort-select:focus { border-color: #111; }
      `}</style>

      {/* ── Page header ── */}
      <div style={{ background: '#111', padding: '52px 32px 44px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`, backgroundSize: '48px 48px' }} />
        <div style={{ position: 'absolute', right: -10, top: '50%', transform: 'translateY(-50%)', fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(80px, 14vw, 180px)', color: 'rgba(255,255,255,0.03)', userSelect: 'none', letterSpacing: '0.04em', lineHeight: 1 }}>SHOP</div>

        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: PRIMARY, marginBottom: 14, animation: 'fadeUp 0.6s ease both' }}>◆ Browse & Shop</p>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(52px, 8vw, 96px)', lineHeight: 0.9, letterSpacing: '0.02em', color: '#fff', animation: 'fadeUp 0.7s ease 0.1s both' }}>
              SHOP<br /><span style={{ color: PRIMARY }}>COLLECTION</span>
            </h1>
          </div>
          <Link to="/app"
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'transparent', border: '1.5px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)', fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', transition: 'all 0.2s', animation: 'fadeUp 0.7s ease 0.2s both' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}>
            <LayoutDashboard size={14} /> Dashboard
          </Link>
        </div>
      </div>

      {/* ── Red ticker ── */}
      <div style={{ background: PRIMARY, overflow: 'hidden', height: 34, display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', animation: 'ticker 22s linear infinite', whiteSpace: 'nowrap' }}>
          {[...Array(4)].map((_, i) => (
            <span key={i} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.18em', color: '#fff', textTransform: 'uppercase', paddingRight: 80 }}>
              FAST SHIPPING COUNTRYWIDE &nbsp;·&nbsp; PREMIUM QUALITY &nbsp;·&nbsp; NEW ARRIVALS WEEKLY &nbsp;·&nbsp; FAST DELIVERY &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ── Sticky controls ── */}
      <div ref={controlsRef} style={{
        position: 'sticky', top: 0, zIndex: 50, background: '#fff',
        borderBottom: '1px solid #e8e8e8',
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.07)' : 'none',
        transition: 'box-shadow 0.3s',
        padding: '14px 32px',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          {/* Top row: search + sort */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input type="text" placeholder="Search by name or description…" value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)} className="search-input" />
              <Search size={14} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#bbb', pointerEvents: 'none' }} />
            </div>

            {/* Sort */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="sort-select">
                <option value="default">Sort: Default</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="name">Name: A → Z</option>
              </select>
              <svg width="10" height="6" viewBox="0 0 10 6" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#bbb' }}>
                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              </svg>
            </div>

            {/* Result count */}
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#aaa', letterSpacing: '0.06em', flexShrink: 0 }}>
              {loading ? '—' : filteredProducts.length} items
            </div>
          </div>

          {/* Category row */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#bbb', marginRight: 4 }}>Category</span>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`cat-btn ${activeCategory === cat ? 'active' : ''}`}>
                {cat}
              </button>
            ))}
            {(activeCategory !== 'All' || searchTerm) && (
              <button onClick={() => { setActiveCategory('All'); setSearchTerm(''); setSortBy('default'); }}
                style={{ padding: '8px 14px', fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'transparent', border: `1.5px solid ${PRIMARY}`, color: PRIMARY, cursor: 'pointer', transition: 'all 0.15s', borderRadius: 0 }}
                onMouseEnter={e => { e.currentTarget.style.background = PRIMARY; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = PRIMARY; }}>
                ✕ Clear
              </button>
            )}
          </div>
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

        {/* Active filter pills */}
        {(activeCategory !== 'All' || searchTerm) && !loading && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: '#aaa', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Filtering:</span>
            {activeCategory !== 'All' && (
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, background: '#111', color: '#fff', padding: '4px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                {activeCategory}
                <button onClick={() => setActiveCategory('All')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 12, padding: 0, lineHeight: 1 }}>✕</button>
              </span>
            )}
            {searchTerm && (
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, background: '#111', color: '#fff', padding: '4px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                "{searchTerm}"
                <button onClick={() => setSearchTerm('')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 12, padding: 0, lineHeight: 1 }}>✕</button>
              </span>
            )}
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#aaa' }}>{filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''}</span>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {Array(10).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {filteredProducts.map(product => (
              <ProductCard
                key={product._id}
                product={product}
                selectedSizes={selectedSizes}
                onSizeSelect={(id, size) => setSelectedSizes(p => ({ ...p, [id]: size }))}
                onQuickAdd={handleQuickAdd}
                addingProductId={addingProductId}
                onCardClick={p => { setSelectedProduct(p); setIsModalOpen(true); }}
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 24px', border: '1px solid #ebebeb', background: '#fff' }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, color: '#ebebeb', letterSpacing: '0.04em', marginBottom: 8 }}>NO RESULTS</div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 18, color: '#aaa', marginBottom: 28 }}>
              {searchTerm
                ? `Nothing matched "${searchTerm}" in ${activeCategory === 'All' ? 'all categories' : activeCategory}`
                : `No products in the ${activeCategory} category yet`}
            </p>
            <button
              onClick={() => { setActiveCategory('All'); setSearchTerm(''); setSortBy('default'); }}
              style={{ padding: '12px 32px', background: '#111', border: 'none', color: '#fff', fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = PRIMARY}
              onMouseLeave={e => e.currentTarget.style.background = '#111'}>
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {isModalOpen && <ProductModal product={selectedProduct} onClose={() => { setIsModalOpen(false); setSelectedProduct(null); }} />}
    </div>
  );
};

export default ShopPage;