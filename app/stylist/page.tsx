import Image from "next/image";

export default function StylistsPage() {
  const faqs = [
    {
      question: "Do I need a license to be a hairstylist in Maryland?",
      answer:
        "Yes. Maryland requires hairstylists to be licensed through the Maryland Board of Cosmetologists. You must complete an approved program and pass the state exam."
    },
    {
      question: "What if I already have a license from another state?",
      answer:
        "Maryland may allow reciprocity, but it depends on your state’s requirements. You’ll need to apply with the Maryland Board and possibly meet additional training hours."
    },
    {
      question: "Can I rent a chair in a salon without a license?",
      answer:
        "No. Maryland law requires all stylists providing services to the public to hold a valid license. Renting a chair doesn’t exempt you from this requirement."
    },
    {
      question: "Do salons need a separate license?",
      answer:
        "Yes. Any salon operating in Maryland must have a salon permit, in addition to individual licenses for each stylist."
    },
    {
      question: "What about continuing education?",
      answer:
        "Stylists must renew their license every two years. Continuing education may be required, so check with the Maryland Board of Cosmetologists."
    }
  ];

  return (
    <main className="relative min-h-screen bg-gray-50">
      {/* Parallax Hero */}
      <section className="relative h-[60vh] flex items-center justify-center text-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/stylist-bg.jpg" // replace with your parallax background
            alt="Stylists working in a salon"
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            className="fixed"
          />
        </div>
        <div className="relative z-10 text-white max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-lg">
            Maryland Stylist Laws & FAQs
          </h1>
          <p className="mt-4 text-lg">
            A quick reference guide for hairstylists renting chairs or working
            in Maryland salons.
          </p>
        </div>
      </section>

      {/* Q&A Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-blue-700 mb-2">
                {faq.question}
              </h3>
              <p className="text-gray-700">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
