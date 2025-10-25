import axios, { AxiosInstance } from 'axios';
import { 
  Hotel, HotelSearchParams, HotelSearchResponse, 
  Holiday, HolidaySearchParams, HolidaySearchResponse,
  Cruise, CruiseSearchParams, CruiseSearchResponse,
  Activity, ActivitySearchParams, ActivitySearchResponse,
  DrupalCard, DrupalApiResponse,
  Experience
} from '../data/types';
import { testActivities, testHolidays, testCruises } from '../data/testData';
import DRUPAL_CONFIG from '../config/drupal';

// Determine if we're in development mode to use proxy
const isDevelopment = import.meta.env.MODE === 'development';
const apiBaseURL = isDevelopment ? '' : DRUPAL_CONFIG.baseURL;

// Create axios instance for Drupal public API
const drupalApi: AxiosInstance = axios.create({
  baseURL: apiBaseURL,
  timeout: DRUPAL_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false, // Set to true only if your backend requires credentials
});

// Transform Drupal card to Hotel interface
const transformDrupalCardToHotel = (card: DrupalCard): Hotel => {
  // Handle null/undefined values safely
  let cardImages: string[] = [];
  if (Array.isArray(card.card_images)) {
    cardImages = card.card_images;
  } else if (typeof card.card_images === 'string' && card.card_images.trim()) {
    cardImages = card.card_images.trim().split(/\s+/);
  }
  
  const description = card.description || '';
  
  return {
    id: parseInt(card.nid),
    name: card.title || 'Untitled',
    location: 'Dubai', // Default location
    category: card.card_for_page || 'hotels',
    rating: 5, // Default rating
    price: parseFloat(card.card_original_price) || 0,
    agentPrice: parseFloat(card.card_agent_price) || 0,
    discountedPrice: parseFloat(card.card_discounted_price) || 0,
    image: cardImages[0] || '/placeholder.svg',
    images: cardImages,
    description: description.replace(/<[^>]*>/g, ''), // Strip HTML tags
    isFlashSale: card.is_card_flash_sale_avail === '1',
    flashSaleText: card.flash_sale_text || '',
    isPopular: card.is_card_flash_sale_avail === '1', // Flash sale items as popular
  };
};

// Transform Drupal card to Holiday interface
const transformDrupalCardToHoliday = (card: DrupalCard): Holiday => {
  let cardImages: string[] = [];
  if (Array.isArray(card.card_images)) {
    cardImages = card.card_images;
  } else if (typeof card.card_images === 'string' && card.card_images.trim()) {
    cardImages = card.card_images.trim().split(/\s+/);
  }
  
  const description = card.description || '';
  
  return {
    id: parseInt(card.nid),
    name: card.title || 'Untitled',
    destination: 'Dubai', // Default destination
    duration: '3-5 Days', // Default duration
    category: card.card_for_page || 'holidays',
    rating: 5, // Default rating
    price: parseFloat(card.card_original_price) || 0,
    agentPrice: parseFloat(card.card_agent_price) || 0,
    discountedPrice: parseFloat(card.card_discounted_price) || 0,
    image: cardImages[0] || '/placeholder.svg',
    images: cardImages,
    description: description.replace(/<[^>]*>/g, ''),
    isFlashSale: card.is_card_flash_sale_avail === '1',
    flashSaleText: card.flash_sale_text || '',
    isPopular: card.is_card_flash_sale_avail === '1',
  };
};

// Transform Drupal card to Cruise interface
const transformDrupalCardToCruise = (card: DrupalCard): Cruise => {
  let cardImages: string[] = [];
  if (Array.isArray(card.card_images)) {
    cardImages = card.card_images;
  } else if (typeof card.card_images === 'string' && card.card_images.trim()) {
    cardImages = card.card_images.trim().split(/\s+/);
  }
  
  const description = card.description || '';
  
  return {
    id: parseInt(card.nid),
    name: card.title || 'Untitled',
    departure: 'Dubai Marina', // Default departure
    destination: 'Dubai Creek', // Default destination
    duration: '2-3 Hours', // Default duration
    category: card.card_for_page || 'cruise',
    rating: 5, // Default rating
    price: parseFloat(card.card_original_price) || 0,
    agentPrice: parseFloat(card.card_agent_price) || 0,
    discountedPrice: parseFloat(card.card_discounted_price) || 0,
    image: cardImages[0] || '/placeholder.svg',
    images: cardImages,
    description: description.replace(/<[^>]*>/g, ''),
    isFlashSale: card.is_card_flash_sale_avail === '1',
    flashSaleText: card.flash_sale_text || '',
    isPopular: card.is_card_flash_sale_avail === '1',
  };
};

