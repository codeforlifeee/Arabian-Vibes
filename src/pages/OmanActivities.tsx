import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useActivities } from "@/hooks/useActivities";
import { useSliders } from "@/hooks/useSliders";
import { useCards } from "@/hooks/useCards";
import { DynamicSlider } from "@/components/ui/DynamicSlider";
import DynamicCards from "@/components/DynamicCards";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useAuth } from "@/contexts/AuthContext";
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
import { Star, Search } from "lucide-react";
import InternalPageLayout from "./InternalPageLayout";

const OmanActivitiesPage = () => {
  const [searchParams] = useSearchParams();
  const fromLocation = searchParams.get('from');
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <OmanActivitiesContent fromLocation={fromLocation} />
      <Footer />
    </div>
  );
};

const OmanActivitiesContent = ({ fromLocation }: { fromLocation: string | null }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("most-popular");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<any | null>(null);
  
  const { convertAmount, formatAmount, currentCurrency } = useCurrency();
  const { isAgent } = useAuth();

  // Fetch slider data for Oman activities page
  const { 
    data: slidersResponse, 
    isLoading: slidersLoading, 
    error: slidersError 
  } = useSliders({ page: 'omanactivities', limit: 5 });

  // Fetch cards data for Oman activities page
  const { 
    data: cardsResponse, 
    isLoading: cardsLoading, 
    error: cardsError 
  } = useCards({ page: 'omanactivities', limit: 8 });

  // Fetch activities from API with Oman location filter
  const { data: activitiesResponse, isLoading, error } = useActivities({
    location: 'Oman',
    searchQuery: searchQuery || undefined,
    category: selectedCategory || undefined,
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    limit: 50
  });

  const activities = activitiesResponse?.activities || [];

  // Helper function to get activity price based on user type and currency
  const getDisplayPrice = (activity: any) => {
    const price = isAgent && activity.agentPrice ? activity.agentPrice : activity.price;
    const convertedPrice = convertAmount(price, 'AED', currentCurrency);
    return formatAmount(convertedPrice, currentCurrency);
  };

  // Helper function for price formatting
  const formatPrice = (price: number) => {
    const convertedPrice = convertAmount(price, 'AED', currentCurrency);
    return formatAmount(convertedPrice, currentCurrency);
  };

  // Handler functions for InternalPageLayout
  const openInternalPage = (activity: any) => {
    setSelectedActivity(activity);
  };

  const closeInternalPage = () => {
    setSelectedActivity(null);
  };

  // Activity categories for Oman
  const categories = [
    { id: "city-tours", name: "City Tours", image: "https://d1i3enf1i5tb1f.cloudfront.net/CategoryType-Images/41904/download%20(3).jpg" },
    { id: "desert-safari", name: "Desert Safari Tours", image: "https://d1i3enf1i5tb1f.cloudfront.net/CategoryType-Images/41903/54.jpg" },
    { id: "culture-attractions", name: "Culture and Attractions", image: "https://d1i3enf1i5tb1f.cloudfront.net/CategoryType-Images/43105/download%20(4).jpg" },
    { id: "adventure-tours", name: "Adventure Tours", image: "https://d1i3enf1i5tb1f.cloudfront.net/CategoryType-Images/43648/download%20(1).jpg" },
    { id: "water-activities", name: "Water Activities", image: "https://d1i3enf1i5tb1f.cloudfront.net/CategoryType-Images/41907/download%20(14).jpg" },
    { id: "heritage-tours", name: "Heritage Tours", image: "https://d1i3enf1i5tb1f.cloudfront.net/CategoryType-Images/heritage/heritage.jpg" },
  ];

  // Helper functions for agent pricing and savings
  const getSavingsPercentage = (activity: any) => {
    const agentPrice = activity.agentPrice ? Number(activity.agentPrice) : null;
    const normalPrice = Number(activity.price);
    const discountedPrice = activity.discountedPrice ? Number(activity.discountedPrice) : null;

    if (isAgent && agentPrice && normalPrice) {
      return Math.round(((normalPrice - agentPrice) / normalPrice) * 100);
    } else if (!isAgent && discountedPrice && normalPrice && discountedPrice !== normalPrice) {
      return Math.round(((normalPrice - discountedPrice) / normalPrice) * 100);
    }
    return 0;
  };

  const shouldShowOriginalPrice = (activity: any) => {
    const agentPrice = activity.agentPrice ? Number(activity.agentPrice) : null;
    const normalPrice = Number(activity.price);
    const discountedPrice = activity.discountedPrice ? Number(activity.discountedPrice) : null;

    if (isAgent && agentPrice) {
      return normalPrice > agentPrice;
    }
    return discountedPrice && normalPrice > discountedPrice;
  };

  const filteredActivities = useMemo(() => {
    let result = activities.filter(activity => {
      const matchesSearch = activity.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || activity.category === selectedCategory;
      
      // Use agentPrice if agent, otherwise normal price
      const priceToUse = isAgent && activity.agentPrice ? Number(activity.agentPrice) : Number(activity.price);
      const matchesPrice = priceToUse >= priceRange[0] && priceToUse <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

    if (sortBy === "price-low") {
      result.sort((a, b) => {
        const priceA = isAgent && a.agentPrice ? Number(a.agentPrice) : Number(a.price);
        const priceB = isAgent && b.agentPrice ? Number(b.agentPrice) : Number(b.price);
        return priceA - priceB;
      });
    } else if (sortBy === "price-high") {
      result.sort((a, b) => {
        const priceA = isAgent && a.agentPrice ? Number(a.agentPrice) : Number(a.price);
        const priceB = isAgent && b.agentPrice ? Number(b.agentPrice) : Number(b.price);
        return priceB - priceA;
      });
    } else if (sortBy === "top-rated") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "recommended") {
      result = result.filter((a) => a.isPopular);
    }

    return result;
  }, [activities, searchQuery, selectedCategory, priceRange, sortBy, isAgent]);

  // Render InternalPageLayout if activity is selected
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

  return (
    <main className="pt-0">
      {/* Hero Section with Dynamic Slider */}
      {slidersLoading ? (
        <div className="relative h-[400px] bg-muted animate-pulse flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading Oman Activities Slider...</p>
          </div>
        </div>
      ) : slidersError ? (
        <div className="relative h-[400px] bg-muted flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p>Unable to load slider content</p>
          </div>
        </div>
      ) : slidersResponse?.slides && slidersResponse.slides.length > 0 ? (
        <div className="relative">
          <DynamicSlider 
            slides={slidersResponse.slides}
            height="400px"
          />
          {/* Overlay Content */}
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <div className="text-center text-white max-w-4xl mx-auto px-4 pointer-events-auto">
             
              {fromLocation && (
                <p className="text-lg mb-6">Searched from: {fromLocation}</p>
              )}
              
              {/* Search Bar */}
              <div className="bg-white rounded-lg p-4 shadow-lg max-w-2xl mx-auto">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="Search Activities"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="border-0 focus:ring-0 text-black"
                    />
                  </div>
                  <Button className="bg-primary hover:bg-travel-orange/90 text-white">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative h-[400px] bg-gradient-to-r from-green-600 to-teal-800 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-4">
           
            {fromLocation && (
              <p className="text-lg mb-6">Searched from: {fromLocation}</p>
            )}
            <p className="text-lg mb-6">No slider content available for Oman Activities</p>
          </div>
        </div>
      )}
 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
              className={`text-center p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                selectedCategory === category.id
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-16 h-16 mx-auto mb-2 rounded-full object-cover"
              />
              <p className="text-xs font-medium">{category.name}</p>
            </button>
          ))}
        </div>

      
        {/* Description */}
        <div className="bg-muted rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold mb-4">Explore Oman</h3>
          <p className="text-muted-foreground">
            Discover the natural beauty and rich heritage of Oman. From pristine beaches and towering mountains to ancient forts and bustling souks, Oman offers authentic Arabian experiences in breathtaking landscapes.
          </p>
        </div>

        {/* Filters and Results */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">{filteredActivities.length} Things to do in Oman</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Sort Result by:</label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="most-popular">Most popular</SelectItem>
                        <SelectItem value="price-low">Price Low to High</SelectItem>
                        <SelectItem value="price-high">Price High to Low</SelectItem>
                        <SelectItem value="top-rated">Top Rated</SelectItem>
                        <SelectItem value="recommended">Recommended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Price Range</label>
                    <div className="px-2">
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        min={0}
                        max={1000}
                        step={10}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{formatPrice(priceRange[0])}</span>
                        <span>{formatPrice(priceRange[1])}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activities Grid */}
          <div className="flex-1">
            {/* Loading State */}
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <Card key={index} className="overflow-hidden animate-pulse">
                    <div className="aspect-[4/3] bg-muted"></div>
                    <CardContent className="p-4">
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-3 bg-muted rounded mb-1"></div>
                      <div className="h-5 bg-muted rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-auto">
                  <h3 className="text-lg font-semibold text-destructive mb-2">
                    Unable to Load Activities
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    There was a problem loading Oman activities. Please try again later.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.reload()}
                     className="h-7 px-2 sm:h-9 sm:px-4 text-[10px] sm:text-sm bg-primary hover:bg-primary-glow"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            )}

            {/* Activities Content */}
            {!isLoading && !error && (
              <>
                {filteredActivities.length === 0 ? (
                  <div className="text-center py-16">
                
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredActivities.map((activity) => (
                      <Card 
                        key={activity.id} 
                        className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer" 
                        onClick={() => openInternalPage(activity)}
                      >
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img
                            src={activity.image || '/placeholder.svg'}
                            alt={activity.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          {activity.isPopular && (
                            <Badge className="absolute top-2 left-2 bg-travel-orange text-white text-xs">
                              Recommended
                            </Badge>
                          )}
                          {getSavingsPercentage(activity) > 0 && (
                            <Badge
                              variant="secondary"
                              className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-xs"
                            >
                              Save {getSavingsPercentage(activity)}%
                            </Badge>
                          )}
                        </div>

                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                            {activity.name}
                          </h3>
                          
                          <div className="flex items-center gap-1 mb-2">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(activity.rating || 0)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-medium">{activity.rating || 0}</span>
                            <span className="text-sm text-muted-foreground">
                              ({activity.rating > 0 ? Math.floor(Math.random() * 200) + 5 : 0} Reviews)
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground">Per Person from</span>
                              {shouldShowOriginalPrice(activity) && (
                                <span className="text-sm text-muted-foreground line-through">
                                  {formatPrice(activity.price)}
                                </span>
                              )}
                              <span className="text-lg font-bold text-primary">
                                {getDisplayPrice(activity)}
                              </span>
                            </div>
                            <Button
                              size="sm"
                              className="h-7 px-2 sm:h-9 sm:px-4 text-[10px] sm:text-sm bg-primary hover:bg-primary-glow"
                              onClick={(e) => {
                                e.stopPropagation();
                                openInternalPage(activity);
                              }}
                            >
                              Add to Cart
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Category Filters */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center mb-8">Things to do in Oman</h2>
        
        {/* Cards Section */}
        {cardsLoading ? (
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-6">Featured Oman Experiences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <Card key={index} className="overflow-hidden animate-pulse">
                  <div className="h-48 bg-muted"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-3 bg-muted rounded mb-1"></div>
                    <div className="h-5 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : cardsError ? (
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-6">Featured Oman Experiences</h3>
            <div className="text-center py-8 bg-muted rounded-lg">
              <p className="text-muted-foreground">Unable to load featured experiences</p>
            </div>
          </div>
        ) : cardsResponse?.cards && cardsResponse.cards.length > 0 ? (
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-6">Featured Oman Experiences</h3>
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
                  location: "Oman",
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
                  location: "Oman",
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
        ) : null}
        
       
       
      </div>
    </main>
  );
};

export default OmanActivitiesPage;