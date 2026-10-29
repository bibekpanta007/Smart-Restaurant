// Filter controls for the menu page.
// The values live in Menu.jsx and are passed in as props.
function FilterBar({
  search, setSearch,
  category, setCategory,
  dietary, setDietary,
  maxPrice, setMaxPrice,
  categories,
}) {
  return (
    <div className="filter-bar">
      <input
        type="text"
        className="search-input"
        placeholder="Search the menu..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="All">All categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <select value={dietary} onChange={(e) => setDietary(e.target.value)}>
        <option value="All">Any diet</option>
        <option value="Vegetarian">Vegetarian</option>
        <option value="Vegan">Vegan</option>
        <option value="Gluten-Free">Gluten-Free</option>
      </select>

      <label className="price-filter">
        Max price: ${maxPrice}
        <input
          type="range"
          min="5"
          max="20"
          step="1"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
        />
      </label>
    </div>
  );
}

export default FilterBar;