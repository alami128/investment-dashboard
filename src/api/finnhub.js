const API_KEY = 'd7o8a21r01qmqe7idvqgd7o8a21r01qmqe7idvr0'; // Replace with your key!
const BASE_URL = 'https://finnhub.io/api/v1';

// Cache for prices (to avoid too many API calls)
const priceCache = {};
const CACHE_DURATION = 10000; // 10 seconds

export async function getStockPrice(ticker) {
  try {
    // Check cache first
    if (priceCache[ticker] && Date.now() - priceCache[ticker].timestamp < CACHE_DURATION) {
      return priceCache[ticker].price;
    }

    const response = await fetch(
      `${BASE_URL}/quote?symbol=${ticker}&token=${API_KEY}`
    );

    if (!response.ok) {
      console.warn(`Failed to fetch price for ${ticker}`);
      return null;
    }

    const data = await response.json();
    const price = data.c; // Current price

    // Cache the result
    priceCache[ticker] = {
      price,
      timestamp: Date.now(),
    };

    return price;
  } catch (error) {
    console.error(`Error fetching price for ${ticker}:`, error);
    return null;
  }
}

export async function getMultiplePrices(tickers) {
  const prices = {};
  
  for (const ticker of tickers) {
    const price = await getStockPrice(ticker);
    if (price) {
      prices[ticker] = price;
    }
    // Add small delay to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return prices;
}
