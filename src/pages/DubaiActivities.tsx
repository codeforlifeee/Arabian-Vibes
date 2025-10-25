import { useState, useMemo, useEffect } from "react";
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
import InternalPageLayout from "./InternalPageLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DubaiActivities = () => {
  const [searchParams] = useSearchParams();
  const fromLocation = searchParams.get('from');

  // State for internal page at main component level
  const [showInternalPage, setShowInternalPage] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);

  return (
    <div className="min-h-screen bg-background">
      {showInternalPage ? (
        <InternalPageLayout
          title={selectedActivity?.name || "Dubai Activity Details"}
          description="Discover the best activities and experiences Dubai has to offer."
          item={selectedActivity}
          onClose={() => {
            setShowInternalPage(false);
            setSelectedActivity(null);
          }}
        />
      ) : (
        <>
          <Header />
          <DubaiActivitiesContent 
            fromLocation={fromLocation}
            onActivitySelect={(activity: any) => {
              setSelectedActivity(activity);
              setShowInternalPage(true);
            }}
          />
          <Footer />
        </>
      )}
    </div>
  );
};
import { Slider } from "@/components/ui/slider";
import { Star, Heart, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const DubaiActivitiesPage = () => {
  const [searchParams] = useSearchParams();
  const fromLocation = searchParams.get('from');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <DubaiActivitiesContent 
        fromLocation={fromLocation} 
        onActivitySelect={() => {}} 
      />
      <Footer />
    </div>
  );
};

