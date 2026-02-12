import { UserPlus, CreditCard, DollarSign, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Create Account",
    description: "Sign up with your email and verify your identity in minutes.",
    color: "primary",
  },
  {
    icon: CreditCard,
    title: "Select Gift Card",
    description: "Choose from 50+ major gift card brands to buy or sell.",
    color: "secondary",
  },
  {
    icon: DollarSign,
    title: "Set Amount",
    description: "Enter your card value and see instant pricing calculations.",
    color: "primary",
  },
  {
    icon: CheckCircle,
    title: "Get Paid / Receive",
    description: "Complete transaction and receive payment or gift card codes.",
    color: "secondary",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Simple 4-Step Process
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Whether you're buying or selling, our streamlined process makes trading gift cards quick and easy.
          </p>
        </div>

        {/* Steps - Desktop: horizontal timeline */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 relative">
          {/* Desktop connecting line */}
          <div className="hidden md:block absolute top-14 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30" />

          {steps.map((step, index) => (
            <div key={step.title} className="relative group">
              <div className="glass-card rounded-2xl md:rounded-3xl p-6 md:p-8 h-full transition-all duration-500 hover:shadow-medium hover:-translate-y-1 md:hover:-translate-y-3">
                {/* Step Number */}
                <div className={`absolute -top-3 -right-3 md:-top-4 md:-right-4 w-8 h-8 md:w-10 md:h-10 rounded-full text-sm md:text-base font-bold flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
                  step.color === "primary" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary text-secondary-foreground"
                }`}>
                  {index + 1}
                </div>

                {/* Icon */}
                <div
                  className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 ${
                    step.color === "primary"
                      ? "bg-primary/10 text-primary"
                      : "bg-secondary/10 text-secondary"
                  }`}
                >
                  <step.icon className="w-7 h-7 md:w-8 md:h-8" />
                </div>

                {/* Content */}
                <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm md:text-base text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
