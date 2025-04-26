import React, { useState, useEffect } from 'react';
import productsData from '../data/products.json';
import './Admin.css';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('add');
  const [products, setProducts] = useState([]);
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

  useEffect(() => {
    setProducts(productsData.products);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      const matchedProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5); // Max 5 suggestions
      setSuggestions(matchedProducts);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, products]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.stock) {
      alert('Please fill in all required fields');
      return;
    }

    const newProduct = {
      id: `product${Date.now()}`,
      name: formData.name,
      price: parseFloat(formData.price),
      description: formData.description,
      category: formData.category,
      image: formData.image || '/images/default-product.jpg',
      stock: parseInt(formData.stock)
    };

    setProducts(prev => [...prev, newProduct]);
    setFormData({
      name: '',
      price: '',
      description: '',
      category: 'Electronics',
      image: '',
      stock: ''
    });
    alert('Product added successfully!');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(product => product.id !== id));
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                  <option value="Electronics">Electronics</option>
                  <option value="Home">Home</option>
                  <option value="Clothing">Clothing</option>
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
                        <img src={product.image} alt={product.name} onError={(e) => (e.target.src = '/images/default-product.jpg')} />
                        <div>
                          <strong>{product.name}</strong>
                          <p>{product.description}</p>
                        </div>
                      </td>
                      <td>${product.price.toFixed(2)}</td>
                      <td className={product.stock < 10 ? 'low-stock' : ''}>{product.stock}</td>
                      <td>{product.category}</td>
                      <td>
                        <button className="delete-btn" onClick={() => handleDelete(product.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-products">{searchTerm ? `No products matching "${searchTerm}"` : 'No products available.'}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
