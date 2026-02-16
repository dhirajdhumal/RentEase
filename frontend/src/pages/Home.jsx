import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <h1>Rent Houses & Vehicles with Ease</h1>
          <p>Find the perfect rental for your needs. Browse thousands of verified listings across India.</p>
          <Link to="/listings" className="btn-large">
            Explore Listings
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
