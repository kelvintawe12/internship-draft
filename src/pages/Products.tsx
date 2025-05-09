import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDownIcon } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { addToOrder } from '../store/orderSlice';
import Spinner from '../components/Spinner';
import { Product } from '../types/product';

// Product Card
const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useContext(AuthContext);

  const handleAddToOrder = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to place an order.', { theme: 'light' });
      return;
    }

    const order = {
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
      total: product.price,
      status: 'pending' as 'pending' | 'shipped' | 'delivered',
      items: [{ name: product.name, quantity: 1, price: product.price }],
    };

    try {
      // Mock API call to create order
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });

      // Mock API call to create notification
      const notification = {
        id: Date.now(),
        message: `Order #${order.id} for ${product.name} has been placed.`,
        date: new Date().toISOString(),
      };
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notification),
      });

      dispatch(addToOrder({ productId: product.id, quantity: 1 }));
      dispatch({ type: 'order/addOrder', payload: order });
      dispatch({ type: 'notification/addNotification', payload: notification });
      toast.success(`${product.name} added to order!`, { theme: 'light' });
    } catch (error) {
      toast.error('Failed to place order.', { theme: 'light' });
    }
  };

  return (
    <motion.div
      className="bg-white shadow-sm rounded-lg p-4 text-center border border-gray-100"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-32 object-cover mb-3 rounded"
      />
      <h3 className="text-sm font-semibold text-gray-800">{product.name}</h3>
      <p className="text-gray-600 text-xs mt-1">{product.price} RWF</p>
      <p className="text-gray-500 text-xs mt-1">Size: {product.size}</p>
      <p className="text-gray-500 text-xs mt-1 truncate">{product.description}</p>
      <p className="text-xs mt-2">
        {product.inStock ? (
          <span className="text-green-500">In Stock</span>
        ) : (
          <span className="text-red-500">Out of Stock</span>
        )}
      </p>
      <button
        onClick={handleAddToOrder}
        disabled={!product.inStock}
        className={`mt-3 w-full bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs ${
          product.inStock
            ? 'hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-500'
            : 'opacity-50 cursor-not-allowed'
        }`}
        aria-label={`Add ${product.name} to Order`}
      >
        Add to Order
      </button>
    </motion.div>
  );
};

// Hero Section
const HeroSection: React.FC = () => {
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <motion.section
      className="bg-indigo-500 text-white py-8"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-3">
          Discover Our Cooking Oil Range
        </h1>
        <p className="text-sm md:text-base mb-4">
          High-quality oils for every kitchen, from everyday cooking to bulk needs
        </p>
        <Link
          to={isAuthenticated ? '/dashboard' : '/order'}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
          aria-label={isAuthenticated ? 'Go to Dashboard' : 'Order Now'}
        >
          {isAuthenticated ? 'Go to Dashboard' : 'Order Now'}
        </Link>
      </div>
    </motion.section>
  );
};

