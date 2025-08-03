import { supabase } from "@/lib/supabaseClient";

// ✅ Must be named `Page` for App Router
export default async function Page(props: { params: { id: string } }) {
    const { params } = props;
    const { id } = params;

  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return <div className="p-4 text-red-600">Listing not found.</div>;
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <img
        src={data.image_url}
        alt={data.title}
        className="w-full h-64 object-cover rounded-xl mb-6"
      />
      <h1 className="text-3xl font-bold mb-2">{data.title}</h1>
      <p className="text-gray-600 mb-2">
        {data.shop} — {data.location}
      </p>
      <p className="text-lg font-semibold mb-4">{data.price}</p>
      <p className="text-base">{data.description}</p>
    </div>
  );
}
