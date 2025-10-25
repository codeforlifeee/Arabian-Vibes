"use client";
import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, MapPin, Filter, Star, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useAuth } from "@/contexts/AuthContext";
import { useActivities, useActivitySearchState } from "@/hooks/useActivities";
import { useSliders } from "@/hooks/useSliders";
import { useCards } from "@/hooks/useCards";
import { DynamicSlider } from "@/components/ui/DynamicSlider";
import { DynamicCards } from "@/components/DynamicCards";
import InternalPageLayout from "./InternalPageLayout";

const Activities = () => {
  // Use the custom search state hook
  const { searchParams, hasSearched, updateSearchParams, resetSearch } = useActivitySearchState();
  
  // Fetch activities data using React Query
  const { 
    data: activityResponse, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useActivities(searchParams); // Always load data

  // Fetch slider data for activities page
  const { 
    data: slidersResponse, 
    isLoading: slidersLoading, 
    error: slidersError 
  } = useSliders({ page: 'activities', limit: 5 });

  // Fetch cards data for activities page
  const { 
    data: cardsResponse, 
    isLoading: cardsLoading, 
    error: cardsError 
  } = useCards({ page: 'activities', limit: 12 });

  // Currency context
  const { convertAmount, formatAmount, currentCurrency } = useCurrency();
  const { isAgent } = useAuth();

  // Local state for form inputs
  const [formData, setFormData] = useState({
    searchQuery: "",
    location: "",
    duration: "",
    category: "",
    minRating: 0,
  });

  const [suggestions, setSuggestions] = useState<string[]>([]);

  // State for internal page
  const [showInternalPage, setShowInternalPage] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  // Get activities from response or default empty array
  const activities = activityResponse?.activities || [];
  const totalResults = activityResponse?.total || 0;

  const activitySuggestions = [
    "Burj Khalifa", "Desert Safari", "Dubai Mall", "Ferrari World", "Louvre Abu Dhabi",
    "Palm Jumeirah", "Dubai Marina", "Sheikh Zayed Mosque", "Al Ain Zoo", "Atlantis Aquaventure",
    "Ski Dubai", "Dubai Fountain", "Gold Souk", "Spice Souk", "Jebel Jais", "Warner Bros World",
    "Yas Waterworld", "IMG Worlds", "Global Village", "Dubai Miracle Garden"
  ];

 

  const [currentImageIndex, setCurrentImageIndex] = useState(0);



  const locations = ["All Locations", "Dubai", "Abu Dhabi", "Al Ain", "Sharjah", "Ras Al Khaimah"];
  const categories = ["All Categories", "Cultural", "Adventure", "Water Activities", "Family Fun"];
  const durations = ["All Durations", "1-2 Hours", "3-4 Hours", "Half Day", "Full Day"];

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
      const filtered = activitySuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
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
      location: "",
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

  // Get activity display price based on currency
  const getActivityDisplayPrice = (activity: any) => {
    const price = isAgent && activity.agentPrice ? activity.agentPrice : activity.price;
    const convertedPrice = convertAmount(price, 'AED', currentCurrency);
    return formatAmount(convertedPrice, currentCurrency);
  };

  // Get activity image
  const getActivityImage = (activity: any) => {
    return activity.image || activity.images?.[0] || '/placeholder.svg';
  };

  return (
    <div className="min-h-screen bg-background">
      {showInternalPage ? (
        <InternalPageLayout
          title={selectedActivity?.name || "Activity Details"}
          description="Experience the best that the Middle East has to offer with our carefully curated activities."
          item={selectedActivity}
          onClose={() => {
            setShowInternalPage(false);
            setSelectedActivity(null);
          }}
        />
      ) : (
        <>
          <Header />
          <main className="pt-0">
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
        <div className="bg-gradient-to-b from-primary/5 to-white py-10">
          <div className="max-w-6xl mx-auto px-4">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-primary/10">
              <div className="flex items-center justify-center mb-6">
                <Search className="h-6 w-6 text-primary mr-3" />
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">Find Your Perfect Activity</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="relative">
                  <label className="text-xs sm:text-sm font-semibold text-foreground block mb-2">
                    What are you looking for?
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search activities..."
                      value={formData.searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="text-sm font-medium text-foreground w-full pr-10 border-2 focus:border-primary"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  {suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white border-2 border-primary/20 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto mt-2">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            handleInputChange('searchQuery', suggestion);
                            setSuggestions([]);
                          }}
                          className="w-full px-4 py-3 text-left text-sm hover:bg-primary/10 transition-colors border-b border-gray-100 last:border-0"
                        >
                          <Search className="inline h-3 w-3 mr-2 text-primary" />
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Location Filter */}
                <div>
                  <label className="text-xs sm:text-sm font-semibold text-foreground block mb-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-primary" />
                    Location
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    {locations.map((location) => (
                      <option key={location} value={location === "All Locations" ? "" : location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="text-xs sm:text-sm font-semibold text-foreground block mb-2 flex items-center">
                    <Filter className="h-4 w-4 mr-1 text-primary" />
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category === "All Categories" ? "" : category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="text-sm font-semibold text-foreground flex items-center">
                  <Star className="h-4 w-4 mr-2 text-primary" />
                  Minimum Rating:
                </span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRatingFilter(star)}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg border-2 transition-all transform hover:scale-110 ${formData.minRating >= star 
                      ? "bg-orange-500 text-white border-orange-500 shadow-md" 
                      : "bg-white text-gray-400 border-gray-300 hover:border-orange-300"
                    }`}
                  >
                    <Star className={`h-4 w-4 ${formData.minRating >= star ? "fill-white" : ""}`} />
                  </button>
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                <Button 
                  className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-6 text-base shadow-lg hover:shadow-xl transition-all"
                  onClick={handleSearch}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Search Activities
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline"
                  className="px-6 py-6 border-2 hover:bg-red-50 hover:border-red-300 transition-all"
                  onClick={handleResetFilters}
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Backend Cards Section */}
        {!cardsLoading && !cardsError && cardsResponse?.cards && cardsResponse.cards.length > 0 && (
          <div className="py-8 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">Featured Activities</h3>
                <p className="text-muted-foreground">Handpicked experiences from our collection</p>
              </div>
              <DynamicCards 
                cards={cardsResponse.cards}
                onAddToCart={(card) => {
                  setSelectedActivity(card);
                  setShowInternalPage(true);
                }}
              />
            </div>
          </div>
        )}

        <div className="py-8 sm:py-12">
          <div className="text-center py-8">
            <div className="container mx-auto px-4">
              <h3 className="text-xl sm:text-3xl font-bold text-foreground mb-2 sm:mb-4">All Activities & Experiences</h3>
              <p className="text-xs sm:text-base text-muted-foreground max-w-2xl mx-auto">
                Discover amazing activities and experiences across the Middle East. From cultural attractions to thrilling adventures, find your perfect experience.
              </p>

              {/* Loading State */}
              {isLoading && (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2 text-lg">Loading activities...</span>
                </div>
              )}

              {/* Error State */}
              {isError && (
                <div className="text-center py-12">
                  <p className="text-red-600 text-lg mb-4">
                    {error?.message || 'Error loading activities. Please try again.'}
                  </p>
                  <Button onClick={() => refetch()}>
                    Try Again
                  </Button>
                </div>
              )}

              {/* No Results */}
              {!isLoading && !isError && activities.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg mb-4">No activities available at the moment.</p>
                  <Button onClick={() => refetch()}>
                    Refresh
                  </Button>
                </div>
              )}

              {/* Results Header */}
              {!isLoading && !isError && activities.length > 0 && (
                <div className="mb-6">
                  <p className="text-gray-600">
                    {hasSearched 
                      ? `Found ${totalResults} activit${totalResults !== 1 ? 'ies' : 'y'} matching your criteria`
                      : `Showing ${activities.length} activit${activities.length !== 1 ? 'ies' : 'y'}`
                    }
                  </p>
                </div>
              )}

              {/* Activities Grid */}
              {!isLoading && !isError && activities.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
                  {activities.map((activity, index) => (
                    <div
                      key={activity.id}
                      className="overflow-hidden bg-card rounded-lg shadow hover:shadow-lg flex flex-col transition-all duration-300 animate-scale-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={getActivityImage(activity)}
                          alt={activity.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />

                        {activity.isFlashSale && activity.flashSaleText && (
                          <Badge
                            variant="secondary"
                            className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-destructive text-destructive-foreground text-[9px] sm:text-xs"
                          >
                            🔥 {activity.flashSaleText}
                          </Badge>
                        )}
                      </div>
                      <div className="p-3 sm:p-4 flex flex-col flex-grow justify-between">
                        <div>
                          <h3 className="font-semibold text-sm sm:text-lg mb-1 sm:mb-2">
                            {activity.name}
                          </h3>
                          <p className="text-xs text-gray-500 mb-1">
                            {activity.location} | {activity.duration}
                          </p>
                          <div className="mb-2">
                            {renderStars(activity.rating)}
                          </div>
                        </div>

                        <div className="flex items-end justify-between mt-auto">
                          <div className="flex flex-col justify-end">
                            <span className="whitespace-nowrap text-[9px] sm:text-xs text-muted-foreground">
                              Per Person from
                            </span>

                            <div className="flex items-end gap-1 sm:gap-2">
                              <span className="text-sm sm:text-xl font-bold text-primary">
                                {getActivityDisplayPrice(activity)}
                              </span>
                            </div>
                          </div>

                          <Button 
                            className="h-7 px-2 sm:h-9 sm:px-4 text-[10px] sm:text-sm bg-primary hover:bg-primary-glow"
                            onClick={() => {
                              setSelectedActivity(activity);
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
              {!isLoading && !isError && activities.length > 0 && activityResponse?.totalPages && activityResponse.totalPages > 1 && (
                <div className="text-center mt-8">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      updateSearchParams({
                        ...searchParams,
                        page: (searchParams.page || 1) + 1
                      });
                    }}
                    disabled={searchParams.page >= activityResponse.totalPages}
                  >
                    Load More Activities
                  </Button>
                  <p className="text-sm text-gray-500 mt-2">
                    Page {searchParams.page || 1} of {activityResponse.totalPages}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      </>
      )}
    </div>
  );
};
export default Activities;