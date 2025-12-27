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
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Simple 4-Step Process
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Whether you're buying or selling, our streamlined process makes trading gift cards quick and easy.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="relative group">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-border to-transparent" />
              )}

              <div className="glass-card rounded-2xl p-6 h-full transition-all duration-300 hover:shadow-medium hover:-translate-y-1">
                {/* Step Number */}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-foreground text-background text-sm font-bold flex items-center justify-center">
                  {index + 1}
                </div>

                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${
                    step.color === "primary"
                      ? "bg-primary/10 text-primary"
                      : "bg-secondary/10 text-secondary"
                  }`}
                >
                  <step.icon className="w-7 h-7" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
