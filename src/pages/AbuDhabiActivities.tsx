import { useState, useEffect, useMemo } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useActivities } from "@/hooks/useActivities";
import { useSliders } from "@/hooks/useSliders";
import { useCards } from "@/hooks/useCards";
import { DynamicSlider } from "@/components/ui/DynamicSlider";
import DynamicCards from "@/components/DynamicCards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Star, Heart, Search, Loader2 } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useAuth } from "@/contexts/AuthContext";
import InternalPageLayout from "./InternalPageLayout";



export default function AbuDhabiActivities() {
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("most-popular");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedActivity, setSelectedActivity] = useState<any | null>(null);

  // Hooks
  const { data: activitiesResponse, isLoading, error } = useActivities({
    location: "Abu Dhabi",
    limit: 50
  });
  // Sliders (not used for cards)
  const { 
    data: slidersResponse, 
    isLoading: slidersLoading, 
    error: slidersError 
  } = useSliders({ page: 'activities', limit: 5 });

  // Cards: Only show cards for Abu Dhabi using correct backend filter
  const { 
    data: cardsResponse, 
    isLoading: cardsLoading, 
    error: cardsError 
  } = useCards({ page: 'abu_dhabi', limit: 8 });
  const { convertAmount, formatAmount, currentCurrency } = useCurrency();
  const { user } = useAuth();

  const isAgent = user?.role === "agent";

  // Extract activities and sliders from response
  const activities = activitiesResponse?.activities || [];
  const sliders = slidersResponse?.slides || [];

  // Hero background images carousel
  

 

  // Activity categories
  const categories = [
    "All Categories",
    "Cultural Tours",
    "Adventure Sports", 
    "Theme Parks",
    "Museums",
    "Water Activities",
    "Desert Experiences",
    "City Tours",
  ];

  // Filter activities by Abu Dhabi location
  const abuDhabiActivities = useMemo(() => {
    return activities.filter(activity => 
      activity.location?.toLowerCase().includes('abu dhabi') ||
      activity.location?.toLowerCase().includes('abu-dhabi') ||
      activity.name?.toLowerCase().includes('abu dhabi')
    );
  }, [activities]);

  // Filtered and sorted activities
  const filteredActivities = useMemo(() => {
    if (!abuDhabiActivities) return [];
    
    let result = [...abuDhabiActivities];

    // Filter by search query
    if (searchQuery) {
      result = result.filter(activity =>
        activity.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== "All Categories") {
      result = result.filter(activity =>
        activity.category?.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // Filter by price range
    result = result.filter(activity =>
      activity.price >= priceRange[0] && activity.price <= priceRange[1]
    );

    // Sort activities
    switch (sortBy) {
      case "low-to-high":
        result.sort((a, b) => a.price - b.price);
        break;
      case "high-to-low":
        result.sort((a, b) => b.price - a.price);
        break;
      case "most-popular":
      default:
        result.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
        break;
    }

    return result;
  }, [abuDhabiActivities, searchQuery, selectedCategory, priceRange, sortBy]);

  // Get activity display price
  const getActivityDisplayPrice = (activity: any) => {
    const price = isAgent && activity.agentPrice ? activity.agentPrice : activity.price;
    const convertedPrice = convertAmount(price, 'AED', currentCurrency);
    return formatAmount(convertedPrice, currentCurrency);
  };

  // Helper function for price formatting
  const formatPrice = (price: number) => {
    const convertedPrice = convertAmount(price, 'AED', currentCurrency);
    return formatAmount(convertedPrice, currentCurrency);
  };

  // Search handler
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (value) {
      const filtered = abuDhabiActivities
        .filter((activity) =>
          activity.name?.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 5)
        .map((activity) => activity.name);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setSuggestions([]);
  };

  // Internal page handlers
  const openInternalPage = (activity: any) => {
    setSelectedActivity(activity);
  };

  const closeInternalPage = () => {
    setSelectedActivity(null);
  };

  // Render internal page if activity selected
  if (selectedActivity) {
    return (
      <InternalPageLayout
        heroImage={selectedActivity.image}
        title={selectedActivity.name}
        description={selectedActivity.description}
        item={selectedActivity}
        onClose={closeInternalPage}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading Abu Dhabi activities...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading activities</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section with Dynamic Slider */}
      {!slidersLoading && !slidersError && slidersResponse?.slides && slidersResponse.slides.length > 0 ? (
        <DynamicSlider 
          slides={slidersResponse.slides}
          height="500px"
          autoplay={true}
          autoplayDelay={4000}
          showDots={true}
          showArrows={true}
          className="mb-0"
        />
      ) : (
        <section className="relative h-[500px] overflow-hidden">
         
         
          
          <div className="relative z-10 flex items-center justify-center h-full text-white">
          <div className="text-center max-w-4xl mx-auto px-4">
            <h1 className="text-5xl font-bold mb-6">Discover Abu Dhabi</h1>
            <p className="text-xl mb-8 text-gray-200">
              Experience the cultural capital of UAE with world-class attractions
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search Abu Dhabi activities..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 pr-4 py-3 bg-white/90 backdrop-blur-sm border-0 rounded-full text-gray-800"
                />
              </div>
              
              {suggestions.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg z-20">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Carousel Dots */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        
        </div>
      </section>
      )}

      {/* Filters Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort Filter */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="most-popular">Most Popular</SelectItem>
                  <SelectItem value="low-to-high">Price: Low to High</SelectItem>
                  <SelectItem value="high-to-low">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>

              {/* Price Range */}
              <div className="flex items-center gap-2 min-w-[200px]">
                <span className="text-sm text-gray-600">Price Range:</span>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={500}
                  min={0}
                  step={10}
                  className="flex-1"
                />
                <span className="text-sm font-medium">
                  ${priceRange[0]} - ${priceRange[1]}
                </span>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              {filteredActivities.length} activities found
            </div>
          </div>
        </div>
      </section>

      {/* Activities Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Abu Dhabi Activities</h2>
          
          {/* Cards Section */}
          {cardsResponse?.cards && cardsResponse.cards.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-6">Featured Abu Dhabi Experiences</h3>
              <DynamicCards 
                cards={cardsResponse.cards}
                onCardClick={(card) => {
                  // Handle card click for viewing details
                  setSelectedActivity({
                    id: card.id,
                    name: card.title,
                    description: card.description,
                    price: card.originalPrice,
                    agentPrice: card.agentPrice,
                    discountedPrice: card.discountedPrice,
                    image: card.images?.[0]?.url || "/placeholder.svg",
                    images: card.images?.map(img => img.url) || [],
                    location: "Abu Dhabi",
                    category: "Featured Experience",
                    isPopular: card.isFlashSaleAvailable,
                    rating: 4.5
                  });
                }}
                onAddToCart={(card) => {
                  // Handle add to cart - open internal page layout with card details
                  setSelectedActivity({
                    id: card.id,
                    name: card.title,
                    description: card.description,
                    price: card.originalPrice,
                    agentPrice: card.agentPrice,
                    discountedPrice: card.discountedPrice,
                    image: card.images?.[0]?.url || "/placeholder.svg",
                    images: card.images?.map(img => img.url) || [],
                    location: "Abu Dhabi",
                    category: "Featured Experience",
                    isPopular: card.isFlashSaleAvailable,
                    isFlashSale: card.isFlashSaleAvailable,
                    flashSaleText: card.flashSaleText,
                    rating: 4.5,
                    duration: "Full Day",
                    pageType: card.pageType,
                    subPageType: card.subPageType
                  });
                }}
              />
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredActivities.map((activity) => (
              <Card key={activity.id} className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
                <div className="relative">
                  <img
                    src={activity.image || "/placeholder.svg"}
                    alt={activity.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex gap-1">
                    {activity.isPopular && (
                      <Badge className="bg-red-500 text-white">Popular</Badge>
                    )}
                    {isAgent && activity.agentPrice && (
                      <Badge className="bg-blue-500 text-white">Agent Price</Badge>
                    )}
                  </div>

                  {/* Favorite Button */}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg line-clamp-1 mb-2">
                    {activity.name}
                  </h3>

                  {/* Rating */}
                  {activity.rating && (
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{activity.rating}</span>
                      <span className="text-sm text-gray-500">
                        (0 reviews)
                      </span>
                    </div>
                  )}

                  {/* Category */}
                  <div className="text-sm text-gray-600 mb-3">
                    {activity.category}
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-primary">
                        {getActivityDisplayPrice(activity)}
                      </span>
                      {activity.agentPrice && isAgent && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(activity.price)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      openInternalPage(activity);
                    }}
                    className="h-7 px-2 sm:h-9 sm:px-4 text-[10px] sm:text-sm bg-primary hover:bg-primary-glow"
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {filteredActivities.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">No activities found</h3>
                <p>Try adjusting your search criteria</p>
              </div>
              <Button 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All Categories");
                  setPriceRange([0, 500]);
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}