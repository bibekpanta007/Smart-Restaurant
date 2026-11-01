import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrders, orderStatuses } from '../context/OrderContext';

function OrderConfirmation() {
  const { id } = useParams(); // the id from the URL /order/:id
  const { orders, updateOrderStatus } = useOrders();
  const order = orders.find((o) => o.id === Number(id));

  // simulate the kitchen: move to the next status every 10 seconds
  useEffect(() => {
    if (!order || order.status === 'Delivered') return;

    const timer = setTimeout(() => {
      const nextStatus = orderStatuses[orderStatuses.indexOf(order.status) + 1];
      updateOrderStatus(order.id, nextStatus);
    }, 10000);

    // clean up the timer if the page changes
    return () => clearTimeout(timer);
  }, [order, updateOrderStatus]);

  if (!order) {
    return (
      <div className="empty-cart">
        <h2 className="page-title">Order not found</h2>
        <Link to="/menu" className="btn">Back to Menu</Link>
      </div>
    );
  }

  const currentStep = orderStatuses.indexOf(order.status);

  return (
    <div className="confirmation">
      <h2 className="page-title">Thank you, {order.customer.name}!</h2>
      <p className="confirmation-text">
        Your order <strong>#{String(order.id).slice(-6)}</strong> has been placed for{' '}
        <strong>{order.orderType}</strong>.
      </p>

      {/* status tracker */}
      <div className="status-tracker">
        {orderStatuses.map((status, index) => (
          <div
            key={status}
            className={index <= currentStep ? 'status-step done' : 'status-step'}
          >
            <div className="status-dot">{index + 1}</div>
            <span>{status}</span>
          </div>
        ))}
      </div>

      <div className="order-summary">
        <h3>Order Details</h3>
        {order.items.map((item) => (
          <div key={item.id} className="summary-row">
            <span>{item.quantity} × {item.name}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <hr />
        <div className="summary-row summary-total">
          <span>Total</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
      </div>

      <Link to="/menu" className="btn">Order More</Link>
    </div>
  );
}

export default OrderConfirmation;