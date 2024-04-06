import React, { useState, useEffect, useMemo } from 'react';
import ProductCard from './components/ProductCard';
import './App.css';
import logo from './images/logo.png'; 
import shopIcon from './images/shop.png';
import { fetchAllData } from './api/fetchData';

const nameTemplates = {
  "Jeans": ["Classic Blue Denim", "Slim Fit Jeans", "High Waist Jeans", "Ripped Skinny Jeans", "Classic Straight Leg Jeans"],
  "Outerwear": ["Leather Jacket", "Windbreaker", "Winter Coat" , "Softshell Windbreaker Jacket", "Thick Wool Peacoat","Ultra-Light Down Vest","Reflective Running Jacket"],
  "Hoodies": ["Oversized Graphic Hoodie", "Zip-Up Hoodie", "Graphic Hoodie"],
  "Shirts": ["Slim Fit Dress Shirt", "Casual Flannel Checked Shirt", "Short Sleeve Hawaiian Shirt", "Long Sleeve Henley Shirt","Chambray Button-Down Shirt", "Classic Oxford Shirt","Denim Work Shirt"], 
  "Polo Shirts": ["Pique Cotton Polo","Performance Golf Polo","Rugby Striped Polo","Textured Knit Polo","Merino Wool Polo","Long Sleeve Polo","Contrast Collar Polo","Tipped Sleeve Polo Shirt","Jersey Fabric Polo"],
  "Pants": ["Tapered Chinos", "Slim Fit Dress Pants", "Cargo Pants","Track Pants with Stripes","Wool Blend Trousers","Corduroy Pants","Linen Blend Summer Pants","High-Waisted Palazzo Pants", "Plaid Golf Pants","Joggers with Cuff Bottoms"],
  "Shorts": ["Denim Shorts", "Athletic Shorts", "Cargo Shorts","Athletic Mesh Shorts","Board Shorts for Surfing","Bermuda Dress Shorts","Fleece Lounge Shorts","Sweat Shorts","Cycling Shorts"]
};

const categories = ['All', 'Jeans', 'Outerwear', 'Hoodies', 'Shirts', 'Polo Shirts', 'Pants', 'Shorts'];

function App () {
  const [products, setProducts] = useState([]); // Store the initially processed products with unique names
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [displayedCategories, setDisplayedCategories] = useState(categories);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false); // New state to toggle cart view
  const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setShowCart(false);
    }, [activeCategory]);

  useEffect(() => {
    setIsLoading(true);
    fetchAllData().then(data => {
      const nameCounters = {};
      const initializedProducts = data.map(product => {
        const category = product.category;
        // Ensure we have a counter for each category
        if (!nameCounters[category]) {
          nameCounters[category] = 0;
        }
        const templates = nameTemplates[category] || ["Generic Product"];
        const nameTemplate = templates[nameCounters[category] % templates.length];
        // Increment the counter for the next item in the same category
        nameCounters[category]++;
        return { ...product, name: nameTemplate };
      });
      setIsLoading(false);
      setProducts(initializedProducts);
      setFilteredProducts(initializedProducts); // Show all products initially
    });
  }, [setProducts, setFilteredProducts, setIsLoading]);

  // Initialize unique product names and set initial state
  // useEffect(() => {
  //   const nameCounters = {};
  //   const initializedProducts = mockData.map(product => {
  //     const category = product.category;
  //     // Ensure we have a counter for each category
  //     if (!nameCounters[category]) {
  //       nameCounters[category] = 0;
  //     }
  //     const templates = nameTemplates[category] || ["Generic Product"];
  //     const nameTemplate = templates[nameCounters[category] % templates.length];
  //     // Increment the counter for the next item in the same category
  //     nameCounters[category]++;
  //     return { ...product, name: nameTemplate };
  //   });
  //   setProducts(initializedProducts);
  //   setFilteredProducts(initializedProducts); // Show all products initially
  // }, []);
  //
  useEffect(() => {
    // Filter categories based on search term
    const filteredCategories = searchTerm.length > 0 ? categories.filter(category =>
      category.toLowerCase().includes(searchTerm.toLowerCase())
    ) : categories;
    setDisplayedCategories(filteredCategories);
  }, [searchTerm]);

const addToCart = (product) => {
    setCart(currentCart => [...currentCart, product]);
  };

  const handleShoppingBagClick = () => {
      setShowCart(!showCart);
  };

  const calculateTotal = () => {
    return cart.reduce((acc, item) => acc + item.price, 0).toFixed(2);
  };
  // const changeCategory = (category) => {
  //   setActiveCategory(category);
  //   setShowCart(false); // Hide cart when changing category
  // };

  // const toggleCartView = () => {
  //   setShowCart(!showCart);
  // };


  const getFilteredProducts = () => {
    return products.filter(product => {
      return activeCategory === 'All' || product.category === activeCategory;
    }).filter(product => {
      return searchTerm === '' || product.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  };

  const renderView = () => {
    if (showCart) {
      return (
        <>
          <h2 className="cart-view-header">Cart Items</h2> {}
          <div className="products-grid">
            {cart.map((item, index) => (
              <ProductCard key={index} product={item} isInCartView={true}/>
            ))}
          </div>
        </>
      );
    } else {
      const filteredProducts = getFilteredProducts();
      return (
        <div className="products-grid">
        { isLoading && <div className="loading">Loading...</div> }
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={() => addToCart(product)} isInCartView={false}/>
          ))}
        </div>
      );
    }
  };

    const renderProductView = () => (
    <div className="products-grid">
      {filteredProducts.map(product => (
        <ProductCard key={product.id} product={product} onAddToCart={() => addToCart(product)} />
      ))}
    </div>
  );

  const renderCartView = () => (
    <div className="cart-view">
      <h2>Cart Items</h2>
      {cart.map((item, index) => (
        <div key={index}>a
          <h4>{item.name}</h4>
          {/* Render other item details as needed */}
        </div>
      ))}
    </div>
  );

  const resetToAllCategories = () => {
    setActiveCategory('All');
    setSearchTerm('');
    setShowCart(false);
    setCart([]); 
  };

    const onClearCart = () => {
        setCart([]);
        setActiveCategory('All');
        setShowCart(false);
    };

  return (
    <div className="App">
      <header className="app-header">
        <div className="top-header">
          <img src={logo} alt="Logo" className="logo" onClick={resetToAllCategories} />
          <div className="search-and-cart">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button onClick={handleShoppingBagClick} className="shopping-bag">
              <img src={shopIcon} alt="Shopping Bag" />
                <div className="shopping-bag-count">{cart.length}</div>
            </button>
          </div>
        </div>
        <div className="category-nav">
        {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`transparent-button ${activeCategory === category ? 'active' : ''}`}
            >
              {category}
            </button>
          ))}
        </div>
      </header>
      <main>
      {renderView()}
      </main>
      {showCart && (
      <div className="sticky-footer">
                    <div className="clear-cart">
                        <button className="clear-cart-but" onClick={onClearCart}>Clear Cart</button>
                    </div>
                    <div className="total-price">
                        TOTAL: <span className="total-amount">$ {calculateTotal()}</span>
                        <span className="tax-note">* BEFORE TAXES</span>
                    </div>
      </div>
      )}
    </div>
  );
};

export default App;

  // Filter products without regenerating names
  // const filterProducts = (category) => {
  //   setActiveCategory(category);
  //   if (category === 'All') {
  //     setFilteredProducts(products);
  //   } else {
  //     const categoryProducts = products.filter(product => product.category === category);
  //     setFilteredProducts(categoryProducts);
  //   }
  // };
