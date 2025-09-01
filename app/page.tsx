'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import ListingsGrid from '@/components/ListingsGrid';
import { supabase } from '@/lib/supabaseClient';
import AuthButton from '@/components/AuthButton';

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

  // Fetch Listings
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
      <header className="w-full bg-orange text-light shadow-md px-4 md:px-8 py-4 fixed top-0 left-0 z-50">
  <div className="max-w-screen-2xl mx-auto flex justify-between items-center">
    <a href="/" className="text-xl md:text-2xl font-bold text-light">Chairro</a>
    <nav className="hidden md:flex space-x-6 items-center">
  <a href="/about" className="hover:text-blue">About</a>
  <a href="/stylists" className="hover:text-blue">Stylists</a>
  <a href="/new" className="hover:text-blue">Post Chair</a>
  <AuthButton />
</nav>
  </div>
</header>



      {/* Hero */}
      <section className="w-screen h-[90vh] md:h-screen relative pt-24 bg-dark">
  {heroImages.map((src, index) => (
    <img
      key={src}
      src={src}
      alt={`Hero ${index}`}
      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
        index === currentImageIndex ? 'opacity-100' : 'opacity-0'
      }`}
    />
  ))}
  <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center px-4">
  <Image
  src="/chairro-logo.png"
  alt="Chairro Logo"
  width={180}
  height={180}
  className="mb-6 invert brightness-0" 
/>

    <h1 className="text-light drop-shadow-lg text-3xl sm:text-4xl md:text-6xl font-bold max-w-3xl mb-4">
      Discover and Rent Barber & Salon Chairs in the DMV
    </h1>
    <p className="text-light drop-shadow text-base sm:text-lg md:text-xl max-w-xl mb-6">
      Get exposure, increase income, and manage bookings — all in one place.
    </p>
    <a
      href="/new"
      className="bg-pink text-light px-6 py-3 rounded-full font-semibold hover:bg-blue transition"
    >
      + Post Your Chair
    </a>
  </div>
</section>


      {/* Features */}
      <section className="max-w-screen-2xl mx-auto px-6 py-16 bg-light">
  <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-dark">Why Chairro?</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
    <div className="border border-green rounded-lg p-6 text-center bg-white shadow-sm">
      <div className="text-3xl mb-4">📶</div>
      <h3 className="font-semibold text-lg text-dark mb-2">Free Wi-Fi</h3>
      <p className="text-dark/70">Stay connected while you work.</p>
    </div>
    <div className="border border-blue rounded-lg p-6 text-center bg-white shadow-sm">
      <div className="text-3xl mb-4">🛡️</div>
      <h3 className="font-semibold text-lg text-dark mb-2">Secure Spaces</h3>
      <p className="text-dark/70">Peace of mind in every booking.</p>
    </div>
    <div className="border border-orange rounded-lg p-6 text-center bg-white shadow-sm">
      <div className="text-3xl mb-4">👥</div>
      <h3 className="font-semibold text-lg text-dark mb-2">High Foot Traffic</h3>
      <p className="text-dark/70">Maximize exposure to clients.</p>
    </div>
  </div>
</section>

      {/* Listings */}
      <section className="max-w-screen-2xl mx-auto px-6 py-16 bg-light">
  <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-dark">Live Listings</h2>
  <ListingsGrid listings={listings || []} />
</section>


      {/* Footer */}
      <footer className="w-full bg-dark text-light py-12 mt-12 px-6">
  <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
    <div>
      <h4 className="font-semibold text-lg mb-4 text-pink">Barbers & Stylists</h4>
      <ul className="space-y-2">
        <li><a href="/search" className="hover:text-orange">Find a Chair</a></li>
        <li><a href="/stylists" className="hover:text-orange">Find a Stylist</a></li>
        <li><a href="/login" className="hover:text-orange">Login</a></li>
        <li><a href="/signup" className="hover:text-orange">Sign Up</a></li>
        <li><a href="/pricing" className="hover:text-orange">Pricing</a></li>
      </ul>
    </div>
    <div>
      <h4 className="font-semibold text-lg mb-4 text-blue">Salon Owners</h4>
      <ul className="space-y-2">
        <li><a href="/new" className="hover:text-green">Post a Chair</a></li>
        <li><a href="/features" className="hover:text-green">Features</a></li>
        <li><a href="/faq" className="hover:text-green">FAQ</a></li>
        <li><a href="/support" className="hover:text-green">Support</a></li>
      </ul>
    </div>
    <div>
      <h4 className="font-semibold text-lg mb-4 text-orange">Contact Us</h4>
      <p className="mb-2">📞 (202) 555-0143</p>
      <p>🏢 1200 U Street NW, Washington DC 20009</p>
      <p className="text-light/70 text-xs md:text-sm mt-4">
        © {new Date().getFullYear()} Chairro Inc. All rights reserved.
      </p>
    </div>
  </div>
</footer>

    </div>
  );
}