// Transform Drupal card to Activity interface
const transformDrupalCardToActivity = (card: DrupalCard): Activity => {
  const baseUrl = import.meta.env.VITE_DRUPAL_BASE_URL || 'https://b2b.arabianvibesllc.com';
  
  let cardImages: string[] = [];
  if (Array.isArray(card.card_images)) {
    cardImages = card.card_images;
  } else if (typeof card.card_images === 'string' && card.card_images.trim()) {
    cardImages = card.card_images.trim().split(/\s+/);
  }
  
  // Transform image paths to full URLs
  const fullImageUrls = cardImages.map(imagePath => {
    if (!imagePath) return '/placeholder.svg';
    
    // If already a full URL, return as is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // If it's a relative path, construct full URL
    if (imagePath.startsWith('public://')) {
      // Drupal public:// format -> convert to sites/default/files
      return `${baseUrl}/sites/default/files/${imagePath.replace('public://', '')}`;
    } else if (imagePath.startsWith('/sites/default/files/')) {
      // Already in correct format, just add base URL
      return `${baseUrl}${imagePath}`;
    } else if (imagePath.startsWith('/')) {
      // Root relative path
      return `${baseUrl}${imagePath}`;
    } else {
      // Relative filename - assume it's in files directory
      return `${baseUrl}/sites/default/files/${imagePath}`;
    }
  });
  
  const description = card.description || '';
  
  return {
    id: parseInt(card.nid),
    name: card.title || 'Untitled',
    location: 'Dubai', // Default location
    duration: '1-2 Hours', // Default duration
    category: card.card_for_page || 'activities',
    rating: 5, // Default rating
    price: parseFloat(card.card_original_price) || 0,
    agentPrice: parseFloat(card.card_agent_price) || 0,
    discountedPrice: parseFloat(card.card_discounted_price) || 0,
    image: fullImageUrls[0] || '/placeholder.svg',
    images: fullImageUrls,
    description: description.replace(/<[^>]*>/g, ''),
    isFlashSale: card.is_card_flash_sale_avail === '1',
    flashSaleText: card.flash_sale_text || '',
    isPopular: card.is_card_flash_sale_avail === '1',
  };
};

// Apply client-side filters for hotels
const applyHotelFilters = (hotels: Hotel[], params: HotelSearchParams): Hotel[] => {
  let filtered = [...hotels];

  if (params.searchQuery) {
    const query = params.searchQuery.toLowerCase();
    filtered = filtered.filter(hotel =>
      hotel.name.toLowerCase().includes(query) ||
      hotel.description?.toLowerCase().includes(query) ||
      hotel.location.toLowerCase().includes(query)
    );
  }

  if (params.location) {
    filtered = filtered.filter(hotel =>
      hotel.location.toLowerCase().includes(params.location!.toLowerCase())
    );
  }

  if (params.category) {
    filtered = filtered.filter(hotel =>
      hotel.category.toLowerCase().includes(params.category!.toLowerCase())
    );
  }

  if (params.minRating && params.minRating > 0) {
    filtered = filtered.filter(hotel => hotel.rating >= params.minRating!);
  }

  if (params.minPrice && params.minPrice > 0) {
    filtered = filtered.filter(hotel => hotel.price >= params.minPrice!);
  }

  if (params.maxPrice && params.maxPrice > 0) {
    filtered = filtered.filter(hotel => hotel.price <= params.maxPrice!);
  }

  return filtered;
};

