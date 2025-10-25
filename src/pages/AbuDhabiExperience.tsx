import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useActivities } from "@/hooks/useActivities";
import { useSliders } from "@/hooks/useSliders";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useAuth } from "@/contexts/AuthContext";
import { Activity } from "@/data/types";
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
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { DynamicSlider } from "@/components/ui/DynamicSlider";

// Using Unsplash images
const heroImage1 = "https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=1200&q=80";
const heroImage2 = "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1200&q=80";

const AbuDhabiActivitiesPage = () => {
  const [searchParams] = useSearchParams();
  const fromLocation = searchParams.get("from");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AbuDhabiActivitiesContent fromLocation={fromLocation} />
      <Footer />
    </div>
  );
};

const AbuDhabiActivitiesContent = ({
  fromLocation,
}: {
  fromLocation: string | null;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("most-popular");
  const [priceRange, setPriceRange] = useState([29, 1799]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  
  const { convertAmount, formatAmount, currentCurrency } = useCurrency();
  const { isAgent } = useAuth();

  // Fetch slider data for Abu Dhabi activities page
  const { 
    data: slidersResponse, 
    isLoading: slidersLoading, 
    error: slidersError 
  } = useSliders({ page: 'abudhabi', limit: 5 });

  // Fetch activities from API with Abu Dhabi location filter
  const { data: activitiesResponse, isLoading, error } = useActivities({
    location: 'Abu Dhabi',
    searchQuery: searchQuery || undefined,
    category: selectedCategory || undefined,
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    limit: 50
  });

  const activities = activitiesResponse?.activities || [];

  const heroImages = [heroImage1, heroImage2];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

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

  // Activity categories from the website
  const categories = [
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
    { id: "wildlife-zoo", name: "Wildlife Zoo and Aquarium", image: "https://d1i3enf1i5tb1f.cloudfront.net/CategoryType-Images/46945/images%20(5).jpg" },
    { id: "events-shows", name: "Events and Shows", image: "https://d1i3enf1i5tb1f.cloudfront.net/CategoryType-Images/271853/download%20(6).jpg" },
  ];

  // Dynamic filtering using the API-fetched activities
  const filteredActivities = useMemo(() => {
    let result = activities.filter((activity) => {
      const matchesSearch = activity.name?.toLowerCase().includes(searchQuery.toLowerCase());
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

  const getSavingsPercentage = (activity: Activity) => {
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

  const shouldShowOriginalPrice = (activity: Activity) => {
    const agentPrice = activity.agentPrice ? Number(activity.agentPrice) : null;
    const normalPrice = Number(activity.price);
    const discountedPrice = activity.discountedPrice ? Number(activity.discountedPrice) : null;

    if (isAgent && agentPrice) {
      return normalPrice > agentPrice;
    }
    return discountedPrice && normalPrice > discountedPrice;
  };

  // Show loading state
  if (isLoading) {
    return (
      <main className="pt-0">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-lg">Loading Abu Dhabi activities...</p>
          </div>
        </div>
      </main>
    );
  }

  // Show error state
  if (error) {
    return (
      <main className="pt-0">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-lg text-red-600">Error loading activities. Please try again later.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
     <main className="pt-0">
      {/* Hero Section */}
      <div className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentHeroImage ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                backgroundImage: `url('${image}')`,
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            />
          ))}
        </div>
        
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentHeroImage(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentHeroImage ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        <div className="absolute inset-0 bg-primary/10" />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Most Popular Experiences in
            <br />
            <span className="text-[#BCA37F]">ABU DHABI</span>
          </h1>
          {fromLocation && (
            <p className="text-lg mb-6">Searched from: {fromLocation}</p>
          )}
          <div className="bg-white rounded-lg p-4 shadow-lg max-w-2xl mx-auto">
            <div className="flex gap-2 relative">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  className="text-black"
                  placeholder="Search Activities in Abu Dhabi"
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
              <Button className="bg-[#BCA37F] hover:bg-[#A68D6C] text-white">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8">
        <h2 className="text-3xl font-bold text-center mb-8">
          Top Abu Dhabi Tours & Activities
        </h2>

        <div className="mb-8">
          <Carousel
            plugins={[
              Autoplay({
                delay: 3000,
                stopOnInteraction: true,
              }),
            ]}
            className="w-full"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="flex gap-4">
              {categories.map((cat) => (
                <CarouselItem key={cat.id} className="basis-auto min-w-0">
                  <button
                    onClick={() =>
                      setSelectedCategory(selectedCategory === cat.id ? null : cat.id)
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
                    <p className="text-xs font-medium whitespace-nowrap">{cat.name}</p>
                  </button>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>

        <div className="flex flex-col gap-8">
          <div className="bg-muted rounded-lg p-6">
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
                  min={29}
                  max={1799}
                  step={10}
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredActivities.map((a, index) => (
         <Card
  key={a.id}
  className="overflow-hidden bg-card rounded-lg shadow hover:shadow-lg flex flex-col transition-all duration-300 animate-scale-in cursor-pointer"
  style={{ animationDelay: `${index * 100}ms` }}
  onClick={() => window.open(`/activity/${a.id}`, "_blank")}
>
  <div className="relative aspect-[4/3] overflow-hidden">
    <img
      src={a.image || '/placeholder.svg'}
      alt={a.name}
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
    {a.isPopular && (
      <Badge className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-travel-orange text-travel-orange-foreground text-[9px] sm:text-xs">
        Recommended
      </Badge>
    )}
    {getSavingsPercentage(a) > 0 && (
      <Badge
        variant="secondary"
        className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-destructive text-destructive-foreground text-[9px] sm:text-xs"
      >
        Save {getSavingsPercentage(a)}%
      </Badge>
    )}
  </div>
  <CardContent className="p-3 sm:p-4 flex flex-col flex-grow justify-between">
    <h3 className="font-semibold text-sm sm:text-lg mb-1 sm:mb-2">
      {a.name}
    </h3>
    <div className="flex justify-center items-center gap-1 sm:gap-2 mb-2 sm:mb-4">
      <div className="flex items-center gap-[1px]">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-3 w-3 sm:h-4 sm:w-4 ${
              i < Math.floor(a.rating || 0)
                ? "fill-travel-orange text-travel-orange"
                : "text-muted"
            }`}
          />
        ))}
      </div>
      <span className="text-[10px] sm:text-sm font-medium">
        {a.rating || 0}
      </span>
      <span className="text-[10px] sm:text-sm text-muted-foreground">
        (0 Reviews)
      </span>
    </div>
    <div className="flex items-end justify-between mt-auto">
      <div className="flex flex-col justify-end">
        <span className="whitespace-nowrap text-[9px] sm:text-xs text-muted-foreground">
          Per Person from
        </span>
        <div className="flex items-end gap-1 sm:gap-2">
          {shouldShowOriginalPrice(a) && (
            <span className="text-[10px] sm:text-sm text-muted-foreground line-through">
              {formatPrice(a.discountedPrice ? a.price : a.price)}
            </span>
          )}
          <span className="text-[10px] sm:text-sm font-bold">
            {getDisplayPrice(a)}
          </span>
        </div>
      </div>
      <Button
        className="h-7 px-7 sm:h-9 sm:px-4 text-[10px] sm:text-sm bg-primary hover:bg-primary-glow"
        onClick={(e) => e.stopPropagation()}
      >
        Add to cart
      </Button>
    </div>
  </CardContent>
</Card>

            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default AbuDhabiActivitiesPage;