import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { LuUtensilsCrossed } from 'react-icons/lu';

// emoji used when an item has no photo
          <LuUtensilsCrossed />

// Shows one menu item. The item is passed in as a prop.
function MenuCard({ item }) {
  const { addToCart } = useCart();

  // becomes true if the photo fails to load
  const [imageError, setImageError] = useState(false);
  const showImage = item.image && !imageError;

  return (
    <div className="menu-card">
      {showImage ? (
        <img
          src={item.image}
          alt={item.name}
          className="card-image"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className={`card-banner banner-${item.category.toLowerCase()}`}>
          {categoryEmoji[item.category]}
        </div>
      )}

      <div className="card-body">
        <div className="card-content">
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
        </div>

        {/* button is disabled if the item is not available */}
        <button
          className="btn add-btn"
          onClick={() => addToCart(item)}
          disabled={!item.available}
        >
          {item.available ? 'Add to Cart' : 'Currently unavailable'}
        </button>
      </div>
    </div>
  );
}

export default MenuCard;