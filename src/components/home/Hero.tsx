import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import heroImage from "@/assets/home-giftcards.jpg";

const Hero = () => (
  <section className="home-hero">
    <img src={heroImage} alt="Amazon, Apple and Steam gift cards" width={1920} height={1088} fetchPriority="high" className="home-hero-image" />
    <div className="container relative z-10">
      <div className="home-hero-copy">
        <p className="home-label">gXchange / Gift card exchange</p>
        <h1>Buy & sell<br />gift cards.</h1>
        <p className="home-hero-description">Turn the cards you have into the things you want. Trade Amazon, Apple, Steam and more with competitive rates.</p>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg" className="rounded-md px-6"><Link to="/sell">Sell gift cards <ArrowUpRight /></Link></Button>
          <Button asChild variant="outline" size="lg" className="rounded-md px-6"><Link to="/buy">Buy gift cards <ArrowUpRight /></Link></Button>
        </div>
        <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"><ShieldCheck className="h-4 w-4 text-primary" /> Secure transactions. Real support.</p>
      </div>
    </div>
    <div className="home-stats">
      <div className="container grid grid-cols-3 divide-x divide-border">
        {[['50K+', 'Happy users'], ['100+', 'Gift card brands'], ['<1hr', 'Processing']].map(([value, label]) => <div key={label} className="home-stat"><strong>{value}</strong><span>{label}</span></div>)}
      </div>
    </div>
  </section>
);
export default Hero;
