import React, { useState } from 'react';
import Spinner from '../components/Spinner';

const productOptions = [
  {
    id: 'soybean-oil',
    name: 'Soybean Oil',
    description: 'High-quality soybean oil extracted from premium soybeans, perfect for cooking and frying.',
    imageUrl: 'https://via.placeholder.com/150?text=Soybean+Oil',
  },
  {
    id: 'soybean-meal',
    name: 'Soybean Meal',
    description: 'Nutritious soybean meal used primarily as animal feed, providing essential proteins and nutrients.',
    imageUrl: 'https://via.placeholder.com/150?text=Soybean+Meal',
  },
  {
    id: 'soy-flour',
    name: 'Soy Flour',
    description: 'Finely ground soy flour suitable for baking, cooking, and as a protein supplement.',
    imageUrl: 'https://via.placeholder.com/150?text=Soy+Flour',
  },
];

const Products: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    deliveryDate: '',
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateStep = () => {
    const newErrors: { [key: string]: string } = {};
    if (step === 1 && !formData.productId) {
      newErrors.productId = 'Please select a product.';
    }
    if (step === 2) {
      if (!formData.quantity || Number(formData.quantity) <= 0) {
        newErrors.quantity = 'Please enter a valid quantity.';
      }
      if (!formData.deliveryDate) {
        newErrors.deliveryDate = 'Please select a delivery date.';
      }
    }
    if (step === 3) {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required.';
      }
      if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Valid email is required.';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required.';
      }
    }
    if (step === 4 && !formData.address.trim()) {
      newErrors.address = 'Delivery address is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({
      ...errors,
      [e.target.name]: '',
    });
  };

  const nextStep = () => {
    if (validateStep()) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep(step + 1);
      }, 700);
    }
  };

  const prevStep = () => {
    setErrors({});
    setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep()) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        alert('Order submitted successfully!');
        setStep(1);
        setFormData({
          productId: '',
          quantity: '',
          deliveryDate: '',
          name: '',
          email: '',
          phone: '',
          address: '',
        });
        setErrors({});
      }, 1500);
    }
  };

  const selectedProduct = productOptions.find(p => p.id === formData.productId);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow-lg">
      <h1 className="text-4xl font-bold mb-6 text-indigo-700">Place Your Product Order</h1>
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                  step === num ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
              >
                {num}
              </div>
              {num < 4 && <div className="w-16 h-1 bg-gray-300"></div>}
            </div>
          ))}
        </div>
      </div>
      {loading && <Spinner loading={true} variant="fullscreen" />}
      {!loading && (
        <form onSubmit={handleSubmit} className="space-y-8">
          {step === 1 && (
            <div>
              <label className="block mb-4 font-semibold text-gray-700">Select Product</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {productOptions.map((product) => (
                  <div
                    key={product.id}
                    className={`border rounded p-4 cursor-pointer hover:shadow-lg transition ${
                      formData.productId === product.id ? 'border-indigo-600 shadow-lg' : 'border-gray-300'
                    }`}
                    onClick={() => setFormData({ ...formData, productId: product.id })}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setFormData({ ...formData, productId: product.id });
                      }
                    }}
                  >
                    <img src={product.imageUrl} alt={product.name} className="w-full h-32 object-cover rounded mb-3" />
                    <h3 className="text-xl font-semibold mb-1">{product.name}</h3>
                    <p className="text-gray-600">{product.description}</p>
                  </div>
                ))}
              </div>
              {errors.productId && <p className="text-red-600 mt-2">{errors.productId}</p>}
            </div>
          )}
          {step === 2 && (
            <div className="space-y-6">
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
                  className={`w-full border rounded px-3 py-2 ${
                    errors.quantity ? 'border-red-600' : 'border-gray-300'
                  }`}
                  placeholder="Enter quantity"
                />
                {errors.quantity && <p className="text-red-600 mt-1">{errors.quantity}</p>}
              </div>
              <div>
                <label htmlFor="deliveryDate" className="block mb-2 font-semibold text-gray-700">
                  Preferred Delivery Date
                </label>
                <input
                  type="date"
                  id="deliveryDate"
                  name="deliveryDate"
                  value={formData.deliveryDate}
                  onChange={handleChange}
                  required
                  className={`w-full border rounded px-3 py-2 ${
                    errors.deliveryDate ? 'border-red-600' : 'border-gray-300'
                  }`}
                />
                {errors.deliveryDate && <p className="text-red-600 mt-1">{errors.deliveryDate}</p>}
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-6">
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
                  className={`w-full border rounded px-3 py-2 ${errors.name ? 'border-red-600' : 'border-gray-300'}`}
                  placeholder="Your full name"
                />
                {errors.name && <p className="text-red-600 mt-1">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 font-semibold text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`w-full border rounded px-3 py-2 ${errors.email ? 'border-red-600' : 'border-gray-300'}`}
                  placeholder="you@example.com"
                />
                {errors.email && <p className="text-red-600 mt-1">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="phone" className="block mb-2 font-semibold text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className={`w-full border rounded px-3 py-2 ${errors.phone ? 'border-red-600' : 'border-gray-300'}`}
                  placeholder="+250 7XX XXX XXX"
                />
                {errors.phone && <p className="text-red-600 mt-1">{errors.phone}</p>}
              </div>
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
                className={`w-full border rounded px-3 py-2 ${errors.address ? 'border-red-600' : 'border-gray-300'}`}
                placeholder="Your delivery address"
              />
              {errors.address && <p className="text-red-600 mt-1">{errors.address}</p>}
              <div className="mt-6 bg-gray-50 p-4 rounded border border-gray-200">
                <h3 className="font-semibold mb-2">Review Your Order</h3>
                {selectedProduct && (
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={selectedProduct.imageUrl}
                      alt={selectedProduct.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div>
                      <p className="font-semibold">{selectedProduct.name}</p>
                      <p className="text-gray-600">{selectedProduct.description}</p>
                    </div>
                  </div>
                )}
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
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                disabled={Object.keys(errors).length > 0}
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
