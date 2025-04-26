import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductContext';
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const { getProductById } = useProducts();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const product = getProductById(id);
    setProduct(product);
  }, [id, getProductById]);

  if (!product) return <div className="loading">Loading...</div>;

  return (
    <div className="product-details">
      <div className="product-images">
        <img 
          src={product.image} 
          alt={product.name} 
          className="product-image" 
          onError={(e) => e.target.src = ''}//image path
        />
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
            max={product.stock}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          />
        </div>

        <button 
          onClick={() => addToCart(product.id, quantity)}
          className="add-to-cart"
          disabled={product.stock <= 0}
        >
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>

        <div className="product-meta">
          <p><strong>Category:</strong> {product.category}</p>
          <p><strong>Availability:</strong> {product.stock > 0 ? 'In Stock' : 'Out of Stock'}</p>
          {product.stock > 0 && <p><strong>Only {product.stock} left!</strong></p>}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;