// Apply client-side filters for holidays
const applyHolidayFilters = (holidays: Holiday[], params: HolidaySearchParams): Holiday[] => {
  let filtered = [...holidays];

  if (params.searchQuery) {
    const query = params.searchQuery.toLowerCase();
    filtered = filtered.filter(holiday =>
      holiday.name.toLowerCase().includes(query) ||
      holiday.description?.toLowerCase().includes(query) ||
      holiday.destination.toLowerCase().includes(query)
    );
  }

  if (params.destination) {
    filtered = filtered.filter(holiday =>
      holiday.destination.toLowerCase().includes(params.destination!.toLowerCase())
    );
  }

  if (params.duration) {
    filtered = filtered.filter(holiday =>
      holiday.duration.toLowerCase().includes(params.duration!.toLowerCase())
    );
  }

  if (params.category) {
    filtered = filtered.filter(holiday =>
      holiday.category.toLowerCase().includes(params.category!.toLowerCase())
    );
  }

  if (params.minRating && params.minRating > 0) {
    filtered = filtered.filter(holiday => holiday.rating >= params.minRating!);
  }

  if (params.minPrice && params.minPrice > 0) {
    filtered = filtered.filter(holiday => holiday.price >= params.minPrice!);
  }

  if (params.maxPrice && params.maxPrice > 0) {
    filtered = filtered.filter(holiday => holiday.price <= params.maxPrice!);
  }

  return filtered;
};

// Apply client-side filters for cruises
const applyCruiseFilters = (cruises: Cruise[], params: CruiseSearchParams): Cruise[] => {
  let filtered = [...cruises];

  if (params.searchQuery) {
    const query = params.searchQuery.toLowerCase();
    filtered = filtered.filter(cruise =>
      cruise.name.toLowerCase().includes(query) ||
      cruise.description?.toLowerCase().includes(query) ||
      cruise.departure.toLowerCase().includes(query) ||
      cruise.destination.toLowerCase().includes(query)
    );
  }

  if (params.departure) {
    filtered = filtered.filter(cruise =>
      cruise.departure.toLowerCase().includes(params.departure!.toLowerCase())
    );
  }

  if (params.destination) {
    filtered = filtered.filter(cruise =>
      cruise.destination.toLowerCase().includes(params.destination!.toLowerCase())
    );
  }

  if (params.duration) {
    filtered = filtered.filter(cruise =>
      cruise.duration.toLowerCase().includes(params.duration!.toLowerCase())
    );
  }

  if (params.category) {
    filtered = filtered.filter(cruise =>
      cruise.category.toLowerCase().includes(params.category!.toLowerCase())
    );
  }

  if (params.minRating && params.minRating > 0) {
    filtered = filtered.filter(cruise => cruise.rating >= params.minRating!);
  }

  if (params.minPrice && params.minPrice > 0) {
    filtered = filtered.filter(cruise => cruise.price >= params.minPrice!);
  }

  if (params.maxPrice && params.maxPrice > 0) {
    filtered = filtered.filter(cruise => cruise.price <= params.maxPrice!);
  }

  return filtered;
};

// Apply client-side filters for activities
const applyActivityFilters = (activities: Activity[], params: ActivitySearchParams): Activity[] => {
  let filtered = [...activities];

  if (params.searchQuery) {
    const query = params.searchQuery.toLowerCase();
    filtered = filtered.filter(activity =>
      activity.name.toLowerCase().includes(query) ||
      activity.description?.toLowerCase().includes(query) ||
      activity.location.toLowerCase().includes(query)
    );
  }

  if (params.location) {
    filtered = filtered.filter(activity =>
      activity.location.toLowerCase().includes(params.location!.toLowerCase())
    );
  }

  if (params.duration) {
    filtered = filtered.filter(activity =>
      activity.duration.toLowerCase().includes(params.duration!.toLowerCase())
    );
  }

  if (params.category) {
    filtered = filtered.filter(activity =>
      activity.category.toLowerCase().includes(params.category!.toLowerCase())
    );
  }

  if (params.minRating && params.minRating > 0) {
    filtered = filtered.filter(activity => activity.rating >= params.minRating!);
  }

  if (params.minPrice && params.minPrice > 0) {
    filtered = filtered.filter(activity => activity.price >= params.minPrice!);
  }

  if (params.maxPrice && params.maxPrice > 0) {
    filtered = filtered.filter(activity => activity.price <= params.maxPrice!);
  }

  return filtered;
};

