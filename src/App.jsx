import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import Navbar from './components/Shared/Navbar';
import Footer from './components/Shared/Footer';
import Home from './components/Home';
import Admin from './components/Admin';
import ProductList from './components/Products/ProductList';
import ProductDetails from './components/Products/ProductDetails';
import Cart from './components/Cart/Cart';
import OrderHistory from './components/Orders/OrderHistory';
import OrderPlacement from './components/Orders/OrderPlacement';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import './App.css';

function App() {
  return (
    <Router>
    <ProductProvider>
      <AuthProvider>
        <CartProvider>
          <div className="app">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/checkout" element={<OrderPlacement />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<Admin />} />

              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
      </ProductProvider>
    </Router>
  );
}

export default App;