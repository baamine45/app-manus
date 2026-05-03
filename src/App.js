import React, { useEffect, useState } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import AddMenuItemForm from './components/AddMenuItemForm';
import MenuList from './components/MenuList';
import UserManagement from './components/UserManagement';
import ChangePasswordModal from './components/ChangePasswordModal';
import { menuAPI } from './services/api';

function AppContent() {
  const { user, logout, isAdmin, loading } = useAuth();
  const [items, setItems] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('Tous');
  const [showRegister, setShowRegister] = useState(false);
  const [activeTab, setActiveTab] = useState('menu');
  const [showChangePassword, setShowChangePassword] = useState(false);

  useEffect(() => {
    if (user) fetchItems();
  }, [user]);

  async function fetchItems() {
    setFetchLoading(true);
    setError('');
    try {
      const res = await menuAPI.getAll();
      setItems(res.data);
    } catch (err) {
      setError('Impossible de charger le menu.');
    } finally {
      setFetchLoading(false);
    }
  }

  async function handleAdd(item) {
    const res = await menuAPI.create(item);
    setItems((prev) => [res.data, ...prev]);
  }

  async function handleEdit(id, updatedItem) {
    const res = await menuAPI.update(id, updatedItem);
    setItems((prev) => prev.map((i) => (i._id === id ? res.data : i)));
  }

  async function handleDelete(id) {
    if (!window.confirm('Supprimer ce plat du menu ?')) return;
    await menuAPI.delete(id);
    setItems((prev) => prev.filter((i) => i._id !== id));
  }

  async function handleToggleAvailable(id, available) {
    const res = await menuAPI.update(id, { available });
    setItems((prev) => prev.map((i) => (i._id === id ? res.data : i)));
  }

  if (loading) return <div className="loading">Chargement...</div>;
  if (!user) {
    return showRegister
      ? <RegisterPage onSwitchToLogin={() => setShowRegister(false)} />
      : <LoginPage onSwitchToRegister={() => setShowRegister(true)} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <h1>🍽️ App Menus</h1>
          <p>Gestion de carte de restaurant</p>
        </div>
        <div className="header-right">
          <span className="user-badge">
            {isAdmin ? '👑' : '👤'} {user.username}
            <span className="role-tag">{isAdmin ? 'Admin' : 'Utilisateur'}</span>
          </span>
          <button className="btn-password" onClick={() => setShowChangePassword(true)}>🔑 Mot de passe</button>
          <button className="btn-logout" onClick={logout}>Déconnexion</button>
        </div>
      </header>

      {isAdmin && (
        <nav className="app-nav">
          <button className={`nav-tab ${activeTab === 'menu' ? 'active' : ''}`} onClick={() => setActiveTab('menu')}>
            🍽️ Menu
          </button>
          <button className={`nav-tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
            👥 Utilisateurs
          </button>
        </nav>
      )}

      <main className="app-main">
        {activeTab === 'users' && isAdmin ? (
          <UserManagement />
        ) : (
          <>
            {isAdmin && <AddMenuItemForm onAdd={handleAdd} />}
            {!isAdmin && (
              <div className="info-banner">
                👀 Mode lecture — Connectez-vous en tant qu'admin pour modifier le menu.
              </div>
            )}
            {fetchLoading ? (
              <div className="loading">Chargement du menu...</div>
            ) : error ? (
              <div className="error-banner">
                {error}
                <button onClick={fetchItems} className="btn-retry">Réessayer</button>
              </div>
            ) : (
              <MenuList
                items={items}
                onDelete={isAdmin ? handleDelete : null}
                onToggleAvailable={isAdmin ? handleToggleAvailable : null}
                onEdit={isAdmin ? handleEdit : null}
                filter={filter}
                onFilterChange={setFilter}
                isAdmin={isAdmin}
              />
            )}
          </>
        )}
      </main>

      {showChangePassword && <ChangePasswordModal onClose={() => setShowChangePassword(false)} />}

      <footer className="app-footer">
        <p>App Menus — Déployé sur Microsoft Azure</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
