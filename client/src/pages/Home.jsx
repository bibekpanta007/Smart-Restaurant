import { Link } from 'react-router-dom';
import { useMenu } from '../context/MenuContext';
import { restaurant } from '../data/restaurantInfo';
import { LuShoppingBag, LuCalendarDays, LuSparkles } from 'react-icons/lu';

// small feature boxes under the special
const features = [
  { icon: <LuShoppingBag />, title: 'Order Online', text: 'Choose your favourite dishes for pickup or delivery.' },
  { icon: <LuCalendarDays />, title: 'Book a Table', text: 'Reserve a table or plan a birthday or corporate event.' },
  { icon: <LuSparkles />, title: 'AI Assistant', text: 'Ask about specials, dietary options or get recommendations.' },
];

function Home() {
  const { menuItems } = useMenu();

  // today's special (matches what the AI assistant says)
  const special = menuItems.find((item) => item.name === 'Chicken Alfredo');

  return (
    <>
      <section className="hero">
        <span className="hero-tag">Fresh • Local • Delicious</span>
        <h2>
          Great food,
          <br />
          made with love
        </h2>
        <p>
          Order your favourite dishes for pickup or delivery, or book a table
          for your next celebration.
        </p>
        <div className="hero-buttons">
          <Link to="/menu" className="btn">View Menu</Link>
          <Link to="/reservations" className="btn btn-outline">Book a Table</Link>
        </div>
      </section>

      {special && (
        <section className="special-banner">
          {special.image && (
            <img
              src={special.image}
              alt={special.name}
              onError={(e) => (e.target.style.display = 'none')} // hide if the photo is missing
            />
          )}
          <div className="special-text">
            <span className="hero-tag">Today's Special</span>
            <h3>{special.name}</h3>
            <p>{special.description}</p>
            <p className="special-price">${special.price.toFixed(2)}</p>
            <Link to="/menu" className="btn">Order Now</Link>
          </div>
        </section>
      )}

      <section className="features">
        {features.map((feature) => (
          <div key={feature.title} className="feature-card">
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.text}</p>
          </div>
        ))}
      </section>
    </>
  );
}

export default Home;