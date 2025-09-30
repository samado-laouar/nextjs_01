"use client";
import supabase from '@/lib/supabaseClient';
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ProductsSection from './components/ProductsSection';
import Footer from './components/Footer';

// Hero carousel data (static, as no schema provided)
const heroSlides = [
  {
    id: 1,
    title: "Summer Collection 2025",
    subtitle: "Discover the hottest trends",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop",
    cta: "Shop Now"
  },
  {
    id: 2,
    title: "Premium Quality Products",
    subtitle: "Crafted with excellence",
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&h=600&fit=crop",
    cta: "Explore"
  },
  {
    id: 3,
    title: "Limited Time Offers",
    subtitle: "Up to 50% off selected items",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop",
    cta: "Get Deals"
  }
];

interface Product {
  id: string;
  name: string;
  price: number;
  sold_price?: number | null;
  images?: { url: string }[] | null;
  category?: string | null;
  rating?: number; // Assuming rating might be derived or added later
}

interface Category {
  id: string;
  name: string;
}

const StoreLandingPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['all']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('id, name, price, sold_price, images, category')
          .order('created_at', { ascending: false });

        if (productsError) throw new Error(productsError.message);

        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('name')
          .order('name', { ascending: true });

        if (categoriesError) throw new Error(categoriesError.message);

        // Map products to include a mock rating (adjust as needed)
        const mappedProducts = productsData.map(product => ({
          ...product,
          rating: 4.5 + Math.random() * 0.4, // Mock rating; replace with actual data
          images: product.images || [{ url: 'https://via.placeholder.com/400' }], // Fallback image
          category: product.category || 'uncategorized'
        }));

        setProducts(mappedProducts);
        setCategories(['all', ...categoriesData.map(cat => cat.name)]);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <p className="text-red-500 text-xl">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <Navbar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      <HeroSection heroSlides={heroSlides} currentSlide={currentSlide} setCurrentSlide={setCurrentSlide} />
      <ProductsSection
        products={products}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        loading={loading}
      />
      <Footer />
    </div>
  );
};

export default StoreLandingPage;
