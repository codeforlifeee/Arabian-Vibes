"use client";
import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Star, Loader2, Badge } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useAuth } from "@/contexts/AuthContext";
import { useHotels, useHotelSearchState } from "@/hooks/useHotels";
import { useSliders } from "@/hooks/useSliders";
import { DynamicSlider } from "@/components/ui/DynamicSlider";
import InternalPageLayout from "./InternalPageLayout";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";




const Hotels = () => {
  // Use the custom search state hook
  const { searchParams, hasSearched, updateSearchParams, resetSearch } = useHotelSearchState();
  
  // Fetch hotels data using React Query
  const { 
    data: hotelResponse, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useHotels(searchParams); // Always load data

  // Fetch slider data for hotels page
  const { 
    data: slidersResponse, 
    isLoading: slidersLoading, 
    error: slidersError 
  } = useSliders({ page: 'hotels', limit: 5 });

  // Currency context
  const { convertAmount, formatAmount, currentCurrency } = useCurrency();
  const { user, isAgent } = useAuth();

  // Local state for form inputs
  const [formData, setFormData] = useState({
    searchQuery: "",
    location: "",
    category: "",
    minRating: 0,
    nationality: "",
    guests: "1",
    checkIn: "",
    checkOut: "",
  });

  // State for internal page
  const [showInternalPage, setShowInternalPage] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);

  // Get hotels from response or default empty array
  const hotels = hotelResponse?.hotels || [];
  const totalResults = hotelResponse?.total || 0;

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

  // Handle rating filter
  const handleRatingFilter = (rating: number) => {
    const newRating = formData.minRating === rating ? 0 : rating;
    setFormData(prev => ({
      ...prev,
      minRating: newRating
    }));
  };

  // Reset all filters
  const handleResetFilters = () => {
    setFormData({
      searchQuery: "",
      location: "",
      category: "",
      minRating: 0,
      nationality: "",
      guests: "1",
      checkIn: "",
      checkOut: "",
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

  // Get hotel display price based on currency and user type
  const getHotelDisplayPrice = (hotel: any) => {
    // Determine which price to use
    let priceToShow = hotel.price;
    
    if (isAgent && hotel.agentPrice && hotel.agentPrice > 0) {
      priceToShow = hotel.agentPrice;
    } else if (hotel.discountedPrice && hotel.discountedPrice > 0) {
      priceToShow = hotel.discountedPrice;
    }

    if (currentCurrency === "AED") {
      return `AED ${priceToShow.toFixed(2)}`;
    } else {
      const converted = convertAmount(priceToShow, 'AED', currentCurrency);
      return formatAmount(converted, currentCurrency);
    }
  };

  // Get original price for showing strikethrough
  const getOriginalPrice = (hotel: any) => {
    if (isAgent && hotel.agentPrice && hotel.agentPrice > 0 && hotel.price > hotel.agentPrice) {
      if (currentCurrency === "AED") {
        return `AED ${hotel.price.toFixed(2)}`;
      }
      const converted = convertAmount(hotel.price, 'AED', currentCurrency);
      return formatAmount(converted, currentCurrency);
    }
    
    if (!isAgent && hotel.discountedPrice && hotel.discountedPrice > 0 && hotel.price > hotel.discountedPrice) {
      if (currentCurrency === "AED") {
        return `AED ${hotel.price.toFixed(2)}`;
      }
      const converted = convertAmount(hotel.price, 'AED', currentCurrency);
      return formatAmount(converted, currentCurrency);
    }
    
    return null;
  };

  // Get savings percentage
  const getSavingsPercentage = (hotel: any) => {
    if (isAgent && hotel.agentPrice && hotel.agentPrice > 0 && hotel.price > hotel.agentPrice) {
      return Math.round(((hotel.price - hotel.agentPrice) / hotel.price) * 100);
    }
    
    if (!isAgent && hotel.discountedPrice && hotel.discountedPrice > 0 && hotel.price > hotel.discountedPrice) {
      return Math.round(((hotel.price - hotel.discountedPrice) / hotel.price) * 100);
    }
    
    return 0;
  };

  // Get hotel image
  const getHotelImage = (hotel: any) => {
    // Use the first image from Drupal or fallback to placeholder
    return hotel.image || hotel.images?.[0] || '/placeholder.svg';
  };

  return (
    <div className="min-h-screen bg-background">
      {showInternalPage ? (
        <InternalPageLayout
          title={selectedHotel?.name || "Hotel Details"}
          description="Experience luxury and comfort at the finest hotels in the UAE."
          item={selectedHotel}
          onClose={() => {
            setShowInternalPage(false);
            setSelectedHotel(null);
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
            className="mb-0 "
          />
        )}

       

        {/* Filters */}
        <section className="py-4 md:py-8 bg-white">
          <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {/* Destination */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 md:h-5 md:w-5" />
              <input
                type="text"
                placeholder="Enter Destination"
                value={formData.searchQuery}
                onChange={(e) => handleInputChange('searchQuery', e.target.value)}
                className="w-full pl-10 pr-3 py-1.5 md:py-3 border border-gray-300 rounded-lg text-xs md:text-base"
              />
            </div>

            {/* Guests */}
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 md:h-5 md:w-5" />
              <select
                value={formData.guests}
                onChange={(e) => handleInputChange('guests', e.target.value)}
                className="w-full pl-10 pr-3 py-1.5 md:py-3 border border-gray-300 rounded-lg text-xs md:text-base"
              >
                <option value="1">1 Person</option>
                <option value="2">2 People</option>
                <option value="3">3 People</option>
                <option value="4">4 People</option>
                <option value="5+">5+ People</option>
              </select>
            </div>

            {/* Check In */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 md:h-5 md:w-5" />
              <input
                type="date"
                value={formData.checkIn}
                onChange={(e) => handleInputChange('checkIn', e.target.value)}
                className="w-full pl-10 pr-3 py-1.5 md:py-3 border border-gray-300 rounded-lg text-xs md:text-base"
              />
            </div>

            {/* Check Out */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 md:h-5 md:w-5" />
              <input
                type="date"
                value={formData.checkOut}
                onChange={(e) => handleInputChange('checkOut', e.target.value)}
                className="w-full pl-10 pr-3 py-1.5 md:py-3 border border-gray-300 rounded-lg text-xs md:text-base"
              />
            </div>

            {/* Rating Filter */}
            <div className="col-span-full flex flex-wrap items-center gap-2">
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

            {/* Nationality */}
            <div className="relative">
              <select
                value={formData.nationality}
                onChange={(e) => handleInputChange('nationality', e.target.value)}
                className="w-full px-4 py-1.5 md:py-3 border border-gray-300 rounded-lg text-xs md:text-base"
              >
                <option value="">Select Nationality</option>
                <option value="Emirati">Emirati</option>
                <option value="Indian">Indian</option>
              </select>
            </div>

            {/* Search Button */}
            <Button 
              className="w-full py-1.5 md:py-3 text-xs md:text-base" 
              onClick={handleSearch}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                'Search'
              )}
            </Button>
          </div>
        </section>



        {/* Hotels */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            
            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2 text-lg">Loading hotels...</span>
              </div>
            )}

            {/* Error State */}
            {isError && (
              <div className="text-center py-12">
                <p className="text-red-600 text-lg mb-4">
                  {error?.message || 'Error loading hotels. Please try again.'}
                </p>
                <Button onClick={() => refetch()}>
                  Try Again
                </Button>
              </div>
            )}

            {/* No Results */}
            {!isLoading && !isError && hotels.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg mb-4">No hotels available at the moment.</p>
                <Button onClick={() => refetch()}>
                  Refresh
                </Button>
              </div>
            )}

            {/* Results Header */}
            {!isLoading && !isError && hotels.length > 0 && (
              <div className="mb-6">
                <p className="text-gray-600">
                  {hasSearched 
                    ? `Found ${totalResults} hotel${totalResults !== 1 ? 's' : ''} matching your criteria`
                    : `Showing ${hotels.length} hotel${hotels.length !== 1 ? 's' : ''}`
                  }
                </p>
              </div>
            )}

            {/* Hotels Grid */}
            {!isLoading && !isError && hotels.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {hotels.map((hotel) => {
                  const originalPrice = getOriginalPrice(hotel);
                  const savingsPercentage = getSavingsPercentage(hotel);
                  
                  return (
                    <div key={hotel.id} className="overflow-hidden bg-card rounded-lg shadow hover:shadow-lg flex flex-col transition-all duration-300 animate-scale-in">
                      <div className="relative">
                        <img 
                          src={getHotelImage(hotel)} 
                          alt={hotel.name} 
                          className="w-full h-36 sm:h-40 md:h-48 object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                        
                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          {hotel.isFlashSale && hotel.flashSaleText && (
                            <span className="bg-red-500 text-white text-[9px] sm:text-xs px-2 py-1 rounded font-medium">
                              🔥 {hotel.flashSaleText}
                            </span>
                          )}
                          {isAgent && hotel.agentPrice && hotel.agentPrice > 0 && (
                            <span className="bg-blue-500 text-white text-[9px] sm:text-xs px-2 py-1 rounded font-medium">
                              Agent Price
                            </span>
                          )}
                          {savingsPercentage > 0 && (
                            <span className="bg-green-600 text-white text-[9px] sm:text-xs px-2 py-1 rounded font-medium">
                              {savingsPercentage}% OFF
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col flex-1 p-3 sm:p-4">
                        <div className="flex-1">
                          <h4 className="mb-1 font-semibold text-[12px] sm:text-sm md:text-base leading-tight">
                            {hotel.name}
                          </h4>
                          <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 mb-1">
                            {hotel.location} | {hotel.category}
                          </p>
                          <div className="mb-2">
                            {renderStars(hotel.rating)}
                          </div>
                        </div>
                        <div className="flex items-end justify-between mt-auto pt-2">
                          <div className="flex flex-col justify-end items-start text-left">
                            <span className="whitespace-nowrap text-[9px] sm:text-xs text-gray-500">Per Night</span>
                            <div className="flex flex-col gap-1">
                              {originalPrice && (
                                <span className="text-[10px] sm:text-xs text-gray-500 line-through">
                                  {originalPrice}
                                </span>
                              )}
                              <span className="font-bold text-xl text-blue-600">
                                {getHotelDisplayPrice(hotel)}
                              </span>
                            </div>
                          </div>
                          <Button 
                            className="h-9 px-4 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                            onClick={() => {
                              setSelectedHotel(hotel);
                              setShowInternalPage(true);
                            }}
                          >
                            Add to cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Load More Button (if pagination is needed) */}
            {!isLoading && !isError && hotels.length > 0 && hotelResponse?.totalPages && hotelResponse.totalPages > 1 && (
              <div className="text-center mt-8">
                <Button 
                  variant="outline"
                  onClick={() => {
                    updateSearchParams({
                      ...searchParams,
                      page: (searchParams.page || 1) + 1
                    });
                  }}
                  disabled={searchParams.page >= hotelResponse.totalPages}
                >
                  Load More Hotels
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  Page {searchParams.page || 1} of {hotelResponse.totalPages}
                </p>
              </div>
            )}
          </div>
        </section>

      </main>
      <Footer />
      </>
      )}
    </div>
  );
};

export default Hotels;