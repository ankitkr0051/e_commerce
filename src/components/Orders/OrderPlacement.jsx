import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import ordersData from '../../data/orders.json';
import productsData from '../../data/products.json';
import './OrderPlacement.css';

const OrderPlacement = () => {
  const { currentUser } = useAuth();
  const { cart, clearCart } = useCart();
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const totalAmount = cart.reduce((total, item) => {
        const product = productsData.products.find(p => p.id === item.productId);
        return total + (product?.price || 0) * item.quantity;
      }, 0);

      const newOrder = {
        id: `order${ordersData.orders.length + 1}`,
        userId: currentUser.id,
        orderDate: new Date().toISOString(),
        status: 'Processing',
        items: cart.map(item => {
          const product = productsData.products.find(p => p.id === item.productId);
          return {
            productId: item.productId,
            quantity: item.quantity,
            price: product?.price || 0
          };
        }),
        shippingInfo,
        paymentMethod,
        totalAmount
      };

      ordersData.orders.push(newOrder);
      clearCart();
      setOrderId(newOrder.id);
      setOrderSuccess(true);
    } catch (err) {
      setError('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="auth-prompt">
        <p>Please login to place an order.</p>
        <Link to="/login" className="auth-link">Login</Link>
      </div>
    );
  }

  if (cart.length === 0 && !orderSuccess) {
    return (
      <div className="empty-cart">
        <p>Your cart is empty.</p>
        <Link to="/products" className="continue-shopping">Continue Shopping</Link>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="order-success-container">
        <div className="order-success-message">
          <svg className="success-icon" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
          </svg>
          <h2>Order Placed Successfully!</h2>
          <p>Your order #{orderId} has been confirmed.</p>
          <p>You can track your order in My Orders Section.</p>
          <Link to="/orders" className="view-orders-button">View My Orders</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="checkout-container">
      <h1 className="checkout-title">Checkout</h1>
      
      <div className="checkout-content">
        <form onSubmit={handleSubmit} className="checkout-form">
          
          {/* Shipping Info */}
          <section className="form-section">
            <h2 className="section-title">Shipping Information</h2>
            <div className="form-grid">
              {['address', 'city', 'state', 'zipCode'].map(field => (
                <div className="form-group" key={field}>
                  <label className="form-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  <input
                    type="text"
                    name={field}
                    className="form-input"
                    value={shippingInfo[field]}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Payment Method */}
          <section className="form-section">
            <h2 className="section-title">Payment Method</h2>
            <div className="payment-options">
              {['credit', 'paypal'].map(method => (
                <label key={method} className="payment-option">
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                    className="payment-input"
                  />
                  <span className="payment-label">{method === 'credit' ? 'Credit Card' : 'PayPal'}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Error Message */}
          {error && <div className="error-message">{error}</div>}

          {/* Submit Button */}
          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? <span className="button-loading">Placing Order...</span> : 'Place Order'}
          </button>
        </form>

        {/* Order Summary */}
        <aside className="order-summary">
          <h2 className="summary-title">Order Summary</h2>
          <ul className="summary-items">
            {cart.map(item => {
              const product = productsData.products.find(p => p.id === item.productId);
              return (
                <li key={item.productId} className="summary-item">
                  <img src={product?.image} alt={product?.name} className="item-image" />
                  <div className="item-details">
                    <h3 className="item-name">{product?.name}</h3>
                    <p className="item-quantity">Qty: {item.quantity}</p>
                    <p className="item-price">${(product?.price * item.quantity).toFixed(2)}</p>
                  </div>
                </li>
              );
            })}
          </ul>
          
          <div className="order-total">
            <span>Total:</span>
            <span className="total-amount">
              ${cart.reduce((total, item) => {
                const product = productsData.products.find(p => p.id === item.productId);
                return total + (product?.price || 0) * item.quantity;
              }, 0).toFixed(2)}
            </span>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default OrderPlacement;
