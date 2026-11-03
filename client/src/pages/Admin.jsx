import { useState } from 'react';
import AdminStats from '../components/admin/AdminStats';
import AdminMenu from '../components/admin/AdminMenu';
import AdminOrders from '../components/admin/AdminOrders';

const tabs = ['Overview', 'Menu', 'Orders', 'Reservations', 'Users'];

function Admin() {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div>
      <h2 className="page-title">Admin Dashboard</h2>

      <div className="admin-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? 'tab active' : 'tab'}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* show only the selected tab */}
      {activeTab === 'Overview' && <AdminStats />}
      {activeTab === 'Menu' && <AdminMenu />}
      {activeTab === 'Orders' && <AdminOrders />}
      {activeTab === 'Reservations' && <p className="hint">Coming next.</p>}
      {activeTab === 'Users' && <p className="hint">Coming next.</p>}
    </div>
  );
}

export default Admin;