import { useState } from 'react';
import MenuCard from '../components/MenuCard';
import { getMenuItems, categories } from '../data/menuData';

function Menu() {
  const items = getMenuItems();

  // what the user types in the search box
  const [search, setSearch] = useState('');

  // keep only items whose name or description matches the search
  const filteredItems = items.filter((item) => {
    const text = search.toLowerCase();
    return (
      item.name.toLowerCase().includes(text) ||
      item.description.toLowerCase().includes(text)
    );
  });

  return (
    <div>
      <h2 className="page-title">Our Menu</h2>

      <input
        type="text"
        className="search-input"
        placeholder="Search the menu..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {categories.map((category) => {
        const categoryItems = filteredItems.filter(
          (item) => item.category === category
        );

        // skip categories with no matching items
        if (categoryItems.length === 0) return null;

        return (
          <section key={category} className="menu-section">
            <h3 className="category-title">{category}</h3>
            <div className="menu-grid">
              {categoryItems.map((item) => (
                <MenuCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default Menu;