// src/components/ImageSlider.tsx
import { useState, useEffect } from "react";

export interface Slide {
  id: string;
  title?: string;
  images: string[]; // always expect an array (can be empty)
}

interface ImageSliderProps {
  slides: Slide[];
}

export default function ImageSlider({ slides }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset index if slides change
  useEffect(() => {
    if (slides.length > 0) {
      setCurrentIndex(0);
    }
  }, [slides]);

  // ⛔ No slides → Show graceful fallback
  if (!slides || slides.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center bg-gray-200 text-gray-500">
        No slides available
      </div>
    );
  }

  // ✅ Safe: get current slide
  const currentSlide = slides[currentIndex];
  const imageUrl =
    currentSlide?.images && currentSlide.images.length > 0
      ? currentSlide.images[0] // use first image if available
      : null;

  return (
    <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden rounded-xl">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={currentSlide.title || "Slide image"}
          className="w-full h-full object-cover transition-all duration-500"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
          No image found
        </div>
      )}

      {/* Navigation */}
      <button
        onClick={() =>
          setCurrentIndex((prev) =>
            prev === 0 ? slides.length - 1 : prev - 1
          )
        }
        className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/40 text-white px-3 py-1 rounded-full"
      >
        ‹
      </button>
      <button
        onClick={() =>
          setCurrentIndex((prev) =>
            prev === slides.length - 1 ? 0 : prev + 1
          )
        }
        className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/40 text-white px-3 py-1 rounded-full"
      >
        ›
      </button>
    </div>
  );
}
