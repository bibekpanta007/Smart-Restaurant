import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { totalItems } = useCart();
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  // open / closed state for the mobile menu
  const [menuOpen, setMenuOpen] = useState(false);

  // links everyone can see
  const links = [
    { path: '/', name: 'Home' },
    { path: '/menu', name: 'Menu' },
    { path: '/reservations', name: 'Reservations' },
    { path: '/cart', name: 'Cart' },
  ];

  // extra links depending on who is logged in
  if (isAdmin) {
    links.push({ path: '/admin', name: 'Admin' });
  }
  if (user) {
    links.push({ path: '/profile', name: 'Profile' });
  } else {
    links.push({ path: '/login', name: 'Login' });
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleLogout() {
    logout();
    closeMenu();
    navigate('/');
  }

  return (
    <nav className="navbar">
      <Link to="/" className="logo" onClick={closeMenu}>
        🍽️ Smart Restaurant
      </Link>

      {/* only visible on small screens */}
      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      <ul className={menuOpen ? 'open' : ''}>
        {links.map((link) => (
          <li key={link.path}>
            <NavLink to={link.path} end onClick={closeMenu}>
              {link.name}
              {link.path === '/cart' && totalItems > 0 && (
                <span className="cart-badge">{totalItems}</span>
              )}
            </NavLink>
          </li>
        ))}

        {user && (
          <li>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;