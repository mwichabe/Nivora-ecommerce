import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import {
  HiCheckCircle,
  HiArrowLeft,
  HiCreditCard,
  HiTruck,
  HiMapPin,
} from "react-icons/hi2";
import { OrderReview } from "./OrderReview";

const PRIMARY = '#ea2e0e';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:wght@400;600&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  .ck-root {
    min-height: 100vh;
    background: #faf9f7;
    font-family: 'DM Sans', sans-serif;
    padding: 48px 24px 80px;
  }

  /* ── Page header ── */
  .ck-header { text-align: center; margin-bottom: 40px; }
  .ck-eyebrow {
    font-size: 9px; font-weight: 700;
    letter-spacing: 0.28em; text-transform: uppercase; color: ${PRIMARY};
    display: inline-flex; align-items: center; gap: 8px; margin-bottom: 10px;
  }
  .ck-eyebrow-line { display: inline-block; width: 20px; height: 1.5px; background: ${PRIMARY}; }
  .ck-page-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 44px; letter-spacing: 0.04em; color: #111; line-height: 1;
  }

  /* ── Stepper ── */
  .ck-stepper {
    display: flex; align-items: flex-start;
    max-width: 640px; margin: 0 auto 40px;
    position: relative;
  }
  .ck-step { flex: 1; display: flex; flex-direction: column; align-items: center; position: relative; }
  .ck-step-connector {
    position: absolute;
    top: 16px; left: calc(50% + 20px);
    right: calc(-50% + 20px);
    height: 1px;
    background: #e8e4de;
    z-index: 0;
    transition: background 0.3s;
  }
  .ck-step-connector.done { background: ${PRIMARY}; }
  .ck-step-dot {
    width: 32px; height: 32px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    border: 2px solid #e8e4de;
    background: #faf9f7;
    color: #ccc;
    transition: all 0.25s;
    position: relative; z-index: 1;
    flex-shrink: 0;
  }
  .ck-step-dot.active {
    border-color: ${PRIMARY}; background: ${PRIMARY}; color: #fff;
    box-shadow: 0 0 0 4px rgba(234,46,14,0.12);
  }
  .ck-step-dot.done {
    border-color: #111; background: #111; color: #fff;
  }
  .ck-step-label {
    margin-top: 8px;
    font-size: 9px; font-weight: 700;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: #ccc; text-align: center;
    transition: color 0.2s;
  }
  .ck-step-label.active { color: ${PRIMARY}; }
  .ck-step-label.done   { color: #555; }

  /* ── Layout ── */
  .ck-layout {
    max-width: 860px; margin: 0 auto;
    display: grid; grid-template-columns: 1fr;
    gap: 2px;
  }

  /* ── Card ── */
  .ck-card {
    background: #fff;
    border: 1px solid #e8e4de;
  }
  .ck-card-header {
    padding: 18px 28px;
    border-bottom: 1px solid #f0ede8;
    display: flex; align-items: center; gap: 10px;
  }
  .ck-card-title {
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.2em; text-transform: uppercase; color: #555;
    display: flex; align-items: center; gap: 8px;
  }
  .ck-card-title svg { color: ${PRIMARY}; }
  .ck-card-body { padding: 28px; }

  /* ── Form fields ── */
  .ck-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .ck-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
  .ck-full   { grid-column: 1 / -1; }
  @media (max-width: 640px) {
    .ck-grid-2 { grid-template-columns: 1fr; }
    .ck-grid-3 { grid-template-columns: 1fr; }
    .ck-card-body { padding: 20px; }
  }

  .ck-field { display: flex; flex-direction: column; }
  .ck-label {
    font-size: 9px; font-weight: 700;
    letter-spacing: 0.18em; text-transform: uppercase; color: #aaa;
    margin-bottom: 7px;
  }
  .ck-input, .ck-select {
    height: 46px; padding: 0 14px;
    border: 1.5px solid #e8e4de;
    background: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; color: #111;
    outline: none;
    transition: border-color 0.18s, box-shadow 0.18s;
    border-radius: 0;
    -webkit-appearance: none;
    width: 100%;
  }
  .ck-input:focus, .ck-select:focus { border-color: #111; box-shadow: inset 0 0 0 1px #111; }
  .ck-input::placeholder { color: #ccc; }
  .ck-input.readonly { background: #faf9f7; color: #999; border-color: #f0ede8; cursor: not-allowed; }
  .ck-field-error { font-size: 11px; color: ${PRIMARY}; margin-top: 5px; }

  /* ── Shipping / Payment option cards ── */
  .ck-option {
    border: 1.5px solid #e8e4de;
    padding: 18px 20px;
    cursor: pointer;
    transition: all 0.18s;
    display: flex; align-items: center; justify-content: space-between;
    gap: 12px;
    margin-bottom: 8px;
    position: relative;
  }
  .ck-option:last-child { margin-bottom: 0; }
  .ck-option:hover { border-color: #ccc; }
  .ck-option.selected { border-color: #111; background: #faf9f7; }
  .ck-option.selected::before {
    content: '';
    position: absolute; left: 0; top: 0; bottom: 0; width: 2px;
    background: ${PRIMARY};
  }

  .ck-option-dot {
    width: 18px; height: 18px; border-radius: 50%;
    border: 2px solid #ddd; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s;
  }
  .ck-option.selected .ck-option-dot {
    border-color: ${PRIMARY}; background: ${PRIMARY};
  }
  .ck-option-dot-inner {
    width: 6px; height: 6px; border-radius: 50%;
    background: #fff; opacity: 0; transition: opacity 0.15s;
  }
  .ck-option.selected .ck-option-dot-inner { opacity: 1; }

  .ck-option-left { display: flex; align-items: center; gap: 14px; flex: 1; }
  .ck-option-name { font-size: 14px; font-weight: 600; color: #111; margin-bottom: 2px; }
  .ck-option-sub  { font-size: 12px; color: #999; }
  .ck-option-price {
    font-family: 'DM Mono', monospace;
    font-size: 15px; font-weight: 500; color: #111;
    white-space: nowrap; flex-shrink: 0;
  }
  .ck-option-price.free { color: #4ade80; }

  /* ── Nav buttons ── */
  .ck-nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 28px;
    border-top: 1px solid #f0ede8;
    background: #faf9f7;
  }
  .ck-back-btn {
    display: flex; align-items: center; gap: 6px;
    background: transparent; border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px; font-weight: 600;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: #aaa; cursor: pointer;
    transition: color 0.15s;
    padding: 0;
  }
  .ck-back-btn:hover { color: #111; }

  .ck-next-btn {
    display: flex; align-items: center; gap: 8px;
    height: 46px; padding: 0 28px;
    background: #111; border: none; color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px; font-weight: 700;
    letter-spacing: 0.16em; text-transform: uppercase;
    cursor: pointer; transition: background 0.18s;
  }
  .ck-next-btn:hover { background: ${PRIMARY}; }

  /* ── Error alert ── */
  .ck-alert {
    max-width: 860px; margin: 0 auto 20px;
    padding: 14px 18px;
    background: #fff5f4; border: 1px solid #fecaca;
    color: #991b1b; font-size: 13px;
    display: flex; align-items: flex-start; gap: 10px;
  }

  /* ── Spinner ── */
  @keyframes ck-spin { to { transform: rotate(360deg); } }
  .ck-spinner {
    width: 20px; height: 20px;
    border: 2px solid #e8e4de; border-top-color: ${PRIMARY};
    border-radius: 50%; animation: ck-spin 0.7s linear infinite;
    margin: 60px auto;
  }
`;

/* ── Step 1: Shipping Address ── */
const ShippingAddress = ({ formData, setFormData, onNext, user }) => {
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user && !formData.address) {
      setFormData(p => ({ ...p, name: user.name || '', email: user.email || '', phone: user.phone || '', country: 'Kenya' }));
    }
  }, [user]);

  const validate = () => {
    const e = {};
    if (!formData.address)                         e.address    = 'Street address is required.';
    if (!formData.city)                            e.city       = 'City is required.';
    if (!formData.postalCode)                      e.postalCode = 'Postal code is required.';
    if (!formData.country)                         e.country    = 'Country is required.';
    if (!formData.phone || formData.phone.length < 9) e.phone  = 'Valid phone number required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  return (
    <div className="ck-card">
      <div className="ck-card-header">
        <span className="ck-card-title"><HiMapPin size={14} /> Shipping Details</span>
      </div>
      <form onSubmit={e => { e.preventDefault(); if (validate()) onNext(); }}>
        <div className="ck-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="ck-grid-2">
            <div className="ck-field">
              <label className="ck-label">Recipient Name</label>
              <input className="ck-input readonly" type="text" value={formData.name || user?.name || ''} readOnly />
            </div>
            <div className="ck-field">
              <label className="ck-label">Email Address</label>
              <input className="ck-input readonly" type="email" value={formData.email || user?.email || ''} readOnly />
            </div>
          </div>
          <div className="ck-field">
            <label className="ck-label">Phone Number <span style={{ color: PRIMARY }}>*</span></label>
            <input className="ck-input" type="tel" name="phone" value={formData.phone || ''} onChange={handleChange} placeholder="07XXXXXXXX" />
            {errors.phone && <span className="ck-field-error">{errors.phone}</span>}
          </div>
          <div className="ck-field">
            <label className="ck-label">Street Address <span style={{ color: PRIMARY }}>*</span></label>
            <input className="ck-input" type="text" name="address" value={formData.address || ''} onChange={handleChange} placeholder="Building, apartment, suite…" />
            {errors.address && <span className="ck-field-error">{errors.address}</span>}
          </div>
          <div className="ck-grid-3">
            <div className="ck-field">
              <label className="ck-label">City <span style={{ color: PRIMARY }}>*</span></label>
              <input className="ck-input" type="text" name="city" value={formData.city || ''} onChange={handleChange} placeholder="Nairobi" />
              {errors.city && <span className="ck-field-error">{errors.city}</span>}
            </div>
            <div className="ck-field">
              <label className="ck-label">Postal Code <span style={{ color: PRIMARY }}>*</span></label>
              <input className="ck-input" type="text" name="postalCode" value={formData.postalCode || ''} onChange={handleChange} placeholder="00100" />
              {errors.postalCode && <span className="ck-field-error">{errors.postalCode}</span>}
            </div>
            <div className="ck-field">
              <label className="ck-label">Country</label>
              <select className="ck-select" name="country" value={formData.country || 'Kenya'} onChange={handleChange}>
                {['Kenya','Uganda','Tanzania','South Africa','Nigeria','Ghana'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="ck-nav">
          <span />
          <button type="submit" className="ck-next-btn">Continue to Shipping →</button>
        </div>
      </form>
    </div>
  );
};

/* ── Step 2: Shipping Method ── */
const SHIP_METHODS = [
  { id: 'standard', name: 'Standard Delivery', cost: 300, time: '3–5 business days' },
  { id: 'express',  name: 'Express Delivery',  cost: 700, time: '1–2 business days' },
  { id: 'free',     name: 'Local Delivery',    cost: 0,   time: 'Kitale / Bungoma area' },
];

const ShippingMethod = ({ formData, setFormData, onNext, onPrev }) => {
  useEffect(() => {
    if (!formData.shippingMethod) {
      setFormData(p => ({ ...p, shippingMethod: SHIP_METHODS[0].id, shippingCost: SHIP_METHODS[0].cost }));
    }
  }, []);

  const select = m => setFormData(p => ({ ...p, shippingMethod: m.id, shippingCost: m.cost }));

  return (
    <div className="ck-card">
      <div className="ck-card-header">
        <span className="ck-card-title"><HiTruck size={14} /> Shipping Method</span>
      </div>
      <div className="ck-card-body">
        {SHIP_METHODS.map(m => (
          <div key={m.id} className={`ck-option${formData.shippingMethod === m.id ? ' selected' : ''}`} onClick={() => select(m)}>
            <div className="ck-option-left">
              <div className="ck-option-dot"><div className="ck-option-dot-inner" /></div>
              <div>
                <div className="ck-option-name">{m.name}</div>
                <div className="ck-option-sub">{m.time}</div>
              </div>
            </div>
            <span className={`ck-option-price${m.cost === 0 ? ' free' : ''}`}>
              {m.cost === 0 ? 'Free' : `Ksh ${m.cost.toLocaleString()}`}
            </span>
          </div>
        ))}
      </div>
      <div className="ck-nav">
        <button className="ck-back-btn" onClick={onPrev}><HiArrowLeft size={13} /> Back</button>
        <button className="ck-next-btn" onClick={onNext}>Continue to Payment →</button>
      </div>
    </div>
  );
};

/* ── Step 3: Payment Method ── */
const PAY_METHODS = [
  { id: 'mpesa', name: 'M-Pesa',             sub: 'Mobile money — instant STK push' },
  { id: 'card',  name: 'Credit / Debit Card', sub: 'Visa, Mastercard, Amex' },
  { id: 'bank',  name: 'Bank Transfer',       sub: 'Direct bank deposit' },
];

const PaymentMethod = ({ formData, setFormData, onNext, onPrev }) => {
  useEffect(() => {
    if (!formData.paymentMethod) setFormData(p => ({ ...p, paymentMethod: PAY_METHODS[0].id }));
  }, []);

  return (
    <div className="ck-card">
      <div className="ck-card-header">
        <span className="ck-card-title"><HiCreditCard size={14} /> Payment Method</span>
      </div>
      <div className="ck-card-body">
        {PAY_METHODS.map(m => (
          <div key={m.id} className={`ck-option${formData.paymentMethod === m.id ? ' selected' : ''}`}
            onClick={() => setFormData(p => ({ ...p, paymentMethod: m.id }))}>
            <div className="ck-option-left">
              <div className="ck-option-dot"><div className="ck-option-dot-inner" /></div>
              <div>
                <div className="ck-option-name">{m.name}</div>
                <div className="ck-option-sub">{m.sub}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="ck-nav">
        <button className="ck-back-btn" onClick={onPrev}><HiArrowLeft size={13} /> Back</button>
        <button className="ck-next-btn" onClick={onNext}>Review Order →</button>
      </div>
    </div>
  );
};

/* ── Step definitions ── */
const STEPS = [
  { name: 'Address',  icon: HiMapPin },
  { name: 'Shipping', icon: HiTruck },
  { name: 'Payment',  icon: HiCreditCard },
  { name: 'Review',   icon: HiCheckCircle },
];

/* ── Main ── */
const CheckoutScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, totalCartPrice, refreshCart } = useCart();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData]       = useState({});
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);

  useEffect(() => {
    const id = 'ck-styles';
    if (!document.getElementById(id)) {
      const s = document.createElement('style');
      s.id = id; s.textContent = STYLES;
      document.head.appendChild(s);
    }
  }, []);

  const nextStep = () => setCurrentStep(p => Math.min(p + 1, STEPS.length));
  const prevStep = () => setCurrentStep(p => Math.max(p - 1, 1));

  const handlePlaceOrder = async (orderTotal, subtotal, tax) => {
    if (!user) return null;
    setLoading(true); setError(null);
    const orderData = {
      shippingAddress: { address: formData.address, city: formData.city, postalCode: formData.postalCode, country: formData.country },
      shippingMethod: formData.shippingMethod,
      paymentMethod: formData.paymentMethod,
      items: cartItems.filter(i => i.product || i.productId).map(i => ({ product: i.product || i.productId, name: i.name, size: i.size, quantity: i.quantity, price: i.price })),
      itemsPrice: subtotal, taxPrice: tax,
      shippingPrice: formData.shippingCost,
      totalPrice: orderTotal,
      phone: formData.phone,
    };
    if (orderData.items.length === 0) {
      setError('No valid items in cart to order. Please add items to your cart.');
      setLoading(false);
      return null;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://one-man-server.onrender.com/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(orderData),
      });
      const data = await res.json();
      if (res.ok) return data;
      setError(data.message || 'Failed to place order. Please try again.');
      return null;
    } catch {
      setError('Network error: could not connect to the server.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <ShippingAddress formData={formData} setFormData={setFormData} onNext={nextStep} user={user} />;
      case 2: return <ShippingMethod  formData={formData} setFormData={setFormData} onNext={nextStep} onPrev={prevStep} />;
      case 3: return <PaymentMethod   formData={formData} setFormData={setFormData} onNext={nextStep} onPrev={prevStep} />;
      case 4: return (
        <OrderReview
          formData={formData} onPrev={prevStep}
          placeOrder={handlePlaceOrder}
          cartItems={cartItems} totalCartPrice={totalCartPrice}
          loading={loading} user={user} refreshCart={refreshCart}
        />
      );
      default: return null;
    }
  };

  return (
    <div className="ck-root">
      <style>{STYLES}</style>

      {/* ── Header ── */}
      <div className="ck-header">
        <div className="ck-eyebrow"><span className="ck-eyebrow-line" /> Secure Checkout</div>
        <h1 className="ck-page-title">Complete Your Order</h1>
      </div>

      {/* ── Stepper ── */}
      <div className="ck-stepper" style={{ maxWidth: 580, margin: '0 auto 36px' }}>
        {STEPS.map((step, i) => {
          const num = i + 1;
          const active = currentStep === num;
          const done   = currentStep > num;
          return (
            <div key={i} className="ck-step">
              {i < STEPS.length - 1 && (
                <div className={`ck-step-connector${done ? ' done' : ''}`} />
              )}
              <div className={`ck-step-dot${active ? ' active' : done ? ' done' : ''}`}>
                {done ? <HiCheckCircle size={14} /> : <step.icon size={13} />}
              </div>
              <span className={`ck-step-label${active ? ' active' : done ? ' done' : ''}`}>
                {step.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="ck-alert">
          <span>✕</span>
          <span><strong>Error:</strong> {error}</span>
        </div>
      )}

      {/* ── Step content ── */}
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        {renderStep()}
      </div>
    </div>
  );
};

export default CheckoutScreen;