import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/logo.png';
import logo1 from '../assets/logo1.png';
import { useAuth } from '../context/AuthContext';
import { ProductCard } from '../components/Common/productCard';

/* ─── Constants ─── */
const PRIMARY = '#ea2e0e';
const API_URL = 'https://one-man-server.onrender.com/api/admin/products';
const REVIEWS_API_URL = 'https://one-man-server.onrender.com/api/reviews';

const cache = {};
const fetchWithCache = async (url, ttl = 60000) => {
  const now = Date.now();
  if (cache[url] && now - cache[url].ts < ttl) return cache[url].data;
  const { data } = await axios.get(url, { headers: { 'Content-Type': 'application/json' } });
  cache[url] = { data, ts: now };
  return data;
};

/* ─── useInView hook ─── */
const useInView = (options = {}) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold: 0.12, ...options });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
};

/* ─── Skeleton ─── */
const Skeleton = ({ w = '100%', h = 20, r = 6, style = {} }) => (
  <div style={{ width: w, height: h, borderRadius: r, background: '#f0f0f0', overflow: 'hidden', position: 'relative', ...style }}>
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.7) 50%,transparent 100%)', animation: 'shimmer 1.4s infinite' }} />
  </div>
);

const ProductSkeleton = () => (
  <div style={{ borderRadius: 2, overflow: 'hidden', background: '#fafafa', border: '1px solid #ebebeb' }}>
    <Skeleton h={320} r={0} />
    <div style={{ padding: '16px 12px 20px' }}>
      <Skeleton h={14} w="60%" style={{ marginBottom: 8 }} />
      <Skeleton h={18} w="40%" />
    </div>
  </div>
);

/* ─── Star Rating ─── */
const StarRating = ({ rating, onChange, interactive = false }) => (
  <div style={{ display: 'flex', gap: 3 }}>
    {[1,2,3,4,5].map(s => (
      <button key={s} type="button" onClick={interactive ? () => onChange(s) : undefined}
        style={{ background: 'none', border: 'none', padding: 0, cursor: interactive ? 'pointer' : 'default', transform: 'scale(1)', transition: 'transform 0.1s' }}
        onMouseEnter={e => interactive && (e.currentTarget.style.transform = 'scale(1.2)')}
        onMouseLeave={e => interactive && (e.currentTarget.style.transform = 'scale(1)')}
        disabled={!interactive}
      >
        <svg width="18" height="18" viewBox="0 0 20 20" fill={s <= rating ? '#F59E0B' : '#E5E7EB'}>
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
        </svg>
      </button>
    ))}
  </div>
);

/* ─── Animated Section wrapper ─── */
const Reveal = ({ children, delay = 0, style = {} }) => {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(32px)',
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      ...style
    }}>
      {children}
    </div>
  );
};

