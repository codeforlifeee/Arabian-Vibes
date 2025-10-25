import { useState, useEffect } from "react";

export interface SiteSettings {
  dubaiContactNumber?: string;
  indiaContactNumber?: string;
  facebookUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  whatsappNumber?: string;
  email?: string;
  address?: string;
  siteName?: string;
  siteDescription?: string;
}

interface SiteSettingsResponse {
  data: SiteSettings;
  isLoading: boolean;
  error: string | null;
}

export const useSiteSettings = (): SiteSettingsResponse => {
  const [data, setData] = useState<SiteSettings>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const baseUrl =
          import.meta.env.VITE_DRUPAL_BASE_URL || "https://drupal-cms.vinux.in";

        const response = await fetch(`${baseUrl}/api/basic-settings`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch site settings: ${response.status}`);
        }

        const result = await response.json();

        // Map backend config keys → our React-friendly format
        const settings: SiteSettings = {
          dubaiContactNumber: result.settings?.dubai_number,
          indiaContactNumber: result.settings?.india_number,
          facebookUrl: result.settings?.facebook,
          linkedinUrl: result.settings?.linkedin,
          youtubeUrl: result.settings?.youtube,
          email: result.settings?.email,
          address: result.settings?.address,
          siteName: result.settings?.site_name || "Arabian Vibes",
          siteDescription: result.settings?.site_description || "",
        };

        setData(settings);
      } catch (err) {
        console.error("Error fetching site settings:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch site settings from backend"
        );
        setData({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchSiteSettings();
  }, []);

  return { data, isLoading, error };
};
