// Custom hooks for cruise data fetching
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Cruise, CruiseSearchParams, CruiseSearchResponse } from '../data/types';
import { cruiseApi } from '../lib/api';

// Query keys for cache management
export const cruiseKeys = {
  all: ['cruises'] as const,
  lists: () => [...cruiseKeys.all, 'list'] as const,
  list: (params: CruiseSearchParams) => [...cruiseKeys.lists(), params] as const,
  details: () => [...cruiseKeys.all, 'detail'] as const,
  detail: (id: number) => [...cruiseKeys.details(), id] as const,
  popular: () => [...cruiseKeys.all, 'popular'] as const,
  category: (category: string) => [...cruiseKeys.all, 'category', category] as const,
  suggestions: (query: string) => [...cruiseKeys.all, 'suggestions', query] as const,
};

// Hook to fetch cruises with search parameters
export const useCruises = (params: CruiseSearchParams = {}) => {
  return useQuery({
    queryKey: cruiseKeys.list(params),
    queryFn: () => cruiseApi.getCruises(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// Hook to fetch a single cruise by ID
export const useCruise = (id: number) => {
  return useQuery({
    queryKey: cruiseKeys.detail(id),
    queryFn: () => cruiseApi.getCruiseById(id),
    enabled: !!id, // Only run if ID is provided
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  });
};

// Hook to fetch popular cruises
export const usePopularCruises = (limit: number = 6) => {
  return useQuery({
    queryKey: cruiseKeys.popular(),
    queryFn: () => cruiseApi.getPopularCruises(limit),
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  });
};

// Hook for managing search state
export const useCruiseSearchState = () => {
  const [searchParams, setSearchParams] = useState<CruiseSearchParams>({
    searchQuery: '',
    departure: '',
    destination: '',
    duration: '',
    category: '',
    minRating: 0,
    page: 1,
    limit: 20,
  });

  const [hasSearched, setHasSearched] = useState(false);

  const updateSearchParams = (newParams: Partial<CruiseSearchParams>) => {
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
      departure: '',
      destination: '',
      duration: '',
      category: '',
      minRating: 0,
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
