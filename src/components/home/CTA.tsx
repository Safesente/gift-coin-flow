import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

const CTA = () => (
  <section className="home-cta">
    <div className="container home-cta-layout">
      <div><p className="home-label">Make your next move</p><h2 className="home-heading">Your gift cards.<br />More possibilities.</h2><p className="mt-5 text-muted-foreground max-w-md">Buy something you'll love, or sell a card you won't use. Start with a free gXchange account.</p></div>
      <div className="flex flex-col items-start gap-4"><Button asChild size="lg" className="rounded-md px-6"><Link to="/register">Create free account <ArrowUpRight /></Link></Button><Button asChild variant="link" className="p-0 text-foreground"><Link to="/login">Already have an account? Log in <ArrowUpRight /></Link></Button><p className="text-xs text-muted-foreground">No hidden fees · Secure transactions · 24/7 support</p></div>
    </div>
  </section>
);
export default CTA;
