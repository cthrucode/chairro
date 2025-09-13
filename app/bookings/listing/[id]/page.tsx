import BookingForm from "../../../listing/[id]/BookingForm";

interface PageProps {
  params: {
    id: string;
  };
}

export default function BookingPage({ params }: PageProps) {
  const { id } = params;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Book Listing {id}</h1>
      <BookingForm listingId={id} />
    </div>
  );
}
