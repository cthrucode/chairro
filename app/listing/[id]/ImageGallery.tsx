"use client";

import { useState } from "react";
import Image from "next/image";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative w-full max-h-[400px] mx-auto">
        <Image
          src={mainImage}
          alt={title}
          width={800}
          height={400}
          className="w-full h-auto rounded-lg shadow object-cover max-h-[400px]"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 justify-center">
          {images.map((url, idx) => (
            <div
              key={idx}
              className={`relative w-20 h-20 cursor-pointer rounded overflow-hidden border transition 
                ${mainImage === url ? "border-blue-500" : "border-transparent"}
              `}
              onClick={() => setMainImage(url)}
              onMouseEnter={() => setMainImage(url)} // optional hover
            >
              <Image
                src={url}
                alt={`${title} ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
