import React from 'react';

// ProductCard component updated with isInCartView prop
const ProductCard = ({ product, isInCartView, onAddToCart }) => {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>Price: ${product.price}</p>
      <p>Popular: {product.rating}</p>
      {!isInCartView && (
        <button onClick={() => onAddToCart(product)}>Add to Cart</button>
      )}
    </div>
  );
};



export default ProductCard;
