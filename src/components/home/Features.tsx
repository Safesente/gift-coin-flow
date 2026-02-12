import { Shield, Zap, Wallet, HeadphonesIcon, Lock, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Bank-Grade Security",
    description: "Your transactions are protected with 256-bit SSL encryption and advanced fraud detection.",
    span: "lg:col-span-2",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Most transactions complete within 1 hour. Get your payment or gift cards quickly.",
    span: "",
  },
  {
    icon: Wallet,
    title: "Multiple Payment Options",
    description: "Pay or receive via PayPal, Skrill, Google Pay, or Binance Pay.",
    span: "",
  },
  {
    icon: TrendingUp,
    title: "Best Rates",
    description: "Get competitive rates on all gift card transactions that benefit you.",
    span: "lg:col-span-2",
  },
  {
    icon: Lock,
    title: "Privacy First",
    description: "Your personal data is encrypted and never shared with third parties.",
    span: "",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    description: "Our dedicated support team is always ready to help with any questions.",
    span: "",
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
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Built for Trust & Speed
          </h2>
          <p className="text-background/60 max-w-2xl mx-auto md:text-lg">
            We've designed every aspect of gXchange to give you the best gift card trading experience.
          </p>
        </div>

        {/* Features Grid - Bento on desktop */}
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
