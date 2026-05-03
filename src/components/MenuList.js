import React from 'react';
import MenuItemCard from './MenuItemCard';

const CATEGORIES = ['Tous', 'Entrée', 'Plat principal', 'Dessert', 'Boisson', 'Autre'];

function MenuList({ items, onDelete, onToggleAvailable, onEdit, filter, onFilterChange, isAdmin }) {
  const filtered = filter === 'Tous' ? items : items.filter((i) => i.category === filter);

  return (
    <section className="menu-list-section">
      <div className="menu-list-header">
        <h2>Menu ({filtered.length} plat{filtered.length !== 1 ? 's' : ''})</h2>
        <div className="filter-tabs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`filter-tab ${filter === cat ? 'active' : ''}`}
              onClick={() => onFilterChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      {filtered.length === 0 ? (
        <p className="empty-state">
          {items.length === 0
            ? 'Aucun plat dans le menu. Ajoutez-en un !'
            : 'Aucun plat dans cette catégorie.'}
        </p>
      ) : (
        <div className="menu-grid">
          {filtered.map((item) => (
            <MenuItemCard
              key={item._id}
              item={item}
              onDelete={onDelete}
              onToggleAvailable={onToggleAvailable}
              onEdit={onEdit}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default MenuList;
