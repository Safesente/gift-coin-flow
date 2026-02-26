export interface BrandSEO {
  slug: string;
  name: string;
  category: string;
}

export const brandSEOData: BrandSEO[] = [
  { slug: "amazon", name: "Amazon", category: "Shopping" },
  { slug: "apple", name: "Apple", category: "Entertainment" },
  { slug: "google-play", name: "Google Play", category: "Entertainment" },
  { slug: "steam", name: "Steam", category: "Gaming" },
  { slug: "netflix", name: "Netflix", category: "Entertainment" },
  { slug: "playstation", name: "PlayStation", category: "Gaming" },
  { slug: "xbox", name: "Xbox", category: "Gaming" },
  { slug: "visa", name: "Visa", category: "Finance" },
  { slug: "ebay", name: "eBay", category: "Shopping" },
  { slug: "spotify", name: "Spotify", category: "Entertainment" },
  { slug: "uber", name: "Uber", category: "Services" },
  { slug: "starbucks", name: "Starbucks", category: "Food" },
  { slug: "target", name: "Target", category: "Shopping" },
  { slug: "walmart", name: "Walmart", category: "Shopping" },
  { slug: "bestbuy", name: "Best Buy", category: "Shopping" },
  { slug: "nike", name: "Nike", category: "Shopping" },
  { slug: "nintendo", name: "Nintendo", category: "Gaming" },
  { slug: "roblox", name: "Roblox", category: "Gaming" },
  { slug: "disney-plus", name: "Disney+", category: "Entertainment" },
  { slug: "fortnite", name: "Fortnite", category: "Gaming" },
];

export const getBrandBySlug = (slug: string): BrandSEO | undefined => {
  return brandSEOData.find((b) => b.slug === slug);
};
