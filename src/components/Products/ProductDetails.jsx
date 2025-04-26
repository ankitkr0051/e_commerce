import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import productsData from '../../data/products.json';
import "./ProductDetails.css"

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const foundProduct = productsData.products.find(p => p.id === id);
    setProduct(foundProduct);
  }, [id]);

  if (!product) return <div className="loading">Loading...</div>;

  return (
    <div className="product-details">
      <div className="product-images">
        <img src={product.image} alt={product.name} className="product-image" />
      </div>
      <div className="product-info">
        <h1>{product.name}</h1>
        <p className="price">${product.price.toFixed(2)}</p>
        <p className="description">{product.description}</p>
        <div className="quantity-selector">
          <label>Quantity:</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          />
        </div>
        <button 
          onClick={() => addToCart(product.id, quantity)}
          className="add-to-cart"
        >
          Add to Cart
        </button>
        <div className="product-meta">
          <p><strong>Category:</strong> {product.category}</p>
          <p><strong>Availability:</strong> {product.stock > 0 ? 'In Stock' : 'Out of Stock'}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;