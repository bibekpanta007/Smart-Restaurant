import Logo from './Logo';
import { restaurant } from '../data/restaurantInfo';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-logo">
        <Logo size={44} />
        <strong>{restaurant.name}</strong>
      </div>
      <p>{restaurant.hours}</p>
      <p>© 2026 {restaurant.name} · All rights reserved .</p>
    </footer>
  );
}

export default Footer;