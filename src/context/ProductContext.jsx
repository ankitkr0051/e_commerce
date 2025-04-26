import { createContext, useContext, useState, useEffect } from 'react';
import productsData from '../data/products.json';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load products and categories on component mount
  useEffect(() => {
    try {
      // In a real app, this would be an API call
      setProducts(productsData.products);
      
      // Extract unique categories
      const uniqueCategories = ['All', ...new Set(
        productsData.products.map(product => product.category)
      )];
      setCategories(uniqueCategories);
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load products');
      setLoading(false);
    }
  }, []);

  // Get product by ID
  const getProductById = (id) => {
    return products.find(product => product.id === id);
  };

  // Filter products by category
  const getProductsByCategory = (category) => {
    if (category === 'All') return products;
    return products.filter(product => product.category === category);
  };

  // Search products
  const searchProducts = (query) => {
    return products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Add new product (admin only)
  const addProduct = (newProduct) => {
    const productWithId = {
      ...newProduct,
      id: `product${products.length + 1}`,
    };
    setProducts(prev => [...prev, productWithId]);
    // In a real app, update the backend here
  };

  // Update product (admin only)
  const updateProduct = (id, updatedProduct) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === id ? { ...product, ...updatedProduct } : product
      )
    );
    // In a real app, update the backend here
  };

  // Delete product (admin only)
  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(product => product.id !== id));
    // In a real app, update the backend here
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        loading,
        error,
        getProductById,
        getProductsByCategory,
        searchProducts,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);