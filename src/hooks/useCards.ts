import { useState, useEffect } from 'react';
import { cleanHtmlContent } from '@/lib/htmlUtils';

interface CardImage {
  id: string;
  alt: string;
  title: string;
  url: string;
  width: number;
  height: number;
}

export interface CardData {
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

interface CardsResponse {
  cards: CardData[];
  total: number;
}

interface UseCardsOptions {
  page?: string; // activities, hotels, cruise, holidays, etc.
  subPage?: string; // dubai, abu_dhabi, oman, ras_al_khaimah
  limit?: number;
}

export const useCards = (options: UseCardsOptions = {}) => {
  const [data, setData] = useState<CardsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { page, subPage, limit = 10 } = options;

  useEffect(() => {
    const fetchCards = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // In development, use relative path to utilize proxy
        // In production, use full URL
        const isDevelopment = import.meta.env.DEV;
        const baseUrl = isDevelopment 
          ? '' 
          : (import.meta.env.VITE_DRUPAL_BASE_URL || 'https://b2b.arabianvibesllc.com');
        
        // Use simple API instead of JSON API for better image handling
        let cardType = 'activities'; // default
        
        if (page) {
          // Map page names to the correct card types
          if (page === 'dubaiactivities' || page === 'abudhabiactivities' || 
              page === 'omanactivities' || page === 'rasalkhaimahactivities' || 
              page === 'activities') {
            cardType = 'activities';
          } else if (page === 'hotels') {
            cardType = 'hotels';
          } else if (page === 'holidays') {
            cardType = 'holidays';
          } else if (page === 'cruise') {
            cardType = 'cruise';
          } else if (page === 'visa') {
            cardType = 'visa';
          } else if (page === 'popular_experience' || page === 'home' || page === 'about_us') {
            // For pages without specific API endpoints, try activities as fallback
            cardType = 'activities';
          } else {
            cardType = page;
          }
        }
        
        const url = `${baseUrl}/api/get-cards/${cardType}`;
        console.log(`[useCards] Fetching cards - Page: ${page}, Type: ${cardType}, URL: ${url}`);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        console.log(`[useCards] Response status: ${response.status}`);

        if (!response.ok) {
          // If 404, return empty data instead of throwing error
          if (response.status === 404) {
            console.warn(`[useCards] Cards API endpoint not found for ${cardType}, returning empty data`);
            setData({
              cards: [],
              total: 0
            });
            setIsLoading(false);
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log(`[useCards] Received ${Array.isArray(result) ? result.length : (result.value?.length || 0)} cards from API`);
        
        // Transform simple API data to our CardData format
        const rawCards = result.value || result || [];
        console.log(`[useCards] Raw cards:`, rawCards.length);
        
        const transformedCards: CardData[] = rawCards.map((card: any) => {
          // Process images from the simple API format
          const cardImages: CardImage[] = [];
          
          if (card.card_images && Array.isArray(card.card_images)) {
            card.card_images.forEach((imageUrl: string, index: number) => {
              if (imageUrl) {
                cardImages.push({
                  id: `${card.nid}-${index}`,
                  alt: card.title || '',
                  title: card.title || '',
                  url: imageUrl, // Already processed by the simple API
                  width: 400,
                  height: 300,
                });
              }
            });
          }
          
          // Filter based on page and subPage for activities
          const cardPageType = card.card_for_page || '';
          const cardSubPageType = card.sub_page_type || '';
          
          // Apply client-side filtering ONLY for specific activity location pages
          if (page === 'dubaiactivities') {
            // Only show cards that are explicitly tagged for Dubai
            if (cardSubPageType !== 'dubai') {
              console.log(`[useCards] Filtering out card "${card.title}" - subPageType: "${cardSubPageType}" (expected: "dubai")`);
              return null;
            }
          } else if (page === 'abudhabiactivities') {
            // Only show cards that are explicitly tagged for Abu Dhabi
            if (cardSubPageType !== 'abu_dhabi') {
              console.log(`[useCards] Filtering out card "${card.title}" - subPageType: "${cardSubPageType}" (expected: "abu_dhabi")`);
              return null;
            }
          } else if (page === 'omanactivities') {
            // Only show cards that are explicitly tagged for Oman
            if (cardSubPageType !== 'oman') {
              console.log(`[useCards] Filtering out card "${card.title}" - subPageType: "${cardSubPageType}" (expected: "oman")`);
              return null;
            }
          } else if (page === 'rasalkhaimahactivities') {
            // Only show cards that are explicitly tagged for Ras Al Khaimah
            if (cardSubPageType !== 'ras_al_khaimah') {
              console.log(`[useCards] Filtering out card "${card.title}" - subPageType: "${cardSubPageType}" (expected: "ras_al_khaimah")`);
              return null;
            }
          }
          
          // For general pages (home, popular_experience, about_us, activities), show all cards
          // No filtering needed
          
          return {
            id: card.nid || card.id || '',
            title: cleanHtmlContent(card.title || ''),
            description: cleanHtmlContent(card.description || ''),
            agentPrice: parseFloat(card.card_agent_price || '0'),
            discountedPrice: parseFloat(card.card_discounted_price || '0'),
            originalPrice: parseFloat(card.card_original_price || '0'),
            flashSaleText: card.flash_sale_text || '',
            isFlashSaleAvailable: card.is_card_flash_sale_avail === '1' || card.is_card_flash_sale_avail === true,
            pageType: cardPageType,
            subPageType: cardSubPageType,
            images: cardImages,
          };
        }).filter(Boolean); // Remove null entries from filtering

        console.log(`[useCards] Transformed cards after filtering: ${transformedCards.length}`);

        setData({
          cards: transformedCards,
          total: transformedCards.length
        });
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch cards';
        console.warn('Cards API error:', errorMessage);
        
        // Set empty data on error instead of showing error state
        setData({
          cards: [],
          total: 0
        });
        
        // Only set error if it's not a 404
        if (!errorMessage.includes('404')) {
          setError(errorMessage);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCards();
  }, [page, subPage, limit]);

  const refetch = () => {
    const fetchCards = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const baseUrl = import.meta.env.VITE_DRUPAL_BASE_URL || 'https://b2b.arabianvibesllc.com';
        
        let url = `${baseUrl}/jsonapi/node/cards?include=field_card_images,field_card_images.field_media_image`;
        
        const filters: string[] = [];
        
        if (page) {
          let filterValue = page;
          
          if (page === 'dubaiactivities') {
            filterValue = 'activities';
            filters.push(`filter[field_slide_for_page]=${filterValue}`);
            filters.push(`filter[field_sub_page_type]=dubai`);
          } else if (page === 'abudhabiactivities') {
            filterValue = 'activities';
            filters.push(`filter[field_slide_for_page]=${filterValue}`);
            filters.push(`filter[field_sub_page_type]=abu_dhabi`);
          } else if (page === 'omanactivities') {
            filterValue = 'oman';
            filters.push(`filter[field_slide_for_page]=${filterValue}`);
          } else if (page === 'rasalkhaimahactivities') {
            filterValue = 'ras_al_khaimah';
            filters.push(`filter[field_slide_for_page]=${filterValue}`);
          } else {
            filters.push(`filter[field_slide_for_page]=${filterValue}`);
            if (subPage) {
              filters.push(`filter[field_sub_page_type]=${subPage}`);
            }
          }
        }
        
        if (filters.length > 0) {
          url += '&' + filters.join('&');
        }
        
        if (limit) {
          url += `&page[limit]=${limit}`;
        }
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        const transformedCards: CardData[] = result.data?.map((card: any) => {
          const cardImages: CardImage[] = [];
          
          if (card.relationships?.field_card_images?.data) {
            card.relationships.field_card_images.data.forEach((imageRef: any) => {
              const mediaEntity = result.included?.find((item: any) => 
                item.type === 'media--image' && item.id === imageRef.id
              );
              
              if (mediaEntity?.relationships?.field_media_image?.data) {
                const fileEntity = result.included?.find((item: any) => 
                  item.type === 'file--file' && 
                  item.id === mediaEntity.relationships.field_media_image.data.id
                );
                
                if (fileEntity) {
                  const imageUrl = fileEntity.attributes.uri?.url ? 
                    `${baseUrl}${fileEntity.attributes.uri.url}` : 
                    fileEntity.attributes.uri?.value || '';
                    
                  cardImages.push({
                    id: fileEntity.id,
                    alt: mediaEntity.relationships.field_media_image.data.meta?.alt || '',
                    title: mediaEntity.relationships.field_media_image.data.meta?.title || '',
                    url: imageUrl,
                    width: mediaEntity.relationships.field_media_image.data.meta?.width || 0,
                    height: mediaEntity.relationships.field_media_image.data.meta?.height || 0,
                  });
                }
              }
            });
          }
          
          return {
            id: card.id,
            title: cleanHtmlContent(card.attributes.title || ''),
            description: cleanHtmlContent(card.attributes.body?.processed || card.attributes.body?.value || ''),
            agentPrice: parseFloat(card.attributes.field_card_agent_price || '0'),
            discountedPrice: parseFloat(card.attributes.field_card_discounted_price || '0'),
            originalPrice: parseFloat(card.attributes.field_card_original_price || '0'),
            flashSaleText: card.attributes.field_flash_sale_text || '',
            isFlashSaleAvailable: card.attributes.field_is_card_flash_sale_avail || false,
            pageType: card.attributes.field_slide_for_page || '',
            subPageType: card.attributes.field_sub_page_type || '',
            images: cardImages,
          };
        }) || [];

        setData({
          cards: transformedCards,
          total: transformedCards.length
        });
        
      } catch (err) {
        console.error('Error fetching cards:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch cards');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCards();
  };

  return {
    data,
    isLoading,
    error,
    refetch
  };
};
