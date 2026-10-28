import { Link } from 'react-router-dom';

function Home() {
  return (
    <section className="hero">
      <h2>Welcome to Smart Restaurant</h2>
      <p>Order your favourite food or book a table in a few clicks.</p>
      <div className="hero-buttons">
        <Link to="/menu" className="btn">View Menu</Link>
        <Link to="/reservations" className="btn btn-outline">Book a Table</Link>
      </div>
    </section>
  );
}

export default Home;