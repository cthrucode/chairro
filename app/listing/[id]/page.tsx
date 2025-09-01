import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import BookingForm from "./BookingForm";

export default async function ListingDetails(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  
  const { data: listing, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return <div className="p-6">Error loading listing.</div>;
  if (!listing) return <div className="p-6">Listing not found.</div>;

  // Always resolve images into one array
  const images: string[] =
    listing.image_urls && listing.image_urls.length > 0
      ? listing.image_urls
      : listing.image_url
      ? [listing.image_url]
      : [];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-2 text-center">{listing.title}</h1>
      <p className="text-center">{listing.shop} · {listing.location}</p>
      <p className="text-center text-blue-600 font-semibold mb-6">
        ${listing.price}/day
      </p>

      {/* Image(s) + Form side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {images.length > 0 && (
          <div className="space-y-4">
            {/* Main image */}
            <img
              src={images[0]}
              alt={listing.title}
              className="w-full rounded-lg shadow max-h-[400px] object-cover mx-auto"
            />

            {/* Thumbnails if multiple */}
            {images.length > 1 && (
              <div className="flex gap-2 justify-center">
                {images.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`${listing.title} ${idx + 1}`}
                    className="w-20 h-20 object-cover rounded cursor-pointer border hover:scale-105 transition"
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-center">
          <BookingForm
            listingId={listing.id}
            listingTitle={listing.title}
            price={listing.price}
          />
        </div>
      </div>
    </div>
  );
}
