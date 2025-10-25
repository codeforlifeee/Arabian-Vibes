// Custom hooks for holiday data fetching
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Holiday, HolidaySearchParams, HolidaySearchResponse } from '../data/types';
import { holidayApi } from '../lib/api';

// Query keys for cache management
export const holidayKeys = {
  all: ['holidays'] as const,
  lists: () => [...holidayKeys.all, 'list'] as const,
  list: (params: HolidaySearchParams) => [...holidayKeys.lists(), params] as const,
  details: () => [...holidayKeys.all, 'detail'] as const,
  detail: (id: number) => [...holidayKeys.details(), id] as const,
  popular: () => [...holidayKeys.all, 'popular'] as const,
  category: (category: string) => [...holidayKeys.all, 'category', category] as const,
  suggestions: (query: string) => [...holidayKeys.all, 'suggestions', query] as const,
};

// Hook to fetch holidays with search parameters
export const useHolidays = (params: HolidaySearchParams = {}) => {
  return useQuery({
    queryKey: holidayKeys.list(params),
    queryFn: () => holidayApi.getHolidays(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// Hook to fetch a single holiday by ID
export const useHoliday = (id: number) => {
  return useQuery({
    queryKey: holidayKeys.detail(id),
    queryFn: () => holidayApi.getHolidayById(id),
    enabled: !!id, // Only run if ID is provided
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  });
};

// Hook to fetch popular holidays
export const usePopularHolidays = (limit: number = 6) => {
  return useQuery({
    queryKey: holidayKeys.popular(),
    queryFn: () => holidayApi.getPopularHolidays(limit),
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  });
};

// Hook for managing search state
export const useHolidaySearchState = () => {
  const [searchParams, setSearchParams] = useState<HolidaySearchParams>({
    searchQuery: '',
    destination: '',
    duration: '',
    minRating: 0,
    category: '',
    page: 1,
    limit: 20,
  });

  const [hasSearched, setHasSearched] = useState(false);

  const updateSearchParams = (newParams: Partial<HolidaySearchParams>) => {
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
      destination: '',
      duration: '',
      minRating: 0,
      category: '',
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
