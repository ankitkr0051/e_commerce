import { createContext, useContext, useState, useEffect } from 'react';
import productsData from '../data/products.json'; 

const ProductContext = createContext();

// Helper functions for localStorage
const getLocalStorageProducts = () => {
  try {
    const storedProducts = localStorage.getItem('products');
    return storedProducts ? JSON.parse(storedProducts) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

const setLocalStorageProducts = (products) => {
  try {
    localStorage.setItem('products', JSON.stringify(products));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState(['All']);

  // Load products from JSON file or localStorage
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 1. Try to load from localStorage first
      const storedProducts = getLocalStorageProducts();
      
      if (storedProducts && storedProducts.length > 0) {
        setProducts(storedProducts);
        updateCategories(storedProducts);
      } else {
        // 2. Fallback to JSON file data
        // Note: In a real app, this would be an API call
        const jsonProducts = productsData.products;
        setProducts(jsonProducts);
        setLocalStorageProducts(jsonProducts);
        updateCategories(jsonProducts);
      }
    } catch (err) {
      setError('Failed to load products');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update categories whenever products change
  const updateCategories = (productsList) => {
    const uniqueCategories = [...new Set(productsList.map(p => p.category))];
    setCategories(['All', ...uniqueCategories]);
  };

  // Initial load
  useEffect(() => {
    loadProducts();
  }, []);

  // Save to localStorage when products change
  useEffect(() => {
    if (products.length > 0) {
      setLocalStorageProducts(products);
      updateCategories(products);
    }
  }, [products]);

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: `product${Date.now()}`,
      price: parseFloat(product.price),
      stock: parseInt(product.stock)
    };
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    return newProduct;
  };

  const deleteProduct = (id) => {
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts);
  };

  const getProductById = (id) => {
    return products.find(product => product.id === id);
  };

  const searchProducts = (query) => {
    if (!query) return products;
    return products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
    );
  };

  const getProductsByCategory = (category) => {
    if (category === 'All') return products;
    return products.filter(product => product.category === category);
  };

  // Optional: Reset to original JSON data
  const resetProducts = () => {
    setProducts(productsData.products);
    setLocalStorageProducts(productsData.products);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        loading,
        error,
        addProduct,
        deleteProduct,
        getProductById,
        searchProducts,
        getProductsByCategory,
        resetProducts,
        reloadProducts: loadProducts // Add reload capability
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);