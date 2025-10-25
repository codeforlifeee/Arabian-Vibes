"use client";
import { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Calendar, Star, Loader2 } from "lucide-react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useAuth } from "@/contexts/AuthContext";
import { useHolidays, useHolidaySearchState } from "@/hooks/useHolidays";
import { useSliders } from "@/hooks/useSliders";
import { DynamicSlider } from "@/components/ui/DynamicSlider";
import { DynamicCards } from "@/components/DynamicCards";
import InternalPageLayout from "./InternalPageLayout";

// Using Unsplash images
const AbuDhabiImg = "https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&q=80";
const BangkokImg = "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80";
const DubaiImg = "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80";
const HanoiImg = "https://images.unsplash.com/photo-1509606400453-c3faca3d4d6e?w=800&q=80";
const KandyImg = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80";
const MaldivesImg = "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80";
const MauritiusImg = "https://images.unsplash.com/photo-1598435737787-f2c1f67ec8df?w=800&q=80";
const SingaporeImg = "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80";

const Holidays = () => {
  // Use the custom search state hook
  const { searchParams, hasSearched, updateSearchParams, resetSearch } = useHolidaySearchState();
  
  // Fetch holidays data using React Query
  const { 
    data: holidayResponse, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useHolidays(searchParams); // Always load data

  // Fetch slider data for holidays page
  const { 
    data: slidersResponse, 
    isLoading: slidersLoading, 
    error: slidersError 
  } = useSliders({ page: 'holidays', limit: 5 });

  // Currency context
  const { convertAmount, formatAmount, currentCurrency } = useCurrency();
  const { isAgent } = useAuth();

  // Local state for form inputs
  const [formData, setFormData] = useState({
    searchQuery: "",
    destination: "",
    duration: "",
    category: "",
    minRating: 0,
  });

  const [suggestions, setSuggestions] = useState<string[]>([]);

  // State for internal page
  const [showInternalPage, setShowInternalPage] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState<any>(null);

  // Get holidays from response or default empty array
  const holidays = holidayResponse?.holidays || [];
  const totalResults = holidayResponse?.total || 0;

  const holidaySuggestions = [
    "Dubai Packages",
    "Abu Dhabi Tours",
    "Maldives Getaway",
    "Singapore Escape",
    "Thailand Adventures",
    "Bali Paradise",
    "Mauritius Retreat",
    "Vietnam Tours",
    "Bangkok Holidays",
    "Kandy Getaway",
    "Ras Al Khaimah Staycation",
    "Arabian Summer Retreat",
    "Best Of Dubai Summer Getaway",
    "Beautiful Thailand",
    "Krabi & Phuket Delight",
    "Magical Mauritius",
  ];

  // Handle search form submission
  const handleSearch = () => {
    updateSearchParams({
      ...formData,
      page: 1, // Reset to first page
    });
  };

  // Handle form field changes
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearchChange = (value: string) => {
    handleInputChange('searchQuery', value);
    if (value.length > 0) {
      const filtered = holidaySuggestions
        .filter((suggestion) =>
          suggestion.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  // Handle rating filter
  const handleRatingFilter = (rating: number) => {
    const newRating = formData.minRating === rating ? 0 : rating;
    handleInputChange('minRating', newRating);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setFormData({
      searchQuery: "",
      destination: "",
      duration: "",
      category: "",
      minRating: 0,
    });
    resetSearch();
  };

  // Render star rating
  const renderStars = (rating: number) => (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? "fill-orange-500 text-orange-500" : "text-gray-300"}`}
        />
      ))}
    </div>
  );

  // Get holiday display price based on currency
  const getHolidayDisplayPrice = (holiday: any) => {
    const price = isAgent && holiday.agentPrice ? holiday.agentPrice : holiday.price;
    const convertedPrice = convertAmount(price, 'AED', currentCurrency);
    return formatAmount(convertedPrice, currentCurrency);
  };

  // Helper function for price formatting
  const formatPrice = (price: number) => {
    const convertedPrice = convertAmount(price, 'AED', currentCurrency);
    return formatAmount(convertedPrice, currentCurrency);
  };

  // Helper function for agent/discount price
  const getFormattedPrice = (holiday: any) => {
    if (isAgent && holiday.agentPrice) {
      return formatPrice(holiday.agentPrice);
    }
    return formatPrice(holiday.discountedPrice || holiday.price);
  };

  // Get holiday image
  const getHolidayImage = (holiday: any) => {
    return holiday.image || holiday.images?.[0] || '/placeholder.svg';
  };

  // Transform holiday data to CardData format for DynamicCards
  const transformHolidaysToCards = (holidays: any[]) => {
    return holidays.map((holiday) => ({
      id: holiday.id,
      title: holiday.name,
      description: holiday.description || '',
      agentPrice: parsePrice(holiday.agentPrice || 0),
      discountedPrice: parsePrice(holiday.discountedPrice || 0),
      originalPrice: parsePrice(holiday.price || 0),
      flashSaleText: holiday.flashSaleText || '',
      isFlashSaleAvailable: holiday.isFlashSale || false,
      pageType: 'holidays',
      subPageType: holiday.category || '',
      images: [
        {
          id: '1',
          alt: holiday.name || '',
          title: holiday.name || '',
          url: getHolidayImage(holiday),
          width: 400,
          height: 300,
        }
      ]
    }));
  };

  const parsePrice = (price: number | string) => {
    if (typeof price === "number") return price;
    return parseFloat(String(price).replace(/[^\d.]/g, ""));
  };



  const destinations = [
    { name: "Abu Dhabi", image: AbuDhabiImg, href: "/destinations/abu-dhabi" },
    { name: "Bangkok", image: BangkokImg, href: "/destinations/bangkok" },
    { name: "Dubai", image: DubaiImg, href: "/destinations/dubai" },
    { name: "Hanoi", image: HanoiImg, href: "/destinations/hanoi" },
    { name: "Kandy", image: KandyImg, href: "/destinations/kandy" },
    { name: "Maldives", image: MaldivesImg, href: "/destinations/maldives" },
    { name: "Mauritius", image: MauritiusImg, href: "/destinations/mauritius" },
    { name: "Singapore", image: SingaporeImg, href: "/destinations/singapore" },
  ];


  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4, // default for desktop
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1024, // tablets
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768, // larger mobiles
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480, // small mobiles
        settings: {
          slidesToShow: 2, // ✅ two cards even on smallest
        },
      },
    ],
  };


  return (
    <div className="min-h-screen bg-background">
      {showInternalPage ? (
        <InternalPageLayout
          title={selectedHoliday?.name || "Holiday Details"}
          description="Discover amazing holiday packages and create unforgettable memories."
          item={selectedHoliday}
          onClose={() => {
            setShowInternalPage(false);
            setSelectedHoliday(null);
          }}
        />
      ) : (
        <>
          <Header />
          <main>
        
        {/* Dynamic Slider Section */}
        {!slidersLoading && !slidersError && slidersResponse?.slides && slidersResponse.slides.length > 0 && (
          <DynamicSlider 
            slides={slidersResponse.slides}
            height="400px"
            autoplay={true}
            autoplayDelay={4000}
            showDots={true}
            showArrows={true}
            className="mb-4"
          />
        )}

        
        {/* Search Section */}
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md sm:shadow-lg max-w-4xl mx-auto mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Destination Input */}
              <div className="relative">
                <label className="text-xs font-medium text-foreground block mb-1">
                  Destination
                </label>
                <Input
                  type="text"
                  placeholder="Search destinations..."
                  value={formData.searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="border rounded-md w-full text-sm" />
                {suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-border rounded-md shadow-lg z-50 max-h-40 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          handleInputChange('searchQuery', suggestion);
                          setSuggestions([]);
                        }}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Travel Date */}
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  Duration
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">Any Duration</option>
                  <option value="1-3 Days">1-3 Days</option>
                  <option value="3-5 Days">3-5 Days</option>
                  <option value="5-7 Days">5-7 Days</option>
                  <option value="7+ Days">7+ Days</option>
                </select>
              </div>

              {/* Package Type */}
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">Any Category</option>
                  <option value="Beach">Beach</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Luxury">Luxury</option>
                  <option value="Family">Family</option>
                </select>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRatingFilter(star)}
                  className={`w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full border transition ${formData.minRating >= star ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-700"
                    }`}
                >
                  <Star className={`h-3 w-3 md:h-4 md:w-4 ${formData.minRating >= star ? "fill-white" : ""}`} />
                </button>
              ))}
              <span className="ml-2 text-xs md:text-sm text-gray-600">Minimum Rating</span>
            </div>

            <Button 
              className="w-full mt-4 bg-[#BCA37F] hover:bg-[#BCA37F]/90 text-white text-sm sm:text-base"
              onClick={handleSearch}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search Packages
                </>
              )}
            </Button>
          </div>
        </div>



  {/* Holiday Destinations */}
        <div className="text-center py-8">
          <h2 className="text-3xl font-bold mb-8">Holiday Destinations</h2>
          <div className="px-4">
            <Slider {...sliderSettings}>
              {destinations.map((dest, index) => (
                <div key={index} className="px-2">
                  <a href={dest.href}>
                    <Card className="relative overflow-hidden hover:shadow-lg cursor-pointer h-full">
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className="w-full h-[200px] md:h-[250px] object-cover" />
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute bottom-0 left-0 w-full p-4">
                        <h4 className="text-white font-semibold text-lg">{dest.name}</h4>
                      </div>
                    </Card>
                  </a>
                </div>
              ))}
            </Slider>
          </div>

          {/* International Destinations */}
          <h2 className="text-3xl font-bold mt-16 mb-8">International Holiday Packages</h2>
          <div className="px-4">
            <Slider {...sliderSettings}>
              {[
                { name: "Bali", image: "https://d1i3enf1i5tb1f.cloudfront.net/City-Images/15688/almaty-city.jpg", href: "/bali-packages" },
                { name: "Bangkok", image: "https://d1i3enf1i5tb1f.cloudfront.net/City-Images/16424/bangkok-city.jpg", href: "/bangkok-packages" },
                { name: "Maldives", image: MaldivesImg, href: "/maldives-packages" },
                { name: "Mauritius", image: MauritiusImg, href: "/mauritius-packages" },
                { name: "Singapore", image: SingaporeImg, href: "/singapore-packages" },
                { name: "Hanoi", image: HanoiImg, href: "/hanoi-packages" },
                { name: "Kandy", image: KandyImg, href: "/kandy-packages" },
                { name: "Amsterdam", image: "https://d1i3enf1i5tb1f.cloudfront.net/City-Images/15825/Amsterdam-image.jpg", href: "/amsterdam-packages" }
              ].map((dest, index) => (
                <div key={index} className="px-2">
                  <a href={dest.href}>
                    <Card className="relative overflow-hidden hover:shadow-lg cursor-pointer h-full">
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className="w-full h-[200px] md:h-[250px] object-cover" />
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute bottom-0 left-0 w-full p-4">
                        <h4 className="text-white font-semibold text-lg">{dest.name}</h4>
                      </div>
                    </Card>
                  </a>
                </div>
              ))}
            </Slider>
          </div>
        </div>

        
        {/* Exclusive Summer Package Deals */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mt-16 mb-4">
            Exclusive Summer Package Deals
          </h2>
          <p className="text-muted-foreground mb-8">
            Soak up the sun with our unbeatable deals — unwrap them now!
          </p>
        </div>

        <div className="px-4">
          <Slider {...sliderSettings}>
            {holidays.map((holiday, index) => (
              <div key={index} className="px-4">
                <a href={`/holidays/${holiday.id}`}>
                  <Card className="w-full flex flex-col overflow-hidden text-center hover:shadow-lg transition-shadow rounded-lg">
                    <img
                      src={holiday.image || '/placeholder.svg'}
                      alt={holiday.name}
                      className="w-full aspect-[4/3] object-cover"
                    />
                    {holiday.isFlashSale && holiday.flashSaleText && (
                        <Badge
                          variant="secondary"
                          className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-destructive text-destructive-foreground text-[9px] sm:text-xs"
                        >
                          🔥 {holiday.flashSaleText}
                        </Badge>
                      )}
                    <div className="p-3 sm:p-4 flex flex-col flex-grow justify-between">
                      <h4 className="text-xs sm:text-sm font-semibold mb-1 line-clamp-1">
                        {holiday.name}
                      </h4>

                      <div className="space-y-1 mt-auto">
                        <div className="flex items-end justify-between">
                          <div className="flex flex-col justify-end text-left">
                            <span className="whitespace-nowrap text-[9px] sm:text-xs text-muted-foreground">
                              Per Person from
                            </span>
                            <div className="flex items-end gap-1 sm:gap-2">
                              {holiday.discountedPrice && (
                                <span className="line-through text-[10px] sm:text-xs text-muted-foreground">
                                  {formatPrice(holiday.price)}
                                </span>
                              )}
                              <span className="text-[10px] sm:text-xs sm:text-sm font-bold">
                                {getFormattedPrice(holiday)}
                              </span>
                            </div>
                          </div>
                          <Button
                            className="h-6 px-2 sm:h-7 sm:px-4 text-[10px] sm:text-xs md:text-sm bg-primary hover:bg-primary-glow"
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedHoliday(holiday);
                              setShowInternalPage(true);
                            }}
                          >
                            Add to cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </a>
              </div>
            ))}
          </Slider>
       
       

     
                 
          
      </div>

      </main>
      <Footer />
      </>
      )}
    </div>
  );
};

export default Holidays;