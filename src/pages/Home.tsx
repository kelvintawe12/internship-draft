import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { motion, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Mail, Truck, Users, Leaf } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { addToOrder } from '../store/orderSlice';
import { Product } from '../types/product';

interface NewsletterForm {
  email: string;
}

const HeroSection: React.FC = () => {
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <motion.section
      className="relative bg-indigo-600 text-white py-16 md:py-24 bg-cover bg-center"
      style={{ backgroundImage: 'url(/images/hero-bg.jpg)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="relative max-w-7xl mx-auto px-4 text-center">
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-6"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Premium Cooking Oils for Every Kitchen
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl mb-8 max-w-2xl mx-auto"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Discover Mount Meru SoyCo’s high-quality, sustainable oils crafted with care in Rwanda.
        </motion.p>
        <motion.div
          className="flex justify-center gap-4"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link
            to="/products"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg text-lg focus:ring-2 focus:ring-green-500"
            aria-label="Shop Now"
          >
            Shop Now
          </Link>
          <Link
            to={isAuthenticated ? '/about' : '/signup'}
            className="bg-transparent border-2 border-white hover:bg-white hover:text-indigo-600 text-white px-6 py-3 rounded-lg text-lg focus:ring-2 focus:ring-white"
            aria-label={isAuthenticated ? 'Learn More' : 'Sign Up'}
          >
            {isAuthenticated ? 'Learn More' : 'Sign Up'}
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
};

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const dispatch = useDispatch();
  const handleAddToOrder = () => {
    dispatch(addToOrder({ productId: product.id, quantity: 1 }));
    toast.success(`${product.name} added to order!`, { theme: 'light' });
  };

  return (
    <motion.div
      className="bg-white shadow-md rounded-lg p-6 text-center"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover mb-4 rounded"
      />
      <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
      <p className="text-gray-600 mt-2">RWF {product.price.toFixed(2)}</p>
      <p className="text-gray-500 text-sm mt-1">Size: {product.size}</p>
      <p className="text-sm mt-2">
        {product.inStock ? (
          <span className="text-green-500">In Stock</span>
        ) : (
          <span className="text-red-500">Out of Stock</span>
        )}
      </p>
      <button
        onClick={handleAddToOrder}
        disabled={!product.inStock}
        className={`mt-4 w-full bg-indigo-600 text-white px-4 py-2 rounded-lg ${
          product.inStock
            ? 'hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500'
            : 'opacity-50 cursor-not-allowed'
        }`}
        aria-label={`Add ${product.name} to Order`}
      >
        Add to Order
      </button>
    </motion.div>
  );
};

const FeaturedProducts: React.FC = () => {
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
      id: 'PREM-OIL-1L',
      name: '1L Premium Cooking Oil',
      price: 7500,
      size: '1 Liter',
      description: 'Refined premium oil for health-conscious cooking.',
      inStock: true,
      image: '/images/prem-oil-1l.jpg',
      category: 'premium-cooking-oil',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  const displayedProducts = products.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  );

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
          className="text-3xl font-bold mb-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Featured Products
        </motion.h2>
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
          {products.length > itemsPerPage && (
            <div className="flex justify-between mt-6">
              <button
                onClick={handlePrev}
                className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
                aria-label="Previous Products"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={handleNext}
                className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
                aria-label="Next Products"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          )}
        </div>
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link
            to="/products"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
            aria-label="View All Products"
          >
            View All Products
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

const CompanyHighlights: React.FC = () => {
  const highlights = [
    {
      icon: Leaf,
      title: 'Sustainable Sourcing',
      description: 'We partner with local farmers to source eco-friendly ingredients, reducing our carbon footprint.',
    },
    {
      icon: Users,
      title: 'Community Impact',
      description: 'Supporting over 1,000 Rwandan farmers with fair trade practices and training.',
    },
    {
      icon: Truck,
      title: 'Reliable Delivery',
      description: 'Fast and dependable shipping to households and businesses across Rwanda.',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
          className="text-3xl font-bold mb-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Why Choose Us
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {highlights.map((highlight, index) => (
            <motion.div
              key={index}
              className="bg-gray-50 shadow-md rounded-lg p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <highlight.icon className="mx-auto text-indigo-600 mb-4" size={40} />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{highlight.title}</h3>
              <p className="text-gray-600">{highlight.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: 'Aline Uwase',
      role: 'Home Cook, Kigali',
      quote: 'Mount Meru’s oils make every dish taste amazing. The quality is unmatched!',
      avatar: '/images/avatar-aline.jpg',
    },
    {
      name: 'Jean Bosco',
      role: 'Restaurant Owner, Gisenyi',
      quote: 'Reliable bulk supply and excellent customer service. Highly recommend!',
      avatar: '/images/avatar-jean.jpg',
    },
    {
      name: 'Marie Claire',
      role: 'Health Enthusiast, Musanze',
      quote: 'Their premium oils are perfect for my healthy cooking recipes.',
      avatar: '/images/avatar-marie.jpg',
    },
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const handlePrev = () => {
    setCurrentTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
          className="text-3xl font-bold mb-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          What Our Customers Say
        </motion.h2>
        <motion.div
          className="bg-white shadow-md rounded-lg p-8 text-center max-w-2xl mx-auto"
          key={currentTestimonial}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={testimonials[currentTestimonial].avatar}
            alt={testimonials[currentTestimonial].name}
            className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
          />
          <p className="text-gray-600 italic mb-4">"{testimonials[currentTestimonial].quote}"</p>
          <p className="text-gray-800 font-semibold">{testimonials[currentTestimonial].name}</p>
          <p className="text-gray-500 text-sm">{testimonials[currentTestimonial].role}</p>
          <div className="flex justify-center gap-1 mt-4">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Star key={i} className="text-yellow-400" size={16} fill="currentColor" />
              ))}
          </div>
        </motion.div>
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={handlePrev}
            className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
            aria-label="Previous Testimonial"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={handleNext}
            className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
            aria-label="Next Testimonial"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
};

const StatsSection: React.FC = () => {
  const stats = [
    { label: 'Farmers Supported', value: 1000 },
    { label: 'Liters Sold', value: 500000 },
    { label: 'Years in Business', value: 15 },
  ];

  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className="py-16 bg-indigo-600 text-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
          className="text-3xl font-bold mb-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.5 }}
        >
          Our Impact
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <motion.p
                className="text-4xl font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: isInView ? 1 : 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                {isInView ? stat.value.toLocaleString() : '0'}+
              </motion.p>
              <p className="text-lg mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const NewsletterSection: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewsletterForm>({ defaultValues: { email: '' } });

  const onSubmit: SubmitHandler<NewsletterForm> = async (data) => {
    setIsLoading(true);
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      toast.success('Subscribed successfully! Check your email for updates.', {
        theme: 'light',
      });
      setIsSubmitted(true);
      reset();
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.', { theme: 'light' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
          className="text-3xl font-bold mb-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Stay Updated
        </motion.h2>
        <motion.p
          className="text-lg text-gray-600 text-center mb-8 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Join our newsletter for exclusive offers and updates on our products.
        </motion.p>
        <motion.div
          className="max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {isSubmitted ? (
            <div className="text-center space-y-4">
              <p className="text-gray-600">
                Thank you for subscribing! You’ll hear from us soon.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
                aria-label="Subscribe Again"
              >
                Subscribe Again
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="email" className="sr-only">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-600" size={20} />
                  <input
                    id="email"
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Invalid email address',
                      },
                    })}
                    className="w-full border border-gray-300 rounded-lg pl-10 p-3 focus:ring-2 focus:ring-indigo-500"
                    aria-invalid={errors.email ? 'true' : 'false'}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1" role="alert">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 flex items-center justify-center"
                aria-label="Subscribe to Newsletter"
              >
                {isLoading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

const Home: React.FC = () => {
  return (
    <>
      <HeroSection />
      <FeaturedProducts />
      <CompanyHighlights />
      <StatsSection />
      <Testimonials />
      <NewsletterSection />
    </>
  );
};

export default Home;