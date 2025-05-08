import React, { useState } from 'react';

const Order: React.FC = () => {
  const [formData, setFormData] = useState({
    product: '',
    quantity: 1,
    name: '',
    email: '',
    address: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const products = [
    'Soybean Oil',
    'Soybean Meal',
    'Soy Flour',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle form submission, e.g., send data to an API
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-5xl font-extrabold mb-8 text-indigo-700">Place an Order</h1>
      <p className="mb-10 text-lg text-gray-700 leading-relaxed">
        Use the form below to place your order. We will get back to you with confirmation and delivery details.
      </p>
      {submitted ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Thank you!</strong>
          <span className="block sm:inline"> Your order has been received and is being processed.</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-lg">
          <div className="mb-6">
            <label htmlFor="product" className="block text-gray-700 font-bold mb-2">
              Product
            </label>
            <select
              id="product"
              name="product"
              value={formData.product}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="" disabled>Select a product</option>
              {products.map((prod) => (
                <option key={prod} value={prod}>{prod}</option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <label htmlFor="quantity" className="block text-gray-700 font-bold mb-2">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="1"
              value={formData.quantity}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Your full name"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="address" className="block text-gray-700 font-bold mb-2">
              Delivery Address
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Your delivery address"
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Submit Order
          </button>
        </form>
      )}
    </div>
  );
};

export default Order;
