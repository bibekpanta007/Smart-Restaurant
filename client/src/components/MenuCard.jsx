// Shows one menu item. The item is passed in as a prop.
function MenuCard({ item }) {
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

      {/* only show tags if the item has dietary info */}
      {item.dietary.length > 0 && (
        <div className="tags">
          {item.dietary.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      )}

      {/* show a message if the item is not available */}
      {!item.available && <p className="unavailable">Currently unavailable</p>}
    </div>
  );
}

export default MenuCard;