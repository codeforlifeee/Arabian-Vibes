import { useState, useEffect } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface SlideData {
  id: string;
  title: string;
  image: string;
  description?: string;
  link?: string;
  alt_text?: string;
}

interface DynamicSliderProps {
  slides: SlideData[];
  height?: string;
  autoplay?: boolean;
  autoplayDelay?: number;
  showDots?: boolean;
  showArrows?: boolean;
  className?: string;
}

export const DynamicSlider = ({
  slides,
  height = "400px",
  autoplay = true,
  autoplayDelay = 4000,
  showDots = true,
  showArrows = true,
  className = ""
}: DynamicSliderProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
 const navigate = useNavigate();
  // Auto-play functionality
  useEffect(() => {
    if (!autoplay || slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoplayDelay);

    return () => clearInterval(interval);
  }, [autoplay, autoplayDelay, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ height }}>
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.alt_text || slide.title}
              className="w-full h-full object-cover"
              loading={index === 0 ? "eager" : "lazy"}
            />
            
            {/* Overlay with gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            
            {/* Content overlay */}
            {(slide.title || slide.description) && (
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="max-w-4xl mx-auto">
                  {slide.title && (
                    <h2 className="text-2xl md:text-4xl font-bold mb-2">
                      {slide.title}
                    </h2>
                  )}
                 
                  {slide.link && (
                    <Button 
                      className="bg-primary hover:bg-travel-orange/90 text-white"
                        onClick={() => navigate("/contact")}
                    >
                      Learn More
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {showArrows && slides.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white z-10"
            onClick={goToPrevious}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white z-10"
            onClick={goToNext}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </>
      )}

      {/* Dots indicator */}
      {showDots && slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
