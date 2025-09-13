'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';

type Profile = {
  id: string;
  full_name: string;
  email: string;
  role: string;
  avatar_url?: string;
};

export default function EditProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [state, setState] = useState(profile);
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let avatar_url = state.avatar_url;

      if (avatarFile) {
        const filename = `${profile.id}-${Date.now()}-${avatarFile.name}`;
        const { error } = await supabase.storage
          .from('avatars')
          .upload(filename, avatarFile, { upsert: true });

        if (error) throw error;

        avatar_url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${filename}`;
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: state.full_name,
          email: state.email,
          role: state.role,
          avatar_url,
        })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      alert('Profile updated!');
      router.push(`/profile/${profile.id}`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Edit Profile</h1>
      <form onSubmit={handleSave} className="space-y-4">
        {/* Avatar Upload */}
        <div className="flex flex-col items-center space-y-2">
          {state.avatar_url ? (
            <Image
              src={avatarFile ? URL.createObjectURL(avatarFile) : state.avatar_url}
              alt="avatar"
              width={100}
              height={100}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-xl">
              {state.full_name?.[0]}
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

        <input
          type="text"
          value={state.full_name || ''}
          onChange={(e) => setState({ ...state, full_name: e.target.value })}
          placeholder="Full Name"
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="email"
          value={state.email || ''}
          onChange={(e) => setState({ ...state, email: e.target.value })}
          placeholder="Email"
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="text"
          value={state.role || ''}
          onChange={(e) => setState({ ...state, role: e.target.value })}
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
