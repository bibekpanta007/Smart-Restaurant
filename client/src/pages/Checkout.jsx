import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';

const DELIVERY_FEE = 4.99;

function Checkout() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const { user } = useAuth();
  const navigate = useNavigate();

  // all form fields in one state object (name is filled in if logged in)
  const [form, setForm] = useState({
    name: user ? user.name : '',
    phone: '',
    orderType: 'pickup',
    address: '',
    payment: 'card',
    notes: '',
  });
  const [errors, setErrors] = useState({});

  const deliveryFee = form.orderType === 'delivery' ? DELIVERY_FEE : 0;
  const total = totalPrice + deliveryFee;

  // one handler for every input, using the input's name
  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function validate() {
    const newErrors = {};
    if (form.name.trim() === '') {
      newErrors.name = 'Please enter your name.';
    }
    // keep only the digits and check there are 10
    if (form.phone.replace(/\D/g, '').length !== 10) {
      newErrors.phone = 'Please enter a valid 10-digit phone number.';
    }
    if (form.orderType === 'delivery' && form.address.trim() === '') {
      newErrors.address = 'Please enter a delivery address.';
    }
    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault(); // stop the page from reloading

    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const order = placeOrder({
      userId: user ? user.id : null, // link the order to the logged-in user
      customer: {
        name: form.name,
        phone: form.phone,
        address: form.orderType === 'delivery' ? form.address : '',
      },
      orderType: form.orderType,
      payment: form.payment,
      notes: form.notes,
      items: cartItems,
      subtotal: totalPrice,
      deliveryFee,
      total,
    });

    clearCart();
    navigate(`/order/${order.id}`);
  }

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <h2 className="page-title">Checkout</h2>
        <p>Your cart is empty.</p>
        <Link to="/menu" className="btn">Browse the Menu</Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="page-title">Checkout</h2>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit} noValidate>
          <label>
            Full name
            <input name="name" value={form.name} onChange={handleChange} />
          </label>
          {errors.name && <p className="error">{errors.name}</p>}

          <label>
            Phone number
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="403-555-1234" />
          </label>
          {errors.phone && <p className="error">{errors.phone}</p>}

          <fieldset className="order-type">
            <legend>Order type</legend>
            <label className="radio">
              <input
                type="radio"
                name="orderType"
                value="pickup"
                checked={form.orderType === 'pickup'}
                onChange={handleChange}
              />
              Pickup
            </label>
            <label className="radio">
              <input
                type="radio"
                name="orderType"
                value="delivery"
                checked={form.orderType === 'delivery'}
                onChange={handleChange}
              />
              Delivery (+${DELIVERY_FEE})
            </label>
          </fieldset>

          {/* address only shows for delivery */}
          {form.orderType === 'delivery' && (
            <>
              <label>
                Delivery address
                <input name="address" value={form.address} onChange={handleChange} />
              </label>
              {errors.address && <p className="error">{errors.address}</p>}
            </>
          )}

          <label>
            Payment method
            <select name="payment" value={form.payment} onChange={handleChange}>
              <option value="card">Credit / Debit card</option>
              <option value="cash">Pay on pickup / delivery</option>
            </select>
          </label>
          <p className="hint">Payment is simulated for this project.</p>

          <label>
            Special instructions (optional)
            <textarea name="notes" rows="3" value={form.notes} onChange={handleChange} />
          </label>

          <button type="submit" className="btn">Place Order</button>
        </form>

        <div className="order-summary">
          <h3>Order Summary</h3>
          {cartItems.map((item) => (
            <div key={item.id} className="summary-row">
              <span>{item.quantity} × {item.name}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <hr />
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          {deliveryFee > 0 && (
            <div className="summary-row">
              <span>Delivery fee</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
          )}
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;