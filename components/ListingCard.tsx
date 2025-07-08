import Link from 'next/link'

export default function ListingCard({ id, title, shop, location, price, image }) {
  return (
    <Link href={`/listing/${id}`}>
      <div className="rounded-2xl shadow-md bg-white overflow-hidden hover:shadow-lg transition">
        <img src={image} alt={title} className="w-full h-48 object-cover" />
        <div className="p-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-gray-500">{shop} – {location}</p>
          <p className="mt-2 text-lg font-bold">{price}</p>
        </div>
      </div>
    </Link>
  )
}