// Main hotel API service
export const hotelApi = {
  // Get hotels from Drupal cards
  async getHotels(params: HotelSearchParams = {}): Promise<HotelSearchResponse> {
    try {
      // Fetch hotels from Drupal API
      const response = await drupalApi.get(`${DRUPAL_CONFIG.endpoints.cards}/${DRUPAL_CONFIG.cardTypes.HOTELS}`);
      
      // Validate response - API returns direct array
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid response format from Drupal API');
      }
      
      // Transform and filter data
      const allHotels = response.data.map(transformDrupalCardToHotel);
      const filteredHotels = applyHotelFilters(allHotels, params);
      
      // Apply pagination
      const page = params.page || 1;
      const limit = params.limit || 20;
      const total = filteredHotels.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedHotels = filteredHotels.slice(startIndex, endIndex);

      return {
        hotels: paginatedHotels,
        total,
        page,
        totalPages
      };
    } catch (error) {
      console.error('Error fetching hotels:', error);
      throw new Error('Failed to fetch hotels from server');
    }
  },

  // Get a single hotel by ID
  async getHotelById(id: number): Promise<Hotel> {
    try {
      // Get all hotels and find the specific one
      const response = await drupalApi.get(`${DRUPAL_CONFIG.endpoints.cards}/${DRUPAL_CONFIG.cardTypes.HOTELS}`);
      
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid response format from Drupal API');
      }
      
      const allHotels = response.data.map(transformDrupalCardToHotel);
      
      const hotel = allHotels.find(h => h.id === id);
      if (!hotel) {
        throw new Error('Hotel not found');
      }
      
      return hotel;
    } catch (error) {
      console.error('Error fetching hotel by ID:', error);
      throw new Error('Failed to fetch hotel details');
    }
  },

  // Get popular hotels (flash sale items)
  async getPopularHotels(limit: number = 6): Promise<Hotel[]> {
    try {
      const response = await drupalApi.get(`${DRUPAL_CONFIG.endpoints.cards}/${DRUPAL_CONFIG.cardTypes.HOTELS}`);
      
      if (!response.data || !Array.isArray(response.data)) {
        console.warn('Hotels endpoint not available');
        return [];
      }
      
      const allHotels = response.data.map(transformDrupalCardToHotel);
      
      return allHotels
        .filter(hotel => hotel.isPopular)
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching popular hotels:', error);
      throw new Error('Failed to fetch popular hotels');
    }
  },

  // Get hotels by category (using different card types)
  async getHotelsByCategory(category: string): Promise<Hotel[]> {
    try {
      // Map category to Drupal card types
      const cardType = category.toLowerCase();
      const validTypes = ['activities', 'hotels', 'holidays', 'visa', 'cruise'];
      
      if (!validTypes.includes(cardType)) {
        throw new Error('Invalid category');
      }

      const response = await drupalApi.get(`${DRUPAL_CONFIG.endpoints.cards}/${cardType}`);
      
      if (!response.data || !Array.isArray(response.data)) {
        return [];
      }
      
      return response.data.map(transformDrupalCardToHotel);
    } catch (error) {
      console.error('Error fetching hotels by category:', error);
      throw new Error('Failed to fetch hotels by category');
    }
  },

  // Get hotel suggestions for autocomplete
  async getHotelSuggestions(query: string): Promise<string[]> {
    try {
      if (query.length < 2) return [];

      const response = await drupalApi.get(`${DRUPAL_CONFIG.endpoints.cards}/${DRUPAL_CONFIG.cardTypes.HOTELS}`);
      
      if (!response.data || !Array.isArray(response.data)) {
        return [];
      }
      
      const allHotels = response.data.map(transformDrupalCardToHotel);
      
      const suggestions = allHotels
        .filter(hotel =>
          hotel.name.toLowerCase().includes(query.toLowerCase()) ||
          hotel.location.toLowerCase().includes(query.toLowerCase())
        )
        .map(hotel => hotel.name)
        .slice(0, 5);
      
      return suggestions;
    } catch (error) {
      console.error('Error fetching hotel suggestions:', error);
      throw new Error('Failed to fetch suggestions');
    }
  }
};

