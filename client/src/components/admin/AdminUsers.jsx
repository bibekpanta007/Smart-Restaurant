import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';

function AdminUsers() {
  const { users } = useAuth();
  const { orders } = useOrders();

  return (
    <div>
      <div className="admin-toolbar">
        <h3>Users ({users.length})</h3>
      </div>

      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Orders</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td><span className="role-badge">{u.role}</span></td>
                <td>{orders.filter((o) => o.userId === u.id).length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* passwords are never shown */}
    </div>
  );
}

export default AdminUsers;