import MenuCard from '../components/MenuCard';
import { getMenuItems, categories } from '../data/menuData';

function Menu() {
  const items = getMenuItems();

  return (
    <div>
      <h2 className="page-title">Our Menu</h2>

      {categories.map((category) => {
        // get only the items in this category
        const categoryItems = items.filter((item) => item.category === category);

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