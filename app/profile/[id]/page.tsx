'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ListingsGrid from '@/components/ListingsGrid';

export default function ProfilePage({ params }: { params: { id: string } }) {
  const [profile, setProfile] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', params.id)
        .single();

      if (profileError) {
        console.error(profileError);
      } else {
        setProfile(profileData);
      }

      const { data: listingData, error: listingError } = await supabase
        .from('listings')
        .select('*')
        .eq('owner_id', params.id) // 👈 you’ll need to add this column if not already
        .order('created_at', { ascending: false });

      if (listingError) {
        console.error(listingError);
      } else {
        setListings(listingData || []);
      }

      setLoading(false);
    };

    fetchProfile();
  }, [params.id]);

  if (loading) {
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
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{profile.full_name}</h1>
          <p className="text-light/80">{profile.email}</p>
          {profile.role && (
            <span className="mt-2 inline-block px-3 py-1 bg-pink text-white text-sm rounded-full">
              {profile.role}
            </span>
          )}
        </div>
      </section>

      {/* Listings */}
      <section className="max-w-screen-2xl mx-auto px-6 py-16 bg-light">
        <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-dark">
          {profile.full_name.split(' ')[0]}'s Listings
        </h2>
        {listings.length > 0 ? (
          <ListingsGrid listings={listings} />
        ) : (
          <p className="text-gray-500 text-center">No listings yet.</p>
        )}
      </section>
    </div>
  );
}
