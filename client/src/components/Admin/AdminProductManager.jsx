import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus as IconPlus,
  Sparkles as IconSparkles,
  Check as IconCheck,
  X as IconXMark,
  Pencil as IconPencil,
  Trash as IconTrash,
  Images as IconImages,
  Maximize2 as IconMaximize2,
  LogOut,
  Package,
  AlertCircle,
  ChevronDown,
} from 'lucide-react';
import { API_BASE } from '../../config';

const PRIMARY = '#ea2e0e';
const API_BASE_URL = `${API_BASE}/admin/products`;
const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const CATEGORIES = ['Men', 'Women', 'Top Wear', 'Bottom Wear', 'Accessories'];

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  .adm-root {
    min-height: 100vh;
    background: #0f0f0f;
    font-family: 'DM Sans', sans-serif;
    color: #e8e4de;
  }

  /* ── Top bar ── */
  .adm-topbar {
    height: 56px;
    background: #161616;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 32px;
    position: sticky; top: 0; z-index: 30;
  }
  .adm-topbar-left { display: flex; align-items: center; gap: 12px; }
  .adm-wordmark {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 20px; letter-spacing: 0.1em; color: #fff;
  }
  .adm-badge {
    padding: 2px 8px;
    background: ${PRIMARY};
    font-size: 8px; font-weight: 700;
    letter-spacing: 0.18em; text-transform: uppercase; color: #fff;
  }
  .adm-logout-btn {
    display: flex; align-items: center; gap: 7px;
    padding: 7px 14px;
    border: 1px solid rgba(255,255,255,0.1);
    background: transparent;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px; font-weight: 500;
    letter-spacing: 0.08em; color: rgba(255,255,255,0.5);
    cursor: pointer; transition: all 0.15s;
  }
  .adm-logout-btn:hover { border-color: rgba(255,255,255,0.25); color: #fff; }

  /* ── Layout ── */
  .adm-body { max-width: 1400px; margin: 0 auto; padding: 32px 32px 64px; }

  /* ── Stats row ── */
  .adm-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2px; margin-bottom: 32px;
  }
  .adm-stat {
    background: #161616;
    border: 1px solid rgba(255,255,255,0.06);
    padding: 20px 24px;
  }
  .adm-stat-label {
    font-size: 9px; font-weight: 700;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: rgba(255,255,255,0.3); margin-bottom: 8px;
  }
  .adm-stat-value {
    font-family: 'DM Mono', monospace;
    font-size: 28px; font-weight: 500; color: #fff; line-height: 1;
  }
  .adm-stat-sub { font-size: 11px; color: rgba(255,255,255,0.25); margin-top: 4px; }

  /* ── Section card ── */
  .adm-card {
    background: #161616;
    border: 1px solid rgba(255,255,255,0.06);
    margin-bottom: 2px;
  }
  .adm-card-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 24px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .adm-card-title {
    display: flex; align-items: center; gap: 10px;
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: rgba(255,255,255,0.4);
  }
  .adm-card-title svg { color: rgba(255,255,255,0.2); }

  /* ── Form ── */
  .adm-form-grid {
    padding: 24px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  @media (max-width: 800px) { .adm-form-grid { grid-template-columns: 1fr; } }
  .adm-full { grid-column: 1 / -1; }

  .adm-label {
    display: block;
    font-size: 9px; font-weight: 700;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: rgba(255,255,255,0.3); margin-bottom: 7px;
  }
  .adm-input, .adm-select, .adm-textarea {
    width: 100%;
    background: #0f0f0f;
    border: 1px solid rgba(255,255,255,0.1);
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px;
    outline: none;
    transition: border-color 0.18s, box-shadow 0.18s;
    border-radius: 0;
    -webkit-appearance: none;
  }
  .adm-input  { height: 42px; padding: 0 12px; }
  .adm-select { height: 42px; padding: 0 12px; cursor: pointer; }
  .adm-textarea { padding: 10px 12px; resize: none; line-height: 1.6; }
  .adm-input:focus, .adm-select:focus, .adm-textarea:focus {
    border-color: rgba(255,255,255,0.3);
    box-shadow: 0 0 0 1px rgba(255,255,255,0.08);
  }
  .adm-input::placeholder, .adm-textarea::placeholder { color: rgba(255,255,255,0.18); }
  option { background: #1a1a1a; }

  /* Size chips */
  .adm-sizes { display: flex; flex-wrap: wrap; gap: 6px; }
  .adm-size-chip {
    display: flex; align-items: center; gap: 0;
    border: 1px solid rgba(255,255,255,0.1);
    cursor: pointer; transition: all 0.13s; overflow: hidden;
  }
  .adm-size-chip input[type="checkbox"] { display: none; }
  .adm-size-chip label {
    display: block;
    padding: 6px 14px;
    font-size: 10px; font-weight: 600; letter-spacing: 0.08em;
    color: rgba(255,255,255,0.35); cursor: pointer; transition: all 0.13s;
    user-select: none;
  }
  .adm-size-chip.checked { border-color: ${PRIMARY}; background: rgba(234,46,14,0.1); }
  .adm-size-chip.checked label { color: ${PRIMARY}; }

  /* Publish button */
  .adm-publish-btn {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    height: 44px; padding: 0 28px;
    background: ${PRIMARY}; border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.16em; text-transform: uppercase; color: #fff;
    cursor: pointer; transition: opacity 0.15s;
    margin-top: 4px;
  }
  .adm-publish-btn:hover:not(:disabled) { opacity: 0.88; }
  .adm-publish-btn:disabled { background: #333; color: #666; cursor: not-allowed; }

  /* ── Error banner ── */
  .adm-error {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 14px 18px; margin-bottom: 20px;
    background: rgba(234,46,14,0.08);
    border: 1px solid rgba(234,46,14,0.25);
    color: #f87171; font-size: 13px;
  }
  .adm-error svg { flex-shrink: 0; margin-top: 1px; }

  /* ── Table ── */
  .adm-table-wrap { overflow-x: auto; }
  .adm-table {
    width: 100%; border-collapse: collapse;
    font-size: 13px;
  }
  .adm-table th {
    padding: 11px 16px;
    text-align: left;
    font-size: 8.5px; font-weight: 700;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: rgba(255,255,255,0.25);
    border-bottom: 1px solid rgba(255,255,255,0.06);
    white-space: nowrap;
    background: #0f0f0f;
  }
  .adm-table td {
    padding: 13px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    vertical-align: middle;
    color: rgba(255,255,255,0.7);
  }
  .adm-table tr:last-child td { border-bottom: none; }
  .adm-table tr:hover td { background: rgba(255,255,255,0.02); }
  .adm-table tr.editing td { background: rgba(234,46,14,0.04); }

  /* Inline edit inputs */
  .adm-inline-input, .adm-inline-select, .adm-inline-textarea {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px; outline: none;
    transition: border-color 0.15s;
    border-radius: 0;
  }
  .adm-inline-input  { height: 34px; padding: 0 8px; width: 100%; }
  .adm-inline-select { height: 34px; padding: 0 8px; cursor: pointer; }
  .adm-inline-textarea { padding: 6px 8px; resize: none; width: 100%; }
  .adm-inline-input:focus, .adm-inline-select:focus, .adm-inline-textarea:focus {
    border-color: rgba(255,255,255,0.25);
  }

  /* Product thumb */
  .adm-thumb {
    width: 44px; height: 54px;
    object-fit: cover; object-position: top;
    background: #222; flex-shrink: 0; display: block;
  }

  /* Category pill */
  .adm-cat-pill {
    display: inline-block;
    padding: 3px 10px;
    border: 1px solid rgba(255,255,255,0.1);
    font-size: 9px; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: rgba(255,255,255,0.4);
  }

  /* Stock badge */
  .adm-stock { font-family: 'DM Mono', monospace; font-size: 13px; }
  .adm-stock.low { color: ${PRIMARY}; }
  .adm-stock.ok  { color: rgba(255,255,255,0.6); }

  /* Size tags */
  .adm-size-tag {
    display: inline-block; padding: 2px 7px;
    border: 1px solid rgba(255,255,255,0.1);
    font-size: 8.5px; font-weight: 700; letter-spacing: 0.08em;
    color: rgba(255,255,255,0.35);
  }

  /* Action buttons */
  .adm-action-btn {
    width: 30px; height: 30px;
    display: flex; align-items: center; justify-content: center;
    background: transparent; border: 1px solid transparent;
    color: rgba(255,255,255,0.25); cursor: pointer; transition: all 0.13s;
  }
  .adm-action-btn.edit:hover  { color: #fff; border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.06); }
  .adm-action-btn.delete:hover { color: ${PRIMARY}; border-color: rgba(234,46,14,0.3); background: rgba(234,46,14,0.06); }
  .adm-action-btn.save:hover   { color: #4ade80; border-color: rgba(74,222,128,0.3); background: rgba(74,222,128,0.06); }
  .adm-action-btn.cancel:hover { color: rgba(255,255,255,0.6); border-color: rgba(255,255,255,0.15); }
  .adm-action-btn:disabled { opacity: 0.3; cursor: not-allowed; }

  /* ── Empty state ── */
  .adm-empty {
    padding: 64px 24px; text-align: center;
  }
  .adm-empty-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 28px; letter-spacing: 0.06em;
    color: rgba(255,255,255,0.1); margin-bottom: 8px;
  }
  .adm-empty-sub { font-size: 13px; color: rgba(255,255,255,0.2); }

  /* ── Loading spinner ── */
  @keyframes adm-spin { to { transform: rotate(360deg); } }
  .adm-spinner {
    width: 13px; height: 13px;
    border: 2px solid rgba(255,255,255,0.15);
    border-top-color: #fff;
    border-radius: 50%;
    animation: adm-spin 0.7s linear infinite;
    display: inline-block; vertical-align: middle;
  }

  /* Loading screen */
  .adm-loading {
    min-height: 100vh; background: #0f0f0f;
    display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 16px;
  }
  .adm-loading-ring {
    width: 32px; height: 32px;
    border: 2px solid rgba(255,255,255,0.06); border-top-color: ${PRIMARY};
    border-radius: 50%; animation: adm-spin 0.8s linear infinite;
  }
  .adm-loading-text { font-size: 12px; color: rgba(255,255,255,0.2); letter-spacing: 0.1em; }

  /* Confirm modal */
  .adm-modal-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.7); z-index: 100;
    display: flex; align-items: center; justify-content: center; padding: 24px;
  }
  .adm-modal {
    background: #1a1a1a; border: 1px solid rgba(255,255,255,0.1);
    padding: 28px 28px 24px; max-width: 380px; width: 100%;
  }
  .adm-modal h3 {
    font-size: 14px; font-weight: 600; color: #fff; margin-bottom: 8px;
  }
  .adm-modal p { font-size: 13px; color: rgba(255,255,255,0.4); line-height: 1.6; margin-bottom: 24px; }
  .adm-modal-actions { display: flex; gap: 8px; justify-content: flex-end; }
  .adm-modal-cancel {
    padding: 8px 16px; border: 1px solid rgba(255,255,255,0.12);
    background: transparent; color: rgba(255,255,255,0.4);
    font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 600;
    letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all 0.15s;
  }
  .adm-modal-cancel:hover { color: #fff; border-color: rgba(255,255,255,0.25); }
  .adm-modal-confirm {
    padding: 8px 16px; border: none; background: ${PRIMARY};
    color: #fff; font-family: 'DM Sans', sans-serif;
    font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
    cursor: pointer; transition: opacity 0.15s;
  }
  .adm-modal-confirm:hover { opacity: 0.85; }

  @media (max-width: 640px) {
    .adm-body { padding: 20px 16px 48px; }
    .adm-topbar { padding: 0 16px; }
    .adm-stats { grid-template-columns: 1fr; }
  }
`;

/* ── API ── */
const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };
  const res = await fetch(url, { credentials: 'include', ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: `Error ${res.status}` }));
    throw new Error(err.message || `API Error: ${res.status}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : {};
};
const fetchProducts  = ()         => apiFetch(API_BASE_URL, { method: 'GET' });
const addProduct     = (data)     => apiFetch(API_BASE_URL, { method: 'POST', body: JSON.stringify(data) });
const updateProduct  = (id, data) => apiFetch(`${API_BASE_URL}/${id}`, { method: 'PUT', body: JSON.stringify(data) });
const deleteProduct  = (id)       => apiFetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });

