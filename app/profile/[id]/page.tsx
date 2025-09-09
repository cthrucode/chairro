'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ListingsGrid from '@/components/ListingsGrid';
import BookingList from '@/components/BookingList';
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@/components/hooks/useUser';

export default function ProfilePage({ params }: { params: { id: string } }) {
  const { user: currentUser, loading: userLoading } = useUser();

  const [profile, setProfile] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [bookings, setBookings] = useState<{ active: any[]; past: any[] }>({
    active: [],
    past: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      // Get profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', params.id)
        .single();

      if (profileError) {
        console.error(profileError);
        setLoading(false);
        return;
      }

      setProfile(profileData);

      if (profileData.role === 'host') {
        // Fetch host listings
        const { data: listingData, error: listingError } = await supabase
          .from('listings')
          .select('*')
          .eq('owner_id', params.id)
          .order('created_at', { ascending: false });

        if (!listingError) setListings(listingData || []);
      } else if (profileData.role === 'professional') {
        // Fetch favorites
        const { data: favs } = await supabase
          .from('favorites')
          .select('*, listings(*)')
          .eq('user_id', params.id);

        setFavorites(favs || []);

        // Fetch active bookings
        const { data: activeBookings } = await supabase
          .from('bookings')
          .select('*, listings(*)')
          .eq('renter_id', params.id)
          .gte('end_date', new Date().toISOString());

        // Fetch past bookings
        const { data: pastBookings } = await supabase
          .from('bookings')
          .select('*, listings(*)')
          .eq('renter_id', params.id)
          .lt('end_date', new Date().toISOString());

        setBookings({
          active: activeBookings || [],
          past: pastBookings || [],
        });
      }

      setLoading(false);
    };

    fetchProfile();
  }, [params.id]);

  if (loading || userLoading) {
    return <div className="p-6 text-center">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="p-6 text-center">Profile not found.</div>;
  }

  return (
    <div className="w-full overflow-x-hidden">
      {/* Profile Header */}
      <section className="bg-dark text-light py-16">
        <div className="max-w-screen-xl mx-auto text-center px-6">
          {/* Avatar */}
          <div className="flex justify-center mb-4">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={`${profile.full_name}'s photo`}
                width={120}
                height={120}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold">
                {profile.full_name?.[0]}
              </div>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-2">{profile.full_name}</h1>
          <p className="text-light/80">{profile.email}</p>

          {profile.role && (
            <span className="mt-2 inline-block px-3 py-1 bg-pink text-white text-sm rounded-full">
              {profile.role}
            </span>
          )}

          {/* Mock Ratings */}
          <div className="flex justify-center mt-4 space-x-1 text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <span key={i}>{i < 4 ? '★' : '☆'}</span> // 4/5 stars
            ))}
          </div>

          {/* Links */}
          <div className="mt-6 flex justify-center gap-4">
            <Link href="/" className="px-4 py-2 bg-light text-dark rounded shadow hover:bg-gray-200">
              Home
            </Link>
            {currentUser?.id === profile.id && (
              <Link
                href={`/profile/${profile.id}/edit`}
                className="px-4 py-2 bg-pink text-white rounded shadow hover:bg-pink/80"
              >
                Edit Profile
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Host Section */}
      {profile.role === 'host' && (
        <section className="max-w-screen-2xl mx-auto px-6 py-16 bg-light">
          <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-dark">
            {profile.full_name?.split(' ')[0]}'s Listings
          </h2>
          {listings.length > 0 ? (
            <ListingsGrid listings={listings} />
          ) : (
            <p className="text-gray-500 text-center">No listings yet.</p>
          )}
        </section>
      )}

      {/* Professional Section */}
      {profile.role === 'professional' && (
        <section className="max-w-screen-2xl mx-auto px-6 py-16 bg-light space-y-12">
          {/* Favorites */}
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-dark">Favorites</h2>
            {favorites.length > 0 ? (
              <ListingsGrid listings={favorites.map((f) => f.listings)} />
            ) : (
              <p className="text-gray-500 text-center">No favorites yet.</p>
            )}
          </div>

          {/* Active Bookings */}
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-dark">Current Bookings</h2>
            {bookings.active.length > 0 ? (
              <BookingList bookings={bookings.active} />
            ) : (
              <p className="text-gray-500 text-center">No active bookings.</p>
            )}
          </div>

          {/* Past Bookings */}
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-dark">Past Bookings</h2>
            {bookings.past.length > 0 ? (
              <BookingList bookings={bookings.past} />
            ) : (
              <p className="text-gray-500 text-center">No past bookings.</p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
