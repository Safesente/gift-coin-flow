import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  { title: "Create your account", description: "Sign up with your email to start buying or selling." },
  { title: "Choose a gift card", description: "Select your brand from the available gift cards." },
  { title: "Enter the amount", description: "Add your card value and see your price before submitting." },
  { title: "Complete your trade", description: "Receive your payment or gift card codes and track your order." },
];
const HowItWorks = () => (
  <section className="home-process">
    <div className="container home-process-layout">
      <div>
        <p className="home-label">From card to checkout</p>
        <h2 className="home-heading">How it works.</h2>
        <p className="mt-5 max-w-sm text-muted-foreground leading-relaxed">Buying or selling, the process stays simple. You're in control at every step.</p>
        <Button asChild variant="link" className="mt-5 p-0 text-foreground"><Link to="/register">Create an account <ArrowUpRight /></Link></Button>
      </div>
      <div className="home-steps">
        {steps.map((step, index) => <div key={step.title} className="home-step"><span className="home-step-number">0{index + 1}</span><div><h3 className="text-lg font-semibold">{step.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p></div></div>)}
      </div>
    </div>
  </section>
);
export default HowItWorks;
