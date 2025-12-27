export interface GiftCard {
  id: string;
  name: string;
  logo: string;
  gradient: string;
  category: string;
  popular?: boolean;
}

export const giftCards: GiftCard[] = [
  { id: "amazon", name: "Amazon", logo: "https://logo.clearbit.com/amazon.com", gradient: "from-orange-500 to-orange-600", category: "Shopping", popular: true },
  { id: "apple", name: "Apple / iTunes", logo: "https://logo.clearbit.com/apple.com", gradient: "from-gray-800 to-gray-900", category: "Entertainment", popular: true },
  { id: "google-play", name: "Google Play", logo: "https://logo.clearbit.com/play.google.com", gradient: "from-green-500 to-green-600", category: "Entertainment", popular: true },
  { id: "steam", name: "Steam", logo: "https://logo.clearbit.com/steampowered.com", gradient: "from-blue-600 to-blue-700", category: "Gaming", popular: true },
  { id: "netflix", name: "Netflix", logo: "https://logo.clearbit.com/netflix.com", gradient: "from-red-600 to-red-700", category: "Entertainment", popular: true },
  { id: "playstation", name: "PlayStation", logo: "https://logo.clearbit.com/playstation.com", gradient: "from-blue-700 to-blue-800", category: "Gaming", popular: true },
  { id: "xbox", name: "Xbox", logo: "https://logo.clearbit.com/xbox.com", gradient: "from-green-600 to-green-700", category: "Gaming", popular: true },
  { id: "visa", name: "Visa Gift Card", logo: "https://logo.clearbit.com/visa.com", gradient: "from-blue-500 to-blue-600", category: "Finance", popular: true },
  { id: "mastercard", name: "Mastercard", logo: "https://logo.clearbit.com/mastercard.com", gradient: "from-red-500 to-orange-500", category: "Finance" },
  { id: "ebay", name: "eBay", logo: "https://logo.clearbit.com/ebay.com", gradient: "from-yellow-500 to-red-500", category: "Shopping" },
  { id: "spotify", name: "Spotify", logo: "https://logo.clearbit.com/spotify.com", gradient: "from-green-400 to-green-600", category: "Entertainment" },
  { id: "uber", name: "Uber", logo: "https://logo.clearbit.com/uber.com", gradient: "from-gray-900 to-gray-800", category: "Services" },
  { id: "uber-eats", name: "Uber Eats", logo: "https://logo.clearbit.com/ubereats.com", gradient: "from-green-500 to-green-700", category: "Food" },
  { id: "doordash", name: "DoorDash", logo: "https://logo.clearbit.com/doordash.com", gradient: "from-red-500 to-red-600", category: "Food" },
  { id: "grubhub", name: "Grubhub", logo: "https://logo.clearbit.com/grubhub.com", gradient: "from-orange-500 to-red-500", category: "Food" },
  { id: "starbucks", name: "Starbucks", logo: "https://logo.clearbit.com/starbucks.com", gradient: "from-green-600 to-green-700", category: "Food" },
  { id: "target", name: "Target", logo: "https://logo.clearbit.com/target.com", gradient: "from-red-600 to-red-700", category: "Shopping" },
  { id: "walmart", name: "Walmart", logo: "https://logo.clearbit.com/walmart.com", gradient: "from-blue-600 to-yellow-500", category: "Shopping" },
  { id: "bestbuy", name: "Best Buy", logo: "https://logo.clearbit.com/bestbuy.com", gradient: "from-blue-700 to-yellow-500", category: "Shopping" },
  { id: "home-depot", name: "Home Depot", logo: "https://logo.clearbit.com/homedepot.com", gradient: "from-orange-500 to-orange-600", category: "Shopping" },
  { id: "lowes", name: "Lowe's", logo: "https://logo.clearbit.com/lowes.com", gradient: "from-blue-700 to-blue-800", category: "Shopping" },
  { id: "sephora", name: "Sephora", logo: "https://logo.clearbit.com/sephora.com", gradient: "from-gray-900 to-gray-800", category: "Shopping" },
  { id: "nordstrom", name: "Nordstrom", logo: "https://logo.clearbit.com/nordstrom.com", gradient: "from-gray-700 to-gray-800", category: "Shopping" },
  { id: "nike", name: "Nike", logo: "https://logo.clearbit.com/nike.com", gradient: "from-gray-900 to-gray-800", category: "Shopping" },
  { id: "adidas", name: "Adidas", logo: "https://logo.clearbit.com/adidas.com", gradient: "from-gray-800 to-gray-900", category: "Shopping" },
  { id: "disney-plus", name: "Disney+", logo: "https://logo.clearbit.com/disneyplus.com", gradient: "from-blue-600 to-blue-800", category: "Entertainment" },
  { id: "hulu", name: "Hulu", logo: "https://logo.clearbit.com/hulu.com", gradient: "from-green-500 to-green-600", category: "Entertainment" },
  { id: "hbo-max", name: "HBO Max", logo: "https://logo.clearbit.com/hbomax.com", gradient: "from-purple-600 to-purple-800", category: "Entertainment" },
  { id: "youtube", name: "YouTube Premium", logo: "https://logo.clearbit.com/youtube.com", gradient: "from-red-500 to-red-600", category: "Entertainment" },
  { id: "nintendo", name: "Nintendo eShop", logo: "https://logo.clearbit.com/nintendo.com", gradient: "from-red-500 to-red-600", category: "Gaming" },
  { id: "roblox", name: "Roblox", logo: "https://logo.clearbit.com/roblox.com", gradient: "from-red-500 to-gray-800", category: "Gaming" },
  { id: "fortnite", name: "Fortnite V-Bucks", logo: "https://logo.clearbit.com/epicgames.com", gradient: "from-purple-500 to-blue-500", category: "Gaming" },
  { id: "american-express", name: "American Express", logo: "https://logo.clearbit.com/americanexpress.com", gradient: "from-blue-700 to-blue-800", category: "Finance" },
  { id: "vanilla", name: "Vanilla Gift Card", logo: "https://logo.clearbit.com/vanillagift.com", gradient: "from-orange-400 to-orange-500", category: "Finance" },
  { id: "zappos", name: "Zappos", logo: "https://logo.clearbit.com/zappos.com", gradient: "from-orange-500 to-orange-600", category: "Shopping" },
  { id: "airbnb", name: "Airbnb", logo: "https://logo.clearbit.com/airbnb.com", gradient: "from-pink-500 to-red-500", category: "Services" },
  { id: "lyft", name: "Lyft", logo: "https://logo.clearbit.com/lyft.com", gradient: "from-pink-500 to-pink-600", category: "Services" },
  { id: "hotels-com", name: "Hotels.com", logo: "https://logo.clearbit.com/hotels.com", gradient: "from-red-500 to-red-600", category: "Services" },
  { id: "expedia", name: "Expedia", logo: "https://logo.clearbit.com/expedia.com", gradient: "from-yellow-500 to-yellow-600", category: "Services" },
  { id: "gamestop", name: "GameStop", logo: "https://logo.clearbit.com/gamestop.com", gradient: "from-red-600 to-red-700", category: "Gaming" },
];

export const categories = ["All", "Shopping", "Entertainment", "Gaming", "Food", "Services", "Finance"];

export const SELL_RATE = 0.47; // 47%
export const BUY_RATE = 0.85; // 85%

export const cardAmounts = [10, 15, 20, 25, 50, 100, 150, 200, 250, 500];

export const paymentMethods = [
  { id: "paypal", name: "PayPal", icon: "P" },
  { id: "skrill", name: "Skrill", icon: "S" },
  { id: "google-pay", name: "Google Pay", icon: "G" },
  { id: "binance", name: "Binance Pay", icon: "B" },
];
