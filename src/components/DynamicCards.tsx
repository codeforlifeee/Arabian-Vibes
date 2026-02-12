import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useAuth } from '@/contexts/AuthContext';
import { cleanHtmlContent } from '@/lib/htmlUtils';

interface CardImage {
  id: string;
  alt: string;
  title: string;
  url: string;
  width: number;
  height: number;
}

interface CardData {
  id: string;
  title: string;
  description?: string;
  agentPrice: number;
  discountedPrice: number;
  originalPrice: number;
  flashSaleText?: string;
  isFlashSaleAvailable: boolean;
  pageType: string;
  subPageType?: string;
  images: CardImage[];
}

interface DynamicCardsProps {
  cards: CardData[];
  className?: string;
  onCardClick?: (card: CardData) => void;
  onAddToCart?: (card: CardData) => void;
}

export const DynamicCards: React.FC<DynamicCardsProps> = ({
  cards,
  className = '',
  onCardClick,
  onAddToCart
}) => {
  const { currentCurrency, convertAmount, formatAmount } = useCurrency();
  const { isAgent } = useAuth();

  const getDisplayPrice = (card: CardData) => {
    if (isAgent && card.agentPrice > 0) {
      if (currentCurrency === "AED") {
        return `AED ${card.agentPrice.toFixed(2)}`;
      }
      const converted = convertAmount(card.agentPrice, 'AED', currentCurrency);
      return formatAmount(converted, currentCurrency);
    }
    
    const priceToShow = card.discountedPrice > 0 ? card.discountedPrice : card.originalPrice;
    if (currentCurrency === "AED") {
      return `AED ${priceToShow.toFixed(2)}`;
    }
    const converted = convertAmount(priceToShow, 'AED', currentCurrency);
    return formatAmount(converted, currentCurrency);
  };

  const getOriginalPrice = (card: CardData) => {
    if (isAgent && card.agentPrice > 0 && card.originalPrice > card.agentPrice) {
      if (currentCurrency === "AED") {
        return `AED ${card.originalPrice.toFixed(2)}`;
      }
      const converted = convertAmount(card.originalPrice, 'AED', currentCurrency);
      return formatAmount(converted, currentCurrency);
    }
    
    if (!isAgent && card.discountedPrice > 0 && card.originalPrice > card.discountedPrice) {
      if (currentCurrency === "AED") {
        return `AED ${card.originalPrice.toFixed(2)}`;
      }
      const converted = convertAmount(card.originalPrice, 'AED', currentCurrency);
      return formatAmount(converted, currentCurrency);
    }
    
    return null;
  };

  const getSavingsPercentage = (card: CardData) => {
    if (isAgent && card.agentPrice > 0 && card.originalPrice > card.agentPrice) {
      return Math.round(((card.originalPrice - card.agentPrice) / card.originalPrice) * 100);
    }
    
    if (!isAgent && card.discountedPrice > 0 && card.originalPrice > card.discountedPrice) {
      return Math.round(((card.originalPrice - card.discountedPrice) / card.originalPrice) * 100);
    }
    
    return 0;
  };

  if (!cards || cards.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No cards available</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 ${className}`}>
      {cards.map((card) => {
        const displayPrice = getDisplayPrice(card);
        const originalPrice = getOriginalPrice(card);
        const savingsPercentage = getSavingsPercentage(card);
        const mainImage = card.images && card.images.length > 0 ? card.images[0] : null;

        return (
          <Card 
            key={card.id} 
            className="overflow-hidden bg-card rounded-lg shadow hover:shadow-lg flex flex-col transition-all duration-300 animate-scale-in"
            onClick={() => onCardClick?.(card)}
          >
            <div className="relative">
              {/* Card Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={card.images?.[0]?.url || '/placeholder.svg'}
                  alt={cleanHtmlContent(card.title)}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />

                {!isAgent && card.originalPrice && card.discountedPrice && (
                  <Badge
                    variant="secondary"
                    className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-destructive text-destructive-foreground text-[9px] sm:text-xs"
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

             
            </div>

            
              {/* Title and Price Section */}
               <div className="p-3 sm:p-4 flex flex-col flex-grow justify-between">
               <h3 className="font-semibold text-sm sm:text-lg mb-1 sm:mb-2 line-clamp-2">
                  {cleanHtmlContent(card.title)}
                </h3>
  <div className="flex items-end justify-between mt-auto">
                  <div className="flex flex-col justify-end">
                    <span className="whitespace-nowrap text-[9px] sm:text-xs text-muted-foreground">
                      Per Person from
                    </span>

                    <div className="flex items-end gap-1 sm:gap-2">
                      {!isAgent && card.originalPrice && card.discountedPrice && (
                        <span className="text-[10px] sm:text-sm text-muted-foreground line-through">
                          {formatAmount(convertAmount(card.originalPrice, 'AED', currentCurrency), currentCurrency)}
                        </span>
                      )}

                      <span className="text-sm sm:text-xl font-bold text-primary">
                        {getDisplayPrice(card)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Add to Cart Button */}
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart?.(card);
                    }}
                    className="h-7 px-2 sm:h-9 sm:px-4 text-[10px] sm:text-sm bg-primary hover:bg-primary-glow"
                  >
                    Add to Cart
                  </Button>
             </div>
</div>
            
          </Card>
        );
      })}
    </div>
  );
};

export default DynamicCards;
