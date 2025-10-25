import { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useSliders } from "@/hooks/useSliders";
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
import { Star, Heart, Search } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { CurrencyProvider, useCurrency } from "@/contexts/CurrencyContext";
import { useAuth } from "@/contexts/AuthContext";
import { useActivities } from "@/hooks/useActivities";
import { useCards } from "@/hooks/useCards";
import InternalPageLayout from "./InternalPageLayout";

// Using Unsplash and related images
const ziplineImg = "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80";
const desertSafariRakImg = "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80";
const dinnerInDesertRakImg = "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80";
const rakCityTourImg = "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=800&q=80";
const sunriseHotAirBalloonImg = "https://images.unsplash.com/photo-1498661694102-0a3793edbe74?w=800&q=80";
const dubaiFountainRakImg = "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=800&q=80";
const jebelJaisMountainImg = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80";
const rakMuseumImg = "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=800&q=80";
const alMarjanIslandImg = "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80";
const icelandWaterParkImg = "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80";
const dhayahFortImg = "https://images.unsplash.com/photo-1590642916589-592bca10dfbf?w=800&q=80";
const rakMangroveKayakingImg = "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80";

const RasAlKhaimahActivitiesPage = () => {
  const [searchParams] = useSearchParams();
  const fromLocation = searchParams.get("from");

  return (
    <CurrencyProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <RasAlKhaimahActivitiesContent fromLocation={fromLocation} />
        <Footer />
      </div>
    </CurrencyProvider>
  );
};

const RasAlKhaimahActivitiesContent = ({
  fromLocation,
}: {
  fromLocation: string | null;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("most-popular");
  const [priceRange, setPriceRange] = useState([45, 850]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<any | null>(null);

  const { convertAmount, formatAmount, currentCurrency } = useCurrency();
  const { isAgent } = useAuth();

  // Helper functions for price formatting
  const getDisplayPrice = (activity: any) => {
    const price = isAgent && activity.agentPrice ? activity.agentPrice : activity.price;
    const convertedPrice = convertAmount(price, 'AED', currentCurrency);
    return formatAmount(convertedPrice, currentCurrency);
  };

  const formatPrice = (price: number) => {
    const convertedPrice = convertAmount(price, 'AED', currentCurrency);
    return formatAmount(convertedPrice, currentCurrency);
  };

  // Fetch slider data for Ras Al Khaimah activities page
  const { 
    data: slidersResponse, 
    isLoading: slidersLoading, 
    error: slidersError 
  } = useSliders({ page: 'rasalkhaimahactivities', limit: 5 });

  // Fetch cards data for Ras Al Khaimah activities page
  const { 
    data: cardsResponse, 
    isLoading: cardsLoading, 
    error: cardsError 
  } = useCards({ page: 'rasalkhaimahactivities', limit: 8 });
  
  // Fetch activities from API with Ras Al Khaimah location filter
  const { data: activitiesResponse, isLoading, error } = useActivities({
    location: 'Ras Al Khaimah',
    searchQuery: searchQuery || undefined,
    category: selectedCategory || undefined,
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    limit: 50
  });

  const activities = activitiesResponse?.activities || [];

  // This function is now defined earlier in the component

  const getSavingsPercentage = (activity) => {
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

  const shouldShowOriginalPrice = (activity) => {
    const agentPrice = activity.agentPrice ? Number(activity.agentPrice) : null;
    const normalPrice = Number(activity.price);
    const discountedPrice = activity.discountedPrice ? Number(activity.discountedPrice) : null;

    if (isAgent && agentPrice) {
      return normalPrice > agentPrice;
    }
    return discountedPrice && normalPrice > discountedPrice;
  };

  // Handler functions for InternalPageLayout
  const openInternalPage = (activity: any) => {
    setSelectedActivity(activity);
  };

  const closeInternalPage = () => {
    setSelectedActivity(null);
  };

 

  const [currentHeroImage, setCurrentHeroImage] = useState(0);



  const autoplay = useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: false,
    })
  );

  const categories = [
    {
      id: "desert-safari",
      name: "Desert Safari Tours",
      image:
        "https://d1i3enf1i5tb1f.cloudfront.net/CategoryType-Images/41903/54.jpg",
    },
    {
      id: "adventure-tours",
      name: "Adventure Tours",
      image:
        "https://d1i3enf1i5tb1f.cloudfront.net/CategoryType-Images/43648/download%20(1).jpg",
    },
    {
      id: "city-tours",
      name: "City Tours",
      image:
        "https://d1i3enf1i5tb1f.cloudfront.net/CategoryType-Images/41904/download%20(3).jpg",
    },
    {
      id: "water-activities",
      name: "Water Activities",
      image:
        "https://d1i3enf1i5tb1f.cloudfront.net/CategoryType-Images/41907/download%20(14).jpg",
    },
    {
      id: "culture-attractions",
      name: "Culture and Attractions",
      image:
        "https://d1i3enf1i5tb1f.cloudfront.net/CategoryType-Images/43105/download%20(4).jpg",
    },
    {
      id: "zipline",
      name: "Zipline Adventures",
      image:
        "https://d1i3enf1i5tb1f.cloudfront.net/CategoryType-Images/zipline/zipline.jpg",
    },
  ];

  const filteredActivities = useMemo(() => {
    let result = activities.filter((activity) => {
      const matchesSearch = activity.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        !selectedCategory || activity.category === selectedCategory;
      
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
      {/* Loading State */}
      {isLoading && (
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-lg">Loading Ras Al Khaimah activities...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-destructive mb-2">
                Unable to Load Activities
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                There was a problem loading Ras Al Khaimah activities. Please try again later.
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
        </div>
      )}

      {/* Main Content */}
      {!isLoading && !error && (
        <>
          {/* Hero Section with Dynamic Slider */}
          {slidersLoading ? (
            <div className="relative h-[400px] bg-muted animate-pulse flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p>Loading Ras Al Khaimah Activities Slider...</p>
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
                  <h1 className="text-4xl md:text-6xl font-bold mb-4">
                    Adventure Experiences in
                    <br />
                    <span className="text-travel-orange">RAS AL KHAIMAH</span>
                  </h1>
                  {fromLocation && (
                    <p className="text-lg mb-6">Searched from: {fromLocation}</p>
                  )}

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
                      <Button className="bg-travel-orange hover:bg-travel-orange/90 text-white">
                        <Search className="w-4 h-4 mr-2" />
                        Search
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative h-[400px] bg-gradient-to-r from-orange-600 to-red-800 flex items-center justify-center">
              <div className="text-center text-white max-w-4xl mx-auto px-4">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  Adventure Experiences in
                  <br />
                  <span className="text-travel-orange">RAS AL KHAIMAH</span>
                </h1>
                {fromLocation && (
                  <p className="text-lg mb-6">Searched from: {fromLocation}</p>
                )}
                <p className="text-lg mb-6">No slider content available for Ras Al Khaimah Activities</p>
              </div>
            </div>
          )}

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center mb-8">
          Top Ras Al Khaimah Tours & Activities
        </h2>

        {/* Cards Section */}
        {cardsLoading ? (
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-6">Featured Ras Al Khaimah Experiences</h3>
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
            <h3 className="text-2xl font-bold mb-6">Featured Ras Al Khaimah Experiences</h3>
            <div className="text-center py-8 bg-muted rounded-lg">
              <p className="text-muted-foreground">Unable to load featured experiences</p>
            </div>
          </div>
        ) : cardsResponse?.cards && cardsResponse.cards.length > 0 ? (
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-6">Featured Ras Al Khaimah Experiences</h3>
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
                  location: "Ras Al Khaimah",
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
                  location: "Ras Al Khaimah",
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

        <Carousel plugins={[autoplay.current]} opts={{ loop: true }} className="w-full mb-8">
          <CarouselContent className="flex gap-4">
            {categories.map((cat) => (
              <CarouselItem key={cat.id} className="basis-auto min-w-0">
                <button
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === cat.id ? null : cat.id
                    )
                  }
                  className={`text-center p-4 rounded-lg border-2 transition-all hover:scale-105 min-w-[120px] ${
                    selectedCategory === cat.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-16 h-16 mx-auto mb-2 rounded-full object-cover"
                  />
                  <p className="text-xs font-medium whitespace-nowrap">
                    {cat.name}
                  </p>
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>

        {filteredActivities.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-muted rounded-lg p-12">
              <h3 className="text-2xl font-bold mb-4">
                {activities.length === 0 ? "Coming Soon" : "No Activities Found"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {activities.length === 0 
                  ? "We're currently working on bringing you amazing Ras Al Khaimah experiences. Check back soon for tours and activities in this beautiful destination."
                  : "Try adjusting your search or filters to find more activities."
                }
              </p>
              {activities.length === 0 && (
                <div className="text-sm text-muted-foreground">
                  <p>In the meantime, explore our other destinations:</p>
                  <div className="flex flex-wrap justify-center gap-4 mt-4">
                    <Button variant="outline" size="sm" onClick={() => window.location.href = '/location/dubai'}>
                      Dubai Activities
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => window.location.href = '/location/abu-dhabi'}>
                      Abu Dhabi Activities
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredActivities.map((activity) => (
            <Card
              key={activity.id}
              className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer"
              onClick={() => openInternalPage(activity)}
            >
              <div className="relative">
                <img
                  src={activity.image || '/placeholder.svg'}
                  alt={activity.name}
                  className="w-full h-36 sm:h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {activity.isPopular && (
                  <Badge className="absolute top-2 left-2 bg-travel-orange text-white text-[10px] sm:text-xs">
                    Recommended
                  </Badge>
                )}
                {getSavingsPercentage(activity) > 0 && (
                  <Badge
                    variant="secondary"
                    className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-[10px] sm:text-xs"
                  >
                    Save {getSavingsPercentage(activity)}%
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 text-white hover:bg-white/20"
                >
                  <Heart className="w-4 h-4" />
                </Button>
              </div>

              <CardContent className="flex flex-col flex-1 p-2 sm:p-3 md:p-4">
                <div className="space-y-1 sm:space-y-2 md:space-y-3 flex-1">
                  <h3 className="font-semibold text-[12px] sm:text-sm md:text-lg leading-tight line-clamp-2">
                    {activity.name}
                  </h3>

                  <div className="flex justify-center items-center gap-1 sm:gap-2 mb-2 sm:mb-4">
                    <div className="flex items-center gap-[1px]">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 sm:h-4 sm:w-4 ${
                            i < Math.floor(activity.rating || 0)
                              ? "fill-travel-orange text-travel-orange"
                              : "text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] sm:text-sm font-medium">
                      {activity.rating || 0}
                    </span>
                    <span className="text-[10px] sm:text-sm text-muted-foreground">
                      (0 Reviews)
                    </span>
                  </div>
                </div>

                <div className="flex items-end justify-between mt-auto pt-2">
                  <div className="flex flex-col">
                    <span className="whitespace-nowrap text-[9px] sm:text-xs text-muted-foreground">
                      Per Person from
                    </span>
                    <div className="flex items-end gap-1 sm:gap-2">
                     {shouldShowOriginalPrice(activity) && (
  <span className="line-through text-[10px] sm:text-sm text-muted-foreground">
    {formatPrice(activity.discountedPrice ? activity.price : activity.price)}
  </span>
)}

<span className="font-bold text-[10px] sm:text-sm">
  {getDisplayPrice(activity)}
</span>

                    </div>
                  </div>

                  <Button
                    className="h-7 px-2 sm:h-9 sm:px-4 text-[10px] sm:text-sm bg-primary hover:bg-primary-glow"
                    onClick={(e) => {
                      e.stopPropagation();
                      openInternalPage(activity);
                    }}
                  >
                    Add to cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        )}
      </div>
      </>
      )}
    </main>
  );
};

export default RasAlKhaimahActivitiesPage;