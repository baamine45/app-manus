import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const BASE_URL = process.env.REACT_APP_API_URL || '/api';

function RegisterPage({ onSwitchToLogin }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '', confirm: '', role: 'user' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Les mots de passe ne correspondent pas.'); return; }
    if (form.password.length < 6) { setError('Minimum 6 caractères.'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.username, password: form.password, role: form.role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      login(data.user, data.token);
    } catch (err) {
      setError(err.message || 'Erreur lors de la création du compte');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-header">
          <h1>🍽️ App Menus</h1>
          <p>Créer un nouveau compte</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          {error && <p className="form-error">{error}</p>}
          <label>
            Nom d'utilisateur
            <input type="text" name="username" value={form.username} onChange={handleChange} placeholder="Choisissez un nom d'utilisateur" minLength={3} required />
          </label>
          <label>
            Mot de passe
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Minimum 6 caractères" required />
          </label>
          <label>
            Confirmer le mot de passe
            <input type="password" name="confirm" value={form.confirm} onChange={handleChange} placeholder="Répétez le mot de passe" required />
          </label>
          <label>
            Rôle
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="user">👤 Utilisateur — lecture seule</option>
              <option value="admin">👑 Administrateur — accès complet</option>
            </select>
          </label>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Création...' : 'Créer le compte'}
          </button>
        </form>
        <p className="login-switch">
          Déjà un compte ?{' '}
          <button className="btn-link" onClick={onSwitchToLogin}>Se connecter</button>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