/* ── Confirm Modal ── */
const ConfirmModal = ({ msg, onConfirm, onCancel }) => (
  <div className="adm-modal-overlay">
    <div className="adm-modal">
      <h3>Confirm Deletion</h3>
      <p>{msg}</p>
      <div className="adm-modal-actions">
        <button className="adm-modal-cancel" onClick={onCancel}>Cancel</button>
        <button className="adm-modal-confirm" onClick={onConfirm}>Delete</button>
      </div>
    </div>
  </div>
);

/* ── Size picker ── */
const SizePicker = ({ selected, onChange, inline = false }) => (
  <div className="adm-sizes">
    {AVAILABLE_SIZES.map(size => {
      const checked = selected.includes(size);
      return (
        <div
          key={size}
          className={`adm-size-chip${checked ? ' checked' : ''}`}
          onClick={() => {
            if (checked) onChange(selected.filter(s => s !== size));
            else onChange([...selected, size]);
          }}
        >
          <label style={{ padding: inline ? '4px 10px' : undefined }}>{size}</label>
        </div>
      );
    })}
  </div>
);

/* ── Main ── */
const AdminProductManager = () => {
  const [products, setProducts]         = useState([]);
  const [dataLoading, setDataLoading]   = useState(false);
  const [isDataReady, setIsDataReady]   = useState(false);
  const [error, setError]               = useState(null);
  const [refetch, setRefetch]           = useState(0);
  const [confirmDelete, setConfirmDelete] = useState(null); // productId | null

  const [newProduct, setNewProduct] = useState({
    name: '', price: '', description: '', category: 'Men',
    imageUrls: ['', '', ''], stock: '10', sizes: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editingId, setEditingId]   = useState(null);
  const [editData, setEditData]     = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  /* Inject styles */
  useEffect(() => {
    const id = 'adm-styles';
    if (!document.getElementById(id)) {
      const s = document.createElement('style');
      s.id = id; s.textContent = STYLES;
      document.head.appendChild(s);
    }
  }, []);

  /* Fetch */
  useEffect(() => {
    (async () => {
      setDataLoading(true); setError(null);
      try {
        setProducts(await fetchProducts());
      } catch (e) {
        setError(e.message); setProducts([]);
      } finally {
        setDataLoading(false); setIsDataReady(true);
      }
    })();
  }, [refetch]);

  /* Stats */
  const totalProducts = products.length;
  const lowStock      = useMemo(() => products.filter(p => p.stock <= 5).length, [products]);
  const totalValue    = useMemo(() => products.reduce((s, p) => s + (p.price * p.stock), 0), [products]);

  /* Handlers */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('imageUrl')) {
      const i = parseInt(name.slice(-1), 10) - 1;
      setNewProduct(p => { const u = [...p.imageUrls]; u[i] = value; return { ...p, imageUrls: u }; });
    } else {
      setNewProduct(p => ({ ...p, [name]: value }));
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!newProduct.name || !newProduct.price || !newProduct.description || !newProduct.stock) {
      setError('Please fill in all required fields.'); return;
    }
    setIsSubmitting(true); setError(null);
    try {
      const urls = newProduct.imageUrls.filter(u => u.trim());
      await addProduct({
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock, 10),
        imageUrls: urls.length ? urls : ['https://placehold.co/600x400/111/eee?text=Product'],
      });
      setRefetch(r => r + 1);
      setNewProduct({ name: '', price: '', description: '', category: 'Men', imageUrls: ['', '', ''], stock: '10', sizes: [] });
    } catch (e) { setError(e.message); }
    finally { setIsSubmitting(false); }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('editImageUrl')) {
      const i = parseInt(name.slice(-1), 10) - 1;
      setEditData(p => { const u = [...(p.imageUrls || ['', '', ''])]; u[i] = value; return { ...p, imageUrls: u }; });
    } else {
      setEditData(p => ({ ...p, [name]: value }));
    }
  };

  const startEditing = (product) => {
    setEditingId(product._id);
    setEditData({
      name: product.name, price: String(product.price), stock: String(product.stock),
      category: product.category, description: product.description,
      imageUrls: [...(product.imageUrls || []), '', ''].slice(0, 3),
      sizes: product.sizes || [],
    });
    setError(null);
  };

  const handleUpdateSubmit = async () => {
    if (!editingId || isUpdating) return;
    setIsUpdating(true); setError(null);
    try {
      const urls = editData.imageUrls.filter(u => u.trim());
      await updateProduct(editingId, {
        ...editData,
        price: parseFloat(editData.price),
        stock: parseInt(editData.stock, 10),
        imageUrls: urls.length ? urls : ['https://placehold.co/600x400/111/eee?text=Product'],
      });
      setEditingId(null); setRefetch(r => r + 1);
    } catch (e) { setError(e.message); }
    finally { setIsUpdating(false); }
  };

  const handleDeleteConfirmed = async () => {
    if (!confirmDelete) return;
    setIsUpdating(true); setError(null);
    try {
      await deleteProduct(confirmDelete);
      setRefetch(r => r + 1);
    } catch (e) { setError(e.message); }
    finally { setIsUpdating(false); setConfirmDelete(null); }
  };

  if (!isDataReady) {
    return (
      <div className="adm-loading">
        <div className="adm-loading-ring" />
        <span className="adm-loading-text">Connecting to server…</span>
      </div>
    );
  }

  return (
    <div className="adm-root">
      <style>{STYLES}</style>
      {confirmDelete && (
        <ConfirmModal
          msg="This product will be permanently removed from your inventory. This action cannot be undone."
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {/* ── Top bar ── */}
      <div className="adm-topbar">
        <div className="adm-topbar-left">
          <span className="adm-wordmark">ONE MAN</span>
          <span className="adm-badge">Admin</span>
        </div>
        <button className="adm-logout-btn" onClick={() => { localStorage.removeItem('token'); window.location.href = '/app'; }}>
          <LogOut size={13} /> Sign Out
        </button>
      </div>

      <div className="adm-body">

        {/* ── Stats ── */}
        <div className="adm-stats">
          <div className="adm-stat">
            <div className="adm-stat-label">Total Products</div>
            <div className="adm-stat-value">{totalProducts}</div>
            <div className="adm-stat-sub">in inventory</div>
          </div>
          <div className="adm-stat">
            <div className="adm-stat-label">Low Stock</div>
            <div className="adm-stat-value" style={{ color: lowStock > 0 ? PRIMARY : undefined }}>{lowStock}</div>
            <div className="adm-stat-sub">≤ 5 units remaining</div>
          </div>
          <div className="adm-stat">
            <div className="adm-stat-label">Inventory Value</div>
            <div className="adm-stat-value">
              <span style={{ fontSize: 14, opacity: 0.4 }}>Ksh </span>
              {totalValue.toLocaleString('en-KE')}
            </div>
            <div className="adm-stat-sub">price × stock</div>
          </div>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="adm-error">
            <AlertCircle size={15} />
            {error}
          </div>
        )}

        {/* ── Add Product ── */}
        <div className="adm-card" style={{ marginBottom: 24 }}>
          <div className="adm-card-header">
            <span className="adm-card-title"><IconPlus size={13} /> Add New Product</span>
          </div>
          <form onSubmit={handleAddProduct}>
            <div className="adm-form-grid">
              <div>
                <label className="adm-label">Product Name *</label>
                <input name="name" type="text" className="adm-input" value={newProduct.name} onChange={handleInputChange} placeholder="e.g. Slim Fit Cotton Shirt" required />
              </div>
              <div>
                <label className="adm-label">Category</label>
                <select name="category" className="adm-select" value={newProduct.category} onChange={handleInputChange}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="adm-label">Price (Ksh) *</label>
                <input name="price" type="number" className="adm-input" value={newProduct.price} onChange={handleInputChange} placeholder="2500" min="0.01" step="0.01" required />
              </div>
              <div>
                <label className="adm-label">Stock *</label>
                <input name="stock" type="number" className="adm-input" value={newProduct.stock} onChange={handleInputChange} placeholder="10" min="0" required />
              </div>

              {/* Image URLs */}
              <div className="adm-full">
                <label className="adm-label" style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <IconImages size={12} /> Image URLs (up to 3)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {[1, 2, 3].map(i => (
                    <div key={i}>
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', marginBottom: 5 }}>
                        IMAGE {i}{i === 1 ? ' (primary)' : ' (optional)'}
                      </div>
                      <input
                        name={`imageUrl${i}`} type="url" className="adm-input"
                        value={newProduct.imageUrls[i - 1] || ''}
                        onChange={handleInputChange}
                        placeholder="https://…"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="adm-full">
                <label className="adm-label">Description *</label>
                <textarea name="description" className="adm-textarea" rows={3} value={newProduct.description} onChange={handleInputChange} placeholder="Describe the product — fabric, fit, features…" required />
              </div>

              <div className="adm-full">
                <label className="adm-label" style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <IconMaximize2 size={12} /> Available Sizes
                </label>
                <SizePicker
                  selected={newProduct.sizes}
                  onChange={sizes => setNewProduct(p => ({ ...p, sizes }))}
                />
              </div>

              <div className="adm-full" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="adm-publish-btn" disabled={isSubmitting || isUpdating}>
                  {isSubmitting ? <><span className="adm-spinner" /> Publishing…</> : <><IconSparkles size={14} /> Publish Product</>}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* ── Products Table ── */}
        <div className="adm-card">
          <div className="adm-card-header">
            <span className="adm-card-title">
              <Package size={13} /> Inventory
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>
                {totalProducts} products
              </span>
            </span>
            {dataLoading && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}><span className="adm-spinner" /> Refreshing…</span>}
          </div>

          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Sizes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => {
                  const isEditing = editingId === product._id;
                  const thumb = product.imageUrls?.[0] || 'https://placehold.co/44x54/111/333?text=·';
                  return (
                    <tr key={product._id} className={isEditing ? 'editing' : ''}>

                      {/* Product */}
                      <td style={{ minWidth: 220 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                          <img className="adm-thumb" src={thumb} alt={product.name} onError={e => { e.target.src = 'https://placehold.co/44x54/111/333?text=·'; }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            {isEditing ? (
                              <>
                                <input name="name" className="adm-inline-input" value={editData.name || ''} onChange={handleEditChange} style={{ marginBottom: 5 }} />
                                <textarea name="description" className="adm-inline-textarea" rows={2} value={editData.description || ''} onChange={handleEditChange} />
                                <div style={{ marginTop: 6 }}>
                                  <div style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.12em', marginBottom: 4 }}>IMAGES</div>
                                  {[1, 2, 3].map(i => (
                                    <input key={i} name={`editImageUrl${i}`} type="url" className="adm-inline-input" style={{ marginBottom: 3 }}
                                      value={editData.imageUrls?.[i - 1] || ''} onChange={handleEditChange} placeholder={`Image ${i} URL`} />
                                  ))}
                                </div>
                              </>
                            ) : (
                              <>
                                <div style={{ fontWeight: 600, color: '#fff', marginBottom: 3, fontSize: 13 }}>{product.name}</div>
                                <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.28)', lineHeight: 1.5 }}>
                                  {product.description?.substring(0, 60)}{product.description?.length > 60 ? '…' : ''}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td>
                        {isEditing ? (
                          <select name="category" className="adm-inline-select" value={editData.category} onChange={handleEditChange}>
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        ) : (
                          <span className="adm-cat-pill">{product.category}</span>
                        )}
                      </td>

                      {/* Price */}
                      <td>
                        {isEditing ? (
                          <input name="price" type="number" className="adm-inline-input" style={{ width: 90 }} value={editData.price} onChange={handleEditChange} min="0.01" step="0.01" />
                        ) : (
                          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
                            {product.price?.toLocaleString('en-KE')}
                          </span>
                        )}
                      </td>

                      {/* Stock */}
                      <td>
                        {isEditing ? (
                          <input name="stock" type="number" className="adm-inline-input" style={{ width: 70 }} value={editData.stock} onChange={handleEditChange} min="0" />
                        ) : (
                          <span className={`adm-stock ${product.stock <= 5 ? 'low' : 'ok'}`}>{product.stock}</span>
                        )}
                      </td>

                      {/* Sizes */}
                      <td style={{ minWidth: 160 }}>
                        {isEditing ? (
                          <SizePicker inline selected={editData.sizes || []} onChange={sizes => setEditData(p => ({ ...p, sizes }))} />
                        ) : (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                            {(product.sizes || []).length > 0
                              ? product.sizes.map(s => <span key={s} className="adm-size-tag">{s}</span>)
                              : <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>One Size</span>
                            }
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {isEditing ? (
                            <>
                              <button className="adm-action-btn save" onClick={handleUpdateSubmit} disabled={isUpdating} title="Save">
                                {isUpdating ? <span className="adm-spinner" style={{ width: 11, height: 11 }} /> : <IconCheck size={14} />}
                              </button>
                              <button className="adm-action-btn cancel" onClick={() => setEditingId(null)} title="Cancel">
                                <IconXMark size={14} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button className="adm-action-btn edit" onClick={() => startEditing(product)} disabled={isUpdating || isSubmitting} title="Edit">
                                <IconPencil size={13} />
                              </button>
                              <button className="adm-action-btn delete" onClick={() => setConfirmDelete(product._id)} disabled={isUpdating || isSubmitting} title="Delete">
                                <IconTrash size={13} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {totalProducts === 0 && !dataLoading && (
              <div className="adm-empty">
                <div className="adm-empty-title">No Products</div>
                <p className="adm-empty-sub">Add your first product using the form above.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminProductManager;