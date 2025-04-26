import { Link } from 'react-router-dom';
import productsData from '../data/products.json';
import "./Home.css"

const Home = () => {
 

  return (
    <div className="home">
      <section className="hero">
        <h1>Welcome to E-Cart</h1>
        <p>Premium products at competitive prices</p>
        <Link to="/products" className="shop-now-btn">
          Shop Now
        </Link>
      </section>

      <section className="about-section">
        <h2>Why Choose Us?</h2>
        <div className="benefits">
          <div className="benefit">
            <h3>Fast Shipping</h3>
            <p>Get your products delivered quickly</p>
          </div>
          <div className="benefit">
            <h3>Quality Products</h3>
            <p>We source only the best items</p>
          </div>
          <div className="benefit">
            <h3>24/7 Support</h3>
            <p>Our team is always here to help</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;