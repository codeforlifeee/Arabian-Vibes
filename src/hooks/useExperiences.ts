import { useQuery } from '@tanstack/react-query';
import { experienceApi } from '@/lib/api';
import { Experience } from '@/data/types';

// Hook to fetch experiences by city
export const useExperiences = (city: string) => {
  return useQuery<Experience[], Error>({
    queryKey: ['experiences', city],
    queryFn: () => experienceApi.getExperiencesByCity(city),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!city, // Only run query if city is provided
  });
};

// Hook to fetch popular experiences
export const usePopularExperiences = (city?: string, limit: number = 20) => {
  return useQuery<Experience[], Error>({
    queryKey: ['popular-experiences', city, limit],
    queryFn: () => experienceApi.getPopularExperiences(city, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
