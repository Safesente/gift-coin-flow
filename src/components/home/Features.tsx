import { Shield, Zap, Wallet, HeadphonesIcon, Lock, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Bank-Grade Security",
    description: "Your transactions are protected with 256-bit SSL encryption and advanced fraud detection.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Most transactions complete within 1 hour. Get your payment or gift cards quickly.",
  },
  {
    icon: Wallet,
    title: "Multiple Payment Options",
    description: "Pay or receive via PayPal, Skrill, Google Pay, or Binance Pay.",
  },
  {
    icon: TrendingUp,
    title: "Best Rates",
    description: "Sell at 47% or buy at 85% - competitive rates that benefit you.",
  },
  {
    icon: Lock,
    title: "Privacy First",
    description: "Your personal data is encrypted and never shared with third parties.",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    description: "Our dedicated support team is always ready to help with any questions.",
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-foreground text-background">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Built for Trust & Speed
          </h2>
          <p className="text-background/60 max-w-2xl mx-auto">
            We've designed every aspect of gXchange to give you the best gift card trading experience.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl border border-background/10 bg-background/5 backdrop-blur-sm transition-all duration-300 hover:bg-background/10 hover:border-primary/30"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-background/60">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
