import { useState } from 'react';
import { useOrders, orderStatuses } from '../../context/OrderContext';

function AdminOrders() {
  const { orders, updateOrderStatus } = useOrders();
  const [filter, setFilter] = useState('All');

  const shownOrders = filter === 'All' ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <div className="admin-toolbar">
        <h3>Orders ({shownOrders.length})</h3>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All statuses</option>
          {orderStatuses.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {shownOrders.length === 0 ? (
        <p className="hint">No orders to show.</p>
      ) : (
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Type</th>
                <th>Placed</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {shownOrders.map((order) => (
                <tr key={order.id}>
                  <td>#{String(order.id).slice(-6)}</td>
                  <td>
                    {order.customer.name}
                    <br />
                    <span className="hint">{order.customer.phone}</span>
                  </td>
                  <td>
                    {order.items.map((item) => `${item.quantity} × ${item.name}`).join(', ')}
                  </td>
                  <td>${order.total.toFixed(2)}</td>
                  <td>{order.orderType}</td>
                  <td>
                    {new Date(order.createdAt).toLocaleString([], {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </td>
                  <td>
                    {/* changing this updates the order everywhere (profile, confirmation page) */}
                    <select
                      className={`status-select status-${order.status.toLowerCase()}`}
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    >
                      {orderStatuses.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;