const DubaiActivitiesContent = ({ 
  fromLocation, 
  onActivitySelect 
}: { 
  fromLocation: string | null;
  onActivitySelect: (activity: any) => void;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("most-popular");
  const [priceRange, setPriceRange] = useState([25, 2500]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const { convertAmount, formatAmount, currentCurrency } = useCurrency();
  const { isAgent } = useAuth();

  // Fetch slider data for Dubai activities page
  const { 
    data: slidersResponse, 
    isLoading: slidersLoading, 
    error: slidersError 
  } = useSliders({ page: 'dubaiactivities', limit: 5 });

  // Fetch cards data for Dubai activities page
  const { 
    data: cardsResponse, 
    isLoading: cardsLoading, 
    error: cardsError 
  } = useCards({ page: 'dubaiactivities', limit: 8 });

  // Fetch activities from API with Dubai location filter
  const { data: activitiesResponse, isLoading, error } = useActivities({
    location: 'Dubai',
    searchQuery: searchQuery || undefined,
    category: selectedCategory || undefined,
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    limit: 50
  });

  const activities = activitiesResponse?.activities || [];

  
 

  // Activity categories for Dubai
  const categories = [
    { id: "burj-khalifa", name: "Burj Khalifa", image: "https://d1i3enf1i5tb1f.cloudfront.net/CategoryType-Images/41901/burj-khalifa.jpg" },
    { id: "desert-safari", name: "Desert Safari Tours", image: "https://d1i3enf1i5tb1f.cloudfront.net/CategoryType-Images/41903/54.jpg" },
    { id: "city-tours", name: "City Tours", image: "https://d1i3enf1i5tb1f.cloudfront.net/CategoryType-Images/41904/download%20(3).jpg" },
    { id: "dhow-cruise", name: "Dhow Cruise", image: "https://d1i3enf1i5tb1f.cloudfront.net/CategoryType-Images/41905/download%20(5).jpg" },
    { id: "water-activities", name: "Water Activities", image: "https://d1i3enf1i5tb1f.cloudfront.net/CategoryType-Images/41907/download%20(14).jpg" },
    { id: "airport-transfers", name: "Airport Transfers", image: "https://d1i3enf1i5tb1f.cloudfront.net/CategoryType-Images/41911/download%20(2).jpg" },
    { id: "water-parks", name: "Water Parks", image: "https://d1i3enf1i5tb1f.cloudfront.net/CategoryType-Images/43023/download%20(15).jpg" },
    { id: "theme-parks", name: "Theme Parks", image: "https://d1i3enf1i5tb1f.cloudfront.net/CategoryType-Images/43068/images%20(4).jpg" },
    { id: "culture-attractions", name: "Culture and Attractions", image: "https://d1i3enf1i5tb1f.cloudfront.net/CategoryType-Images/43105/download%20(4).jpg" },
    { id: "hop-on-hop-off", name: "Hop on Hop Off Bus", image: "https://d1i3enf1i5tb1f.cloudfront.net/CategoryType-Images/43124/All-You-Need-to-Know-about-Hop-On-Hop-Off-Tours-in-Abu-Dhabi-_-Body-3-17-8-22-1024x640.jpg" },
    { id: "adventure-tours", name: "Adventure Tours", image: "https://d1i3enf1i5tb1f.cloudfront.net/CategoryType-Images/43648/download%20(1).jpg" },
    { id: "events-shows", name: "Events and Shows", image: "https://d1i3enf1i5tb1f.cloudfront.net/CategoryType-Images/271853/download%20(6).jpg" },
  ];

  // Helper function to get activity price based on user type and currency
  const getDisplayPrice = (activity: any) => {
    const price = isAgent && activity.agentPrice ? activity.agentPrice : activity.price;
    const convertedPrice = convertAmount(price, 'AED', currentCurrency);
    return formatAmount(convertedPrice, currentCurrency);
  };

  // Helper function for formatting prices
  const formatPrice = (price: number) => {
    const convertedPrice = convertAmount(price, 'AED', currentCurrency);
    return formatAmount(convertedPrice, currentCurrency);
  };

  const filteredActivities = useMemo(() => {
    let result = activities.filter((activity) => {
      const matchesSearch = activity.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || activity.category === selectedCategory;
      const matchesPrice = activity.price >= priceRange[0] && activity.price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    });

    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "top-rated") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "recommended") {
      result = result.filter((a) => a.isPopular);
    }

    return result;
  }, [activities, searchQuery, selectedCategory, priceRange, sortBy]);

  return (
    <main className="pt-0">
      {/* Hero Section with Dynamic Slider */}
      {slidersLoading ? (
        <div className="relative h-[400px] bg-muted animate-pulse flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading Dubai Activities Slider...</p>
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
            
              <div className="bg-white rounded-lg p-4 shadow-lg max-w-2xl mx-auto">
                <div className="flex gap-2 relative">
                  <div className="flex-1 relative">
                    <Input
                      type="text"
                      className="text-black"
                      placeholder="Search Activities in Dubai"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (e.target.value.length > 0) {
                          const filtered = activities
                            .filter((a) =>
                              a.name.toLowerCase().includes(e.target.value.toLowerCase())
                            )
                            .map((a) => a.name)
                            .slice(0, 5);
                          setSuggestions(filtered);
                        } else {
                          setSuggestions([]);
                        }
                      }}
                    />
                    {suggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 bg-white border rounded-md shadow-lg z-50 max-h-40 overflow-y-auto">
                        {suggestions.map((s, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setSearchQuery(s);
                              setSuggestions([]);
                            }}
                            className="w-full px-3 text-black py-2 text-left hover:bg-muted"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button className="bg-primary hover:bg-[#A68D6C] text-white">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative h-[400px] bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p>No slider content available for Dubai Activities</p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8">
        <h2 className="text-3xl font-bold text-center mb-8">
          Top Dubai Tours & Activities
        </h2>

        <div className="mb-8">
          <Carousel
            opts={{
              align: "start",
              loop: false,
            }}
            plugins={[
              Autoplay({
                delay: 3000,
                stopOnInteraction: true,
              }),
            ]}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Browse by Category</h3>
              <div className="flex gap-2">
                <CarouselPrevious className="relative top-0 left-0 translate-y-0 h-8 w-8" />
                <CarouselNext className="relative top-0 right-0 translate-y-0 h-8 w-8" />
              </div>
            </div>
            <CarouselContent className="flex gap-4">
              {categories.map((cat) => (
                <CarouselItem key={cat.id} className="basis-auto w-auto">
                  <button
                    onClick={() =>
                      setSelectedCategory(selectedCategory === cat.id ? null : cat.id)
                    }
                    className={`text-center p-4 rounded-lg border-2 transition-all hover:scale-105 ${selectedCategory === cat.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                      }`}
                  >
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-16 h-16 mx-auto mb-2 rounded-full object-cover"
                    />
                    <p className="text-xs font-medium">{cat.name}</p>
                  </button>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* Description */}
        <div className="bg-muted rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold mb-4">Things to do in Dubai</h3>
          <p className="text-muted-foreground">
            Culture, nature, thrills, and record-breaking experiences—Dubai is the place to seek out everything you imagine and beyond. From the world's tallest building to the largest shopping mall, Dubai offers unparalleled experiences for every type of traveler.
          </p>
        </div>

        {/* NEW FILTERS SECTION - Horizontal layout */}
        <div className="bg-muted rounded-lg p-6 mb-8">
          <h3 className="font-semibold mb-4">{filteredActivities.length} Activities</h3>
          <div className="flex flex-col md:flex-row md:items-center md:gap-8 gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Sort by:</label>
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
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Price Range</label>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                min={25}
                max={2500}
                step={10}
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>{formatPrice(priceRange[0])}</span>
                <span>{formatPrice(priceRange[1])}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cards Section */}
        {cardsLoading ? (
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-6">Featured Dubai Experiences</h3>
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
            <h3 className="text-2xl font-bold mb-6">Featured Dubai Experiences</h3>
            <div className="text-center py-8 bg-muted rounded-lg">
              <p className="text-muted-foreground">Unable to load featured experiences</p>
            </div>
          </div>
        ) : cardsResponse?.cards && cardsResponse.cards.length > 0 ? (
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-6">Featured Dubai Experiences</h3>
            <DynamicCards 
              cards={cardsResponse.cards}
              onCardClick={(card) => {
                // Handle card click for viewing details
                const activityData = {
                  id: card.id,
                  name: card.title,
                  description: card.description,
                  price: card.originalPrice,
                  agentPrice: card.agentPrice,
                  discountedPrice: card.discountedPrice,
                  image: card.images?.[0]?.url || "/placeholder.svg",
                  images: card.images?.map(img => img.url) || [],
                  location: "Dubai",
                  category: "Featured Experience",
                  isPopular: card.isFlashSaleAvailable,
                  rating: 4.5
                };
                onActivitySelect(activityData);
              }}
              onAddToCart={(card) => {
                // Handle add to cart - open internal page layout with card details
                const activityData = {
                  id: card.id,
                  name: card.title,
                  description: card.description,
                  price: card.originalPrice,
                  agentPrice: card.agentPrice,
                  discountedPrice: card.discountedPrice,
                  image: card.images?.[0]?.url || "/placeholder.svg",
                  images: card.images?.map(img => img.url) || [],
                  location: "Dubai",
                  category: "Featured Experience",
                  isPopular: card.isFlashSaleAvailable,
                  isFlashSale: card.isFlashSaleAvailable,
                  flashSaleText: card.flashSaleText,
                  rating: 4.5,
                  duration: "Full Day",
                  pageType: card.pageType,
                  subPageType: card.subPageType
                };
                onActivitySelect(activityData);
              }}
            />
          </div>
        ) : null}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 ">
            {[...Array(8)].map((_, index) => (
              <Card key={index} className="overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-muted"></div>
                <CardContent className="p-3 sm:p-4">
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
                There was a problem loading Dubai activities. Please try again later.
              </p>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="border-destructive text-destructive hover:bg-destructive/10"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Activities Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredActivities.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="bg-muted rounded-lg p-8 max-w-md mx-auto">
                  <h3 className="text-lg font-semibold mb-2">No Activities Found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filters to find more activities.
                  </p>
                </div>
              </div>
            ) : (
              filteredActivities.map((activity, index) => (
                <Card
                  key={activity.id}
                  className="overflow-hidden bg-card rounded-lg shadow hover:shadow-lg flex flex-col transition-all duration-300 animate-scale-in cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => window.open(`/activity/${activity.id}`, "_blank")}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={activity.image || '/placeholder.svg'}
                      alt={activity.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {activity.isPopular && (
                      <Badge className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-travel-orange text-travel-orange-foreground text-[9px] sm:text-xs">
                        Popular
                      </Badge>
                    )}
                    {activity.discountedPrice && activity.discountedPrice !== activity.price && (
                      <Badge
                        variant="secondary"
                        className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-destructive text-destructive-foreground text-[9px] sm:text-xs"
                      >
                        Save {Math.round(((activity.price - activity.discountedPrice) / activity.price) * 100)}%
                      </Badge>
                    )}
                  </div>

                  <CardContent className="p-3 sm:p-4 flex flex-col flex-grow justify-between">
                    <h3 className="font-semibold text-sm sm:text-lg mb-1 sm:mb-2">
                      {activity.name}
                    </h3>
                    
                    <div className="flex items-end justify-between mt-auto">
                      <div className="flex flex-col justify-end">
                        <span className="whitespace-nowrap text-[9px] sm:text-xs text-muted-foreground">
                          Per Person from
                        </span>
                        <div className="flex items-end gap-1 sm:gap-2">
                          {activity.discountedPrice && activity.discountedPrice !== activity.price && (
                            <span className="text-[10px] sm:text-sm text-muted-foreground line-through">
                              {formatPrice(activity.price)}
                            </span>
                          )}
                          <span className="text-[10px] sm:text-sm font-bold">
                            {getDisplayPrice(activity)}
                          </span>
                        </div>
                      </div>
                      <Button
                        className="h-7 px-2 sm:h-9 sm:px-4 text-[10px] sm:text-sm bg-primary hover:bg-primary-glow"
                        onClick={(e) => {
                          e.stopPropagation();
                          onActivitySelect(activity);
                        }}
                      >
                        Add to cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default DubaiActivities;