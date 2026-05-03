import React, { useState } from 'react';

const BASE_URL = process.env.REACT_APP_API_URL || '/api';

function ChangePasswordModal({ onClose }) {
  const [form, setForm] = useState({ current: '', newPass: '', confirm: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (form.newPass !== form.confirm) {
      setError('Les nouveaux mots de passe ne correspondent pas.');
      return;
    }
    if (form.newPass.length < 6) {
      setError('Le nouveau mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ currentPassword: form.current, newPassword: form.newPass }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccess('Mot de passe modifié avec succès !');
      setForm({ current: '', newPass: '', confirm: '' });
      setTimeout(onClose, 1500);
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
          <h2>🔑 Changer le mot de passe</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          {error && <p className="form-error">{error}</p>}
          {success && <p className="form-success">{success}</p>}
          <label>
            Mot de passe actuel
            <input type="password" name="current" value={form.current} onChange={handleChange} placeholder="••••••" required />
          </label>
          <label>
            Nouveau mot de passe
            <input type="password" name="newPass" value={form.newPass} onChange={handleChange} placeholder="Minimum 6 caractères" required />
          </label>
          <label>
            Confirmer le nouveau mot de passe
            <input type="password" name="confirm" value={form.confirm} onChange={handleChange} placeholder="Répétez le nouveau mot de passe" required />
          </label>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Modification...' : '💾 Modifier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordModal;
