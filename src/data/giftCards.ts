export interface GiftCard {
  id: string;
  name: string;
  letter: string;
  gradient: string;
  category: string;
  popular?: boolean;
}

export const giftCards: GiftCard[] = [
  { id: "amazon", name: "Amazon", letter: "A", gradient: "from-orange-500 to-orange-600", category: "Shopping", popular: true },
  { id: "apple", name: "Apple / iTunes", letter: "A", gradient: "from-gray-800 to-gray-900", category: "Entertainment", popular: true },
  { id: "google-play", name: "Google Play", letter: "G", gradient: "from-green-500 to-green-600", category: "Entertainment", popular: true },
  { id: "steam", name: "Steam", letter: "S", gradient: "from-blue-600 to-blue-700", category: "Gaming", popular: true },
  { id: "netflix", name: "Netflix", letter: "N", gradient: "from-red-600 to-red-700", category: "Entertainment", popular: true },
  { id: "playstation", name: "PlayStation", letter: "P", gradient: "from-blue-700 to-blue-800", category: "Gaming", popular: true },
  { id: "xbox", name: "Xbox", letter: "X", gradient: "from-green-600 to-green-700", category: "Gaming", popular: true },
  { id: "visa", name: "Visa Gift Card", letter: "V", gradient: "from-blue-500 to-blue-600", category: "Finance", popular: true },
  { id: "mastercard", name: "Mastercard", letter: "M", gradient: "from-red-500 to-orange-500", category: "Finance" },
  { id: "ebay", name: "eBay", letter: "E", gradient: "from-yellow-500 to-red-500", category: "Shopping" },
  { id: "spotify", name: "Spotify", letter: "S", gradient: "from-green-400 to-green-600", category: "Entertainment" },
  { id: "uber", name: "Uber", letter: "U", gradient: "from-gray-900 to-gray-800", category: "Services" },
  { id: "uber-eats", name: "Uber Eats", letter: "U", gradient: "from-green-500 to-green-700", category: "Food" },
  { id: "doordash", name: "DoorDash", letter: "D", gradient: "from-red-500 to-red-600", category: "Food" },
  { id: "grubhub", name: "Grubhub", letter: "G", gradient: "from-orange-500 to-red-500", category: "Food" },
  { id: "starbucks", name: "Starbucks", letter: "S", gradient: "from-green-600 to-green-700", category: "Food" },
  { id: "target", name: "Target", letter: "T", gradient: "from-red-600 to-red-700", category: "Shopping" },
  { id: "walmart", name: "Walmart", letter: "W", gradient: "from-blue-600 to-yellow-500", category: "Shopping" },
  { id: "bestbuy", name: "Best Buy", letter: "B", gradient: "from-blue-700 to-yellow-500", category: "Shopping" },
  { id: "home-depot", name: "Home Depot", letter: "H", gradient: "from-orange-500 to-orange-600", category: "Shopping" },
  { id: "lowes", name: "Lowe's", letter: "L", gradient: "from-blue-700 to-blue-800", category: "Shopping" },
  { id: "sephora", name: "Sephora", letter: "S", gradient: "from-gray-900 to-gray-800", category: "Shopping" },
  { id: "nordstrom", name: "Nordstrom", letter: "N", gradient: "from-gray-700 to-gray-800", category: "Shopping" },
  { id: "nike", name: "Nike", letter: "N", gradient: "from-gray-900 to-gray-800", category: "Shopping" },
  { id: "adidas", name: "Adidas", letter: "A", gradient: "from-gray-800 to-gray-900", category: "Shopping" },
  { id: "disney-plus", name: "Disney+", letter: "D", gradient: "from-blue-600 to-blue-800", category: "Entertainment" },
  { id: "hulu", name: "Hulu", letter: "H", gradient: "from-green-500 to-green-600", category: "Entertainment" },
  { id: "hbo-max", name: "HBO Max", letter: "H", gradient: "from-purple-600 to-purple-800", category: "Entertainment" },
  { id: "youtube", name: "YouTube Premium", letter: "Y", gradient: "from-red-500 to-red-600", category: "Entertainment" },
  { id: "nintendo", name: "Nintendo eShop", letter: "N", gradient: "from-red-500 to-red-600", category: "Gaming" },
  { id: "roblox", name: "Roblox", letter: "R", gradient: "from-red-500 to-gray-800", category: "Gaming" },
  { id: "fortnite", name: "Fortnite V-Bucks", letter: "F", gradient: "from-purple-500 to-blue-500", category: "Gaming" },
  { id: "american-express", name: "American Express", letter: "A", gradient: "from-blue-700 to-blue-800", category: "Finance" },
  { id: "vanilla", name: "Vanilla Gift Card", letter: "V", gradient: "from-orange-400 to-orange-500", category: "Finance" },
  { id: "zappos", name: "Zappos", letter: "Z", gradient: "from-orange-500 to-orange-600", category: "Shopping" },
  { id: "airbnb", name: "Airbnb", letter: "A", gradient: "from-pink-500 to-red-500", category: "Services" },
  { id: "lyft", name: "Lyft", letter: "L", gradient: "from-pink-500 to-pink-600", category: "Services" },
  { id: "hotels-com", name: "Hotels.com", letter: "H", gradient: "from-red-500 to-red-600", category: "Services" },
  { id: "expedia", name: "Expedia", letter: "E", gradient: "from-yellow-500 to-yellow-600", category: "Services" },
  { id: "gamestop", name: "GameStop", letter: "G", gradient: "from-red-600 to-red-700", category: "Gaming" },
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
