'use client';

'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import ListingsGrid from '@/components/ListingsGrid';
import { supabase } from '@/lib/supabaseClient';
import AuthButton from '@/components/AuthButton';
import { 
  DollarSign, 
  Calendar, 
  Star, 
  Wifi, 
  Shield, 
  Users, 
  PlusCircle, 
  Tag, 
  CalendarCheck 
} from "lucide-react"; // <- All imports at the top



const heroImages = [
  '/brown-vintage-leather-chairs-stylish-barber-shop.jpg',
  '/modern-beauty-salon-interior.jpg',
];

export default function HomePage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [listings, setListings] = useState<any[]>([]);
  const [userName, setUserName] = useState<string | null>(null);

  // Rotate hero images
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

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserName(user ? (user.user_metadata?.full_name || user.email) : null);
    };
    fetchUser();

    // Subscribe to auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      setUserName(user ? (user.user_metadata?.full_name || user.email) : null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
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

            {userName && (
              <span className="text-sm text-light/90">
                Welcome, {userName.split(' ')[0]}
              </span>
            )}

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
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-black/40 z-0"></div>
        <div className="absolute inset-0 z-10 flex justify-between items-center px-6 md:px-16">
          {/* Left: Tagline */}
          <div className="flex flex-col justify-center text-light max-w-xl">
            <Image
              src="/chairro-logo.png"
              alt="Chairro Logo"
              width={160}
              height={160}
              className="mb-6 invert brightness-0"
            />
            <h1 className="drop-shadow-lg text-3xl sm:text-4xl md:text-6xl font-bold mb-4">
              Discover and Rent Barber & Salon Chairs in the DMV
            </h1>
            <p className="drop-shadow text-base sm:text-lg md:text-xl mb-6">
              Get exposure, increase income, and manage bookings — all in one place.
            </p>
            <a
              href="/new"
              className="bg-pink text-light px-6 py-3 rounded-full font-semibold hover:bg-blue transition w-fit"
            >
              + Post Your Chair
            </a>
          </div>

         {/* Right: Featured Listing */}
{listings.length > 0 && (
  <div className="hidden md:block bg-white/90 rounded-2xl shadow-lg p-6 max-w-sm w-full">
    <Image
      src={listings[0].images?.[0] || "/placeholder-barbershop.png"}
      alt={listings[0].title || "Featured Listing"}
      width={400}
      height={200}
      className="w-full h-48 object-cover rounded-lg mb-4"
    />
    <h1 className="text-3xl font-bold text-dark mb-2">
      ✂️ {listings[0].title || "Available Chair"}
    </h1>
    <p className="text-dark/70 mb-4">
      {listings[0].shop || "Barbershop/Salon"} · {listings[0].location || "DMV Area"} · $
      {listings[0].price || "—"}
    </p>
    <a
      href={`/listing/${listings[0].id || "#"}`}
      className="block text-center bg-black text-white px-6 py-2 rounded-xl font-semibold hover:bg-gray-800 transition"
    >
      View Listing
    </a>
  </div>
)}

        </div>
      </section>



     {/* Promo Gradient Banner */}
<section className="relative">
  {/* Gradient bar */}
  <div
    className="absolute inset-x-0 top-0 h-24 md:h-32 bg-gradient-to-b from-[#A8D8FF] to-transparent z-0"
  ></div>

  {/* Text content */}
  <div className="relative z-10 text-center py-6 md:py-10 px-6">
    <p className="text-xl md:text-2xl font-bold max-w-4xl mx-auto text-dark">
      🎉 Hosts get <span className="text-pink">2 months free</span> when posting their first chair.{" "}
      After that, keep earning with <span className="text-pink">$39.99/mo or 12% per booking</span>.
    </p>
  </div>
</section>
{/* How It Works */}
<section className="max-w-screen-2xl mx-auto px-6 py-16 bg-light relative">
  <h2 className="text-2xl md:text-3xl font-semibold mb-16 text-dark text-center">
    How It Works for Hosts
  </h2>

  {/* Steps */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
    <div className="p-6 text-center bg-white rounded-lg shadow hover:shadow-lg transition">
      <PlusCircle className="w-10 h-10 mx-auto mb-4 text-black" />
      <h3 className="font-semibold text-lg text-dark mb-2">1. Create Your Chair Listing</h3>
      <p className="text-dark/70">Add your chair, photos, and details in just a few minutes.</p>
    </div>

    <div className="p-6 text-center bg-white rounded-lg shadow hover:shadow-lg transition">
      <Tag className="w-10 h-10 mx-auto mb-4 text-black" />
      <h3 className="font-semibold text-lg text-dark mb-2">2. Set Your Price</h3>
      <p className="text-dark/70">Choose daily, weekly, or monthly rates that work for you.</p>
    </div>

    <div className="p-6 text-center bg-white rounded-lg shadow hover:shadow-lg transition">
      <CalendarCheck className="w-10 h-10 mx-auto mb-4 text-black" />
      <h3 className="font-semibold text-lg text-dark mb-2">3. Manage Bookings</h3>
      <p className="text-dark/70">Approve, schedule, and track bookings easily.</p>
    </div>

    <div className="p-6 text-center bg-white rounded-lg shadow hover:shadow-lg transition">
      <Users className="w-10 h-10 mx-auto mb-4 text-black" />
      <h3 className="font-semibold text-lg text-dark mb-2">4. Earn & Grow</h3>
      <p className="text-dark/70">Increase exposure, earn extra income, and grow your business.</p>
    </div>
  </div>
</section>


      {/* Host Benefits */}
      <section className="max-w-screen-2xl mx-auto px-6 py-16 bg-light">
        <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-dark">Why Salon Owners Love Chairro</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="p-6 text-center bg-white rounded-lg shadow hover:shadow-lg transition">
            <DollarSign className="w-10 h-10 mx-auto mb-4 text-black" />
            <h3 className="font-semibold text-lg text-dark mb-2">Extra Income</h3>
            <p className="text-dark/70">Turn unused chairs into steady monthly revenue.</p>
          </div>
          <div className="p-6 text-center bg-white rounded-lg shadow hover:shadow-lg transition">
            <Calendar className="w-10 h-10 mx-auto mb-4 text-black" />
            <h3 className="font-semibold text-lg text-dark mb-2">Flexible Options</h3>
            <p className="text-dark/70">Set daily, weekly, or monthly rates that work for you.</p>
          </div>
          <div className="p-6 text-center bg-white rounded-lg shadow hover:shadow-lg transition">
            <Star className="w-10 h-10 mx-auto mb-4 text-black" />
            <h3 className="font-semibold text-lg text-dark mb-2">2-Month Free Trial</h3>
            <p className="text-dark/70">Start risk-free. No credit card required.</p>
          </div>
        </div>
        <div className="mt-10 flex justify-center">
          <a
            href="/new"
            className="bg-pink text-white px-8 py-3 rounded-full font-semibold hover:bg-blue transition"
          >
            + Post Your Chair (Free Trial)
          </a>
        </div>
      </section>

      {/* Stylist Benefits */}
      <section className="max-w-screen-2xl mx-auto px-6 py-16 bg-white">
        <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-dark">Why Stylists Choose Chairro</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="border border-gray-300 rounded-lg p-6 text-center bg-light shadow-sm hover:shadow-md transition">
            <Wifi className="w-10 h-10 mx-auto mb-4 text-black" />
            <h3 className="font-semibold text-lg text-dark mb-2">Free Wi-Fi</h3>
            <p className="text-dark/70">Stay connected while you work.</p>
          </div>
          <div className="border border-gray-300 rounded-lg p-6 text-center bg-light shadow-sm hover:shadow-md transition">
            <Shield className="w-10 h-10 mx-auto mb-4 text-black" />
            <h3 className="font-semibold text-lg text-dark mb-2">Secure Spaces</h3>
            <p className="text-dark/70">Peace of mind in every booking.</p>
          </div>
          <div className="border border-gray-300 rounded-lg p-6 text-center bg-light shadow-sm hover:shadow-md transition">
            <Users className="w-10 h-10 mx-auto mb-4 text-black" />
            <h3 className="font-semibold text-lg text-dark mb-2">High Foot Traffic</h3>
            <p className="text-dark/70">Maximize exposure to clients.</p>
          </div>
        </div>
      </section>

      {/* Listings */}
      <section className="max-w-screen-2xl mx-auto px-6 py-16 bg-light">
        <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-dark">Maryland Listings</h2>
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
