// Core types for the application

// Activity Types
export interface Activity {
  id: number;
  name: string;
  location: string;
  duration: string;
  category: string;
  rating: number;
  price: number;
  agentPrice?: number;
  discountedPrice?: number;
  image: string;
  images?: string[];
  description?: string;
  isFlashSale?: boolean;
  flashSaleText?: string;
  isPopular?: boolean;
}

export interface ActivitySearchParams {
  searchQuery?: string;
  location?: string;
  duration?: string;
  category?: string;
  minRating?: number;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export interface ActivitySearchResponse {
  activities: Activity[];
  total: number;
  page: number;
  totalPages: number;
}

// Hotel Types
export interface Hotel {
  id: number;
  name: string;
  location: string;
  category: string;
  rating: number;
  price: number;
  agentPrice?: number;
  discountedPrice?: number;
  image: string;
  images?: string[];
  description?: string;
  amenities?: string[];
  isFlashSale?: boolean;
  flashSaleText?: string;
  isPopular?: boolean;
}

export interface HotelSearchParams {
  searchQuery?: string;
  location?: string;
  category?: string;
  minRating?: number;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export interface HotelSearchResponse {
  hotels: Hotel[];
  total: number;
  page: number;
  totalPages: number;
}

// Holiday Types
export interface Holiday {
  id: number;
  name: string;
  destination: string;
  duration: string;
  category: string;
  rating: number;
  price: number;
  agentPrice?: number;
  discountedPrice?: number;
  image: string;
  images?: string[];
  description?: string;
  includes?: string[];
  isFlashSale?: boolean;
  flashSaleText?: string;
  isPopular?: boolean;
}

export interface HolidaySearchParams {
  searchQuery?: string;
  destination?: string;
  duration?: string;
  category?: string;
  minRating?: number;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export interface HolidaySearchResponse {
  holidays: Holiday[];
  total: number;
  page: number;
  totalPages: number;
}

// Cruise Types
export interface Cruise {
  id: number;
  name: string;
  destination: string;
  departure?: string;
  duration: string;
  category: string;
  rating: number;
  price: number;
  agentPrice?: number;
  discountedPrice?: number;
  image: string;
  images?: string[];
  description?: string;
  amenities?: string[];
  isFlashSale?: boolean;
  flashSaleText?: string;
  isPopular?: boolean;
}

export interface CruiseSearchParams {
  searchQuery?: string;
  destination?: string;
  departure?: string;
  duration?: string;
  category?: string;
  minRating?: number;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export interface CruiseSearchResponse {
  cruises: Cruise[];
  total: number;
  page: number;
  totalPages: number;
}

// Experience Types
export interface Experience {
  id: number;
  title: string;
  location: string;
  city: string;
  rating: number;
  reviews?: number;
  price: number;
  originalPrice?: number;
  agentPrice?: number;
  discountedPrice?: number;
  rPoints?: number;
  earnRPoints?: boolean;
  image: string;
  images?: string[];
  description?: string;
  category?: string;
  isFlashSale?: boolean;
  flashSaleText?: string;
  isPopular?: boolean;
}

// Drupal API Types
export interface DrupalCard {
  nid: string;
  title: string;
  description?: string;
  card_original_price: string;
  card_agent_price?: string;
  card_discounted_price?: string;
  card_images?: string[] | string;
  is_card_flash_sale_avail?: string | boolean;
  flash_sale_text?: string;
  card_for_page?: string;
  sub_page_type?: string;
}

export interface DrupalApiResponse {
  data: DrupalCard[];
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

// Slider Types
export interface Slide {
  id: string;
  title: string;
  image: string;
  images?: string[];
  description?: string;
  link?: string;
}

// Site Settings Types
export interface SiteSettings {
  siteName: string;
  siteSlogan?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'agent';
}

// Cart Types
export interface CartItem {
  id: string;
  type: 'activity' | 'hotel' | 'holiday' | 'cruise';
  name: string;
  price: number;
  quantity: number;
  image?: string;
}