// Additional Drupal API services
export const drupalApiService = {
  // Get slides for specific page
  async getSlides(): Promise<any[]> {
    try {
      const response = await drupalApi.get(`${DRUPAL_CONFIG.endpoints.slides}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching slides:', error);
      throw new Error('Failed to fetch slides');
    }
  },

  // Get basic site settings
  async getBasicSettings(): Promise<any> {
    try {
      const response = await drupalApi.get(`${DRUPAL_CONFIG.endpoints.basicSettings}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching basic settings:', error);
      // Return fallback settings
      return {
        site_name: "Arabian Vibes",
        site_slogan: "Experience the Magic of Arabia",
        contact_email: "info@arabianvibes.ae",
        contact_phone: "+971 4 123 4567",
        address: "Dubai, United Arab Emirates",
        social_facebook: "https://facebook.com/arabianvibes",
        social_instagram: "https://instagram.com/arabianvibes",
        social_twitter: "https://twitter.com/arabianvibes",
        currency_default: "AED",
        languages_enabled: ["en", "ar"],
        booking_fee: 0,
        tax_rate: 5, // VAT in UAE
        business_hours: "9:00 AM - 6:00 PM",
        emergency_contact: "+971 50 123 4567",
      };
    }
  },

  // Get cards by type
  async getCardsByType(type: 'activities' | 'hotels' | 'holidays' | 'visa' | 'cruise'): Promise<DrupalCard[]> {
    try {
      const response = await drupalApi.get(`${DRUPAL_CONFIG.endpoints.cards}/${type}`);
      
      if (!response.data || !Array.isArray(response.data)) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${type} cards:`, error);
      throw new Error(`Failed to fetch ${type} cards`);
    }
  }
};

// Export default hotel API
export default hotelApi;

// Holiday API service
export const holidayApi = {
  async getHolidays(params: HolidaySearchParams = {}): Promise<HolidaySearchResponse> {
    try {
      const response = await drupalApi.get(`${DRUPAL_CONFIG.endpoints.cards}/${DRUPAL_CONFIG.cardTypes.HOLIDAYS}`);
      
      if (!response.data || !Array.isArray(response.data)) {
        // Return empty result if backend endpoint is not ready
        console.warn('Holiday endpoint not available, returning empty results');
        return {
          holidays: [],
          total: 0,
          page: 1,
          totalPages: 0
        };
      }
      
      const allHolidays = response.data.map(transformDrupalCardToHoliday);
      const filteredHolidays = applyHolidayFilters(allHolidays, params);
      
      const page = params.page || 1;
      const limit = params.limit || 20;
      const total = filteredHolidays.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedHolidays = filteredHolidays.slice(startIndex, endIndex);

      return {
        holidays: paginatedHolidays,
        total,
        page,
        totalPages
      };
    } catch (error) {
      console.warn('Holiday endpoint not available:', error);
      // Return empty result instead of throwing error
      return {
        holidays: [],
        total: 0,
        page: 1,
        totalPages: 0
      };
    }
  },

  async getHolidayById(id: number): Promise<Holiday> {
    try {
      const response = await drupalApi.get(`${DRUPAL_CONFIG.endpoints.cards}/${DRUPAL_CONFIG.cardTypes.HOLIDAYS}`);
      
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Holiday endpoint not available');
      }
      
      const allHolidays = response.data.map(transformDrupalCardToHoliday);
      const holiday = allHolidays.find(h => h.id === id);
      
      if (!holiday) {
        throw new Error('Holiday not found');
      }
      
      return holiday;
    } catch (error) {
      console.error('Error fetching holiday by ID:', error);
      throw new Error('Failed to fetch holiday details');
    }
  },

  async getPopularHolidays(limit: number = 6): Promise<Holiday[]> {
    try {
      const response = await drupalApi.get(`${DRUPAL_CONFIG.endpoints.cards}/${DRUPAL_CONFIG.cardTypes.HOLIDAYS}`);
      
      if (!response.data || !Array.isArray(response.data)) {
        console.warn('Holiday endpoint not available for popular holidays');
        return [];
      }
      
      const allHolidays = response.data.map(transformDrupalCardToHoliday);
      
      return allHolidays
        .filter(holiday => holiday.isPopular)
        .slice(0, limit);
    } catch (error) {
      console.warn('Error fetching popular holidays:', error);
      return [];
    }
  }
};

// Cruise API service
export const cruiseApi = {
  async getCruises(params: CruiseSearchParams = {}): Promise<CruiseSearchResponse> {
    try {
      const response = await drupalApi.get(`${DRUPAL_CONFIG.endpoints.cards}/${DRUPAL_CONFIG.cardTypes.CRUISE}`);
      
      if (!response.data || !Array.isArray(response.data)) {
        // Return empty result if backend endpoint is not ready
        console.warn('Cruise endpoint not available, returning empty results');
        return {
          cruises: [],
          total: 0,
          page: 1,
          totalPages: 0
        };
      }
      
      const allCruises = response.data.map(transformDrupalCardToCruise);
      const filteredCruises = applyCruiseFilters(allCruises, params);
      
      const page = params.page || 1;
      const limit = params.limit || 20;
      const total = filteredCruises.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedCruises = filteredCruises.slice(startIndex, endIndex);

      return {
        cruises: paginatedCruises,
        total,
        page,
        totalPages
      };
    } catch (error) {
      console.warn('Cruise endpoint not available:', error);
      // Return empty result instead of throwing error
      return {
        cruises: [],
        total: 0,
        page: 1,
        totalPages: 0
      };
    }
  },

  async getCruiseById(id: number): Promise<Cruise> {
    try {
      const response = await drupalApi.get(`${DRUPAL_CONFIG.endpoints.cards}/${DRUPAL_CONFIG.cardTypes.CRUISE}`);
      
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Cruise endpoint not available');
      }
      
      const allCruises = response.data.map(transformDrupalCardToCruise);
      const cruise = allCruises.find(c => c.id === id);
      
      if (!cruise) {
        throw new Error('Cruise not found');
      }
      
      return cruise;
    } catch (error) {
      console.error('Error fetching cruise by ID:', error);
      throw new Error('Failed to fetch cruise details');
    }
  },

  async getPopularCruises(limit: number = 6): Promise<Cruise[]> {
    try {
      const response = await drupalApi.get(`${DRUPAL_CONFIG.endpoints.cards}/${DRUPAL_CONFIG.cardTypes.CRUISE}`);
      
      if (!response.data || !Array.isArray(response.data)) {
        console.warn('Cruise endpoint not available for popular cruises');
        return [];
      }
      
      const allCruises = response.data.map(transformDrupalCardToCruise);
      
      return allCruises
        .filter(cruise => cruise.isPopular)
        .slice(0, limit);
    } catch (error) {
      console.warn('Error fetching popular cruises:', error);
      return [];
    }
  }
};

// Activity API service
export const activityApi = {
  async getActivities(params: ActivitySearchParams = {}): Promise<ActivitySearchResponse> {
    try {
      const response = await drupalApi.get(`${DRUPAL_CONFIG.endpoints.cards}/${DRUPAL_CONFIG.cardTypes.ACTIVITIES}`);
      
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid response format from Drupal API');
      }
      
      const allActivities = response.data.map(transformDrupalCardToActivity);
      const filteredActivities = applyActivityFilters(allActivities, params);
      
      const page = params.page || 1;
      const limit = params.limit || 20;
      const total = filteredActivities.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedActivities = filteredActivities.slice(startIndex, endIndex);

      return {
        activities: paginatedActivities,
        total,
        page,
        totalPages
      };
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw new Error('Failed to fetch activities from server');
    }
  },

  async getActivityById(id: number): Promise<Activity> {
    try {
      const response = await drupalApi.get(`${DRUPAL_CONFIG.endpoints.cards}/${DRUPAL_CONFIG.cardTypes.ACTIVITIES}`);
      
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid response format from Drupal API');
      }
      
      const allActivities = response.data.map(transformDrupalCardToActivity);
      
      const activity = allActivities.find(a => a.id === id);
      if (!activity) {
        throw new Error('Activity not found');
      }
      
      return activity;
    } catch (error) {
      console.error('Error fetching activity by ID:', error);
      throw new Error('Failed to fetch activity details');
    }
  },

  async getPopularActivities(limit: number = 6): Promise<Activity[]> {
    try {
      const response = await drupalApi.get(`${DRUPAL_CONFIG.endpoints.cards}/${DRUPAL_CONFIG.cardTypes.ACTIVITIES}`);
      
      if (!response.data || !Array.isArray(response.data)) {
        console.warn('Activities endpoint not available');
        return [];
      }
      
      const allActivities = response.data.map(transformDrupalCardToActivity);
      
      return allActivities
        .filter(activity => activity.isPopular)
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching popular activities:', error);
      throw new Error('Failed to fetch popular activities');
    }
  }
};

// Transform Drupal card to Experience interface
const transformDrupalCardToExperience = (card: DrupalCard): Experience => {
  let cardImages: string[] = [];
  if (Array.isArray(card.card_images)) {
    cardImages = card.card_images;
  } else if (typeof card.card_images === 'string' && card.card_images.trim()) {
    cardImages = card.card_images.trim().split(/\s+/);
  }
  
  // Determine city from title or default to Dubai
  let city = 'Dubai'; // Default city
  const title = (card.title || '').toLowerCase();
  const descText = (card.description || '').toLowerCase();
  
  // Check for Abu Dhabi keywords
  const abuDhabiKeywords = [
    'abu dhabi', 'abudhabi', 'emirates palace', 'louvre', 'ferrari', 
    'yas island', 'sheikh zayed', 'corniche', 'saadiyat', 'al ain',
    'warner bros', 'seaworld', 'qasr al watan', 'etihad towers'
  ];
  
  // Check for Dubai keywords (more specific ones)
  const dubaiKeywords = [
    'burj khalifa', 'dubai mall', 'palm jumeirah', 'dubai marina', 
    'atlantis', 'jumeirah', 'downtown dubai', 'deira', 'bur dubai',
    'dubai frame', 'miracle garden', 'global village', 'ski dubai'
  ];
  
  // Check Abu Dhabi first (more specific)
  if (abuDhabiKeywords.some(keyword => title.includes(keyword) || descText.includes(keyword))) {
    city = 'Abu Dhabi';
  } else if (dubaiKeywords.some(keyword => title.includes(keyword) || descText.includes(keyword))) {
    city = 'Dubai';
  }
  // If no specific keywords found, alternate between cities to ensure both have content
  else {
    city = parseInt(card.nid) % 2 === 0 ? 'Dubai' : 'Abu Dhabi';
  }
  
  const description = card.description || '';
  
  return {
    id: parseInt(card.nid),
    title: card.title || 'Untitled',
    image: cardImages[0] || '/placeholder.svg',
    rating: 4.5, // Default rating since not in Drupal data
    reviews: Math.floor(Math.random() * 500) + 10, // Random reviews for now
    price: card.card_original_price || '0.00',
    originalPrice: card.card_discounted_price !== card.card_original_price ? card.card_original_price : undefined,
    agentPrice: parseFloat(card.card_agent_price) || undefined,
    rPoints: Math.floor(parseFloat(card.card_original_price || '0') / 10), // Calculate points based on price
    isPopular: card.is_card_flash_sale_avail === '1',
    city: city,
    earnRPoints: card.is_card_flash_sale_avail === '1'
  };
};

// Experience API service
export const experienceApi = {
  // Get experiences by city
  async getExperiencesByCity(city: string): Promise<Experience[]> {
    try {
      // Use activities endpoint as it contains experience data
      const response = await drupalApi.get(`${DRUPAL_CONFIG.endpoints.cards}/${DRUPAL_CONFIG.cardTypes.ACTIVITIES}`);
      
      if (!response.data || !Array.isArray(response.data)) {
        console.warn('Experience endpoint not available, returning empty results');
        return [];
      }
      
      const allExperiences = response.data.map(transformDrupalCardToExperience);
      
      // Filter by city if specified (case insensitive)
      if (city.toLowerCase() !== 'all') {
        const filtered = allExperiences.filter(exp => 
          exp.city?.toLowerCase().includes(city.toLowerCase())
        );
        
        // If no experiences found for specific city, return a subset of all experiences
        if (filtered.length === 0) {
          return allExperiences.slice(0, 10);
        }
        
        return filtered;
      }
      
      return allExperiences;
    } catch (error) {
      console.warn('Error fetching experiences:', error);
      return [];
    }
  },

  // Get popular experiences
  async getPopularExperiences(city?: string, limit: number = 20): Promise<Experience[]> {
    try {
      const experiences = await this.getExperiencesByCity(city || 'all');
      return experiences
        .filter(exp => exp.isPopular)
        .slice(0, limit);
    } catch (error) {
      console.warn('Error fetching popular experiences:', error);
      return [];
    }
  }
};
