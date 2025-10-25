// Configuration file for Drupal CMS integration (Public API - No Authentication)
export const DRUPAL_CONFIG = {
  // Drupal domain from environment variable (no trailing slash)
  baseURL: import.meta.env.VITE_DRUPAL_BASE_URL?.replace(/\/$/, '') || 'https://b2b.arabianvibesllc.com',
  
  // API endpoints (Public access)
  endpoints: {
    slides: '/api/get-slides',
    cards: '/api/get-cards',
    basicSettings: '/api/basic-settings',
  },
  
  // Available card types in Drupal (only working endpoints)
  cardTypes: {
    HOTELS: 'hotels',
    ACTIVITIES: 'activities',
    HOLIDAYS: 'holidays',
    CRUISE: 'cruise',
    VISA: 'visa',
  } as const,
  
  // Available slide pages
  slidePages: {
    HOTELS: 'hotels',
    HOLIDAYS: 'holidays',
    CRUISE: 'cruise', 
    DUBAI: 'dubai',
  } as const,
  
  // Request timeout from environment
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
};

export default DRUPAL_CONFIG;
