import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductContext';
import './ProductList.css';

const ProductList = () => {
  const { products, categories, getProductsByCategory, searchProducts } = useProducts();
  const { addToCart } = useCart();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    let result = products;

    if (selectedCategory !== 'All') {
      result = getProductsByCategory(selectedCategory);
    }

    if (searchTerm) {
      result = searchProducts(searchTerm).filter(p =>
        selectedCategory === 'All' || p.category === selectedCategory
      );
    }

    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, products, getProductsByCategory, searchProducts]);

  // Generate suggestions when searchTerm changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      const matchedProducts = products
        .filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice(0, 5); // Max 5 suggestions

      setSuggestions(matchedProducts);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, products]);

  const handleSuggestionClick = (product) => {
    setSearchTerm(product.name);
    setShowSuggestions(false);
    setFilteredProducts([product]);
  };

  return (
    <div className="product-list">
      <div className="filters">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="search-input"
          />

          {showSuggestions && suggestions.length > 0 && (
            <div className="suggestions-dropdown">
              {suggestions.map(product => (
                <div
                  key={product.id}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(product)}
                >
                  {product.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-select"
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div className="products">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <img
              src={product.image}
              alt={product.name}
              onError={(e) => e.target.src = ''}
            />
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="price">${product.price.toFixed(2)}</p>
              <p className="category">{product.category}</p>
            </div>
            <div className="product-actions">
              <button
                onClick={() => addToCart(product.id, 1)}
                className="add-to-cart-btn"
                disabled={product.stock <= 0}
              >
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <Link
                to={`/products/${product.id}`}
                className="details-link"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="no-products">
          {searchTerm || selectedCategory !== 'All'
            ? 'No products match your criteria'
            : 'No products available'}
        </div>
      )}
    </div>
  );
};

export default ProductList;
