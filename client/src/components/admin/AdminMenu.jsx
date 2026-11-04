import { useState } from 'react';
import { LuStar } from 'react-icons/lu';
import { useMenu } from '../../context/MenuContext';
import MenuItemForm from './MenuItemForm';

function AdminMenu() {
  const {
    menuItems,
    specialId,
    setSpecial,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleAvailability,
    resetMenu,
  } = useMenu();

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // null = adding a new item

  function handleAdd() {
    setEditingItem(null);
    setShowForm(true);
  }

  function handleEdit(item) {
    setEditingItem(item);
    setShowForm(true);
  }

  function handleSave(itemData) {
    if (editingItem) {
      updateMenuItem(editingItem.id, itemData);
    } else {
      addMenuItem(itemData);
    }
    setShowForm(false);
    setEditingItem(null);
  }

  function handleCancel() {
    setShowForm(false);
    setEditingItem(null);
  }

  function handleDelete(item) {
    if (window.confirm(`Delete "${item.name}" from the menu?`)) {
      deleteMenuItem(item.id);
    }
  }

  function handleReset() {
    if (window.confirm('Reset the menu to the default items?')) {
      resetMenu();
    }
  }

  return (
    <div>
      <div className="admin-toolbar">
        <h3>Menu Items ({menuItems.length})</h3>
        <div className="cart-actions">
          <button className="btn btn-outline" onClick={handleReset}>Reset Menu</button>
          <button className="btn" onClick={handleAdd}>+ Add Item</button>
        </div>
      </div>

      <p className="hint admin-hint">Click the star to choose today's special.</p>

      {/* key makes the form reset when we switch to a different item */}
      {showForm && (
        <MenuItemForm
          key={editingItem ? editingItem.id : 'new'}
          initialItem={editingItem}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Special</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Dietary</th>
              <th>Available</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map((item) => {
              const isSpecial = item.id === specialId;

              return (
                <tr key={item.id} className={isSpecial ? 'special-row' : ''}>
                  <td>
                    {/* unavailable items can't be the special */}
                    <button
                      className={isSpecial ? 'star-btn active' : 'star-btn'}
                      onClick={() => setSpecial(item.id)}
                      disabled={!item.available}
                      title={isSpecial ? "Today's special" : 'Make this the special'}
                    >
                      <LuStar />
                    </button>
                  </td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>{item.dietary.length > 0 ? item.dietary.join(', ') : '—'}</td>
                  <td>
                    <button
                      className={item.available ? 'toggle on' : 'toggle'}
                      onClick={() => toggleAvailability(item.id)}
                    >
                      {item.available ? 'Yes' : 'No'}
                    </button>
                  </td>
                  <td className="actions">
                    <button className="link-btn" onClick={() => handleEdit(item)}>Edit</button>
                    <button className="remove-btn" onClick={() => handleDelete(item)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminMenu;