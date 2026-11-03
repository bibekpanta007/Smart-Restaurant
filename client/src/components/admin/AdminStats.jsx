import { useOrders } from '../../context/OrderContext';
import { useReservations } from '../../context/ReservationContext';
import { useMenu } from '../../context/MenuContext';
import { useAuth } from '../../context/AuthContext';

function isSameDay(date1, date2) {
  return date1.toDateString() === date2.toDateString();
}

function AdminStats() {
  const { orders } = useOrders();
  const { reservations } = useReservations();
  const { menuItems } = useMenu();
  const { users } = useAuth();

  const today = new Date();

  // numbers for the stat cards
  const revenue = orders.reduce((sum, o) => sum + o.total, 0);
  const ordersToday = orders.filter((o) => isSameDay(new Date(o.createdAt), today)).length;
  const activeOrders = orders.filter((o) => o.status !== 'Delivered').length;
  const pendingReservations = reservations.filter((r) => r.status === 'Pending').length;
  const customers = users.filter((u) => u.role === 'customer').length;
  const unavailableItems = menuItems.filter((item) => !item.available).length;

  const stats = [
    { label: 'Total Orders', value: orders.length },
    { label: 'Revenue', value: `$${revenue.toFixed(2)}` },
    { label: 'Orders Today', value: ordersToday },
    { label: 'Active Orders', value: activeOrders },
    { label: 'Pending Reservations', value: pendingReservations },
    { label: 'Customers', value: customers },
  ];

  // orders per day for the last 7 days
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const day = new Date();
    day.setDate(day.getDate() - i);
    const count = orders.filter((o) => isSameDay(new Date(o.createdAt), day)).length;
    last7Days.push({ label: day.toLocaleDateString('en-US', { weekday: 'short' }), count });
  }
  const maxCount = Math.max(1, ...last7Days.map((d) => d.count));

  // top 5 most ordered items
  const counts = {};
  orders.forEach((order) => {
    order.items.forEach((item) => {
      counts[item.name] = (counts[item.name] || 0) + item.quantity;
    });
  });
  const popularItems = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div>
      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <p className="stat-label">{stat.label}</p>
            <p className="stat-value">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="admin-panels">
        <div className="admin-panel">
          <h3>Orders – Last 7 Days</h3>
          <div className="bar-chart">
            {last7Days.map((day) => (
              <div key={day.label} className="bar-column">
                <span className="bar-count">{day.count}</span>
                <div className="bar" style={{ height: `${(day.count / maxCount) * 120}px` }} />
                <span className="bar-label">{day.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-panel">
          <h3>Popular Items</h3>
          {popularItems.length === 0 ? (
            <p className="hint">No orders yet.</p>
          ) : (
            <ul className="popular-list">
              {popularItems.map(([name, count]) => (
                <li key={name}>
                  <span>{name}</span>
                  <strong>{count} sold</strong>
                </li>
              ))}
            </ul>
          )}
          {unavailableItems > 0 && (
            <p className="hint">{unavailableItems} menu item(s) currently unavailable.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminStats;