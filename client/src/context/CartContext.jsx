import { createContext, useContext, useState, useEffect } from 'react';

// 1. create the context
const CartContext = createContext();

// 2. the provider holds the cart state and shares it with the whole app
export function CartProvider({ children }) {
  // load the saved cart from localStorage so it survives a page refresh
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  // save the cart every time it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  function addToCart(item) {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);

      // if it's already in the cart, just increase the quantity
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }

      // otherwise add it with quantity 1
      return [...prev, { ...item, quantity: 1 }];
    });
  }

  function removeFromCart(id) {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  }

  function updateQuantity(id, quantity) {
    // going below 1 removes the item
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  }

  function clearCart() {
    setCartItems([]);
  }

  // totals calculated from the cart
  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// 3. custom hook so components can write useCart() instead of useContext(CartContext)
export function useCart() {
  return useContext(CartContext);
}