"use client";

import Link from "next/link";
import Image from "next/image";

type ListingCardProps = {
  id: string;
  title: string;
  shop: string;
  location: string;
  price: number;
  image?: string | null;
};

export default function ListingCard({
  id,
  title,
  shop,
  location,
  price,
  image,
}: ListingCardProps) {
  return (
    <div className="rounded-2xl shadow bg-white flex flex-col">
      <Link
        href={`/listing/${id}`}
        className="block rounded-t-2xl overflow-hidden group relative w-full h-48"
      >
        <Image
          src={image || "/placeholder.jpg"}
          alt={title}
          fill
          sizes="100vw"
          className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
          priority={false}
        />
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <Link
          href={`/listing/${id}`}
          className="font-semibold text-lg hover:underline"
        >
          {title}
        </Link>

        <p className="text-gray-500">
          {shop} · {location}
        </p>
        <p className="text-pink font-semibold mb-4">${price}</p>

        <Link
          href={`/listing/${id}`}
          className="mt-auto bg-black text-white rounded-full px-4 py-2 text-center text-sm font-medium hover:bg-gray-800 transition"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
}
