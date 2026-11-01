import { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();

// the steps an order goes through
export const orderStatuses = ['Received', 'Preparing', 'Ready', 'Delivered'];

export function OrderProvider({ children }) {
  // load saved orders so they survive a page refresh
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  function placeOrder(orderDetails) {
    const newOrder = {
      ...orderDetails,
      id: Date.now(), // simple unique id
      status: 'Received',
      createdAt: new Date().toISOString(),
    };
    // newest order first
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  }

  function updateOrderStatus(id, status) {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status } : order))
    );
  }

  return (
    <OrderContext.Provider value={{ orders, placeOrder, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  return useContext(OrderContext);
}