'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import ListingsGrid from '@/components/ListingsGrid';
import { supabase } from '@/lib/supabaseClient';

const heroImages = [
  '/brown-vintage-leather-chairs-stylish-barber-shop.jpg',
  '/modern-beauty-salon-interior.jpg',
];

export default function HomePage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [listings, setListings] = useState<any[]>([]);

  // Rotate Hero Image
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Listings Client-side
  useEffect(() => {
    const fetchListings = async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error) setListings(data || []);
    };
    fetchListings();
  }, []);

  return (
    <div className="w-full overflow-x-hidden">
      {/* Header */}
      <header className="w-screen bg-white shadow-md px-8 py-4 fixed top-0 left-0 z-50">
        <div className="max-w-screen-2xl mx-auto flex justify-between items-center">
          <a href="/" className="text-2xl font-bold text-black">Chairro</a>
          <nav className="space-x-6 text-black">
            <a href="/about" className="hover:text-gray-700">About</a>
            <a href="/new" className="hover:text-gray-700">Post Chair</a>
            <a href="/login" className="hover:text-gray-700">Login</a>
          </nav>
        </div>
      </header>

      {/* Hero Section (Image Crossfade) */}
      <section className="w-screen h-screen relative pt-24">
        {heroImages.map((src, index) => (
          <img
            key={src}
            src={src}
            alt={`Hero ${index}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? 'opacity-100 z-0' : 'opacity-0 z-0'
            }`}
          />
        ))}
        <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center px-4">
          <Image
            src="/chairro-logo.png"
            alt="Chairro Logo"
            width={240}
            height={240}
            className="mb-6 filter invert"
          />
          <h1 className="text-white drop-shadow-lg text-6xl font-bold max-w-3xl mb-4">
            Discover and Rent Barber & Salon Chairs in the DMV
          </h1>
          <p className="text-white drop-shadow text-lg max-w-xl mb-6">
            Get exposure, increase income, and manage bookings — all in one place.
          </p>
          <a
            href="/new"
            className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
          >
            + Post Your Chair
          </a>
        </div>
      </section>

      {/* Feature Section */}
      <section className="max-w-screen-2xl mx-auto px-[150px] py-20 bg-white">
        <h2 className="text-3xl font-semibold mb-8">Why Chairro?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="border rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">📶</div>
            <h3 className="font-semibold text-xl mb-2">Free Wi-Fi</h3>
            <p className="text-gray-600">Stay connected while you work.</p>
          </div>
          <div className="border rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="font-semibold text-xl mb-2">Secure Spaces</h3>
            <p className="text-gray-600">Peace of mind in every booking.</p>
          </div>
          <div className="border rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="font-semibold text-xl mb-2">High Foot Traffic</h3>
            <p className="text-gray-600">Maximize exposure to clients.</p>
          </div>
        </div>
      </section>

      {/* Dynamic Listings Grid from Supabase */}
      <section className="max-w-screen-2xl mx-auto px-[150px] py-20 bg-white">
        <h2 className="text-3xl font-semibold mb-8">Live Listings</h2>
        <ListingsGrid listings={listings || []} />
      </section>

      {/* Static Listing Grid (can remove or convert to dynamic) */}
     
      {/* Footer */}
      <footer className="w-full bg-gray-100 py-12 mt-12 px-[150px]">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h4 className="font-semibold text-lg mb-4">Barbers & Stylists</h4>
            <ul className="space-y-2 text-gray-700">
              <li><a href="/search">Find a Chair</a></li>
              <li><a href="/login">Login</a></li>
              <li><a href="/signup">Sign Up</a></li>
              <li><a href="/pricing">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">Salon Owners</h4>
            <ul className="space-y-2 text-gray-700">
              <li><a href="/new">Post a Chair</a></li>
              <li><a href="/features">Features</a></li>
              <li><a href="/faq">FAQ</a></li>
              <li><a href="/support">Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            <p className="text-gray-700 mb-2">📞 (202) 555-0143</p>
            <p className="text-gray-700">🏢 1200 U Street NW, Washington DC 20009</p>
            <p className="text-gray-600 text-sm mt-4">© {new Date().getFullYear()} Chairro Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
