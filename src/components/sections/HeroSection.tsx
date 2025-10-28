import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search, X, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { useSliders } from "@/hooks/useSliders";
import { useActivities } from "@/hooks/useActivities";

// Using Unsplash images
const dubaiImg = "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80";
const abuDhabiImg = "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1200&q=80";
const rakImg = "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=1200&q=80";
const omanImg = "https://images.unsplash.com/photo-1590642916589-592bca10dfbf?w=1200&q=80";

const HeroSection = () => {
  const [showPromo, setShowPromo] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [locationOpen, setLocationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate();
  const popoverRef = useRef<HTMLDivElement>(null);

  const { data: slidersData, isLoading: slidersLoading } = useSliders({ page: "activities" });
  const homeSliders = slidersData?.slides || [];

  const { data: activitiesData } = useActivities();
  
  const locations = [
    { id: "abu-dhabi", name: "Abu Dhabi", image: abuDhabiImg },
    { id: "dubai", name: "Dubai City", image: dubaiImg },
    { id: "ras-al-khaimah", name: "Ras al Khaimah", image: rakImg },
    { id: "oman", name: "Oman", image: omanImg },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (homeSliders.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % homeSliders.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [homeSliders.length]);

  const getLocationSlug = () => {
    if (!selectedLocation) return "activities";
    const name = selectedLocation.toLowerCase();
    if (name.includes("abu dhabi")) return "abuDhabi";
    if (name.includes("dubai")) return "dubai";
    if (name.includes("ras")) return "ras-al-khaimah";
    if (name.includes("oman")) return "oman";
    return "activities";
  };

  const handleRedirect = (id: string) => {
    const base = getLocationSlug();
    navigate(`/${base}/${id}`);
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      const base = getLocationSlug();
      navigate(`/${base}?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleBookNow = () => {
    navigate("/holidays");
  };

  const handleLocationSelect = (loc: { id: string; name: string }) => {
    if (isClosing) return;

    setIsClosing(true);
    const newLocation = selectedLocation === loc.name ? null : loc.name;
    setSelectedLocation(newLocation);
    setLocationOpen(false);

    setTimeout(() => {
      setIsClosing(false);
      if (newLocation) {
        handleRedirect(loc.id);
      } else {
        navigate("/activities");
      }
    }, 300);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? homeSliders.length - 1 : prev - 1
    );
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) =>
      prev === homeSliders.length - 1 ? 0 : prev + 1
    );
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.length > 0) {
      // Create activity suggestions from backend data or use fallback
      const activityList = activitiesData?.activities || [];
      let suggestionList: string[] = [];
      
      if (activityList.length > 0) {
        suggestionList = activityList
          .map((activity: any) => activity.title || activity.name)
          .filter((title: string) => title.toLowerCase().includes(value.toLowerCase()))
          .slice(0, 5);
      } else {
        // Fallback suggestions when backend data is not available
        suggestionList = [
          "Burj Khalifa",
          "Dubai Mall", 
          "Desert Safari",
          "Ferrari World",
          "Sheikh Zayed Grand Mosque"
        ].filter((s) => s.toLowerCase().includes(value.toLowerCase())).slice(0, 5);
      }
      
      setSuggestions(suggestionList);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <>
      {/* Promo Bar */}
      {showPromo && (
        <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white py-3 px-4 relative text-xs sm:text-sm animate-gradient shadow-lg">
          <div className="container mx-auto text-center">
            <p className="font-semibold">
              <span className="font-extrabold">🎉 MEGA SALE!</span> Flat 8% discount on all Tours and Attractions. Use Code: <span className="font-extrabold bg-white text-red-600 px-3 py-1 rounded-lg shadow-md mx-1">SAVE8</span>
            </p>
                        <Button
              onClick={() => setShowPromo(false)}
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/30 h-8 w-8 sm:h-9 sm:w-9 rounded-full transition-all"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative">
        <div className="relative h-[450px] sm:h-[550px] md:h-[600px] overflow-hidden">
          {slidersLoading ? (
            /* Loading state */
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900">
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="relative z-10 h-full flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
                  <p className="text-lg">Loading amazing experiences...</p>
                </div>
              </div>
            </div>
          ) : homeSliders.length === 0 ? (
            /* Fallback when no sliders available */
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent">
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="relative z-10 h-full flex items-center">
                <div className="container mx-auto px-4">
                  <div className="max-w-5xl">
                    <div className="text-white mb-6">
                      <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 leading-tight drop-shadow-lg">
                        Discover <span className="text-orange-400">Arabian</span> <br />
                        <span className="text-orange-400">Adventures</span>
                      </h1>
                      <p className="text-lg sm:text-xl mb-6 text-white/90 max-w-2xl">
                        Culture, nature, thrills, and record-breaking experiences awaits you
                      </p>
                      <div className="flex flex-wrap gap-4 items-center">
                        <Button
                          size="lg"
                          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-6 text-base shadow-xl"
                          onClick={handleBookNow}
                        >
                          BOOK NOW
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ✅ Dynamic sliders from backend */
            <>
              {homeSliders.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
                    index === currentSlide ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ backgroundImage: `url(${slide.images?.[0]?.url || slide.image})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
                </div>
              ))}

              {/* Navigation arrows - only show if multiple slides */}
              {homeSliders.length > 1 && (
                <>
                  <button
                    onClick={goToPrevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-full z-20 transition-all"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={goToNextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-full z-20 transition-all"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>

                  {/* Slide indicators */}
                  <div className="absolute bottom-24 sm:bottom-28 left-0 right-0 flex justify-center gap-2 z-20">
                    {homeSliders.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`h-2 w-2 sm:h-3 sm:w-3 rounded-full transition-all ${
                          index === currentSlide ? "bg-white w-6 sm:w-8" : "bg-white/50"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* ✅ Dynamic text overlay from backend slider data */}
              <div className="relative z-10 h-full flex items-center pt-12">
                <div className="container mx-auto px-4">
                  <div className="max-w-5xl">
                    <div className="text-white mb-6">
                      <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 leading-tight drop-shadow-2xl">
                        {homeSliders[currentSlide]?.title || "ARABIAN ADVENTURES"}
                      </h1>
                      {homeSliders[currentSlide]?.description && (
                        <p className="text-base sm:text-lg md:text-xl mb-6 text-white/90 max-w-2xl drop-shadow-lg">
                          {homeSliders[currentSlide].description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-4 items-center mb-5">
                        <Button
                          size="lg"
                          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-10 py-7 text-lg shadow-2xl transform hover:scale-110 transition-all rounded-xl"
                          onClick={handleBookNow}
                        >
                          🎫 BOOK NOW
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ✅ Search Box - Always visible, positioned absolutely */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 w-full px-4">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-8 shadow-2xl max-w-4xl w-full mx-auto border-2 border-white/50">
              <div className="grid grid-cols-1 sm:grid-cols-6 gap-3 sm:gap-4 items-end">
                {/* Search Activities */}
                <div className="sm:col-span-4 relative">
                  <label className="text-xs sm:text-sm font-bold text-gray-800 mb-2 block flex items-center">
                    <Search className="h-4 w-4 mr-2 text-primary" />
                    Search Activities
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Where would you like to go?"
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                      className="w-full px-5 py-3.5 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all font-medium shadow-sm"
                    />
                    <Button
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 rounded-lg shadow-md"
                      onClick={handleSearchSubmit}
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                  {suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white border-2 border-primary/20 rounded-2xl shadow-2xl z-50 mt-2 max-h-48 overflow-y-auto">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSearchQuery(suggestion);
                            setSuggestions([]);
                            handleSearchSubmit();
                          }}
                          className="w-full px-4 py-3 text-left text-sm font-medium hover:bg-primary/10 transition-colors border-b border-gray-100 last:border-0 flex items-center gap-2"
                        >
                          <Search className="inline h-4 w-4 text-primary" />
                          <span className="flex-1">{suggestion}</span>
                          <span className="text-xs text-gray-400">→</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Location Selector */}
                <div className="sm:col-span-2">
                  <label className="text-xs sm:text-sm font-bold text-gray-800 mb-2 block flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-primary" />
                    Location
                  </label>
                  <Popover
                    open={locationOpen && !isClosing}
                    onOpenChange={(open) => {
                      if (!isClosing) setLocationOpen(open);
                    }}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-sm h-12 px-4 border-2 border-gray-200 hover:border-primary transition-all font-semibold rounded-xl shadow-sm"
                        disabled={isClosing}
                      >
                        {selectedLocation || "All Locations"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-[380px] p-5 z-[1000] rounded-2xl shadow-2xl border-2"
                      align="start"
                      ref={popoverRef}
                      onInteractOutside={(e) => {
                        if (!isClosing) setLocationOpen(false);
                        else e.preventDefault();
                      }}
                    >
                      <h4 className="font-bold mb-4 text-base text-gray-900">Select Location</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {locations.map((loc) => (
                          <button
                            key={loc.id}
                            onClick={(e) => {
                              e.preventDefault();
                              handleLocationSelect(loc);
                            }}
                            disabled={isClosing}
                            className={`rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ${
                              isClosing ? "" : "hover:scale-105 hover:shadow-2xl"
                            } ${
                              selectedLocation === loc.name
                                ? "ring-4 ring-primary"
                                : "ring-2 ring-gray-100"
                            }`}
                          >
                            <img
                              src={loc.image}
                              alt={loc.name}
                              className="w-full h-28 object-cover"
                              loading="lazy"
                            />
                            <p className="text-center py-3 text-sm font-bold bg-white text-gray-900">
                              {loc.name}
                            </p>
                          </button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;