import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  getCurrencyRates, 
  convertCurrency, 
  formatCurrency, 
  getCurrencySymbol,
  getSupportedCurrencies,
  type Currency,
  SUPPORTED_CURRENCIES 
} from '../lib/currencyApi';

interface CurrencyContextType {
  currentCurrency: Currency;
  exchangeRates: Record<Currency, number>;
  isLoading: boolean;
  isUsingFallback: boolean;
  lastUpdated: Date | null;
  setCurrency: (currency: Currency) => void;
  convertAmount: (amount: number, fromCurrency: Currency, toCurrency?: Currency) => number;
  formatAmount: (amount: number, currency?: Currency) => string;
  getCurrencySymbol: (currency: Currency) => string;
  getSupportedCurrencies: () => Currency[];
  refreshRates: () => Promise<void>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const CACHE_KEY = 'arabianVibes_currencyData';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

interface CachedCurrencyData {
  rates: Record<Currency, number>;
  timestamp: number;
  isUsingFallback: boolean;
}

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentCurrency, setCurrentCurrency] = useState<Currency>('AED');
  const [exchangeRates, setExchangeRates] = useState<Record<Currency, number>>({
    AED: 1,
    USD: 0.272,
    INR: 22.65
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isUsingFallback, setIsUsingFallback] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchCurrencyRates = useCallback(async () => {
    console.log('Fetching fresh currency rates from external API...');
    
    try {
      const rates = await getCurrencyRates();
      
      setExchangeRates(rates);
      setIsUsingFallback(false);
      setLastUpdated(new Date());
      
      // Cache the successful response
      const cacheData: CachedCurrencyData = {
        rates,
        timestamp: Date.now(),
        isUsingFallback: false
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      
      console.log('Currency rates updated successfully. Using live rates.');
    } catch (error) {
      console.error('Failed to fetch currency rates:', error);
      
      // Keep existing rates if fetch fails (better UX)
      setIsUsingFallback(true);
      console.log('Currency rates updated successfully. Using fallback rates.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load cached data on mount
  useEffect(() => {
    const loadCachedData = () => {
      try {
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const { rates, timestamp, isUsingFallback: wasFallback }: CachedCurrencyData = JSON.parse(cachedData);
          const age = Date.now() - timestamp;
          
          if (age < CACHE_DURATION) {
            setExchangeRates(rates);
            setIsUsingFallback(wasFallback);
            setLastUpdated(new Date(timestamp));
            console.log('Loaded cached currency data');
            return true;
          }
        }
      } catch (error) {
        console.error('Error loading cached currency data:', error);
        localStorage.removeItem(CACHE_KEY);
      }
      return false;
    };

    // Try to load cached data first
    const hasCachedData = loadCachedData();
    
    // Fetch fresh data regardless, but don't show loading if we have cache
    if (!hasCachedData) {
      setIsLoading(true);
    }
    
    fetchCurrencyRates();
  }, [fetchCurrencyRates]);

  const setCurrency = useCallback((currency: Currency) => {
    if (currency in SUPPORTED_CURRENCIES) {
      setCurrentCurrency(currency);
      localStorage.setItem('selectedCurrency', currency);
    }
  }, []);

  const convertAmount = useCallback((
    amount: number, 
    fromCurrency: Currency, 
    toCurrency: Currency = currentCurrency
  ): number => {
    return convertCurrency(amount, fromCurrency, toCurrency, exchangeRates);
  }, [currentCurrency, exchangeRates]);

  const formatAmount = useCallback((amount: number, currency: Currency = currentCurrency): string => {
    return formatCurrency(amount, currency);
  }, [currentCurrency]);

  const refreshRates = useCallback(async () => {
    setIsLoading(true);
    await fetchCurrencyRates();
  }, [fetchCurrencyRates]);

  // Load saved currency preference
  useEffect(() => {
    const savedCurrency = localStorage.getItem('selectedCurrency') as Currency;
    if (savedCurrency && savedCurrency in SUPPORTED_CURRENCIES) {
      setCurrentCurrency(savedCurrency);
    }
  }, []);

  const value: CurrencyContextType = {
    currentCurrency,
    exchangeRates,
    isLoading,
    isUsingFallback,
    lastUpdated,
    setCurrency,
    convertAmount,
    formatAmount,
    getCurrencySymbol,
    getSupportedCurrencies,
    refreshRates
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};