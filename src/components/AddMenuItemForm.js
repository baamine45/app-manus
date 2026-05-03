import React, { useState } from 'react';

const CATEGORIES = ['Entrée', 'Plat principal', 'Dessert', 'Boisson', 'Autre'];

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  category: 'Plat principal',
  available: true,
};

function AddMenuItemForm({ onAdd }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      await onAdd({ ...form, price: parseFloat(form.price) });
      setForm(EMPTY_FORM);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h2>Ajouter un plat</h2>
      {error && <p className="form-error">{error}</p>}
      <div className="form-row">
        <label>
          Nom *
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Ex: Steak frites"
            maxLength={100}
            required
          />
        </label>
        <label>
          Prix (€) *
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />
        </label>
      </div>
      <div className="form-row">
        <label>
          Catégorie
          <select name="category" value={form.category} onChange={handleChange}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="available"
            checked={form.available}
            onChange={handleChange}
          />
          Disponible
        </label>
      </div>
      <label>
        Description
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description du plat..."
          maxLength={500}
          rows={2}
        />
      </label>
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? 'Ajout en cours...' : '+ Ajouter au menu'}
      </button>
    </form>
  );
}

export default AddMenuItemForm;
