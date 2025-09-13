import EditProfileForm from './EditProfileForm';
import { supabase } from '@/lib/supabaseClient';

export default async function EditProfilePage({ params }: { params: { id: string } }) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!profile) return <div className="p-6">Profile not found.</div>;

  return <EditProfileForm profile={profile} />;
}
