import Link from 'next/link'

type ListingCardProps = {
  id: string
  title: string
  shop: string
  location: string
  price: number
  images?: string[] | null
}


export default function ListingCard({ id, title, shop, location, price, image }: ListingCardProps) {
  return (
    <div className="rounded-2xl shadow bg-white flex flex-col">
      <Link
        href={`/listing/${id}`}
        className="block rounded-t-2xl overflow-hidden group"
      >
        <img
          src={image || '/placeholder.jpg'}
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
        />
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <Link
          href={`/listing/${id}`}
          className="font-semibold text-lg hover:underline"
        >
          {title}
        </Link>

        <p className="text-gray-500">{shop} · {location}</p>
        <p className="text-blue-600 font-medium mb-4">${price}</p>

        <Link
          href={`/listing/${id}`}
          className="mt-auto bg-black text-white rounded-full px-4 py-2 text-center text-sm font-medium hover:bg-gray-800 transition"
        >
          Book Now
        </Link>
      </div>
    </div>
  )
}
