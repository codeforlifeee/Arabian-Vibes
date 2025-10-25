import { useState, useEffect } from 'react';

interface SlideImage {
  id: string;
  alt: string;
  title: string;
  url: string;
  width: number;
  height: number;
}

interface SlideData {
  id: string;
  title: string;
  image: string; // Legacy single image support
  images: SlideImage[]; // New multiple images support
  description?: string;
  link?: string;
  alt_text?: string;
  pageType?: string;
  subPageType?: string;
}

interface SlidersResponse {
  slides: SlideData[];
  total: number;
}

interface UseSlidersOptions {
  page?: string; // activities, holidays, hotels, cruise, visa, home, popular_experience, about_us
  subPage?: string; // dubai, abu_dhabi, oman, ras_al_khaimah
  limit?: number;
}

export const useSliders = (options: UseSlidersOptions = {}) => {
  const [data, setData] = useState<SlidersResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { page, subPage, limit = 10 } = options;

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const baseUrl = import.meta.env.VITE_DRUPAL_BASE_URL || 'https://b2b.arabianvibesllc.com';
        
        // Use Drupal JSON API for slides
        let url = `${baseUrl}/jsonapi/node/slides?include=field_card_images,field_card_images.field_media_image`;
        
        // Apply filters based on page and subPage
        const filters: string[] = [];
        
        if (page) {
          if (page === 'dubaiactivities') {
            filters.push(`filter[field_slide_for_page]=dubai`);
          } else if (page === 'abudhabiactivities') {
            filters.push(`filter[field_slide_for_page]=abu_dhabi`);
          } else if (page === 'omanactivities') {
            filters.push(`filter[field_slide_for_page]=oman`);
          } else if (page === 'rasalkhaimahactivities') {
            filters.push(`filter[field_slide_for_page]=ras_al_khaimah`);
          } else if (page === 'activities') {
            filters.push(`filter[field_slide_for_page]=activities`);
            if (subPage) {
              filters.push(`filter[field_sub_page_type]=${subPage}`);
            }
          } else if (page === 'home') {
            filters.push(`filter[field_slide_for_page]=holidays`);
          } else {
            filters.push(`filter[field_slide_for_page]=${page}`);
            if (subPage) {
              filters.push(`filter[field_sub_page_type]=${subPage}`);
            }
          }
        }
        
        // Add filters to URL
        if (filters.length > 0) {
          url += '&' + filters.join('&');
        }
        
        // Add limit
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
        
        // Transform JSON API format to SlideData with working image URLs
        const rawSlides = result.data || [];
        const transformedSlides: SlideData[] = rawSlides.map((slide: any) => {
          const slideImages: SlideImage[] = [];
          let legacyImageUrl = ''; // No default fallback
          
          if (slide.relationships?.field_card_images?.data) {
            slide.relationships.field_card_images.data.forEach((imageRef: any) => {
              // Find the media entity in included data
              const mediaEntity = result.included?.find((item: any) => 
                item.type === 'media--image' && item.id === imageRef.id
              );
              
              if (mediaEntity?.relationships?.field_media_image?.data) {
                // Find the file entity in included data
                const fileEntity = result.included?.find((item: any) => 
                  item.type === 'file--file' && 
                  item.id === mediaEntity.relationships.field_media_image.data.id
                );
                
                if (fileEntity) {
                  // TEMPORARY FIX: Use working card images until backend creates simple API for slides
                  // The JSON API doesn't provide styled URLs with itok tokens that are required for images
                  const workingImages = [
                    'https://b2b.arabianvibesllc.com/sites/default/files/styles/to_webp/public/2025-09/Dubai%20Aquarium%20and%20Underwater%20Zoo.jpg.webp?itok=EVAVtvMH',
                    'https://b2b.arabianvibesllc.com/sites/default/files/styles/to_webp/public/2025-09/Wonderful%20Bali.jpg.webp?itok=qLane9_k',
                    'https://b2b.arabianvibesllc.com/sites/default/files/styles/to_webp/public/2025-09/burj-khalifa-tickets.jpg.webp?itok=raHgTm48'
                  ];
                  
                  // Use a working image (rotate through available ones)
                  const imageIndex = slideImages.length % workingImages.length;
                  const imageUrl = workingImages[imageIndex];
                  
                  // TODO: Replace with proper Simple API for slides (like /api/get-slides/{page})
                  // Once backend creates this endpoint, remove this temporary fix
                  
                  // Add to slideImages only if we have a valid URL
                  if (imageUrl) {
                    slideImages.push({
                      id: fileEntity.id,
                      alt: mediaEntity.relationships.field_media_image.data.meta?.alt || slide.attributes.title || '',
                      title: mediaEntity.relationships.field_media_image.data.meta?.title || slide.attributes.title || '',
                      url: imageUrl,
                      width: mediaEntity.relationships.field_media_image.data.meta?.width || 400,
                      height: mediaEntity.relationships.field_media_image.data.meta?.height || 300,
                    });
                    
                    // Set first image as legacy image URL
                    if (!legacyImageUrl) {
                      legacyImageUrl = imageUrl;
                    }
                  }
                }
              }
            });
          }
          
          return {
            id: slide.id,
            title: slide.attributes.title || '',
            image: legacyImageUrl,
            images: slideImages,
            description: slide.attributes.body?.processed || slide.attributes.body?.value || slide.attributes.title,
            pageType: slide.attributes.field_slide_for_page || '',
            subPageType: slide.attributes.field_sub_page_type || '',
            link: `/slide/${slide.id}`,
            alt_text: slide.attributes.title || ''
          };
        }) || [];

        
        // Apply limit if specified
        const limitedSlides = limit ? transformedSlides.slice(0, limit) : transformedSlides;
        
        const slidersData: SlidersResponse = {
          slides: limitedSlides,
          total: transformedSlides.length
        };

        console.log('Final slides data:', slidersData);
        setData(slidersData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch sliders';
        setError(errorMessage);
        console.error('Error fetching sliders:', err);
        
        // Don't set empty data on error - let the UI handle the error state
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSliders();
  }, [page, subPage, limit]);

  const refetch = () => {
    const fetchSliders = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const baseUrl = import.meta.env.VITE_DRUPAL_BASE_URL || 'https://b2b.arabianvibesllc.com';
        
        let url = `${baseUrl}/jsonapi/node/slides?include=field_card_images,field_card_images.field_media_image`;
        
        // Apply filters based on page and subPage  
        const filters: string[] = [];
        
        if (page) {
          // Use the same mapping logic as in the main fetch function
          if (page === 'dubaiactivities') {
            filters.push(`filter[field_slide_for_page]=dubai`);
          } else if (page === 'abudhabiactivities') {
            filters.push(`filter[field_slide_for_page]=abu_dhabi`);
            filters.push(`filter[field_sub_page_type]=abu_dhabi`);
          } else if (page === 'omanactivities') {
            filters.push(`filter[field_slide_for_page]=oman`);
            filters.push(`filter[field_sub_page_type]=oman`);
          } else if (page === 'rasalkhaimahactivities') {
            filters.push(`filter[field_slide_for_page]=ras_al_khaimah`);
            filters.push(`filter[field_sub_page_type]=ras_al_khaimah`);
          } else if (page === 'activities') {
            filters.push(`filter[field_slide_for_page]=activities`);
            if (subPage) {
              filters.push(`filter[field_sub_page_type]=${subPage}`);
            }
          } else if (page === 'home') {
            filters.push(`filter[field_slide_for_page]=holidays`);
          } else if (page === 'popular_experience') {
            filters.push(`filter[field_slide_for_page]=popular_experience`);
          } else if (page === 'about_us') {
            filters.push(`filter[field_slide_for_page]=about_us`);
          } else {
            filters.push(`filter[field_slide_for_page]=${page}`);
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
        
        const transformedSlides: SlideData[] = result.data?.map((slide: any) => {
          const slideImages: SlideImage[] = [];
          let legacyImageUrl = ''; // No default fallback
          
          if (slide.relationships?.field_card_images?.data) {
            slide.relationships.field_card_images.data.forEach((imageRef: any) => {
              // Find the media entity in included data
              const mediaEntity = result.included?.find((item: any) => 
                item.type === 'media--image' && item.id === imageRef.id
              );
              
              if (mediaEntity?.relationships?.field_media_image?.data) {
                // Find the file entity in included data
                const fileEntity = result.included?.find((item: any) => 
                  item.type === 'file--file' && 
                  item.id === mediaEntity.relationships.field_media_image.data.id
                );
                
                if (fileEntity) {
                  // TEMPORARY FIX: Use working card images until backend creates simple API for slides
                  // The JSON API doesn't provide styled URLs with itok tokens that are required for images
                  const workingImages = [
                    'https://b2b.arabianvibesllc.com/sites/default/files/styles/to_webp/public/2025-09/Dubai%20Aquarium%20and%20Underwater%20Zoo.jpg.webp?itok=EVAVtvMH',
                    'https://b2b.arabianvibesllc.com/sites/default/files/styles/to_webp/public/2025-09/Wonderful%20Bali.jpg.webp?itok=qLane9_k',
                    'https://b2b.arabianvibesllc.com/sites/default/files/styles/to_webp/public/2025-09/burj-khalifa-tickets.jpg.webp?itok=raHgTm48'
                  ];
                  
                  // Use a working image (rotate through available ones)
                  const imageIndex = slideImages.length % workingImages.length;
                  const imageUrl = workingImages[imageIndex];
                  
                  // TODO: Replace with proper Simple API for slides (like /api/get-slides/{page})
                  // Once backend creates this endpoint, remove this temporary fix
                  
                  // Add to slideImages only if we have a valid URL
                  if (imageUrl) {
                    slideImages.push({
                      id: fileEntity.id,
                      alt: mediaEntity.relationships.field_media_image.data.meta?.alt || slide.attributes.title || '',
                      title: mediaEntity.relationships.field_media_image.data.meta?.title || slide.attributes.title || '',
                      url: imageUrl,
                      width: mediaEntity.relationships.field_media_image.data.meta?.width || 400,
                      height: mediaEntity.relationships.field_media_image.data.meta?.height || 300,
                    });
                    
                    // Set first image as legacy image URL
                    if (!legacyImageUrl) {
                      legacyImageUrl = imageUrl;
                    }
                  }
                }
              }
            });
          }
          
          return {
            id: slide.id,
            title: slide.attributes.title || '',
            image: legacyImageUrl, // Legacy single image support
            images: slideImages, // New multiple images support
            description: slide.attributes.body?.processed || slide.attributes.body?.value || slide.attributes.title,
            pageType: slide.attributes.field_slide_for_page || '',
            subPageType: slide.attributes.field_sub_page_type || '',
            link: `/slide/${slide.id}`,
            alt_text: slide.attributes.title || ''
          };
        }) || [];

        const limitedSlides = limit ? transformedSlides.slice(0, limit) : transformedSlides;
        
        const slidersData: SlidersResponse = {
          slides: limitedSlides,
          total: transformedSlides.length
        };

        setData(slidersData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch sliders';
        setError(errorMessage);
        console.error('Error fetching sliders:', err);
        
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSliders();
  };

  return {
    data,
    isLoading,
    error,
    refetch
  };
};
