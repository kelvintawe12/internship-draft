import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Spinner from './Spinner';

// Hero Section
const HeroSection: React.FC = () => {
  return (
    <section className="bg-indigo-600 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Premium Cooking Oil</h1>
        <p className="text-lg md:text-xl mb-6">Order high-quality cooking oil from Mount Meru SoyCo Rwanda</p>
        <Link
          to="/order"
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg text-lg"
          aria-label="Order Now"
        >
          Order Now
        </Link>
      </div>
    </section>
  );
};

// Product Card
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}
const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 text-center">
      <img src={product.image} alt={product.name} className="w-full h-40 object-cover mb-4 rounded" />
      <h3 className="text-xl font-semibold">{product.name}</h3>
      <p className="text-gray-700">{product.price} RWF</p>
      <Link
        to="/order"
        state={{ productId: product.id }}
        className="mt-4 inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
        aria-label="Add to Order"
      >
        Add to Order
      </Link>
    </div>
  );
};

// Order Form
interface OrderFormData {
  name: string;
  phone: string;
  address: string;
  product: string;
}
const OrderForm: React.FC = () => {
  const [formData, setFormData] = useState<OrderFormData>({
    name: '',
    phone: '',
    address: '',
    product: 'OIL-1L',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/orders', formData);
      toast.success('Order placed successfully!');
      setFormData({ name: '', phone: '', address: '', product: 'OIL-1L' });
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="order" className="py-16 bg-gray-100">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-center">Place Your Order</h2>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700">Full Name</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded"
              required
              aria-required="true"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-gray-700">Phone Number</label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-2 border rounded"
              required
              aria-required="true"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block text-gray-700">Delivery Address</label>
            <textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-2 border rounded"
              required
              aria-required="true"
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="product" className="block text-gray-700">Product</label>
            <select
              id="product"
              value={formData.product}
              onChange={(e) => setFormData({ ...formData, product: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="OIL-1L">1L Cooking Oil</option>
              <option value="OIL-5L">5L Cooking Oil</option>
              <option value="OIL-20L">20L Cooking Oil</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded flex items-center justify-center"
            disabled={loading}
            aria-label="Place Order"
          >
            {loading ? <Spinner /> : 'Place Order'}
          </button>
        </form>
      </div>
    </section>
  );
};

// About Section
const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-6 md:mb-0">
          <img
            src="/images/company.jpg"
            alt="About Mount Meru SoyCo"
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>
        <div className="md:w-1/2 md:pl-8">
          <h2 className="text-3xl font-bold mb-4">About Us</h2>
          <p className="text-gray-700">
            Mount Meru SoyCo Rwanda is dedicated to providing high-quality cooking oil to households and businesses across Rwanda. Our mission is to deliver healthy, affordable, and sustainable products.
          </p>
        </div>
      </div>
    </section>
  );
};

// Contact Form
interface ContactFormData {
  name: string;
  email: string;
  message: string;
}
const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/contact', formData);
      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-16 bg-gray-100">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-center">Contact Us</h2>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label htmlFor="contact-name" className="block text-gray-700">Name</label>
            <input
              type="text"
              id="contact-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded"
              required
              aria-required="true"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2 border rounded"
              required
              aria-required="true"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block text-gray-700">Message</label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full p-2 border rounded h-32"
              required
              aria-required="true"
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded flex items-center justify-center"
            disabled={loading}
            aria-label="Send Message"
          >
            {loading ? <Spinner /> : 'Send Message'}
          </button>
        </form>
      </div>
    </section>
  );
};

// FAQ Section
const FAQSection: React.FC = () => {
  const faqs = [
    {
      question: 'How long does delivery take?',
      answer: 'Delivery typically takes 2-5 business days, depending on your location.',
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept Mobile Money, Bank Transfer, and Cash on Delivery.',
    },
    {
      question: 'Can I order in bulk?',
      answer: 'Yes, please contact us for bulk order inquiries.',
    },
  ];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-16">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
        {faqs.map((faq, index) => (
          <div key={index} className="mb-4">
            <button
              className="w-full text-left bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              aria-expanded={openIndex === index}
              aria-controls={`faq-${index}`}
            >
              <span className="text-lg font-semibold">{faq.question}</span>
              <span>{openIndex === index ? '−' : '+'}</span>
            </button>
            {openIndex === index && (
              <div id={`faq-${index}`} className="p-4 bg-gray-50 rounded-lg mt-2">
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

// Footer
const Footer: React.FC = () => {
  return (
    <footer className="bg-indigo-600 text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Mount Meru SoyCo</h3>
            <p>Kigali, Rwanda</p>
            <p>+250 788 123 456</p>
            <p>info@mountmeru.rw</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul>
              <li><Link to="/" className="hover:underline">Home</Link></li>
              <li><Link to="/products" className="hover:underline">Products</Link></li>
              <li><Link to="/about" className="hover:underline">About</Link></li>
              <li><Link to="/contact" className="hover:underline">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Follow Us</h3>
            <p>Stay updated on social media</p>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p>© {new Date().getFullYear()} Mount Meru SoyCo Rwanda. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// Main Homepage Component
const HomePage: React.FC = () => {
  const products: Product[] = [
    { id: 'OIL-1L', name: '1L Cooking Oil', price: 5000, image: '/images/oil-1l.jpg' },
    { id: 'OIL-5L', name: '5L Cooking Oil', price: 22000, image: '/images/oil-5l.jpg' },
    { id: 'OIL-20L', name: '20L Cooking Oil', price: 80000, image: '/images/oil-20l.jpg' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection />
      <section id="products" className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
      <OrderForm />
      <AboutSection />
      <ContactForm />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default HomePage;