'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useSession } from '@/lib/SupabaseProvider';


const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

export default function DashboardPage() {
  const { user } = useSession();
  const [metrics, setMetrics] = useState({ listings: 0, bookings: 0, views: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);

      // Fetch Listings for this user
      const { count: listingsCount } = await supabase
        .from('listings')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', user.id);

      // Fetch Bookings within last 30 days
      const { count: bookingsCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('host_id', user.id)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      // Fetch Views (if you have a views table, otherwise stub with random)
      const { count: viewsCount } = await supabase
        .from('views')
        .select('*', { count: 'exact', head: true })
        .eq('host_id', user.id)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      setMetrics({
        listings: listingsCount || 0,
        bookings: bookingsCount || 0,
        views: viewsCount || 0,
      });

      setLoading(false);
    };

    fetchData();
  }, [user]);

  if (!user) {
    return <div className="p-6 text-center">Please log in to see your dashboard.</div>;
  }

  if (loading) {
    return <div className="p-6 text-center">Loading metrics...</div>;
  }

  const data = [
    { name: 'Listings', value: metrics.listings },
    { name: 'Bookings', value: metrics.bookings },
    { name: 'Views', value: metrics.views },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Host Dashboard</h1>

      <div className="w-full h-96">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={140}
              label
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