const Landing = () => {
  const { user, isLoggedIn } = useAuth();
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, comment: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [navScrolled, setNavScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const reviewFormRef = useRef(null);

  /* ── Parallel data fetch on mount ── */
  useEffect(() => {
    const loadAll = async () => {
      const [prodResult, revResult] = await Promise.allSettled([
        fetchWithCache(API_URL),
        fetchWithCache(REVIEWS_API_URL),
      ]);
      if (prodResult.status === 'fulfilled') setProducts(prodResult.value);
      else setProductsError('Could not load products. Please try again later.');
      setProductsLoading(false);

      if (revResult.status === 'fulfilled') setReviews(revResult.value);
      setReviewsLoading(false);
    };
    loadAll();
  }, []);

  /* ── Sync user name to form ── */
  useEffect(() => {
    if (user?.name) setReviewForm(p => ({ ...p, name: user.name }));
  }, [user]);

  /* ── Nav shadow on scroll ── */
  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const fetchReviews = useCallback(async () => {
    delete cache[REVIEWS_API_URL];
    try {
      const data = await fetchWithCache(REVIEWS_API_URL);
      setReviews(data);
    } catch {}
  }, []);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) return alert('Please log in to submit a review');
    if (!reviewForm.name.trim() || !reviewForm.comment.trim()) return alert('Please fill in all fields');
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const cfg = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } };
      const payload = { name: reviewForm.name.trim(), rating: reviewForm.rating, comment: reviewForm.comment.trim() };
      if (editingReview) await axios.put(`${REVIEWS_API_URL}/${editingReview._id}`, payload, cfg);
      else await axios.post(REVIEWS_API_URL, payload, cfg);
      await fetchReviews();
      setReviewForm({ name: user?.name || '', rating: 5, comment: '' });
      setEditingReview(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async (id) => {
    if (!confirm('Delete this review?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${REVIEWS_API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      await fetchReviews();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete review.');
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setReviewForm({ name: review.name, rating: review.rating, comment: review.comment });
    reviewFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#111' }}>

      {/* ── Global styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes shimmer { from { transform: translateX(-100%); } to { transform: translateX(200%); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes scaleIn { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        .nav-link { position: relative; text-decoration: none; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 400; letter-spacing: 0.06em; color: #111; transition: color 0.2s; }
        .nav-link::after { content: ''; position: absolute; bottom: -2px; left: 0; width: 0; height: 1px; background: ${PRIMARY}; transition: width 0.25s; }
        .nav-link:hover::after { width: 100%; }
        .nav-link:hover { color: ${PRIMARY}; }
        .btn-primary { display: inline-block; background: ${PRIMARY}; color: #fff; padding: 14px 36px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; border: none; cursor: pointer; transition: background 0.2s, transform 0.15s; }
        .btn-primary:hover { background: #c72409; transform: translateY(-1px); }
        .btn-outline { display: inline-block; background: transparent; color: #111; padding: 13px 36px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; border: 1.5px solid #111; cursor: pointer; transition: all 0.2s; }
        .btn-outline:hover { background: #111; color: #fff; }
        .product-card-wrap { overflow: hidden; }
        .product-card-wrap:hover .product-img { transform: scale(1.04); }
        .product-img { transition: transform 0.5s ease; }
        .review-card:hover { border-color: #111; }
        input, textarea { outline: none; }
        input:focus, textarea:focus { border-color: #111 !important; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #f0f0f0; } ::-webkit-scrollbar-thumb { background: #111; }
      `}</style>

      <nav style={{
        position: 'sticky', top: 0, zIndex: 100, background: '#fff',
        borderBottom: navScrolled ? '1px solid #e8e8e8' : '1px solid transparent',
        boxShadow: navScrolled ? '0 2px 20px rgba(0,0,0,0.06)' : 'none',
        transition: 'border-color 0.3s, box-shadow 0.3s',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 64 }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 36, height: 36, borderRadius: 4, overflow: 'hidden', flexShrink: 0 }}>
              <img src={logo} alt="ONE MAN" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: '0.12em', color: '#111' }}>ONE MAN</span>
          </Link>

          {/* Desktop nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
            <a href="#collection" className="nav-link">Collection</a>
            <a href="#reviews" className="nav-link">Reviews</a>
            <Link to="/login" className="nav-link">Log In</Link>
            <Link to="/signup" className="btn-primary" style={{ padding: '9px 22px' }}>Sign Up</Link>
          </div>
        </div>
      </nav>

      <div style={{ background: '#111', overflow: 'hidden', height: 36, display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', animation: 'ticker 22s linear infinite', whiteSpace: 'nowrap' }}>
          {[...Array(3)].map((_, i) => (
            <span key={i} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.18em', color: '#fff', textTransform: 'uppercase', paddingRight: 80 }}>
              NEW ARRIVALS &nbsp;·&nbsp; FAST SHIPPING &nbsp;·&nbsp; PREMIUM QUALITY &nbsp;·&nbsp; LIMITED EDITION PIECES &nbsp;·&nbsp; CURATED FASHION &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════
          HERO
      ════════════════════════════════════ */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 32px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          {/* Left: text */}
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: PRIMARY, marginBottom: 20, animation: 'fadeUp 0.6s ease both' }}>
              ◆ SS 2025 Collection
            </p>
            <h1 style={{
              fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(72px, 9vw, 120px)',
              lineHeight: 0.92, letterSpacing: '0.02em', color: '#111',
              marginBottom: 32, animation: 'fadeUp 0.7s ease 0.1s both',
            }}>
              WEAR<br />
              <span style={{ color: PRIMARY }}>YOUR</span><br />
              STORY
            </h1>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 18,
              lineHeight: 1.7, color: '#555', maxWidth: 380, marginBottom: 40,
              animation: 'fadeUp 0.7s ease 0.2s both',
            }}>
              Curated collections for the modern individual. Each piece selected for its craftsmanship, character, and timeless appeal.
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', animation: 'fadeUp 0.7s ease 0.3s both' }}>
              <Link to="/signup" className="btn-primary">Shop Now</Link>
              <a href="#collection" className="btn-outline">View Collection</a>
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: 40, marginTop: 56, paddingTop: 40, borderTop: '1px solid #ebebeb', animation: 'fadeUp 0.7s ease 0.4s both' }}>
              {[['0+', 'Customers'], ['50+', 'Products'], ['4.9★', 'Avg Rating']].map(([val, lbl]) => (
                <div key={lbl}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, letterSpacing: '0.04em', color: '#111' }}>{val}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#888', marginTop: 2 }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>

          <div 
  style={{
    position: 'relative',
    animation: 'fadeUp 1s ease-out forwards',
    overflow: 'hidden',
  }}
>
  {/* Main card with subtle depth */}
  <div 
    style={{
      aspectRatio: '4/5',
      background: 'linear-gradient(135deg, #f8f7f5 0%, #f0ede8 100%)',
      position: 'relative',
      borderRadius: '24px',
      overflow: 'hidden',
      boxShadow: '0 20px 50px -15px rgba(0,0,0,0.12)',
      transition: 'transform 0.4s ease, box-shadow 0.4s ease',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-8px)';
      e.currentTarget.style.boxShadow = '0 30px 70px -20px rgba(0,0,0,0.18)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 20px 50px -15px rgba(0,0,0,0.12)';
    }}
  >
    {/* Logo / Hero Image */}
    <div 
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.03)',
      }}
    >
      <img 
        src={logo1} 
        alt="ONE MAN Logo" 
        style={{ 
          width: '86%', 
          height: '86%', 
          objectFit: 'contain',
          filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.15))',
        }} 
      />
    </div>

    {/* Bottom info panel – glass-like with blur */}
    <div 
      style={{
        position: 'absolute',
        bottom: '28px',
        left: '28px',
        right: '28px',
      }}
    >
      <div 
        style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: '16px',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          border: '1px solid rgba(255,255,255,0.4)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        }}
      >
        <div>
          <div 
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#777',
              marginBottom: '4px',
            }}
          >
            Featured
          </div>
          <div 
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '22px',
              fontWeight: 700,
              color: '#111',
              lineHeight: 1.1,
            }}
          >
            New Arrivals
          </div>
        </div>

        <a 
          href="#collection" 
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: '2px solid #111',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            color: '#111',
            fontSize: '24px',
            fontWeight: 300,
            transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#111';
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.transform = 'scale(1.12)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#111';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          →
        </a>
      </div>
    </div>
  </div>

  {/* Modern decorative accents – subtle geometric */}
  <div 
    style={{
      position: 'absolute',
      top: '-20px',
      right: '-20px',
      width: '120px',
      height: '120px',
      background: 'linear-gradient(45deg, #e0d9d2, #f5f0ea)',
      borderRadius: '50%',
      opacity: 0.7,
      zIndex: -1,
      filter: 'blur(8px)',
    }} 
  />
  <div 
    style={{
      position: 'absolute',
      bottom: '-24px',
      left: '-24px',
      width: '80px',
      height: '80px',
      border: '3px solid rgba(17,17,17,0.18)',
      borderRadius: '20px',
      transform: 'rotate(-12deg)',
      zIndex: -1,
    }} 
  />
