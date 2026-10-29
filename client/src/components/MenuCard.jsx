import { useCart } from '../context/CartContext';

// Shows one menu item. The item is passed in as a prop.
function MenuCard({ item }) {
  const { addToCart } = useCart();

  return (
    <div className="menu-card">
      <div className="menu-card-header">
        <h3>{item.name}</h3>
        <span className="price">${item.price.toFixed(2)}</span>
      </div>

      <p className="description">{item.description}</p>

      <p className="ingredients">
        <strong>Ingredients:</strong> {item.ingredients.join(', ')}
      </p>

      {item.dietary.length > 0 && (
        <div className="tags">
          {item.dietary.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      )}

      {/* button is disabled if the item is not available */}
      <button
        className="btn add-btn"
        onClick={() => addToCart(item)}
        disabled={!item.available}
      >
        {item.available ? 'Add to Cart' : 'Currently unavailable'}
      </button>
    </div>
  );
}

export default MenuCard;