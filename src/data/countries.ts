export interface Country {
  code: string;
  name: string;
  currency_code: string;
  currency_symbol: string;
}

export const countries: Country[] = [
  { code: "US", name: "United States", currency_code: "USD", currency_symbol: "$" },
  { code: "UK", name: "United Kingdom", currency_code: "GBP", currency_symbol: "£" },
  { code: "CA", name: "Canada", currency_code: "CAD", currency_symbol: "C$" },
  { code: "AU", name: "Australia", currency_code: "AUD", currency_symbol: "A$" },
  { code: "DE", name: "Germany", currency_code: "EUR", currency_symbol: "€" },
  { code: "FR", name: "France", currency_code: "EUR", currency_symbol: "€" },
  { code: "IT", name: "Italy", currency_code: "EUR", currency_symbol: "€" },
  { code: "ES", name: "Spain", currency_code: "EUR", currency_symbol: "€" },
  { code: "NL", name: "Netherlands", currency_code: "EUR", currency_symbol: "€" },
  { code: "BE", name: "Belgium", currency_code: "EUR", currency_symbol: "€" },
  { code: "AT", name: "Austria", currency_code: "EUR", currency_symbol: "€" },
  { code: "CH", name: "Switzerland", currency_code: "CHF", currency_symbol: "CHF" },
  { code: "SE", name: "Sweden", currency_code: "SEK", currency_symbol: "kr" },
  { code: "NO", name: "Norway", currency_code: "NOK", currency_symbol: "kr" },
  { code: "DK", name: "Denmark", currency_code: "DKK", currency_symbol: "kr" },
  { code: "FI", name: "Finland", currency_code: "EUR", currency_symbol: "€" },
  { code: "IE", name: "Ireland", currency_code: "EUR", currency_symbol: "€" },
  { code: "NZ", name: "New Zealand", currency_code: "NZD", currency_symbol: "NZ$" },
  { code: "JP", name: "Japan", currency_code: "JPY", currency_symbol: "¥" },
  { code: "KR", name: "South Korea", currency_code: "KRW", currency_symbol: "₩" },
  { code: "SG", name: "Singapore", currency_code: "SGD", currency_symbol: "S$" },
  { code: "HK", name: "Hong Kong", currency_code: "HKD", currency_symbol: "HK$" },
  { code: "AE", name: "United Arab Emirates", currency_code: "AED", currency_symbol: "د.إ" },
  { code: "SA", name: "Saudi Arabia", currency_code: "SAR", currency_symbol: "﷼" },
  { code: "BR", name: "Brazil", currency_code: "BRL", currency_symbol: "R$" },
  { code: "MX", name: "Mexico", currency_code: "MXN", currency_symbol: "$" },
  { code: "IN", name: "India", currency_code: "INR", currency_symbol: "₹" },
  { code: "ZA", name: "South Africa", currency_code: "ZAR", currency_symbol: "R" },
  { code: "NG", name: "Nigeria", currency_code: "NGN", currency_symbol: "₦" },
];

export const getCountryByCode = (code: string): Country | undefined => {
  return countries.find(c => c.code === code);
};
