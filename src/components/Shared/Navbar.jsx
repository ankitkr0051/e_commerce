import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import "./Navbar.css"
import logo from '../../assets/logo.png'; 

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { cart } = useCart();

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left Corner - Brand Logo */}
        <div className="nav-brand">
          <Link to="/" className="brand-link">
            <div className="logo-circle">
              <img src={logo} alt="E-Cart logo" className="brand-logo" />
            </div>
            <span>E-Cart</span>
          </Link>
        </div>
        
        {/* Middle - Navigation Links */}
        <div className="nav-middle">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/cart" className="cart-link">
            Cart
            {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
          </Link>
          {currentUser && <Link to="/orders">My Orders</Link>}
        </div>
        
        {/* Right Corner - User Section */}
        <div className="nav-right">
          {currentUser ? (
            <>
              <div className="user-profile">
                <div className="profile-photo">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="welcome-msg">Hi, {currentUser.name.split(' ')[0]}</span>
              </div>
              <button onClick={logout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="login-btn">
              <div className="profile-photo">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F4EFEA" width="20px" height="20px">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;