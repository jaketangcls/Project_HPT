import React, { useState, useEffect } from 'react';
import ProductCard from './components/ProductCard';
import mockData from './json.json'; // Adjust the path as necessary
import './App.css';

// Sample name templates by category
const nameTemplates = {
  "Jeans": ["Classic Blue Denim", "Slim Fit Jeans", "High Waist Jeans"],
  "Outerwear": ["Leather Jacket", "Windbreaker", "Winter Coat"],
  "Hoodies": ["Pullover Hoodie", "Zip-Up Hoodie", "Graphic Hoodie"],
  "Shirts": ["Crew Neck T-Shirt", "V-Neck Tee", "Button-Up Shirt"],
  "Polo Shirts": ["Classic Polo", "Striped Polo", "Sport Polo"],
  "Pants": ["Chinos", "Khakis", "Cargo Pants"],
  "Shorts": ["Denim Shorts", "Athletic Shorts", "Cargo Shorts"]
}; 


const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const preprocessedData = mockData.map((product, index) => {
      // Get a name template based on category
      const templates = nameTemplates[product.category];
      // Select a template randomly or use the first one if not available
      const template = templates ? templates[index % templates.length] : "Stylish Wear";
      // Generate a more descriptive name
      const newName = `${template} - ${product.category} #${index + 1}`;

      return {
        ...product,
        name: newName,
      };
    });

    setProducts(preprocessedData);
  }, []);

  return (
    <div className="product-list">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
