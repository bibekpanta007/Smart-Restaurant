import { NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// list of links shown in the navbar
const links = [
  { path: '/', name: 'Home' },
  { path: '/menu', name: 'Menu' },
  { path: '/reservations', name: 'Reservations' },
  { path: '/cart', name: 'Cart' },
  { path: '/login', name: 'Login' },
  { path: '/admin', name: 'Admin' },
];

function Navbar() {
  const { totalItems } = useCart();

  return (
    <nav className="navbar">
      <h1 className="logo">Smart Restaurant</h1>
      <ul>
        {links.map((link) => (
          <li key={link.path}>
            <NavLink to={link.path} end>
              {link.name}
              {/* show the number of items next to Cart */}
              {link.path === '/cart' && totalItems > 0 && (
                <span className="cart-badge">{totalItems}</span>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;