</div>
        </div>
      </section>

      {/* ════════════════════════════════════
          WHY CHOOSE US — horizontal strip
      ════════════════════════════════════ */}
      <section style={{ borderTop: '1px solid #ebebeb', borderBottom: '1px solid #ebebeb', background: '#fafafa', padding: '40px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
          {[
            { icon: '✦', title: 'Premium Quality', desc: 'Handpicked from top designers' },
            { icon: '⚡', title: 'Fast Shipping', desc: 'Worldwide delivery, tracked' },
            { icon: '⚿', title: 'Secure Payments', desc: '256-bit SSL encryption' },
            { icon: '◎', title: 'Customer First', desc: '24/7 support & easy returns' },
          ].map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08}>
              <div style={{ padding: '24px 32px', borderRight: i < 3 ? '1px solid #e4e4e4' : 'none' }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: PRIMARY, marginBottom: 10, letterSpacing: '0.06em' }}>{f.icon} {f.title}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#777', lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════
          FEATURED COLLECTION
      ════════════════════════════════════ */}
      <section id="collection" style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 32px' }}>
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48 }}>
            <div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: PRIMARY, marginBottom: 10 }}>◆ Curated Picks</p>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px, 6vw, 72px)', letterSpacing: '0.02em', lineHeight: 1, color: '#111' }}>Featured Collection</h2>
            </div>
            <Link to="/signup" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#111', textDecoration: 'none', borderBottom: '1px solid #111', paddingBottom: 2, transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = PRIMARY}
              onMouseLeave={e => e.currentTarget.style.color = '#111'}>
              View All →
            </Link>
          </div>
        </Reveal>

        {/* Products grid */}
        {productsLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
            {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : productsError ? (
          <div style={{ textAlign: 'center', padding: '48px 24px', border: '1px solid #fecaca', borderRadius: 2, background: '#fff5f5' }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#b91c1c', fontSize: 14 }}>{productsError}</p>
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 24px', border: '1px solid #ebebeb' }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: '#888' }}>No products available yet</p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#bbb', marginTop: 8 }}>Check back soon for our latest collection</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
            {products.map((product, i) => (
              <Reveal key={product._id} delay={Math.min(i * 0.06, 0.4)}>
                <div className="product-card-wrap">
                  <ProductCard product={product} />
                </div>
              </Reveal>
            ))}
          </div>
        )}

        <Reveal style={{ textAlign: 'center', marginTop: 64 }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 18, color: '#888', marginBottom: 20 }}>
            Join our community for exclusive access
          </p>
          <Link to="/signup" className="btn-primary">Sign Up for Full Access</Link>
        </Reveal>
      </section>

      {/* ════════════════════════════════════
          EDITORIAL BANNER
      ════════════════════════════════════ */}
      <Reveal>
        <section style={{ background: '#111', padding: '80px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(120px, 20vw, 280px)', color: 'rgba(255,255,255,0.03)', whiteSpace: 'nowrap', userSelect: 'none', letterSpacing: '0.04em' }}>STYLE</div>
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 640, margin: '0 auto' }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: PRIMARY, marginBottom: 20 }}>◆ The ONE MAN Way</p>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(48px, 7vw, 88px)', color: '#fff', letterSpacing: '0.02em', lineHeight: 0.95, marginBottom: 24 }}>FASHION IS A LANGUAGE</h2>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 18, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, marginBottom: 36 }}>
              Every garment tells a story. Every choice defines you. Discover pieces that speak before you do.
            </p>
            <Link to="/signup" className="btn-primary" style={{ background: PRIMARY }}>Start Your Journey</Link>
          </div>
        </section>
      </Reveal>

      {/* ════════════════════════════════════
          REVIEWS
      ════════════════════════════════════ */}
      <section id="reviews" style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 32px' }}>
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48 }}>
            <div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: PRIMARY, marginBottom: 10 }}>◆ Testimonials</p>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px, 6vw, 72px)', letterSpacing: '0.02em', lineHeight: 1, color: '#111' }}>Customer Reviews</h2>
            </div>
            {avgRating && (
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, color: '#111', lineHeight: 1 }}>{avgRating}</div>
                <StarRating rating={Math.round(parseFloat(avgRating))} />
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#888', marginTop: 4 }}>{reviews.length} reviews</div>
              </div>
            )}
          </div>
        </Reveal>

        {/* Reviews grid */}
        {reviewsLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {[...Array(3)].map((_, i) => (
              <div key={i} style={{ border: '1px solid #ebebeb', padding: 24 }}>
                <Skeleton h={16} w="50%" style={{ marginBottom: 12 }} />
                <Skeleton h={14} style={{ marginBottom: 6 }} />
                <Skeleton h={14} w="80%" style={{ marginBottom: 20 }} />
                <Skeleton h={12} w="30%" />
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 24px', border: '1px solid #ebebeb' }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: '#888' }}>No reviews yet</p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#bbb', marginTop: 8 }}>
              {isLoggedIn ? 'Be the first to share your experience!' : 'Log in to share your experience'}
            </p>
            {!isLoggedIn && <Link to="/login" className="btn-primary" style={{ marginTop: 20, fontSize: 12, padding: '10px 24px' }}>Log In to Review</Link>}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {reviews.map((review, i) => (
              <Reveal key={review._id} delay={Math.min(i * 0.06, 0.3)}>
                <div className="review-card" style={{ border: '1px solid #e8e8e8', padding: '24px', position: 'relative', transition: 'border-color 0.2s', background: '#fff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                    <StarRating rating={review.rating} />
                    {isLoggedIn && user && review.user?._id === user._id && (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => handleEditReview(review)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: 13, fontFamily: "'DM Sans', sans-serif", transition: 'color 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.color = '#111'} onMouseLeave={e => e.currentTarget.style.color = '#999'}>Edit</button>
                        <button onClick={() => handleDeleteReview(review._id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: 13, fontFamily: "'DM Sans', sans-serif", transition: 'color 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.color = PRIMARY} onMouseLeave={e => e.currentTarget.style.color = '#999'}>Delete</button>
                      </div>
                    )}
                  </div>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 16, lineHeight: 1.65, color: '#333', marginBottom: 18 }}>
                    "{review.comment}"
                  </p>
                  <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 13, color: '#111' }}>{review.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {isLoggedIn && user && review.user?._id === user._id && (
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, background: '#111', color: '#fff', padding: '2px 8px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Yours</span>
                      )}
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#bbb' }}>{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {/* Review Form */}
        {isLoggedIn ? (
          <Reveal style={{ marginTop: 56 }}>
            <div ref={reviewFormRef} style={{ maxWidth: 600, margin: '0 auto', border: '1px solid #e8e8e8', padding: '40px' }}>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: '0.04em', marginBottom: 6, color: '#111' }}>
                {editingReview ? 'Edit Review' : 'Write a Review'}
              </h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#888', marginBottom: 28 }}>Share your experience with the ONE MAN community</p>

              <form onSubmit={handleReviewSubmit}>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: 8 }}>Name</label>
                  <input name="name" value={reviewForm.name} onChange={e => setReviewForm(p => ({ ...p, name: e.target.value }))}
                    style={{ width: '100%', padding: '12px 14px', border: '1px solid #e0e0e0', fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#111', background: '#fff', transition: 'border-color 0.2s' }} />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: 10 }}>Rating</label>
                  <StarRating rating={reviewForm.rating} interactive onChange={r => setReviewForm(p => ({ ...p, rating: r }))} />
                </div>
                <div style={{ marginBottom: 28 }}>
                  <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: 8 }}>Comment</label>
                  <textarea name="comment" value={reviewForm.comment} onChange={e => setReviewForm(p => ({ ...p, comment: e.target.value }))} rows={4}
                    placeholder="Tell us about your experience..."
                    style={{ width: '100%', padding: '12px 14px', border: '1px solid #e0e0e0', fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: '#111', resize: 'vertical', background: '#fff', transition: 'border-color 0.2s', lineHeight: 1.6 }} />
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ opacity: isSubmitting ? 0.6 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                    {isSubmitting ? 'Submitting…' : editingReview ? 'Update Review' : 'Submit Review'}
                  </button>
                  {editingReview && (
                    <button type="button" className="btn-outline" onClick={() => { setEditingReview(null); setReviewForm({ name: user?.name || '', rating: 5, comment: '' }); }}>Cancel</button>
                  )}
                </div>
              </form>
            </div>
          </Reveal>
        ) : (
          <Reveal style={{ textAlign: 'center', marginTop: 48 }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 18, color: '#888', marginBottom: 16 }}>Log in to share your experience</p>
            <Link to="/login" className="btn-outline">Log In to Review</Link>
          </Reveal>
        )}
      </section>

      {/* ════════════════════════════════════
          FOOTER
      ════════════════════════════════════ */}
      <footer style={{ borderTop: '1px solid #e8e8e8', background: '#111', color: '#fff' }}>
        {/* Top */}
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 32px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: 3, overflow: 'hidden' }}>
                <img src={logo} alt="ONE MAN" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: '0.12em', color: '#fff' }}>ONE MAN</span>
            </div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: 280 }}>
              Premium fashion for the modern individual. Curated with care, delivered with precision.
            </p>
          </div>
          {[
            { heading: 'Shop', links: [['Collection', '#collection'], ['New Arrivals', '/signup'], ['Best Sellers', '/signup']] },
            { heading: 'Company', links: [['About', '/about'], ['Contact', '/contact'], ['Privacy', '/policy']] },
            { heading: 'Account', links: [['Sign Up', '/signup'], ['Log In', '/login'], ['Reviews', '#reviews']] },
          ].map(col => (
            <div key={col.heading}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>{col.heading}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {col.links.map(([label, href]) => (
                  <Link key={label} to={href} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.65)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}>{label}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '20px 32px', maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em' }}>
            © {new Date().getFullYear()} ONE MAN. All rights reserved.
          </p>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em' }}>
            Made with precision
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;