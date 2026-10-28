import { NavLink } from 'react-router-dom';

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
  return (
    <nav className="navbar">
      <h1 className="logo">Smart Restaurant</h1>
      <ul>
        {links.map((link) => (
          <li key={link.path}>
            <NavLink to={link.path} end>
              {link.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;