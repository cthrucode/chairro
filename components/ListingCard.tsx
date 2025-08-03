type ListingCardProps = {
    id: string
    title: string
    shop: string
    location: string
    price: number
    image: string
  }
  
  export default function ListingCard({ id, title, shop, location, price, image }: ListingCardProps) {
    return (
      <div className="rounded-2xl shadow bg-white">
        <img src={image} alt={title} className="w-full h-48 object-cover rounded-t-2xl" />
        <div className="p-4">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-gray-500">{shop} · {location}</p>
          <p className="text-blue-600 font-medium">${price}</p>
        </div>
      </div>
    )
  }
  