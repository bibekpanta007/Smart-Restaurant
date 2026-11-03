import { useState } from 'react';
import { categories } from '../../data/menuData';

const dietaryOptions = ['Vegetarian', 'Vegan', 'Gluten-Free'];

// Used for both adding a new item and editing an existing one
function MenuItemForm({ initialItem, onSave, onCancel }) {
  const [form, setForm] = useState(() =>
    initialItem
      ? {
          ...initialItem,
          ingredients: initialItem.ingredients.join(', '),
          price: String(initialItem.price),
        }
      : {
          name: '',
          category: categories[0],
          description: '',
          ingredients: '',
          price: '',
          dietary: [],
          available: true,
        }
  );
  const [error, setError] = useState('');

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  }

  // add or remove a dietary tag
  function toggleDietary(option) {
    const hasOption = form.dietary.includes(option);
    setForm({
      ...form,
      dietary: hasOption
        ? form.dietary.filter((d) => d !== option)
        : [...form.dietary, option],
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const price = Number(form.price);

    if (form.name.trim() === '') {
      setError('Name is required.');
      return;
    }
    if (form.description.trim() === '') {
      setError('Description is required.');
      return;
    }
    if (!form.price || isNaN(price) || price <= 0) {
      setError('Please enter a valid price greater than 0.');
      return;
    }

    onSave({
      name: form.name.trim(),
      category: form.category,
      description: form.description.trim(),
      // "Bread, Garlic" -> ['Bread', 'Garlic']
      ingredients: form.ingredients
        .split(',')
        .map((i) => i.trim())
        .filter((i) => i !== ''),
      price: Math.round(price * 100) / 100,
      dietary: form.dietary,
      available: form.available,
    });
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit} noValidate>
      <h3>{initialItem ? 'Edit Item' : 'Add New Item'}</h3>
      {error && <p className="form-error">{error}</p>}

      <div className="form-grid">
        <label className="form-field">
          Name
          <input name="name" value={form.name} onChange={handleChange} />
        </label>

        <label className="form-field">
          Category
          <select name="category" value={form.category} onChange={handleChange}>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>

        <label className="form-field">
          Price ($)
          <input type="number" step="0.01" min="0" name="price" value={form.price} onChange={handleChange} />
        </label>

        <label className="form-field">
          Ingredients (comma separated)
          <input name="ingredients" value={form.ingredients} onChange={handleChange} />
        </label>

        <label className="form-field full-width">
          Description
          <textarea name="description" rows="2" value={form.description} onChange={handleChange} />
        </label>
      </div>

      <div className="checkbox-group">
        {dietaryOptions.map((option) => (
          <label key={option}>
            <input
              type="checkbox"
              checked={form.dietary.includes(option)}
              onChange={() => toggleDietary(option)}
            />
            {option}
          </label>
        ))}
        <label>
          <input type="checkbox" name="available" checked={form.available} onChange={handleChange} />
          Available
        </label>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn">
          {initialItem ? 'Save Changes' : 'Add Item'}
        </button>
        <button type="button" className="btn btn-outline" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default MenuItemForm;