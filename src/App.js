import React, { useEffect, useState } from 'react';
import './App.css';
import AddMenuItemForm from './components/AddMenuItemForm';
import MenuList from './components/MenuList';
import { menuAPI } from './services/api';

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('Tous');

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    setLoading(true);
    setError('');
    try {
      const res = await menuAPI.getAll();
      setItems(res.data);
    } catch (err) {
      setError('Impossible de charger le menu. Vérifiez la connexion au serveur.');
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(item) {
    const res = await menuAPI.create(item);
    setItems((prev) => [res.data, ...prev]);
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

  return (
    <div className="app">
      <header className="app-header">
        <h1>🍽️ App Menus</h1>
        <p>Gestion de carte de restaurant</p>
      </header>
      <main className="app-main">
        <AddMenuItemForm onAdd={handleAdd} />
        {loading ? (
          <div className="loading">Chargement du menu...</div>
        ) : error ? (
          <div className="error-banner">
            {error}
            <button onClick={fetchItems} className="btn-retry">
              Réessayer
            </button>
          </div>
        ) : (
          <MenuList
            items={items}
            onDelete={handleDelete}
            onToggleAvailable={handleToggleAvailable}
            filter={filter}
            onFilterChange={setFilter}
          />
        )}
      </main>
      <footer className="app-footer">
        <p>App Menus — Déployé sur Microsoft Azure</p>
      </footer>
    </div>
  );
}

export default App;
