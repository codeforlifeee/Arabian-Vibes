// Drupal-specific React Query hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { drupalApiService } from '../lib/api';
import { authService } from '../lib/auth';

// Query keys for Drupal APIs
export const drupalKeys = {
  slides: ['drupal', 'slides'] as const,
  settings: ['drupal', 'settings'] as const,
  cards: (type: string) => ['drupal', 'cards', type] as const,
};

// Hook to fetch slides
export const useSlides = () => {
  return useQuery({
    queryKey: drupalKeys.slides,
    queryFn: () => drupalApiService.getSlides(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  });
};

// Hook to fetch basic site settings
export const useBasicSettings = () => {
  return useQuery({
    queryKey: drupalKeys.settings,
    queryFn: () => drupalApiService.getBasicSettings(),
    staleTime: 30 * 60 * 1000, // 30 minutes - settings don't change often
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 2,
  });
};

// Hook to fetch cards by type
export const useCardsByType = (type: 'activities' | 'hotels' | 'holidays' | 'visa' | 'cruise') => {
  return useQuery({
    queryKey: drupalKeys.cards(type),
    queryFn: () => drupalApiService.getCardsByType(type),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 2,
    enabled: !!type, // Only run if type is provided
  });
};

// Authentication hooks
export const useAuth = () => {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      return await authService.login(credentials);
    },
    onSuccess: () => {
      // Invalidate all queries when user logs in to refresh data with auth
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });

  const logout = () => {
    authService.logout();
    queryClient.clear(); // Clear all cached data when logging out
  };

  return {
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    logout,
    isAuthenticated: authService.isAuthenticated(),
    isAgent: authService.isAuthenticated(), // Assuming logged in users are agents
  };
};
