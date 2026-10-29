import { useState } from 'react';
import MenuCard from '../components/MenuCard';
import FilterBar from '../components/FilterBar';
import { getMenuItems, categories } from '../data/menuData';

function Menu() {
  const items = getMenuItems();

  // filter values
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [dietary, setDietary] = useState('All');
  const [maxPrice, setMaxPrice] = useState(20);

  // an item is shown only if it passes every filter
  const filteredItems = items.filter((item) => {
    const text = search.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(text) ||
      item.description.toLowerCase().includes(text);
    const matchesCategory = category === 'All' || item.category === category;
    const matchesDietary = dietary === 'All' || item.dietary.includes(dietary);
    const matchesPrice = item.price <= maxPrice;

    return matchesSearch && matchesCategory && matchesDietary && matchesPrice;
  });

  function resetFilters() {
    setSearch('');
    setCategory('All');
    setDietary('All');
    setMaxPrice(20);
  }

  return (
    <div>
      <h2 className="page-title">Our Menu</h2>

      <FilterBar
        search={search} setSearch={setSearch}
        category={category} setCategory={setCategory}
        dietary={dietary} setDietary={setDietary}
        maxPrice={maxPrice} setMaxPrice={setMaxPrice}
        categories={categories}
      />

      {/* message when nothing matches */}
      {filteredItems.length === 0 && (
        <div className="no-results">
          <p>No dishes match your filters.</p>
          <button className="btn" onClick={resetFilters}>Reset filters</button>
        </div>
      )}

      {categories.map((cat) => {
        const categoryItems = filteredItems.filter((item) => item.category === cat);
        if (categoryItems.length === 0) return null;

        return (
          <section key={cat} className="menu-section">
            <h3 className="category-title">{cat}</h3>
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