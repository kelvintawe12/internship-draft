import React, { useState } from 'react';
import Spinner from '../components/Spinner';

const productOptions = [
  'Soybean Oil',
  'Soybean Meal',
  'Soy Flour',
];

const Products: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    product: '',
    quantity: '',
    deliveryDate: '',
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const nextStep = () => {
    if (step < 4) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep(step + 1);
      }, 800);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      alert('Order submitted successfully!');
      setStep(1);
      setFormData({
        product: '',
        quantity: '',
        deliveryDate: '',
        name: '',
        email: '',
        phone: '',
        address: '',
      });
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-indigo-700">Place Your Product Order</h1>
      {loading && <Spinner loading={true} variant="fullscreen" />}
      {!loading && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <div>
              <label htmlFor="product" className="block mb-2 font-semibold text-gray-700">
                Select Product
              </label>
              <select
                id="product"
                name="product"
                value={formData.product}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="" disabled>
                  -- Choose a product --
                </option>
                {productOptions.map((prod) => (
                  <option key={prod} value={prod}>
                    {prod}
                  </option>
                ))}
              </select>
            </div>
          )}
          {step === 2 && (
            <div>
              <label htmlFor="quantity" className="block mb-2 font-semibold text-gray-700">
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
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Enter quantity"
              />
              <label htmlFor="deliveryDate" className="block mt-4 mb-2 font-semibold text-gray-700">
                Preferred Delivery Date
              </label>
              <input
                type="date"
                id="deliveryDate"
                name="deliveryDate"
                value={formData.deliveryDate}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          )}
          {step === 3 && (
            <div>
              <label htmlFor="name" className="block mb-2 font-semibold text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Your full name"
              />
              <label htmlFor="email" className="block mt-4 mb-2 font-semibold text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="you@example.com"
              />
              <label htmlFor="phone" className="block mt-4 mb-2 font-semibold text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="+250 7XX XXX XXX"
              />
            </div>
          )}
          {step === 4 && (
            <div>
              <label htmlFor="address" className="block mb-2 font-semibold text-gray-700">
                Delivery Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows={4}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Your delivery address"
              />
              <div className="mt-6 bg-gray-50 p-4 rounded border border-gray-200">
                <h3 className="font-semibold mb-2">Review Your Order</h3>
                <p><strong>Product:</strong> {formData.product}</p>
                <p><strong>Quantity:</strong> {formData.quantity}</p>
                <p><strong>Delivery Date:</strong> {formData.deliveryDate}</p>
                <p><strong>Name:</strong> {formData.name}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Phone:</strong> {formData.phone}</p>
                <p><strong>Address:</strong> {formData.address}</p>
              </div>
            </div>
          )}
          <div className="flex justify-between">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Back
              </button>
            )}
            {step < 4 && (
              <button
                type="button"
                onClick={nextStep}
                disabled={
                  (step === 1 && !formData.product) ||
                  (step === 2 && (!formData.quantity || !formData.deliveryDate)) ||
                  (step === 3 && (!formData.name || !formData.email || !formData.phone))
                }
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
              >
                Next
              </button>
            )}
            {step === 4 && (
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Submit Order
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default Products;
