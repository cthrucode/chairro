import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import BookingForm from "./BookingForm";
import ImageGallery from "./ImageGallery";

export default async function ListingDetails(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  
  const { data: listing, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return <div className="p-6">Error loading listing.</div>;
  if (!listing) return <div className="p-6">Listing not found.</div>;

  const images: string[] =
    listing.image_urls && listing.image_urls.length > 0
      ? listing.image_urls
      : listing.image_url
      ? [listing.image_url]
      : [];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* 🔙 Back Button */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 text-gray-800 font-medium shadow-sm hover:bg-gray-200 transition"
        >
          ← Back to Home
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-2 text-center">{listing.title}</h1>
      <p className="text-center">{listing.shop} · {listing.location}</p>
      <p className="text-center text-blue-600 font-semibold mb-6">
        ${listing.price}/day
      </p>

      {/* Image(s) + Form side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {images.length > 0 && (
          <div className="space-y-4">
            <ImageGallery images={images} title={listing.title} />
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
