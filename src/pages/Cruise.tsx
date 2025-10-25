"use client";
import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Search, Anchor, Calendar, Users, Star, Loader2 } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCruises, useCruiseSearchState } from "@/hooks/useCruises";
import { useSliders } from "@/hooks/useSliders";
import { DynamicSlider } from "@/components/ui/DynamicSlider";
import InternalPageLayout from "./InternalPageLayout";

const Cruise = () => {
  // Use the custom search state hook
  const { searchParams, hasSearched, updateSearchParams, resetSearch } = useCruiseSearchState();
  
  // Fetch cruises data using React Query
  const { 
    data: cruiseResponse, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useCruises(searchParams); // Always load data

  // Fetch slider data for cruise page
  const { 
    data: slidersResponse, 
    isLoading: slidersLoading, 
    error: slidersError 
  } = useSliders({ page: 'cruise', limit: 5 });

  // Currency context
  const { convertAmount, formatAmount, currentCurrency } = useCurrency();
  const { isAgent } = useAuth();

  // Local state for form inputs
  const [formData, setFormData] = useState({
    searchQuery: "",
    departure: "",
    destination: "",
    duration: "",
    category: "",
    minRating: 0,
  });

  // State for internal page
  const [showInternalPage, setShowInternalPage] = useState(false);
  const [selectedCruise, setSelectedCruise] = useState<any>(null);

  // Get cruises from response or default empty array
  const cruises = cruiseResponse?.cruises || [];
  const totalResults = cruiseResponse?.total || 0;

  const cruiseSuggestions = [
    "Dubai Marina Cruise", "Abu Dhabi Yacht Charter", "Musandam Cruise", "Dhow Cruise Dubai",
    "Dinner Cruise Dubai", "Sunset Cruise", "Luxury Yacht Dubai", "Creek Cruise",
    "Persian Gulf Cruise", "Oman Fjords Cruise", "Red Sea Cruise", "Mediterranean Cruise",
    "Private Yacht Charter", "Catamaran Cruise", "Speed Boat Tour"
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

  // Handle rating filter
  const handleRatingFilter = (rating: number) => {
    const newRating = formData.minRating === rating ? 0 : rating;
    handleInputChange('minRating', newRating);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setFormData({
      searchQuery: "",
      departure: "",
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

  // Get cruise display price based on currency
  const getCruiseDisplayPrice = (cruise: any) => {
    const price = isAgent && cruise.agentPrice ? cruise.agentPrice : cruise.price;
    const convertedPrice = convertAmount(price, 'AED', currentCurrency);
    return formatAmount(convertedPrice, currentCurrency);
  };

  // Get cruise image
  const getCruiseImage = (cruise: any) => {
    return cruise.image || cruise.images?.[0] || '/placeholder.svg';
  };

  return (
    <div className="min-h-screen bg-background">
      {showInternalPage ? (
        <InternalPageLayout
          title={selectedCruise?.name || "Cruise Details"}
          description="Embark on an unforgettable journey across pristine waters with our luxury cruise experiences."
          item={selectedCruise}
          onClose={() => {
            setShowInternalPage(false);
            setSelectedCruise(null);
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
            className="mb-0"
          />
        )}

 
        {/* Search Section */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="relative">
                <label className="text-xs font-medium text-foreground block mb-1">
                  Search Cruises
                </label>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search cruises..."
                  value={formData.searchQuery}
                  onChange={(e) => handleInputChange('searchQuery', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  Departure
                </label>
                <select
                  value={formData.departure}
                  onChange={(e) => handleInputChange('departure', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                >
                  <option value="">All Departures</option>
                  <option value="Dubai Marina">Dubai Marina</option>
                  <option value="Abu Dhabi">Abu Dhabi</option>
                  <option value="Musandam">Musandam</option>
                  <option value="Doha">Doha</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  Destination
                </label>
                <select
                  value={formData.destination}
                  onChange={(e) => handleInputChange('destination', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                >
                  <option value="">All Destinations</option>
                  <option value="Mediterranean">Mediterranean</option>
                  <option value="Caribbean">Caribbean</option>
                  <option value="Arabian Gulf">Arabian Gulf</option>
                  <option value="Red Sea">Red Sea</option>
                  <option value="Oman Fjords">Oman Fjords</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  Duration
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                >
                  <option value="">Any Duration</option>
                  <option value="2-3 Hours">2-3 Hours</option>
                  <option value="Half Day">Half Day</option>
                  <option value="Full Day">Full Day</option>
                  <option value="Multi-Day">Multi-Day</option>
                </select>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRatingFilter(star)}
                  className={`w-8 h-8 flex items-center justify-center rounded-full border transition ${formData.minRating >= star ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-700"
                    }`}
                >
                  <Star className={`h-4 w-4 ${formData.minRating >= star ? "fill-white" : ""}`} />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">Minimum Rating</span>
            </div>

            <Button 
              className="mt-4 px-6 py-3"
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
                  <Anchor className="h-5 w-5 mr-2" />
                  Search Cruises
                </>
              )}
            </Button>
          </div>
        </section>

        {/* Cruises Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Available Cruises</h2>
            
            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2 text-lg">Loading cruises...</span>
              </div>
            )}

            {/* Error State */}
            {isError && (
              <div className="text-center py-12">
                <p className="text-red-600 text-lg mb-4">
                  {error?.message || 'Error loading cruises. Please try again.'}
                </p>
                <Button onClick={() => refetch()}>
                  Try Again
                </Button>
              </div>
            )}

            {/* No Results */}
            {!isLoading && !isError && cruises.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg mb-4">No cruises available at the moment.</p>
                <Button onClick={() => refetch()}>
                  Refresh
                </Button>
              </div>
            )}

            {/* Results Header */}
            {!isLoading && !isError && cruises.length > 0 && (
              <div className="mb-6">
                <p className="text-gray-600 text-center">
                  {hasSearched 
                    ? `Found ${totalResults} cruise${totalResults !== 1 ? 's' : ''} matching your criteria`
                    : `Showing ${cruises.length} cruise${cruises.length !== 1 ? 's' : ''}`
                  }
                </p>
              </div>
            )}

            {/* Cruises Grid */}
            {!isLoading && !isError && cruises.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {cruises.map((cruise) => (
                  <div
                    key={cruise.id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <div className="relative h-48">
                      <img 
                        src={getCruiseImage(cruise)} 
                        alt={cruise.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                      <div className="absolute top-4 right-4 bg-white/90 px-2 py-1 rounded-full">
                        {renderStars(cruise.rating)}
                      </div>
                      {cruise.isFlashSale && cruise.flashSaleText && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                          🔥 {cruise.flashSaleText}
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{cruise.name}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{cruise.description}</p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          {cruise.duration}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Anchor className="h-4 w-4 mr-2" />
                          {cruise.departure} → {cruise.destination}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-primary">
                            {getCruiseDisplayPrice(cruise)}
                          </span>
                          <span className="text-sm text-gray-500 ml-2">per person</span>
                        </div>
                        
                        <Button 
                          size="sm"
                          onClick={() => {
                            setSelectedCruise(cruise);
                            setShowInternalPage(true);
                          }}
                        >
                          Add to cart
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Load More Button (if pagination is needed) */}
            {!isLoading && !isError && cruises.length > 0 && cruiseResponse?.totalPages && cruiseResponse.totalPages > 1 && (
              <div className="text-center mt-8">
                <Button 
                  variant="outline"
                  onClick={() => {
                    updateSearchParams({
                      ...searchParams,
                      page: (searchParams.page || 1) + 1
                    });
                  }}
                  disabled={searchParams.page >= cruiseResponse.totalPages}
                >
                  Load More Cruises
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  Page {searchParams.page || 1} of {cruiseResponse.totalPages}
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

export default Cruise;
