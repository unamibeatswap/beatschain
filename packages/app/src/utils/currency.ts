/**
 * Currency conversion utilities for BeatsChain
 */

// Cache for exchange rates to avoid excessive API calls
interface ExchangeRateCache {
  [key: string]: {
    rate: number;
    timestamp: number;
  };
}

const exchangeRateCache: ExchangeRateCache = {};
const CACHE_EXPIRY = 3600000; // 1 hour in milliseconds

/**
 * Get the current exchange rate for ETH to a fiat currency
 * @param currency Target fiat currency code (e.g., 'ZAR', 'USD')
 * @returns Exchange rate or null if unavailable
 */
export async function getEthExchangeRate(currency: string = 'ZAR'): Promise<number | null> {
  try {
    // Check cache first
    const cacheKey = `ETH_${currency}`;
    const cachedRate = exchangeRateCache[cacheKey];
    
    if (cachedRate && (Date.now() - cachedRate.timestamp) < CACHE_EXPIRY) {
      return cachedRate.rate;
    }
    
    // Fetch current rate from CoinGecko API
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=${currency.toLowerCase()}`,
      { next: { revalidate: 3600 } } // Revalidate cache every hour
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch exchange rate: ${response.status}`);
    }
    
    const data = await response.json();
    const rate = data.ethereum[currency.toLowerCase()];
    
    if (!rate) {
      throw new Error(`No exchange rate found for ${currency}`);
    }
    
    // Update cache
    exchangeRateCache[cacheKey] = {
      rate,
      timestamp: Date.now()
    };
    
    return rate;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    
    // Return fallback rates if API call fails
    const fallbackRates: Record<string, number> = {
      'ZAR': 18000,
      'USD': 1000,
      'EUR': 920,
      'GBP': 790
    };
    
    return fallbackRates[currency] || null;
  }
}

/**
 * Format ETH price with fiat equivalent
 * @param ethPrice Price in ETH
 * @param currency Target fiat currency code
 * @param exchangeRate Optional exchange rate (will be fetched if not provided)
 * @returns Formatted price string
 */
export async function formatEthWithFiat(
  ethPrice: number,
  currency: string = 'ZAR',
  exchangeRate?: number
): Promise<string> {
  try {
    const rate = exchangeRate || await getEthExchangeRate(currency);
    
    if (!rate) {
      return `${ethPrice.toFixed(4)} ETH`;
    }
    
    const fiatValue = ethPrice * rate;
    const currencySymbol = getCurrencySymbol(currency);
    
    return `${ethPrice.toFixed(4)} ETH (~${currencySymbol}${fiatValue.toLocaleString()})`;
  } catch (error) {
    console.error('Error formatting price with fiat:', error);
    return `${ethPrice.toFixed(4)} ETH`;
  }
}

/**
 * Get currency symbol for a currency code
 * @param currency Currency code
 * @returns Currency symbol
 */
export function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'ZAR': 'R',
    'JPY': '¥',
    'CNY': '¥',
    'INR': '₹',
    'AUD': 'A$',
    'CAD': 'C$'
  };
  
  return symbols[currency] || currency;
}