import { Shield, Zap, Wallet, HeadphonesIcon, Lock, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Bank-Grade Security",
    description: "Every gift card transaction is protected with 256-bit SSL encryption and advanced fraud detection. Your data stays safe.",
    span: "lg:col-span-2",
  },
  {
    icon: Zap,
    title: "Instant Payout in Under 1 Hour",
    description: "Sell gift cards and get paid fast. Most payouts via PayPal or Binance Pay complete within 1 hour.",
    span: "",
  },
  {
    icon: Wallet,
    title: "PayPal & Binance Pay Supported",
    description: "Receive payouts or pay for gift cards through PayPal and Binance Pay — trusted global payment methods.",
    span: "",
  },
  {
    icon: TrendingUp,
    title: "Best Gift Card Exchange Rates",
    description: "Competitive, country-specific rates updated regularly. See your exact payout before you sell.",
    span: "lg:col-span-2",
  },
  {
    icon: Lock,
    title: "Privacy-First Platform",
    description: "Your personal data is encrypted and never shared with third parties. We take your privacy seriously.",
    span: "",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Customer Support",
    description: "Our dedicated support team is always ready to help with any gift card trading questions via live chat or email.",
    span: "",
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-foreground text-background">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
            Why 50,000+ Users Trust gXchange
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            The Secure Gift Card Exchange Platform
          </h2>
          <p className="text-background/60 max-w-2xl mx-auto md:text-lg">
            Sell gift cards for instant cash or buy discounted gift cards — with trust signals, 
            security, and speed built into every transaction.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`group p-6 md:p-8 rounded-2xl md:rounded-3xl border border-background/10 bg-background/5 backdrop-blur-sm transition-all duration-500 hover:bg-background/10 hover:border-primary/30 md:hover:-translate-y-1 ${feature.span}`}
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-primary/20 flex items-center justify-center mb-4 md:mb-6 transition-all duration-500 group-hover:scale-110 group-hover:bg-primary/30">
                <feature.icon className="w-6 h-6 md:w-7 md:h-7 text-primary" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">{feature.title}</h3>
              <p className="text-sm md:text-base text-background/60">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
