// Custom hooks for hotel data fetching
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Hotel, HotelSearchParams, HotelSearchResponse } from '../data/types';
import { hotelApi } from '../lib/api';

// Query keys for cache management
export const hotelKeys = {
  all: ['hotels'] as const,
  lists: () => [...hotelKeys.all, 'list'] as const,
  list: (params: HotelSearchParams) => [...hotelKeys.lists(), params] as const,
  details: () => [...hotelKeys.all, 'detail'] as const,
  detail: (id: number) => [...hotelKeys.details(), id] as const,
  popular: () => [...hotelKeys.all, 'popular'] as const,
  category: (category: string) => [...hotelKeys.all, 'category', category] as const,
  suggestions: (query: string) => [...hotelKeys.all, 'suggestions', query] as const,
};

// Hook to fetch hotels with search parameters
export const useHotels = (params: HotelSearchParams = {}) => {
  return useQuery({
    queryKey: hotelKeys.list(params),
    queryFn: () => hotelApi.getHotels(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// Hook to fetch a single hotel by ID
export const useHotel = (id: number) => {
  return useQuery({
    queryKey: hotelKeys.detail(id),
    queryFn: () => hotelApi.getHotelById(id),
    enabled: !!id, // Only run if ID is provided
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  });
};

// Hook to fetch popular hotels
export const usePopularHotels = (limit: number = 6) => {
  return useQuery({
    queryKey: hotelKeys.popular(),
    queryFn: () => hotelApi.getPopularHotels(limit),
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  });
};

// Hook to fetch hotels by category
export const useHotelsByCategory = (category: string) => {
  return useQuery({
    queryKey: hotelKeys.category(category),
    queryFn: () => hotelApi.getHotelsByCategory(category),
    enabled: !!category, // Only run if category is provided
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
    retry: 2,
  });
};

// Hook to fetch hotel suggestions for autocomplete
export const useHotelSuggestions = (query: string) => {
  return useQuery({
    queryKey: hotelKeys.suggestions(query),
    queryFn: () => hotelApi.getHotelSuggestions(query),
    enabled: query.length >= 2, // Only search if query is at least 2 characters
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

// Custom hook for hotel search with debounced parameters
export const useHotelSearch = (searchParams: HotelSearchParams) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: hotelKeys.list(searchParams),
    queryFn: () => hotelApi.getHotels(searchParams),
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });

  // Function to invalidate and refetch hotel data
  const refetchHotels = () => {
    queryClient.invalidateQueries({ queryKey: hotelKeys.lists() });
  };

  // Function to prefetch hotel details
  const prefetchHotel = (id: number) => {
    queryClient.prefetchQuery({
      queryKey: hotelKeys.detail(id),
      queryFn: () => hotelApi.getHotelById(id),
      staleTime: 10 * 60 * 1000,
    });
  };

  return {
    ...query,
    refetchHotels,
    prefetchHotel,
  };
};

// Hook for managing search state with URL synchronization
export const useHotelSearchState = () => {
  const [searchParams, setSearchParams] = useState<HotelSearchParams>({
    searchQuery: '',
    location: '',
    category: '',
    minRating: 0,
    nationality: '',
    guests: '1',
    checkIn: '',
    checkOut: '',
    page: 1,
    limit: 20,
  });

  const [hasSearched, setHasSearched] = useState(false);

  const updateSearchParams = (newParams: Partial<HotelSearchParams>) => {
    setSearchParams(prev => ({
      ...prev,
      ...newParams,
      page: newParams.page || 1, // Reset to first page when filters change
    }));
    setHasSearched(true);
  };

  const resetSearch = () => {
    setSearchParams({
      searchQuery: '',
      location: '',
      category: '',
      minRating: 0,
      nationality: '',
      guests: '1',
      checkIn: '',
      checkOut: '',
      page: 1,
      limit: 20,
    });
    setHasSearched(false);
  };

  return {
    searchParams,
    hasSearched,
    updateSearchParams,
    resetSearch,
  };
};

// Additional utility hooks
export const useHotelMutations = () => {
  const queryClient = useQueryClient();

  // These would be used for actions like booking, favorites, etc.
  const addToFavorites = useMutation({
    mutationFn: async (hotelId: number) => {
      // API call to add to favorites
      // await hotelApi.addToFavorites(hotelId);
      console.log('Added to favorites:', hotelId);
    },
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: hotelKeys.all });
    },
  });

  const removeFromFavorites = useMutation({
    mutationFn: async (hotelId: number) => {
      // API call to remove from favorites
      // await hotelApi.removeFromFavorites(hotelId);
      console.log('Removed from favorites:', hotelId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hotelKeys.all });
    },
  });

  return {
    addToFavorites,
    removeFromFavorites,
  };
};
