import React, { useState } from 'react';

const CATEGORIES = ['Entrée', 'Plat principal', 'Dessert', 'Boisson', 'Autre'];

function EditMenuItemModal({ item, onSave, onClose }) {
  const [form, setForm] = useState({
    name: item.name,
    description: item.description || '',
    price: item.price,
    category: item.category,
    available: item.available,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.price) {
      setError('Le nom et le prix sont obligatoires.');
      return;
    }
    setLoading(true);
    try {
      await onSave(item._id, { ...form, price: parseFloat(form.price) });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>✏️ Modifier le plat</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="add-form" style={{ boxShadow: 'none', padding: 0 }}>
          {error && <p className="form-error">{error}</p>}
          <div className="form-row">
            <label>
              Nom *
              <input type="text" name="name" value={form.name} onChange={handleChange} maxLength={100} required />
            </label>
            <label>
              Prix (€) *
              <input type="number" name="price" value={form.price} onChange={handleChange} min="0" step="0.01" required />
            </label>
          </div>
          <div className="form-row">
            <label>
              Catégorie
              <select name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label className="checkbox-label">
              <input type="checkbox" name="available" checked={form.available} onChange={handleChange} />
              Disponible
            </label>
          </div>
          <label>
            Description
            <textarea name="description" value={form.description} onChange={handleChange} maxLength={500} rows={2} />
          </label>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Enregistrement...' : '💾 Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditMenuItemModal;
