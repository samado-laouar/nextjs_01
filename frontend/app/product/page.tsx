"use client"
import React, { useState } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';

const ProductPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    wilaya: '',
    commune: '',
    delivery: ''
  });
  const [errors, setErrors] = useState({});

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Phone number validation
    if (name === 'phone') {
      const phoneRegex = /^(05|06|07)[0-9]{8}$/;
      if (!phoneRegex.test(value)) {
        setErrors({ ...errors, phone: 'Please enter a valid phone number starting with 05, 06, or 07 followed by 8 digits' });
      } else {
        setErrors({ ...errors, phone: '' });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.wilaya) newErrors.wilaya = 'Wilaya is required';
    if (!formData.commune) newErrors.commune = 'Commune is required';
    if (!formData.delivery) newErrors.delivery = 'Delivery option is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Handle form submission (e.g., send to backend)
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({ name: '', phone: '', wilaya: '', commune: '', delivery: '' });
    setErrors({});
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-white/90 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-2 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                StoreHub
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200">Home</a>
              <a href="#" className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200">Products</a>
              <a href="#" className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200">About</a>
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-purple-600 transition-colors"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-3">
                <a href="#" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">Home</a>
                <a href="#" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">Products</a>
                <a href="#" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">About</a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <img
              src="https://via.placeholder.com/400"
              alt="Product"
              className="w-full h-96 object-cover rounded-lg shadow-md"
            />
            <div className="flex space-x-4 mt-4">
              <img src="https://via.placeholder.com/100" alt="Thumbnail 1" className="w-24 h-24 object-cover rounded-md" />
              <img src="https://via.placeholder.com/100" alt="Thumbnail 2" className="w-24 h-24 object-cover rounded-md" />
              <img src="https://via.placeholder.com/100" alt="Thumbnail 3" className="w-24 h-24 object-cover rounded-md" />
            </div>
          </div>

          {/* Product Details and Form */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sample Product Name</h1>
            <p className="text-gray-600 mt-2">Category: Electronics</p>
            <p className="text-2xl font-semibold text-purple-600 mt-2">$99.99</p>
            <p className="text-gray-700 mt-4">
              This is a sample product description. It provides excellent features and quality for the price. Perfect for
              your everyday needs with a sleek design and reliable performance.
            </p>

            {/* Order Form */}
            <div className="mt-6 bg-gray-50 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Now</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-purple-600 focus:border-purple-600"
                  />
                  {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-purple-600 focus:border-purple-600"
                  />
                  {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label htmlFor="wilaya" className="block text-sm font-medium text-gray-700">Wilaya</label>
                  <select
                    id="wilaya"
                    name="wilaya"
                    value={formData.wilaya}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-purple-600 focus:border-purple-600"
                  >
                    <option value="">Select Wilaya</option>
                    {/* Replace with JSON data */}
                    <option value="wilaya1">Wilaya 1</option>
                    <option value="wilaya2">Wilaya 2</option>
                  </select>
                  {errors.wilaya && <p className="text-red-600 text-sm mt-1">{errors.wilaya}</p>}
                </div>
                <div>
                  <label htmlFor="commune" className="block text-sm font-medium text-gray-700">Commune</label>
                  <select
                    id="commune"
                    name="commune"
                    value={formData.commune}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-purple-600 focus:border-purple-600"
                  >
                    <option value="">Select Commune</option>
                    {/* Replace with JSON data */}
                    <option value="commune1">Commune 1</option>
                    <option value="commune2">Commune 2</option>
                  </select>
                  {errors.commune && <p className="text-red-600 text-sm mt-1">{errors.commune}</p>}
                </div>
                <div>
                  <label htmlFor="delivery" className="block text-sm font-medium text-gray-700">Delivery Option</label>
                  <select
                    id="delivery"
                    name="delivery"
                    value={formData.delivery}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-purple-600 focus:border-purple-600"
                  >
                    <option value="">Select Delivery Option</option>
                    <option value="home">Home Delivery</option>
                    <option value="desk">Desk Delivery</option>
                  </select>
                  {errors.delivery && <p className="text-red-600 text-sm mt-1">{errors.delivery}</p>}
                </div>
                <button
                  onClick={handleSubmit}
                  className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors"
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-6 w-6 text-purple-400" />
              <span className="text-lg font-bold">StoreHub</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Home</a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Products</a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">About</a>
            </div>
            <p className="text-gray-400 text-sm">&copy; 2025 StoreHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProductPage;