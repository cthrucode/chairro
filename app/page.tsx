// app/page.tsx
import { supabase } from '@/lib/supabaseClient'
import ListingsGrid from '@/components/ListingsGrid'
import { FaWifi, FaLock, FaShieldAlt, FaChartLine, FaTrafficLight, FaUsers, FaUser, FaChild } from 'react-icons/fa';

export default async function Page() {
  const { data, error } = await supabase.from('listings').select('*')

  if (error) {
    console.error(error)
    return <div className="p-4 text-red-600">Error loading listings</div>
  }

  const features = [
    { icon: <FaWifi size={48} />, title: 'Free WiFi', description: 'Stay connected at all times' },
    { icon: <FaLock size={48} />, title: 'Secure', description: 'Safe & private workspaces' },
    { icon: <FaShieldAlt size={48} />, title: 'Protected', description: 'Peace of mind for your tools' },
    { icon: <FaChartLine size={48} />, title: 'High Traffic', description: 'Attract more walk-ins' },
    { icon: <FaTrafficLight size={48} />, title: 'Easy Access', description: 'Prime, visible locations' },
    { icon: <FaUsers size={48} />, title: 'Team Friendly', description: 'Great for groups or teams' },
    { icon: <FaUser size={48} />, title: 'Solo Ready', description: 'Perfect for individual barbers' },
    { icon: <FaChild size={48} />, title: 'All Ages', description: 'Comfortable for everyone' },
  ];


  return (
    <main className="max-w-7xl mx-auto px-4">
      {/* Sticky top menu */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between py-4">
          {/* Logo on the left */}
          <div className="flex items-center">
            <img
              src="/chairro-logo.png" // replace with your actual logo path
              alt="Chairro Logo"
              className="h-10 w-auto"
            />
          </div>
          {/* Menu links on the right */}
          <nav className="space-x-6">
            <a href="/" className="text-black font-medium hover:text-gray-700">Home</a>
            <a href="/new" className="text-black font-medium hover:text-gray-700">Post Chair</a>
            <a href="/about" className="text-black font-medium hover:text-gray-700">About</a>
          </nav>
        </div>
      </header>

      {/* Hero section */}
      <section className="flex flex-col md:flex-row items-center justify-between py-20 md:py-28 gap-8">
  {/* Text content */}
  <div className="flex-1 text-center md:text-left">
    {/* Larger logo over the h1 */}
    <img
      src="/chairro-logo.png"
      alt="Chairro Logo"
      className="h-40 md:h-56 w-auto mb-4 mx-auto md:mx-0"
    />
    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
      Discover the perfect booth rental or post your empty chair to earn extra income.
    </h1>
    <p className="text-gray-600 text-lg md:text-xl max-w-xl mb-8">
      Find & Rent Barber and Salon Chairs in Maryland, Washington DC, and Virginia.
    </p>
    <a
      href="/new"
      className="inline-block bg-black text-white rounded-full px-6 py-3 text-base font-medium hover:bg-gray-800 transition"
    >
      + Post Your Chair
    </a>
  </div>

  {/* Hero image */}
  <div className="flex-1">
    <img
      src="full-shot-man-getting-haircut.jpg"
      alt="Hero placeholder"
      className="w-full max-w-lg mx-auto rounded-xl shadow-md object-cover"
    />
  </div>
</section>


<section className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {features.map((feature, index) => (
        <div key={index} className="border rounded-xl p-6 text-center hover:shadow transition">
          <div className="text-black mb-2">
            {feature.icon}
          </div>
          <h3 className="text-lg font-semibold">{feature.title}</h3>
          <p className="text-gray-500 text-sm">{feature.description}</p>
        </div>
      ))}
    </section>


      {/* Listings grid */}
      <ListingsGrid listings={data || []} />
    </main>
  )
}
