import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useReservations } from '../context/ReservationContext';

function Profile() {
  const { user, logout } = useAuth();
  const { orders } = useOrders();
  const { reservations } = useReservations();
  const navigate = useNavigate();

  // only this user's orders and reservations
  const myOrders = orders.filter((o) => o.userId === user.id);
  const myReservations = reservations.filter((r) => r.userId === user.id);

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div>
      <h2 className="page-title">My Profile</h2>

      <div className="profile-card">
        <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
        <div className="profile-info">
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <span className="role-badge">{user.role}</span>
        </div>
        <button className="btn btn-outline" onClick={handleLogout}>
          Log out
        </button>
      </div>

      <section className="profile-section">
        <h3 className="section-title">Order History</h3>
        {myOrders.length === 0 ? (
          <p className="hint">
            No orders yet. <Link to="/menu">Browse the menu</Link>
          </p>
        ) : (
          <div className="history-list">
            {myOrders.map((order) => (
              <div key={order.id} className="reservation-card">
                <div>
                  <h4>
                    Order #{String(order.id).slice(-6)} · ${order.total.toFixed(2)}
                  </h4>
                  <p>
                    {new Date(order.createdAt).toLocaleDateString()} ·{' '}
                    {order.items.map((item) => `${item.quantity} × ${item.name}`).join(', ')}
                  </p>
                </div>
                <div className="reservation-right">
                  <span className={`status-badge status-${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                  <Link to={`/order/${order.id}`} className="remove-btn">View</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="profile-section">
        <h3 className="section-title">My Reservations</h3>
        {myReservations.length === 0 ? (
          <p className="hint">
            No reservations yet. <Link to="/reservations">Book a table</Link>
          </p>
        ) : (
          <div className="history-list">
            {myReservations.map((r) => (
              <div key={r.id} className="reservation-card">
                <div>
                  <h4>{r.type === 'Regular' ? 'Table reservation' : `${r.type} event`}</h4>
                  <p>{r.date} at {r.time} · {r.guests} guests</p>
                </div>
                <span className={`status-badge status-${r.status.toLowerCase()}`}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Profile;