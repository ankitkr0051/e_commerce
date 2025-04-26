import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ordersData from '../../data/orders.json';
import productsData from '../../data/products.json';
import "./OrderHistory.css";
import { Link } from 'react-router-dom';
const OrderHistory = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (currentUser) {
      const userOrders = ordersData.orders
        .filter(order => order.userId === currentUser.id)
        .map(order => {
          const itemsWithDetails = order.items.map(item => {
            const product = productsData.products.find(p => p.id === item.productId);
            return {
              ...item,
              name: product?.name || 'Unknown Product',
              image: product?.image || '',
              price: product?.price || 0
            };
          });
          return {
            ...order,
            items: itemsWithDetails
          };
        });
      setOrders(userOrders);
    }
  }, [currentUser]);

  if (!currentUser) {
    return <div className="nothing" >Please login to view your order history.  <Link to="/login">Login</Link> </div>;
  }

  return (
    <div className="order-history">
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <h3>Order #{order.id}</h3>
                  <p>Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                </div>
                <div className={`status ${order.status.toLowerCase()}`}>
                  {order.status}
                </div>
              </div>
              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <img src={item.image} alt={item.name} />
                    <div className="item-info">
                      <h4>{item.name}</h4>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: ${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="order-footer">
                <p>Total: ${order.totalAmount.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;