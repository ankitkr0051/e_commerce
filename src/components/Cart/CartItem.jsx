import React from "react";
import  './CartItem.css';
const CartItem = ({ item, onRemove, onUpdateQuantity }) => {
    return (
      <div className="cart-item">
        <div className="item-image">
          <img src={item.image} alt={item.name} />
        </div>
        <div className="item-details">
          <h3>{item.name}</h3>
          <p className="price">${item.price.toFixed(2)}</p>
          <div className="quantity-control">
            <button 
              onClick={() => onUpdateQuantity(item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              -
            </button>
            <span>{item.quantity}</span>
            <button onClick={() => onUpdateQuantity(item.quantity + 1)}>
              +
            </button>
          </div>
          <p className="subtotal">Subtotal: ${item.subtotal.toFixed(2)}</p>
        </div>
        <button onClick={onRemove} className="remove-item">
          Remove
        </button>
      </div>
    );
  };
  
  export default CartItem;