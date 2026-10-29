import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Cart() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, totalPrice } = useCart();

  // show a message when the cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <h2 className="page-title">Your Cart</h2>
        <p>Your cart is empty.</p>
        <Link to="/menu" className="btn">Browse the Menu</Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="page-title">Your Cart</h2>

      <div className="cart-list">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-info">
              <h3>{item.name}</h3>
              <p>${item.price.toFixed(2)} each</p>
            </div>

            <div className="quantity-controls">
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
            </div>

            <p className="cart-item-total">
              ${(item.price * item.quantity).toFixed(2)}
            </p>

            <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <p className="cart-total">
          Total: <strong>${totalPrice.toFixed(2)}</strong>
        </p>
        <button className="btn btn-outline" onClick={clearCart}>
          Clear Cart
        </button>
      </div>
    </div>
  );
}

export default Cart;