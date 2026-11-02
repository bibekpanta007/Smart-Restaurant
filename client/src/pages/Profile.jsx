import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
    </div>
  );
}

export default Profile;