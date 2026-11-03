import { useState } from 'react';
import { useReservations } from '../../context/ReservationContext';

const statuses = ['Pending', 'Approved', 'Cancelled'];

function AdminReservations() {
  const { reservations, updateReservationStatus } = useReservations();
  const [filter, setFilter] = useState('All');

  const shown = filter === 'All' ? reservations : reservations.filter((r) => r.status === filter);

  return (
    <div>
      <div className="admin-toolbar">
        <h3>Reservations & Events ({shown.length})</h3>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All statuses</option>
          {statuses.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {shown.length === 0 ? (
        <p className="hint">No reservations to show.</p>
      ) : (
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Date & Time</th>
                <th>Guests</th>
                <th>Type</th>
                <th>Requirements</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => (
                <tr key={r.id}>
                  <td>
                    {r.name}
                    <br />
                    <span className="hint">{r.email}</span>
                  </td>
                  <td>{r.date} at {r.time}</td>
                  <td>{r.guests}</td>
                  <td>{r.type}</td>
                  <td>{r.requirements || '—'}</td>
                  <td>
                    <span className={`status-badge status-${r.status.toLowerCase()}`}>{r.status}</span>
                  </td>
                  <td className="actions">
                    {r.status === 'Pending' && (
                      <button className="link-btn" onClick={() => updateReservationStatus(r.id, 'Approved')}>
                        Approve
                      </button>
                    )}
                    {r.status !== 'Cancelled' && (
                      <button className="remove-btn" onClick={() => updateReservationStatus(r.id, 'Cancelled')}>
                        Cancel
                      </button>
                    )}
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

export default AdminReservations;