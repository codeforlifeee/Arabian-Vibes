// src/components/sections/Carousel.tsx
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { fetchSlides } from "@/components/services/slideService";
import { cleanHtmlContent } from '@/lib/htmlUtils';

interface Slide {
  id: string;
  title: string;
  allImages: string[]; // all images for this slide
}

const Carousel: React.FC = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSlides = async () => {
      try {
        const data = await fetchSlides();
        setSlides(data);
      } catch (err) {
        console.error("Error loading slides:", err);
      } finally {
        setLoading(false);
      }
    };
    loadSlides();
  }, []);

  const mainSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };

  const innerSliderSettings = {
    dots: false,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  if (loading) {
    return <div className="text-center py-10">Loading slides...</div>;
  }

  return (
    <div className="carousel-container w-full max-w-5xl mx-auto">
      <Slider {...mainSliderSettings}>
        {slides.map((slide) => (
          <div key={slide.id} className="p-4">
            {/* Inner slider for multiple images per slide */}
            <Slider {...innerSliderSettings}>
              {slide.allImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${cleanHtmlContent(slide.title)}-${idx}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              ))}
            </Slider>

            <h3 className="text-center mt-4 text-lg font-semibold">
              {cleanHtmlContent(slide.title)}
            </h3>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
