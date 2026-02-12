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

// Fallback/default site settings with updated contact information
const DEFAULT_SITE_SETTINGS: SiteSettings = {
  dubaiContactNumber: "+971-552763147",
  indiaContactNumber: "+91-9871163568",
  whatsappNumber: "+971-552164786",
  email: "trilok@arabianvibesllc.com",
  address: "75 Arabian Square Business Center Al Fahidi Dubai 12202",
  siteName: "Arabian Vibes LLC",
  siteDescription: "Your trusted travel partner for UAE and Middle East experiences",
};

export const useSiteSettings = (): SiteSettingsResponse => {
  const [data, setData] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
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
          dubaiContactNumber: result.settings?.dubai_number || DEFAULT_SITE_SETTINGS.dubaiContactNumber,
          indiaContactNumber: result.settings?.india_number || DEFAULT_SITE_SETTINGS.indiaContactNumber,
          facebookUrl: result.settings?.facebook,
          linkedinUrl: result.settings?.linkedin,
          youtubeUrl: result.settings?.youtube,
          email: result.settings?.email || DEFAULT_SITE_SETTINGS.email,
          address: result.settings?.address || DEFAULT_SITE_SETTINGS.address,
          siteName: result.settings?.site_name || DEFAULT_SITE_SETTINGS.siteName,
          siteDescription: result.settings?.site_description || DEFAULT_SITE_SETTINGS.siteDescription,
          whatsappNumber: result.settings?.whatsapp_number || DEFAULT_SITE_SETTINGS.whatsappNumber,
        };

        setData(settings);
      } catch (err) {
        console.error("Error fetching site settings:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch site settings from backend"
        );
        // Use default settings as fallback
        setData(DEFAULT_SITE_SETTINGS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSiteSettings();
  }, []);

  return { data, isLoading, error };
};
