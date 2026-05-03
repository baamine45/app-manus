import React, { useState } from 'react';
import EditMenuItemModal from './EditMenuItemModal';

const CATEGORY_EMOJI = {
  'Entrée': '🥗',
  'Plat principal': '🍽️',
  'Dessert': '🍮',
  'Boisson': '🥤',
  'Autre': '🍴',
};

function MenuItemCard({ item, onDelete, onToggleAvailable, onEdit, isAdmin }) {
  const [showEdit, setShowEdit] = useState(false);

  return (
    <>
      <div className={`menu-card ${!item.available ? 'unavailable' : ''}`}>
        <div className="menu-card-header">
          <span className="menu-category-badge">
            {CATEGORY_EMOJI[item.category] || '🍴'} {item.category}
          </span>
          <span className={`availability-dot ${item.available ? 'available' : 'unavailable'}`} />
        </div>
        <h3 className="menu-card-title">{item.name}</h3>
        {item.description && <p className="menu-card-desc">{item.description}</p>}
        <div className="menu-card-footer">
          <span className="menu-card-price">{item.price.toFixed(2)} €</span>
          {isAdmin && (
            <div className="menu-card-actions">
              <button
                className="btn-toggle"
                onClick={() => onToggleAvailable(item._id, !item.available)}
                title={item.available ? 'Marquer indisponible' : 'Marquer disponible'}
              >
                {item.available ? '🔴 Indispo' : '🟢 Dispo'}
              </button>
              <button className="btn-edit" onClick={() => setShowEdit(true)}>
                ✏️ Éditer
              </button>
              <button className="btn-delete" onClick={() => onDelete(item._id)}>
                🗑️ Supprimer
              </button>
            </div>
          )}
        </div>
      </div>

      {showEdit && (
        <EditMenuItemModal
          item={item}
          onSave={onEdit}
          onClose={() => setShowEdit(false)}
        />
      )}
    </>
  );
}

export default MenuItemCard;
