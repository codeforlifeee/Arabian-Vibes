// Simplified currency API service for AED, USD, and INR only

// Supported currencies with their symbols (simplified to 3 currencies)
export const SUPPORTED_CURRENCIES = {
  AED: '﷼',
  USD: '$',
  INR: '₹'
} as const;

export type Currency = keyof typeof SUPPORTED_CURRENCIES;

// Fallback exchange rates for offline support
const FALLBACK_RATES = {
  AED: 1, // Base currency
  USD: 0.272,
  INR: 22.65
};

// Use a free, CORS-enabled API
const API_BASE_URL = 'https://api.fxratesapi.com/latest?base=AED&currencies=USD,INR';

export const getCurrencyRates = async (): Promise<Record<Currency, number>> => {
  console.log('Fetching real-time currency rates...');
  
  try {
    const response = await fetch(API_BASE_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.success && data.rates) {
      const rates: Record<Currency, number> = {
        AED: 1, // Base currency
        USD: data.rates.USD || FALLBACK_RATES.USD,
        INR: data.rates.INR || FALLBACK_RATES.INR
      };
      
      console.log('Successfully fetched currency rates:', rates);
      return rates;
    } else {
      throw new Error('Invalid API response format');
    }
  } catch (error) {
    console.error('Failed to fetch currency rates from external API:', error);
    console.log('Using fallback currency rates...');
    return FALLBACK_RATES;
  }
};

// Get currency symbol for a given currency code
export const getCurrencySymbol = (currencyCode: Currency): string => {
  return SUPPORTED_CURRENCIES[currencyCode] || '?';
};

// Get list of supported currencies
export const getSupportedCurrencies = (): Currency[] => {
  return Object.keys(SUPPORTED_CURRENCIES) as Currency[];
};

// Convert amount from one currency to another
export const convertCurrency = (
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency,
  exchangeRates: Record<Currency, number>
): number => {
  if (fromCurrency === toCurrency) return amount;
  
  // Convert to AED first (base currency), then to target currency
  const inAED = amount / exchangeRates[fromCurrency];
  return inAED * exchangeRates[toCurrency];
};

// Format amount with currency symbol
export const formatCurrency = (
  amount: number,
  currency: Currency,
  exchangeRates?: Record<Currency, number>
): string => {
  const symbol = getCurrencySymbol(currency);
  const formattedAmount = amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  return `${symbol} ${formattedAmount}`;
};
