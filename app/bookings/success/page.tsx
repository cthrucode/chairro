"use client";

import { useEffect, useState } from "react";
import Confetti from "react-confetti";

export default function BookingSuccessPage() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });

      const handleResize = () =>
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-6">
      {/* 🎉 Confetti */}
      <Confetti width={windowSize.width} height={windowSize.height} />

      <h1 className="text-4xl font-bold mb-4 text-green-600">
        🎉 Booking Confirmed!
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        Thank you for booking! A confirmation email has been sent.
      </p>

      <a
        href="/dashboard"
        className="px-6 py-3 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-medium shadow-md"
      >
        Go to Dashboard
      </a>
    </div>
  );
}
