// Custom hooks for activity data fetching
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Activity, ActivitySearchParams, ActivitySearchResponse } from '../data/types';
import { activityApi } from '../lib/api';
// Query keys for cache management
export const activityKeys = {
  all: ['activities'] as const,
  lists: () => [...activityKeys.all, 'list'] as const,
  list: (params: ActivitySearchParams) => [...activityKeys.lists(), params] as const,
  details: () => [...activityKeys.all, 'detail'] as const,
  detail: (id: number) => [...activityKeys.details(), id] as const,
  popular: () => [...activityKeys.all, 'popular'] as const,
  category: (category: string) => [...activityKeys.all, 'category', category] as const,
  suggestions: (query: string) => [...activityKeys.all, 'suggestions', query] as const,
};
// Hook to fetch activities with search parameters
export const useActivities = (params: ActivitySearchParams = {}) => {
  return useQuery({
    queryKey: activityKeys.list(params),
    queryFn: () => activityApi.getActivities(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
// Hook to fetch a single activity by ID
export const useActivity = (id: number) => {
  return useQuery({
    queryKey: activityKeys.detail(id),
    queryFn: () => activityApi.getActivityById(id),
    enabled: !!id, // Only run if ID is provided
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  });
};
// Hook to fetch popular activities
export const usePopularActivities = (limit: number = 6) => {
  return useQuery({
    queryKey: activityKeys.popular(),
    queryFn: () => activityApi.getPopularActivities(limit),
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  });
};
// Hook for managing search state
export const useActivitySearchState = () => {
  const [searchParams, setSearchParams] = useState<ActivitySearchParams>({
    searchQuery: '',
    location: '',
    duration: '',
    category: '',
    minRating: 0,
    page: 1,
    limit: 20,
  });
  const [hasSearched, setHasSearched] = useState(false);
  const updateSearchParams = (newParams: Partial<ActivitySearchParams>) => {
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
