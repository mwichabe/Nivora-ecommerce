import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiCheckCircle, HiCreditCard, HiArrowLeft, HiXMark, HiMapPin, HiTruck } from "react-icons/hi2";
import { API_BASE } from '../../config';

const PRIMARY = '#ea2e0e';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  /* ── Review card ── */
  .or-root { font-family: 'DM Sans', sans-serif; }

  .or-card {
    background: #fff;
    border: 1px solid #e8e4de;
  }
  .or-card-header {
    padding: 18px 28px;
    border-bottom: 1px solid #f0ede8;
    display: flex; align-items: center; gap: 8px;
  }
  .or-card-title {
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.2em; text-transform: uppercase; color: #555;
    display: flex; align-items: center; gap: 8px;
  }
  .or-card-title svg { color: ${PRIMARY}; }

  /* ── Two-column layout ── */
  .or-body {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 2px;
  }
  @media (max-width: 768px) { .or-body { grid-template-columns: 1fr; } }

  /* ── Left column sections ── */
  .or-section {
    background: #fff;
    border: 1px solid #e8e4de;
    padding: 22px 24px;
    margin-bottom: 2px;
  }
  .or-section:last-child { margin-bottom: 0; }

  .or-section-label {
    font-size: 9px; font-weight: 700;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: rgba(0,0,0,0.25);
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 16px;
  }
  .or-section-label::after { content: ''; flex: 1; height: 1px; background: #f0ede8; }

  .or-detail-row {
    display: flex; justify-content: space-between;
    align-items: baseline; gap: 12px;
    padding: 8px 0;
    border-bottom: 1px solid #f8f6f3;
  }
  .or-detail-row:last-child { border-bottom: none; }
  .or-detail-key {
    font-size: 11px; font-weight: 600;
    letter-spacing: 0.06em; color: #aaa;
    text-transform: uppercase; white-space: nowrap;
  }
  .or-detail-val {
    font-size: 13px; font-weight: 500; color: #333;
    text-align: right;
  }

  /* ── Item list ── */
  .or-item {
    display: flex; align-items: flex-start; gap: 14px;
    padding: 12px 0;
    border-bottom: 1px solid #f8f6f3;
  }
  .or-item:first-child { padding-top: 0; }
  .or-item:last-child  { border-bottom: none; padding-bottom: 0; }

  .or-item-img {
    width: 50px; height: 62px;
    object-fit: cover; object-position: top;
    background: #f0ede8; flex-shrink: 0; display: block;
  }
  .or-item-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 15px; font-weight: 600; color: #111; line-height: 1.25;
    margin-bottom: 3px;
  }
  .or-item-meta { font-size: 11px; color: #aaa; letter-spacing: 0.06em; margin-bottom: 4px; }
  .or-item-price {
    font-family: 'DM Mono', monospace;
    font-size: 12px; color: #555;
  }

  /* ── Summary sidebar ── */
  .or-summary {
    background: #fff;
    border: 1px solid #e8e4de;
    padding: 24px;
    height: fit-content;
    position: sticky; top: 80px;
  }
  .or-summary-title {
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.2em; text-transform: uppercase; color: #555;
    margin-bottom: 20px;
    padding-bottom: 14px;
    border-bottom: 1px solid #f0ede8;
  }
  .or-summary-row {
    display: flex; justify-content: space-between;
    align-items: baseline; padding: 8px 0;
    border-bottom: 1px solid #f8f6f3;
  }
  .or-summary-row:last-of-type { border-bottom: none; }
  .or-summary-label { font-size: 12px; color: #aaa; font-weight: 500; }
  .or-summary-val {
    font-family: 'DM Mono', monospace;
    font-size: 13px; color: #333;
  }
  .or-summary-divider { height: 1px; background: #e8e4de; margin: 14px 0; }
  .or-summary-total-label {
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.14em; text-transform: uppercase; color: #555;
  }
  .or-summary-total-val {
    font-family: 'DM Mono', monospace;
    font-size: 22px; font-weight: 500; color: #111; letter-spacing: -0.02em;
  }
  .or-summary-note { font-size: 10px; color: #ccc; text-align: right; margin-top: 6px; }

  /* ── Nav bar ── */
  .or-nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 28px;
    border-top: 1px solid #f0ede8;
    background: #faf9f7;
    margin-top: 2px;
    border: 1px solid #e8e4de;
    border-top: none;
  }
  .or-back-btn {
    display: flex; align-items: center; gap: 6px;
    background: transparent; border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px; font-weight: 600;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: #aaa; cursor: pointer; transition: color 0.15s; padding: 0;
  }
  .or-back-btn:hover { color: #111; }

  .or-pay-btn {
    display: flex; align-items: center; gap: 10px;
    height: 50px; padding: 0 32px;
    background: #111; border: none; color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px; font-weight: 700;
    letter-spacing: 0.18em; text-transform: uppercase;
    cursor: pointer; transition: background 0.18s;
  }
  .or-pay-btn:hover:not(:disabled) { background: ${PRIMARY}; }
  .or-pay-btn:disabled { background: #ccc; cursor: not-allowed; }

  /* ── Spinner ── */
  @keyframes or-spin { to { transform: rotate(360deg); } }
  .or-spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.25);
    border-top-color: #fff;
    border-radius: 50%;
    animation: or-spin 0.7s linear infinite;
    flex-shrink: 0;
  }

  /* ── Payment Modal ── */
  @keyframes or-modal-in {
    from { opacity: 0; transform: translateY(12px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .or-modal-overlay {
    position: fixed; inset: 0; z-index: 60;
    background: rgba(0,0,0,0.55);
    display: flex; align-items: center; justify-content: center;
    padding: 24px;
    backdrop-filter: blur(3px);
    animation: or-fade-in 0.2s ease;
  }
  @keyframes or-fade-in { from { opacity: 0; } to { opacity: 1; } }
  .or-modal {
    background: #fff;
    border: 1px solid #e8e4de;
    max-width: 480px; width: 100%;
    animation: or-modal-in 0.25s ease both;
    overflow: hidden;
  }
  .or-modal-accent { height: 3px; background: ${PRIMARY}; }
  .or-modal-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid #f0ede8;
  }
  .or-modal-title {
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.2em; text-transform: uppercase; color: #555;
  }
  .or-modal-close {
    width: 32px; height: 32px;
    display: flex; align-items: center; justify-content: center;
    background: transparent; border: 1px solid #e8e4de;
    color: #aaa; cursor: pointer; transition: all 0.15s;
  }
  .or-modal-close:hover { background: #111; color: #fff; border-color: #111; }

  .or-modal-body { padding: 24px; }

  /* Order summary in modal */
  .or-modal-amount-block {
    background: #faf9f7;
    border: 1px solid #e8e4de;
    padding: 20px 24px;
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 20px;
  }
  .or-modal-order-id { font-size: 11px; color: #aaa; letter-spacing: 0.06em; margin-bottom: 3px; }
  .or-modal-order-num {
    font-family: 'DM Mono', monospace;
    font-size: 15px; font-weight: 500; color: #111;
  }
  .or-modal-total-label { font-size: 10px; color: #aaa; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 3px; text-align: right; }
  .or-modal-total-val {
    font-family: 'DM Mono', monospace;
    font-size: 22px; font-weight: 500; color: #111; letter-spacing: -0.02em;
  }

  .or-modal-ref-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 0; border-bottom: 1px solid #f0ede8; margin-bottom: 20px;
  }
  .or-modal-ref-label { font-size: 11px; color: #aaa; font-weight: 500; }
  .or-modal-ref-val {
    font-family: 'DM Mono', monospace;
    font-size: 12px; color: #333;
  }

  .or-modal-info {
    font-size: 12.5px; color: #777; line-height: 1.65; margin-bottom: 20px;
  }

  .or-modal-proceed-btn {
    width: 100%; height: 50px;
    background: #111; border: none; color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px; font-weight: 700;
    letter-spacing: 0.18em; text-transform: uppercase;
    cursor: pointer; transition: background 0.18s;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    margin-bottom: 8px;
  }
  .or-modal-proceed-btn:hover:not(:disabled) { background: ${PRIMARY}; }
  .or-modal-proceed-btn:disabled { background: #ccc; cursor: not-allowed; }

  .or-modal-cancel-btn {
    width: 100%; height: 38px;
    background: transparent; border: 1px solid #e8e4de; color: #aaa;
    font-family: 'DM Sans', sans-serif;
    font-size: 10px; font-weight: 600;
    letter-spacing: 0.12em; text-transform: uppercase;
    cursor: pointer; transition: all 0.15s;
  }
  .or-modal-cancel-btn:hover { border-color: #111; color: #111; }

  /* Secure badge */
  .or-secure-note {
    display: flex; align-items: center; justify-content: center;
    gap: 6px; padding: 10px;
    border-top: 1px solid #f0ede8;
    font-size: 10px; color: #ccc;
    letter-spacing: 0.06em;
  }
  .or-secure-dot { width: 6px; height: 6px; border-radius: 50%; background: #4ade80; flex-shrink: 0; }
`;

const fmt = (n) => n.toLocaleString('en-KE', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const SHIP_LABEL = { standard: 'Standard (3–5 days)', express: 'Express (1–2 days)', free: 'Local Delivery' };
const PAY_LABEL  = { mpesa: 'M-Pesa', card: 'Credit / Debit Card', bank: 'Bank Transfer' };

export const OrderReview = ({ formData, onPrev, placeOrder, cartItems, totalCartPrice, loading, refreshCart }) => {
  const navigate = useNavigate();

  const [showModal, setShowModal]           = useState(false);
  const [orderId, setOrderId]               = useState(null);
  const [paystackAuthUrl, setPaystackAuthUrl] = useState(null);
  const [paystackReference, setPaystackReference] = useState(null);
  const [paystackLoading, setPaystackLoading] = useState(false);

  const shippingCost = formData.shippingCost || 0;
  const subtotal     = totalCartPrice;
  const taxRate      = 0.16;
  const tax          = subtotal * taxRate;
  const orderTotal   = subtotal + shippingCost + tax;

  const initializePayment = async (id) => {
    setPaystackLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/orders/${id}/paystack-init`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ callback_url: window.location.origin + '/app/paystack-callback' }),
      });
      const data = await res.json();
      if (res.ok && data.authorization_url) {
        setPaystackAuthUrl(data.authorization_url);
        setPaystackReference(data.reference);
        setShowModal(true);
      } else {
        alert(`Payment initialization failed: ${data.message || 'Unknown error.'}`);
      }
    } catch {
      alert('Failed to connect to payment gateway. Please try again.');
    } finally {
      setPaystackLoading(false);
    }
  };

  const handlePlaceOrderAndPay = async () => {
    setPaystackLoading(true);
    const data = await placeOrder(orderTotal, subtotal, tax);
    if (data?.order?._id) {
      const newId = data.order._id;
      setOrderId(newId);
      await initializePayment(newId);
    } else {
      setPaystackLoading(false);
    }
  };

  const handleProceedToPaystack = () => {
    refreshCart();
    window.location.href = paystackAuthUrl;
  };

  const handleModalDismiss = () => {
    refreshCart();
    setShowModal(false);
    navigate('/app');
  };

  const busy = loading || paystackLoading;

  return (
    <div className="or-root">
      <style>{STYLES}</style>

      {/* ── Card header ── */}
      <div className="or-card">
        <div className="or-card-header">
          <span className="or-card-title"><HiCheckCircle size={14} /> Review &amp; Place Order</span>
        </div>

        {/* ── Body grid ── */}
        <div className="or-body" style={{ padding: '2px' }}>

          {/* Left: details + items */}
          <div>
            {/* Delivery info */}
            <div className="or-section">
              <div className="or-section-label"><HiMapPin size={11} /> Delivery &amp; Payment</div>
              {[
                { key: 'Recipient',       val: formData.name },
                { key: 'Shipping To',     val: `${formData.address}, ${formData.city}` },
                { key: 'Shipping Method', val: SHIP_LABEL[formData.shippingMethod] || formData.shippingMethod },
                { key: 'Payment Method', val: PAY_LABEL[formData.paymentMethod]  || formData.paymentMethod },
              ].map(({ key, val }) => (
                <div key={key} className="or-detail-row">
                  <span className="or-detail-key">{key}</span>
                  <span className="or-detail-val">{val}</span>
                </div>
              ))}
            </div>

            {/* Items */}
            <div className="or-section">
              <div className="or-section-label"><HiTruck size={11} /> Items ({cartItems.length})</div>
              {cartItems.map(item => (
                <div key={item._id} className="or-item">
                  <img
                    className="or-item-img"
                    src={item.imageUrls?.[0] || item.product?.imageUrls?.[0] || 'https://placehold.co/50x62/f2f0ed/999?text=·'}
                    alt={item.name}
                    onError={e => { e.target.src = 'https://placehold.co/50x62/f2f0ed/999?text=·'; }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="or-item-name">{item.name}</div>
                    <div className="or-item-meta">Size: {item.size}  ·  Qty: {item.quantity}</div>
                    <div className="or-item-price">
                      Ksh {fmt(item.price)} × {item.quantity} = Ksh {fmt(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: summary */}
          <div style={{ padding: '0 2px 2px 0' }}>
            <div className="or-summary">
              <div className="or-summary-title">Order Summary</div>
              {[
                { label: 'Subtotal',          val: fmt(subtotal) },
                { label: `VAT (${taxRate * 100}%)`, val: fmt(tax) },
                { label: 'Shipping',          val: shippingCost === 0 ? 'Free' : `Ksh ${fmt(shippingCost)}` },
              ].map(({ label, val }) => (
                <div key={label} className="or-summary-row">
                  <span className="or-summary-label">{label}</span>
                  <span className="or-summary-val">{val.startsWith('Ksh') || val === 'Free' ? val : `Ksh ${val}`}</span>
                </div>
              ))}
              <div className="or-summary-divider" />
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
                <span className="or-summary-total-label">Total</span>
                <span className="or-summary-total-val">Ksh {fmt(orderTotal)}</span>
              </div>
              <p className="or-summary-note">All prices in Kenyan Shillings</p>
            </div>
          </div>
        </div>

        {/* ── Nav ── */}
        <div className="or-nav">
          <button className="or-back-btn" onClick={onPrev} disabled={busy}>
            <HiArrowLeft size={13} /> Edit Details
          </button>
          <button className="or-pay-btn" onClick={handlePlaceOrderAndPay} disabled={busy}>
            {busy ? <><div className="or-spinner" /> Processing…</> : <>Place Order &amp; Pay <HiCreditCard size={14} /></>}
          </button>
        </div>
      </div>

      {/* ── Payment Modal ── */}
      {showModal && (
        <div className="or-modal-overlay" onClick={e => e.target === e.currentTarget && handleModalDismiss()}>
          <div className="or-modal">
            <div className="or-modal-accent" />
            <div className="or-modal-header">
              <span className="or-modal-title">Secure Payment</span>
              <button className="or-modal-close" onClick={handleModalDismiss} aria-label="Close">
                <HiXMark size={16} />
              </button>
            </div>
            <div className="or-modal-body">

              {/* Amount block */}
              <div className="or-modal-amount-block">
                <div>
                  <div className="or-modal-order-id">Order ID</div>
                  <div className="or-modal-order-num">#{orderId?.slice(-6).toUpperCase()}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="or-modal-total-label">Total Due</div>
                  <div className="or-modal-total-val">Ksh {fmt(orderTotal)}</div>
                </div>
              </div>

              {/* Reference */}
              {paystackReference && (
                <div className="or-modal-ref-row">
                  <span className="or-modal-ref-label">Paystack Reference</span>
                  <span className="or-modal-ref-val">{paystackReference}</span>
                </div>
              )}

              <p className="or-modal-info">
                You'll be redirected to Paystack's secure payment page where you can pay via Card, Bank Transfer, or Mobile Money (M-Pesa).
              </p>

              <button className="or-modal-proceed-btn" onClick={handleProceedToPaystack} disabled={!paystackAuthUrl}>
                <HiCreditCard size={15} /> Continue to Payment
              </button>
              <button className="or-modal-cancel-btn" onClick={handleModalDismiss}>
                Cancel &amp; Return Home
              </button>
            </div>

            <div className="or-secure-note">
              <div className="or-secure-dot" />
              Secured by Paystack · 256-bit SSL encryption
            </div>
          </div>
        </div>
      )}
    </div>
  );
};