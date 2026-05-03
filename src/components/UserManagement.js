import React, { useState, useEffect } from 'react';

const BASE_URL = process.env.REACT_APP_API_URL || '/api';
const getToken = () => localStorage.getItem('token');

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ username: '', password: '', role: 'user' });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => { fetchUsers(); }, []);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/users`, { headers: { Authorization: `Bearer ${getToken()}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUsers(data.data);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setFormError(''); setSuccess('');
    if (form.password.length < 6) { setFormError('Minimum 6 caractères.'); return; }
    setFormLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccess(`Compte "${form.username}" créé avec succès.`);
      setForm({ username: '', password: '', role: 'user' });
      fetchUsers();
    } catch (err) { setFormError(err.message); }
    finally { setFormLoading(false); }
  }

  async function handleChangeRole(id, newRole) {
    try {
      const res = await fetch(`${BASE_URL}/auth/users/${id}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role: newRole } : u)));
    } catch (err) { alert(err.message); }
  }

  async function handleDelete(id, username) {
    if (!window.confirm(`Supprimer le compte "${username}" ?`)) return;
    try {
      const res = await fetch(`${BASE_URL}/auth/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) { alert(err.message); }
  }

  return (
    <section className="user-management">
      <h2>👥 Gestion des utilisateurs</h2>
      <form className="add-form" onSubmit={handleCreate}>
        <h3>Créer un utilisateur</h3>
        {formError && <p className="form-error">{formError}</p>}
        {success && <p className="form-success">{success}</p>}
        <div className="form-row">
          <label>
            Nom d'utilisateur
            <input type="text" value={form.username} onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))} placeholder="Nom d'utilisateur" minLength={3} required />
          </label>
          <label>
            Mot de passe
            <input type="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} placeholder="Minimum 6 caractères" required />
          </label>
          <label>
            Rôle
            <select value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}>
              <option value="user">👤 Utilisateur</option>
              <option value="admin">👑 Administrateur</option>
            </select>
          </label>
        </div>
        <button type="submit" className="btn-primary" disabled={formLoading}>
          {formLoading ? 'Création...' : '+ Créer le compte'}
        </button>
      </form>
      <div className="user-list">
        <h3>Comptes existants ({users.length})</h3>
        {loading ? <p className="loading">Chargement...</p> : error ? <p className="form-error">{error}</p> : (
          <table className="user-table">
            <thead><tr><th>Nom d'utilisateur</th><th>Rôle</th><th>Créé le</th><th>Actions</th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.username}</td>
                  <td>
                    <select value={u.role} onChange={(e) => handleChangeRole(u._id, e.target.value)} className="role-select">
                      <option value="user">👤 Utilisateur</option>
                      <option value="admin">👑 Admin</option>
                    </select>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString('fr-FR')}</td>
                  <td><button className="btn-delete" onClick={() => handleDelete(u._id, u.username)}>🗑️ Supprimer</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

export default UserManagement;
