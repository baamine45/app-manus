import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const BASE_URL = process.env.REACT_APP_API_URL || '/api';

function LoginPage({ onSwitchToRegister }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      login(data.user, data.token);
    } catch (err) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-header">
          <h1>🍽️ App Menus</h1>
          <p>Connectez-vous pour continuer</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          {error && <p className="form-error">{error}</p>}
          <label>
            Nom d'utilisateur
            <input type="text" name="username" value={form.username} onChange={handleChange} placeholder="Votre nom d'utilisateur" autoComplete="username" required />
          </label>
          <label>
            Mot de passe
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••" autoComplete="current-password" required />
          </label>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        <p className="login-switch">
          Pas encore de compte ?{' '}
          <button className="btn-link" onClick={onSwitchToRegister}>Créer un compte</button>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
