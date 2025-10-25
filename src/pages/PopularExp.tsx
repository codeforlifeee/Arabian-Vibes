import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCards } from "@/hooks/useCards";
import { useSliders } from "@/hooks/useSliders";
import { DynamicSlider } from "@/components/ui/DynamicSlider";
import { Loader2, AlertCircle, Search } from "lucide-react";
import { useState } from "react";
import InternalPageLayout from "./InternalPageLayout";

interface PopularExperiencesProps {
  city: string;
  title: string;
  description: string;
}

const PopularExperiences = ({
  city,
  title,
  description,
}: PopularExperiencesProps) => {
  const { convertAmount, formatAmount, currentCurrency } = useCurrency();
  const { isAgent } = useAuth();
  const [selectedCard, setSelectedCard] = useState<any | null>(null);
  
  // Fetch cards using the useCards hook for "popular experience" page
  const { 
    data: cardsResponse, 
    isLoading, 
    error 
  } = useCards({ page: 'popular_experience', limit: 20 });

  // Fetch sliders for popular experience page
  const { 
    data: slidersResponse, 
    isLoading: slidersLoading, 
    error: slidersError 
  } = useSliders({ page: 'popular_experience', limit: 5 });

  const cards = cardsResponse?.cards || [];

  const getDisplayPrice = (card: any) => {
    const price = isAgent && card.agentPrice ? card.agentPrice : (card.originalPrice || card.discountedPrice);
    const convertedPrice = convertAmount(price, 'AED', currentCurrency);
    return formatAmount(convertedPrice, currentCurrency);
  };

  const handleAddToCart = (card: any) => {
    // Convert card data to activity format for InternalPageLayout
    const activityData = {
      id: card.id,
      name: card.title,
      description: card.description,
      price: card.originalPrice,
      agentPrice: card.agentPrice,
      discountedPrice: card.discountedPrice,
      image: card.images?.[0]?.url || "/placeholder.svg",
      images: card.images?.map(img => img.url) || [],
      location: city,
      category: "Popular Experience",
      isPopular: card.isFlashSaleAvailable,
      isFlashSale: card.isFlashSaleAvailable,
      flashSaleText: card.flashSaleText,
      rating: 4.5,
      duration: "Full Day",
      pageType: card.pageType,
      subPageType: card.subPageType
    };
    setSelectedCard(activityData);
  };

  const closeInternalPage = () => {
    setSelectedCard(null);
  };

  // Render InternalPageLayout if card is selected
  if (selectedCard) {
    return (
      <InternalPageLayout
        heroImage={selectedCard.image}
        title={selectedCard.name}
        description={selectedCard.description}
        item={selectedCard}
        onClose={closeInternalPage}
      />
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <section className="py-8 sm:py-12 bg-gradient-to-b from-blue-50/30 to-white">
        <div className="container mx-auto px-4">
          <div className="mb-6 sm:mb-10 text-center">
            <h2 className="text-xl sm:text-3xl font-bold text-foreground mb-2 sm:mb-4">
              {title}
            </h2>
            <p className="text-xs sm:text-base text-muted-foreground max-w-2xl mx-auto">
              {description}
            </p>
          </div>
          <div className="flex flex-col justify-center items-center py-16">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Loader2 className="h-10 w-10 text-primary animate-pulse" />
              </div>
            </div>
            <span className="text-lg font-semibold text-primary mt-6 animate-pulse">Loading amazing experiences...</span>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-8 sm:py-12 bg-gradient-to-b from-red-50/30 to-white">
        <div className="container mx-auto px-4">
          <div className="mb-6 sm:mb-10 text-center">
            <h2 className="text-xl sm:text-3xl font-bold text-foreground mb-2 sm:mb-4">
              {title}
            </h2>
            <p className="text-xs sm:text-base text-muted-foreground max-w-2xl mx-auto">
              {description}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl shadow-lg border-2 border-red-100">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
            <p className="text-xl font-bold text-red-600 mb-3">
              Oops! Something went wrong
            </p>
            <p className="text-sm text-gray-600 mb-6 max-w-md text-center">
              {error || 'Failed to load popular experiences. Please try again.'}
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold px-8 py-6 shadow-lg rounded-xl"
            >
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // No data state
  if (cards.length === 0) {
    return (
      <section className="py-8 sm:py-12 bg-gradient-to-b from-gray-50/30 to-white">
        <div className="container mx-auto px-4">
          <div className="mb-6 sm:mb-10 text-center">
            <h2 className="text-xl sm:text-3xl font-bold text-foreground mb-2 sm:mb-4">
              {title}
            </h2>
            <p className="text-xs sm:text-base text-muted-foreground max-w-2xl mx-auto">
              {description}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl shadow-lg border-2 border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <p className="text-xl font-bold text-gray-700 mb-3">
              No experiences found
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Check back soon for exciting new adventures!
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-bold px-8 py-6 shadow-lg rounded-xl"
            >
              Refresh
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 sm:py-16 bg-gradient-to-b from-blue-50/30 via-white to-blue-50/30">
      <div className="container mx-auto px-4">
        <div className="mb-8 sm:mb-12 text-center">
          <h2 className="text-2xl sm:text-5xl font-extrabold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-sm sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
            {description}
          </p>
        </div>

        {/* Sliders Section */}
        {!slidersLoading && !slidersError && slidersResponse?.slides && slidersResponse.slides.length > 0 && (
          <div className="mb-10">
            <DynamicSlider 
              slides={slidersResponse.slides}
              height="300px"
              autoplay={true}
              autoplayDelay={3500}
              showDots={true}
              showArrows={true}
            />
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {cards.map((card, index) => (
            <div
              key={card.id || index}
              className="group overflow-hidden bg-white rounded-3xl shadow-lg hover:shadow-2xl flex flex-col transition-all duration-500 animate-scale-in transform hover:-translate-y-3 border border-gray-100 hover:border-primary/20"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-t-3xl">
                <img
                  src={card.images?.[0]?.url || '/placeholder.svg'}
                  alt={card.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-115"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Flash Sale Badge */}
                {card.isFlashSaleAvailable && card.flashSaleText && (
                  <Badge
                    className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs sm:text-sm font-bold px-3 py-1.5 animate-pulse shadow-lg"
                  >
                    🔥 {card.flashSaleText}
                  </Badge>
                )}

                {/* Discount Badge */}
                {!isAgent && card.originalPrice && card.discountedPrice && (
                  <Badge
                    variant="secondary"
                    className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs sm:text-sm font-bold px-3 py-1.5 shadow-lg"
                  >
                    Save{" "}
                    {Math.round(
                      ((card.originalPrice - card.discountedPrice) /
                        card.originalPrice) *
                        100
                    )}
                    %
                  </Badge>
                )}
              </div>
              <div className="p-4 sm:p-6 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="font-bold text-sm sm:text-lg mb-2 line-clamp-2 text-gray-900 group-hover:text-primary transition-colors leading-snug">
                    {card.title}
                  </h3>
                  {card.description && (
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed">
                      {card.description}
                    </p>
                  )}
                </div>

                <div className="flex items-end justify-between mt-auto pt-4 border-t-2 border-gray-100">
                  <div className="flex flex-col justify-end">
                    <span className="whitespace-nowrap text-[10px] sm:text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">
                      From
                    </span>

                    <div className="flex items-baseline gap-1.5 sm:gap-2">
                      {!isAgent && card.originalPrice && card.discountedPrice && (
                        <span className="text-[10px] sm:text-sm text-gray-400 line-through font-medium">
                          {formatAmount(convertAmount(card.originalPrice, 'AED', currentCurrency), currentCurrency)}
                        </span>
                      )}

                      <span className="text-lg sm:text-2xl font-extrabold text-primary bg-primary/5 px-2 py-0.5 rounded">
                        {getDisplayPrice(card)}
                      </span>
                    </div>
                    <span className="text-[9px] sm:text-xs text-gray-500 font-medium">per person</span>
                  </div>

                  <Button 
                    className="h-9 px-4 sm:h-11 sm:px-6 text-[11px] sm:text-sm bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 rounded-xl"
                    onClick={() => handleAddToCart(card)}
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularExperiences;