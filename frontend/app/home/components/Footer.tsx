"use client";
import React from 'react';
import { ShoppingBag, Facebook, Instagram, MessageCircle } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-2 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                StoreHub
              </span>
            </div>
            <p className="text-gray-400 text-lg leading-relaxed max-w-md">
              Your premium destination for quality products. We curate the best items to enhance your lifestyle with style and functionality.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Products</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
            <div className="space-y-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-gray-400 hover:text-blue-400 transition-colors group"
              >
                <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-500 transition-colors">
                  <Facebook className="h-5 w-5" />
                </div>
                <span>Facebook</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-gray-400 hover:text-pink-400 transition-colors group"
              >
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg group-hover:from-purple-500 group-hover:to-pink-500 transition-all">
                  <Instagram className="h-5 w-5" />
                </div>
                <span>Instagram</span>
              </a>
              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-gray-400 hover:text-green-400 transition-colors group"
              >
                <div className="bg-green-600 p-2 rounded-lg group-hover:bg-green-500 transition-colors">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2025 StoreHub. All rights reserved. Made with ❤️ for amazing customers.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;