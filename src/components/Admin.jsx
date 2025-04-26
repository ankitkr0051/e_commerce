import React, { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import './Admin.css';

const Admin = () => {
  const { user } = useAuth();
  const { 
    products, 
    categories, 
    addProduct, 
    deleteProduct, 
    searchProducts 
  } = useProducts();
  
  const [activeTab, setActiveTab] = useState('add');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'Electronics',
    image: '',
    stock: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.stock) {
      alert('Please fill required fields');
      return;
    }
    addProduct(formData);
    setFormData({
      name: '',
      price: '',
      description: '',
      category: 'Electronics',
      image: '',
      stock: ''
    });
  };

  const filteredProducts = searchProducts(searchTerm);

  // Generate search suggestions
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      const matchedProducts = products
        .filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice(0, 5); // Show max 5 suggestions
      setSuggestions(matchedProducts);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, products]);

  const handleSuggestionClick = (product) => {
    setSearchTerm(product.name);
    setShowSuggestions(false);
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-tabs">
          <button 
            className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`}
            onClick={() => setActiveTab('add')}
          >
            Add Product
          </button>
          <button 
            className={`tab-btn ${activeTab === 'view' ? 'active' : ''}`}
            onClick={() => setActiveTab('view')}
          >
            View Products ({products.length})
          </button>
        </div>
      </div>

      <div className="admin-content">
        {activeTab === 'add' && (
          <form onSubmit={handleAddProduct} className="product-form">
            <h2>Add New Product</h2>
            <div className="form-group">
              <label>Product Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Price *</label>
                <input type="number" name="price" value={formData.price} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Stock *</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleInputChange}>
                  {categories.filter(c => c !== 'All').map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" />
            </div>
            <div className="form-group">
              <label>Image URL</label>
              <input type="text" name="image" value={formData.image} onChange={handleInputChange} />
            </div>
            <button type="submit" className="submit-btn">Add Product</button>
          </form>
        )}

        {activeTab === 'view' && (
          <div className="product-list">
            <div className="search-bar">
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

            {filteredProducts.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Category</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(product => (
                    <tr key={product.id}>
                      <td className="product-info">
                        <img src={product.image} alt={product.name} />
                        <div>
                          <strong>{product.name}</strong>
                          <p>{product.description}</p>
                        </div>
                      </td>
                      <td>${product.price.toFixed(2)}</td>
                      <td className={product.stock < 10 ? 'low-stock' : ''}>{product.stock}</td>
                      <td>{product.category}</td>
                      <td>
                        <button 
                          className="delete-btn" 
                          onClick={() => deleteProduct(product.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-products">
                {searchTerm ? `No products matching "${searchTerm}"` : 'No products available'}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
