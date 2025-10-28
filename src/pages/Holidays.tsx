"use client";
import { useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

        {/* Results Section - DynamicCards component displays the holiday packages from Drupal */}
        {hasSearched && (
          <div className="container mx-auto px-4 pb-6">
            {isLoading && (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            )}

            {isError && (
              <div className="text-center py-16">
                <p className="text-red-500 text-lg mb-4">Error loading holidays: {String(error)}</p>
                <Button onClick={() => refetch()}>Try Again</Button>
              </div>
            )}

            {!isLoading && !isError && holidays.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">No holidays found matching your criteria.</p>
                <Button onClick={handleResetFilters} className="mt-4">Reset Filters</Button>
              </div>
            )}

            {!isLoading && !isError && holidays.length > 0 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">
                    {totalResults} Package{totalResults !== 1 ? 's' : ''} Found
                  </h2>
                  <Button 
                    variant="outline" 
                    onClick={handleResetFilters}
                  >
                    Reset Filters
                  </Button>
                </div>
                <DynamicCards 
                  cards={transformHolidaysToCards(holidays)}
                  onCardClick={(card) => {
                    const holiday = holidays.find(h => String(h.id) === String(card.id));
                    if (holiday) {
                      setSelectedHoliday(holiday);
                      setShowInternalPage(true);
                    }
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Exclusive Summer Package Deals - Displays holidays from Drupal CMS */}
        {!hasSearched && holidays.length > 0 && (
          <div className="container mx-auto px-4 pb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">
                Exclusive Summer Package Deals
              </h2>
              <p className="text-muted-foreground">
                Soak up the sun with our unbeatable deals — unwrap them now!
              </p>
            </div>

            <DynamicCards 
              cards={transformHolidaysToCards(holidays)}
              onCardClick={(card) => {
                const holiday = holidays.find(h => String(h.id) === String(card.id));
                if (holiday) {
                  setSelectedHoliday(holiday);
                  setShowInternalPage(true);
                }
              }}
            />
          </div>
        )}

      </main>
      <Footer />
      </>
      )}
    </div>
  );
};

export default Holidays;