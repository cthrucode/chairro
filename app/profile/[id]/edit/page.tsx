'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function EditProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        console.error(error);
      } else {
        setProfile(data);
      }

      setLoading(false);
    };

    fetchProfile();
  }, [params.id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let avatar_url = profile.avatar_url;

      // Upload new avatar if provided
      if (avatarFile) {
        const filename = `${params.id}-${Date.now()}-${avatarFile.name}`;
        const { error: uploadError } = await supabase
          .storage
          .from('avatars')
          .upload(filename, avatarFile, { upsert: true });

        if (uploadError) throw uploadError;

        avatar_url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${filename}`;
      }

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          email: profile.email,
          role: profile.role,
          avatar_url,
        })
        .eq('id', params.id);

      if (updateError) throw updateError;

      alert('Profile updated!');
      router.push(`/profile/${params.id}`);
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!profile) return <div className="p-6">Profile not found.</div>;

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Edit Profile</h1>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Avatar Upload */}
        <div className="flex flex-col items-center space-y-2">
          {profile.avatar_url ? (
            <Image
              src={avatarFile ? URL.createObjectURL(avatarFile) : profile.avatar_url}
              alt="avatar"
              width={100}
              height={100}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-xl">
              {profile.full_name?.[0]}
            </div>
          )}

          <button
            type="button"
            className="text-sm text-pink underline"
            onClick={() => fileInputRef.current?.click()}
          >
            Change Photo
          </button>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => {
              if (e.target.files?.[0]) setAvatarFile(e.target.files[0]);
            }}
          />
        </div>

        {/* Full Name */}
        <input
          type="text"
          value={profile.full_name || ''}
          onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
          placeholder="Full Name"
          className="w-full border rounded px-3 py-2"
        />

        {/* Email */}
        <input
          type="email"
          value={profile.email || ''}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          placeholder="Email"
          className="w-full border rounded px-3 py-2"
        />

        {/* Role */}
        <input
          type="text"
          value={profile.role || ''}
          onChange={(e) => setProfile({ ...profile, role: e.target.value })}
          placeholder="Role (Barber, Stylist, etc.)"
          className="w-full border rounded px-3 py-2"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink text-white px-4 py-2 rounded hover:bg-pink/80"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