// Filter and Sort Dropdowns
const FilterSortControls: React.FC<{
  category: string;
  setCategory: (value: string) => void;
  sort: string;
  setSort: (value: string) => void;
}> = ({ category, setCategory, sort, setSort }) => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'cooking-oil', label: 'Cooking Oil' },
    { value: 'premium-cooking-oil', label: 'Premium Cooking Oil' },
    { value: 'bulk', label: 'Bulk' },
  ];

  const sortOptions = [
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A-Z' },
    { value: 'name-desc', label: 'Name: Z-A' },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative">
        <button
          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 text-xs hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500"
          aria-expanded={isCategoryOpen}
          aria-label="Filter by category"
        >
          <span>
            {categories.find((c) => c.value === category)?.label || 'Select Category'}
          </span>
          <ChevronDownIcon className="ml-1 h-4 w-4" />
        </button>
        {isCategoryOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  setCategory(cat.value);
                  setIsCategoryOpen(false);
                }}
                className="block w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-indigo-50 focus:bg-indigo-100"
                aria-label={`Filter by ${cat.label}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="relative">
        <button
          onClick={() => setIsSortOpen(!isSortOpen)}
          className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 text-xs hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500"
          aria-expanded={isSortOpen}
          aria-label="Sort products"
        >
          <span>
            {sortOptions.find((s) => s.value === sort)?.label || 'Sort By'}
          </span>
          <ChevronDownIcon className="ml-1 h-4 w-4" />
        </button>
        {isSortOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setSort(option.value);
                  setIsSortOpen(false);
                }}
                className="block w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-indigo-50 focus:bg-indigo-100"
                aria-label={`Sort by ${option.label}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Footer
const Footer: React.FC = () => {
  return (
    <footer className="bg-indigo-500 text-white py-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-bold mb-3">Mount Meru SoyCo</h3>
            <p className="text-xs">Kigali, Rwanda</p>
            <p className="text-xs">+250 788 123 456</p>
            <p className="text-xs">info@mountmeru.rw</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-3">Quick Links</h3>
            <ul className="text-xs">
              <li><Link to="/" className="hover:underline">Home</Link></li>
              <li><Link to="/products" className="hover:underline">Products</Link></li>
              <li><Link to="/about" className="hover:underline">About</Link></li>
              <li><Link to="/contact" className="hover:underline">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-3">Follow Us</h3>
            <p className="text-xs">Stay updated on social media</p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-xs">© {new Date().getFullYear()} Mount Meru SoyCo Rwanda. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// Main Products Page
const Products: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('name-asc');

  // Mock product data
  const products: Product[] = [
    {
      id: 'OIL-1L',
      name: '1L Cooking Oil',
      price: 5000,
      size: '1 Liter',
      description: 'Perfect for small households, offering high-quality cooking oil.',
      inStock: true,
      image: '/images/oil-1l.jpg',
      category: 'cooking-oil',
    },
    {
      id: 'OIL-5L',
      name: '5L Cooking Oil',
      price: 22000,
      size: '5 Liters',
      description: 'Ideal for medium-sized families, ensuring long-lasting supply.',
      inStock: true,
      image: '/images/oil-5l.jpg',
      category: 'cooking-oil',
    },
    {
      id: 'OIL-20L',
      name: '20L Cooking Oil',
      price: 80000,
      size: '20 Liters',
      description: 'Bulk option for restaurants and large households.',
      inStock: false,
      image: '/images/oil-20l.jpg',
      category: 'bulk',
    },
    {
      id: 'PREM-OIL-1L',
      name: '1L Premium Cooking Oil',
      price: 7500,
      size: '1 Liter',
      description: 'Refined premium oil for health-conscious cooking.',
      inStock: true,
      image: '/images/prem-oil-1l.jpg',
      category: 'premium-cooking-oil',
    },
    {
      id: 'PREM-OIL-5L',
      name: '5L Premium Cooking Oil',
      price: 30000,
      size: '5 Liters',
      description: 'Premium oil for larger families, with enhanced purity.',
      inStock: true,
      image: '/images/prem-oil-5l.jpg',
      category: 'premium-cooking-oil',
    },
    {
      id: 'PREM-OIL-20L',
      name: '20L Premium Cooking Oil',
      price: 110000,
      size: '20 Liters',
      description: 'Premium bulk oil for commercial kitchens.',
      inStock: true,
      image: '/images/prem-oil-20l.jpg',
      category: 'bulk',
    },
  ];

  // Filter and sort products
  const filteredProducts = products
    .filter((product) =>
      category === 'all' ? true : product.category === category
    )
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'name-asc') return a.name.localeCompare(b.name);
      if (sort === 'name-desc') return b.name.localeCompare(a.name);
      return 0;
    });

  // Simulate initial page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      {isLoading && <Spinner loading={true} variant="fullscreen" />}
      <main className="flex-1 pt-12">
        <HeroSection />
        <section id="products" className="py-12">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-4 text-center">Our Products</h2>
            <FilterSortControls
              category={category}
              setCategory={setCategory}
              sort={sort}
              setSort={setSort}
            />
            {filteredProducts.length === 0 ? (
              <p className="text-center text-gray-600 text-xs">No products found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Products;