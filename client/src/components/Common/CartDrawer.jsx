import React, { useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { HiOutlineTrash, HiPlus, HiMinus, HiOutlineShoppingBag, HiArrowRight } from "react-icons/hi2";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

const PRIMARY = '#ea2e0e';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:wght@400;600&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  /* ── Drawer shell ── */
  .cd-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.35);
    z-index: 48;
    animation: cd-fade-in 0.25s ease;
  }
  @keyframes cd-fade-in { from { opacity: 0; } to { opacity: 1; } }

  .cd-drawer {
    position: fixed;
    top: 0; right: 0;
    width: min(400px, 100vw);
    height: 100%;
    background: #faf9f7;
    z-index: 50;
    display: flex;
    flex-direction: column;
    font-family: 'DM Sans', sans-serif;
    transition: transform 0.32s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: -8px 0 48px rgba(0,0,0,0.12);
  }
  .cd-drawer.open  { transform: translateX(0); }
  .cd-drawer.closed { transform: translateX(100%); }

  /* red accent top bar */
  .cd-accent { height: 3px; background: ${PRIMARY}; flex-shrink: 0; }

  /* ── Header ── */
  .cd-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 24px 16px;
    border-bottom: 1px solid #e8e4de;
    flex-shrink: 0;
    background: #fff;
  }
  .cd-header-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .cd-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px;
    letter-spacing: 0.08em;
    color: #111;
    line-height: 1;
  }
  .cd-count-pill {
    padding: 3px 9px;
    background: #111;
    color: #fff;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.06em;
    border-radius: 10px;
    font-family: 'DM Mono', monospace;
  }
  .cd-close-btn {
    width: 36px; height: 36px;
    display: flex; align-items: center; justify-content: center;
    background: transparent;
    border: 1px solid #e8e4de;
    cursor: pointer;
    color: #888;
    transition: all 0.15s;
    border-radius: 2px;
    flex-shrink: 0;
  }
  .cd-close-btn:hover { background: #111; color: #fff; border-color: #111; }

  /* ── Items list ── */
  .cd-list {
    flex: 1;
    overflow-y: auto;
    padding: 8px 0;
  }
  .cd-list::-webkit-scrollbar { width: 4px; }
  .cd-list::-webkit-scrollbar-track { background: transparent; }
  .cd-list::-webkit-scrollbar-thumb { background: #ddd; border-radius: 2px; }

  /* ── Cart item ── */
  .cd-item {
    display: flex;
    gap: 14px;
    padding: 16px 24px;
    border-bottom: 1px solid #f0ede8;
    background: #fff;
    transition: background 0.15s;
    position: relative;
  }
  .cd-item:last-child { border-bottom: none; }
  .cd-item:hover { background: #fdfcfb; }

  .cd-item-img {
    width: 72px;
    height: 90px;
    object-fit: cover;
    object-position: top;
    flex-shrink: 0;
    background: #f0ede8;
    display: block;
  }

  .cd-item-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }

  .cd-item-category {
    font-size: 8.5px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #bbb;
  }
  .cd-item-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 15px;
    font-weight: 600;
    color: #111;
    line-height: 1.25;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .cd-item-size {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.08em;
    color: #999;
    text-transform: uppercase;
  }
  .cd-item-price {
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    font-weight: 500;
    color: #111;
    margin-top: 2px;
  }

  .cd-item-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 8px;
  }

  /* Quantity stepper */
  .cd-qty {
    display: flex;
    align-items: center;
    border: 1px solid #e8e4de;
    background: #fff;
    height: 30px;
  }
  .cd-qty-btn {
    width: 30px; height: 30px;
    display: flex; align-items: center; justify-content: center;
    background: transparent;
    border: none;
    color: #777;
    cursor: pointer;
    transition: all 0.12s;
    flex-shrink: 0;
  }
  .cd-qty-btn:hover { background: #111; color: #fff; }
  .cd-qty-val {
    width: 32px;
    text-align: center;
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    font-weight: 500;
    color: #111;
    border-left: 1px solid #e8e4de;
    border-right: 1px solid #e8e4de;
    line-height: 30px;
  }

  /* Remove button */
  .cd-remove-btn {
    width: 30px; height: 30px;
    display: flex; align-items: center; justify-content: center;
    background: transparent;
    border: 1px solid transparent;
    color: #ccc;
    cursor: pointer;
    transition: all 0.15s;
    border-radius: 2px;
  }
  .cd-remove-btn:hover { color: ${PRIMARY}; border-color: ${PRIMARY}; background: #fff5f4; }

  /* ── Empty state ── */
  .cd-empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 24px;
    text-align: center;
    gap: 12px;
  }
  .cd-empty-icon {
    width: 64px; height: 64px;
    border: 1.5px solid #e8e4de;
    display: flex; align-items: center; justify-content: center;
    color: #ccc;
    margin-bottom: 8px;
  }
  .cd-empty-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 26px;
    letter-spacing: 0.06em;
    color: #ccc;
  }
  .cd-empty-sub {
    font-size: 13px;
    color: #aaa;
    line-height: 1.6;
    max-width: 220px;
  }
  .cd-empty-btn {
    margin-top: 12px;
    padding: 10px 24px;
    border: 1.5px solid #111;
    background: transparent;
    font-family: 'DM Sans', sans-serif;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #111;
    cursor: pointer;
    transition: all 0.18s;
  }
  .cd-empty-btn:hover { background: #111; color: #fff; }

  /* ── Loading skeleton ── */
  @keyframes cd-shimmer { from { background-position: -300px 0; } to { background-position: 300px 0; } }
  .cd-skeleton {
    background: linear-gradient(90deg, #ede9e3 25%, #f5f2ee 50%, #ede9e3 75%);
    background-size: 300px 100%;
    animation: cd-shimmer 1.5s ease-in-out infinite;
  }
  .cd-loading-item {
    display: flex; gap: 14px; padding: 16px 24px;
    border-bottom: 1px solid #f0ede8;
    background: #fff;
  }

  /* ── Footer ── */
  .cd-footer {
    flex-shrink: 0;
    background: #fff;
    border-top: 1px solid #e8e4de;
    padding: 20px 24px 24px;
  }
  .cd-summary-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
  }
  .cd-summary-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #999;
  }
  .cd-summary-items {
    font-size: 11px;
    color: #bbb;
    font-family: 'DM Mono', monospace;
  }
  .cd-total-label {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #555;
  }
  .cd-total-value {
    font-family: 'DM Mono', monospace;
    font-size: 20px;
    font-weight: 500;
    color: #111;
    letter-spacing: -0.02em;
  }
  .cd-divider { height: 1px; background: #f0ede8; margin: 14px 0; }

  .cd-checkout-btn {
    width: 100%;
    height: 50px;
    background: #111;
    border: none;
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: background 0.2s;
    margin-bottom: 10px;
  }
  .cd-checkout-btn:hover { background: ${PRIMARY}; }

  .cd-continue-btn {
    width: 100%;
    height: 38px;
    background: transparent;
    border: 1px solid #e8e4de;
    color: #888;
    font-family: 'DM Sans', sans-serif;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.15s;
  }
  .cd-continue-btn:hover { border-color: #111; color: #111; }
`;

/* ── Loading skeleton item ── */
const SkeletonItem = () => (
  <div className="cd-loading-item">
    <div className="cd-skeleton" style={{ width: 72, height: 90, flexShrink: 0 }} />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 4 }}>
      <div className="cd-skeleton" style={{ height: 10, width: '45%', borderRadius: 2 }} />
      <div className="cd-skeleton" style={{ height: 16, width: '80%', borderRadius: 2 }} />
      <div className="cd-skeleton" style={{ height: 10, width: '30%', borderRadius: 2 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        <div className="cd-skeleton" style={{ height: 30, width: 94, borderRadius: 2 }} />
        <div className="cd-skeleton" style={{ height: 30, width: 30, borderRadius: 2 }} />
      </div>
    </div>
  </div>
);

/* ── Cart item row ── */
const CartItemDisplay = ({ item, updateQuantity, removeItem }) => {
  const itemId = item._id;
  const unitPrice = item.price;
  const lineTotal = (unitPrice * item.quantity).toLocaleString('en-KE', { minimumFractionDigits: 2 });

  const src = item.imageUrls?.[0] || item.product?.imageUrls?.[0] || 'https://placehold.co/100x120/f2f0ed/999?text=Item';
  console.log('Cart item image src:', src, 'for item:', item.name, 'item:', item);

  return (
    <div className="cd-item">
      <img
        src={item.imageUrls?.[0] || item.product?.imageUrls?.[0] || 'https://placehold.co/100x120/f2f0ed/999?text=Item'}
        alt={item.name}
        className="cd-item-img"
        onError={e => { e.currentTarget.src = 'https://placehold.co/100x120/f2f0ed/999?text=Item'; }}
      />
      <div className="cd-item-body">
        <span className="cd-item-category">{item.category || 'Fashion'}</span>
        <span className="cd-item-name" title={item.name}>{item.name}</span>
        <span className="cd-item-size">Size: {item.size}</span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 2 }}>
          <span className="cd-item-price">Ksh {unitPrice.toLocaleString('en-KE', { minimumFractionDigits: 2 })}</span>
          {item.quantity > 1 && (
            <span style={{ fontSize: 10, color: '#bbb', fontFamily: "'DM Mono', monospace" }}>
              × {item.quantity} = Ksh {lineTotal}
            </span>
          )}
        </div>

        <div className="cd-item-footer">
          {/* Quantity stepper */}
          <div className="cd-qty">
            <button
              className="cd-qty-btn"
              onClick={() => updateQuantity(itemId, item.quantity - 1)}
              aria-label="Decrease quantity"
            >
              <HiMinus size={11} />
            </button>
            <span className="cd-qty-val">{item.quantity}</span>
            <button
              className="cd-qty-btn"
              onClick={() => updateQuantity(itemId, item.quantity + 1)}
              aria-label="Increase quantity"
            >
              <HiPlus size={11} />
            </button>
          </div>

          {/* Remove */}
          <button
            className="cd-remove-btn"
            onClick={() => removeItem(itemId)}
            aria-label="Remove item"
          >
            <HiOutlineTrash size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Main Drawer ── */
const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {
  const {
    cartItems,
    totalItems,
    loading,
    updateCartItemQuantity,
    removeCartItem,
    totalCartPrice,
  } = useCart();
  const navigate = useNavigate();

  /* Inject styles */
  useEffect(() => {
    const id = 'cd-styles';
    if (!document.getElementById(id)) {
      const s = document.createElement('style');
      s.id = id;
      s.textContent = STYLES;
      document.head.appendChild(s);
    }
  }, []);

  /* Lock body scroll when open */
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const formattedTotal = totalCartPrice.toLocaleString('en-KE', { minimumFractionDigits: 2 });

  return (
    <>
      {/* Backdrop */}
      {drawerOpen && (
        <div className="cd-overlay" onClick={toggleCartDrawer} />
      )}

      {/* Drawer */}
      <div className={`cd-drawer ${drawerOpen ? 'open' : 'closed'}`}>
        <div className="cd-accent" />

        {/* Header */}
        <div className="cd-header">
          <div className="cd-header-left">
            <span className="cd-title">Your Cart</span>
            {totalItems > 0 && (
              <span className="cd-count-pill">{totalItems}</span>
            )}
          </div>
          <button className="cd-close-btn" onClick={toggleCartDrawer} aria-label="Close cart">
            <IoMdClose size={18} />
          </button>
        </div>

        {/* Body */}
        {loading ? (
          <div className="cd-list">
            {[1, 2, 3].map(i => <SkeletonItem key={i} />)}
          </div>
        ) : cartItems.length === 0 ? (
          <div className="cd-empty">
            <div className="cd-empty-icon">
              <HiOutlineShoppingBag size={28} />
            </div>
            <div className="cd-empty-title">Empty</div>
            <p className="cd-empty-sub">Your cart is empty. Browse our new arrivals and add something you love.</p>
            <button className="cd-empty-btn" onClick={toggleCartDrawer}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="cd-list">
            {cartItems.map(item => (
              <CartItemDisplay
                key={item._id}
                item={item}
                updateQuantity={updateCartItemQuantity}
                removeItem={removeCartItem}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        {!loading && cartItems.length > 0 && (
          <div className="cd-footer">
            <div className="cd-summary-row">
              <span className="cd-summary-label">Subtotal</span>
              <span className="cd-summary-items">{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
            </div>
            <div className="cd-summary-row" style={{ marginTop: 6 }}>
              <span className="cd-total-label">Total</span>
              <span className="cd-total-value">Ksh {formattedTotal}</span>
            </div>

            <div className="cd-divider" />

            <button
              className="cd-checkout-btn"
              onClick={() => { navigate('/checkout'); toggleCartDrawer(); }}
            >
              Proceed to Checkout
              <HiArrowRight size={14} />
            </button>
            <button className="cd-continue-btn" onClick={toggleCartDrawer}>
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;