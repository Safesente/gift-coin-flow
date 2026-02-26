import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingCart, Shield, Zap, CheckCircle } from "lucide-react";
import { brandSEOData, getBrandBySlug } from "@/data/brandSEO";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const BrandBuy = () => {
  const { brand } = useParams<{ brand: string }>();
  const brandData = getBrandBySlug(brand || "");

  if (!brandData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16 container mx-auto text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Brand Not Found</h1>
          <p className="text-muted-foreground mb-8">The gift card brand you're looking for doesn't exist.</p>
          <Link to="/gift-cards">
            <Button>Browse All Gift Cards</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const title = `Buy ${brandData.name} Gift Cards at Discounted Prices | gXchange`;
  const description = `Buy ${brandData.name} gift cards online at up to 15% off. Instant delivery, secure checkout, and the best rates on ${brandData.name} gift cards at gXchange.`;

  const buyFaqs = [
    {
      question: `How do I buy a ${brandData.name} gift card on gXchange?`,
      answer: `Buying a ${brandData.name} gift card is simple: 1) Create a free account or log in, 2) Go to our Buy Gift Cards page and select ${brandData.name}, 3) Choose your card amount and country, 4) Complete payment through our secure checkout, 5) Receive your ${brandData.name} gift card code instantly in your dashboard.`,
    },
    {
      question: `Are ${brandData.name} gift cards from gXchange legitimate?`,
      answer: `Yes, all ${brandData.name} gift cards sold on gXchange are 100% legitimate and verified. We source our cards through authorized channels and verify every card before delivery. Your purchase is protected by our buyer guarantee.`,
    },
    {
      question: `How much can I save on ${brandData.name} gift cards?`,
      answer: `You can save up to 15% on ${brandData.name} gift cards compared to face value. Our discounted rates vary based on card denomination and current market conditions. Check our Buy page for the latest rates.`,
    },
    {
      question: `How quickly will I receive my ${brandData.name} gift card?`,
      answer: `Most ${brandData.name} gift card orders are processed within 1 hour. Once approved, the gift card code is instantly available in your gXchange dashboard. You'll also receive an email notification.`,
    },
    {
      question: `Can I buy ${brandData.name} gift cards internationally?`,
      answer: `Yes! gXchange supports ${brandData.name} gift card purchases from over 30 countries. Rates and availability may vary by region. Select your country during checkout to see country-specific pricing.`,
    },
  ];

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={`buy ${brandData.name.toLowerCase()} gift card, ${brandData.name.toLowerCase()} gift card discount, cheap ${brandData.name.toLowerCase()} gift card, ${brandData.name.toLowerCase()} gift card online`} />
        <link rel="canonical" href={`https://gxchange.cards/buy-${brandData.slug}-gift-card`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: `${brandData.name} Gift Card`,
            description: description,
            brand: { "@type": "Brand", name: brandData.name },
            offers: {
              "@type": "Offer",
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
              seller: { "@type": "Organization", name: "gXchange" },
            },
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-24 pb-16">
          {/* Hero Section */}
          <section className="bg-gradient-hero py-16 md:py-24">
            <div className="container mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 mb-6">
                <ShoppingCart className="w-4 h-4 text-secondary" />
                <span className="text-sm font-medium text-foreground">Save Up to 15%</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                Buy {brandData.name} Gift Cards{" "}
                <span className="text-gradient-primary">at Discounted Prices</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                Get {brandData.name} gift cards for less than face value. Instant delivery, secure transactions,
                and the best rates guaranteed on gXchange.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to={`/buy`}>
                  <Button variant="gold" size="xl" className="gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Buy {brandData.name} Gift Card Now
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/gift-cards">
                  <Button variant="outline" size="xl">
                    View All Gift Cards
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Trust Signals */}
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground text-center mb-12">
                Why Buy {brandData.name} Gift Cards on gXchange?
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="glass-card rounded-2xl p-8 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">100% Verified Cards</h3>
                  <p className="text-muted-foreground">Every {brandData.name} gift card is verified before delivery. Your purchase is protected by our buyer guarantee.</p>
                </div>
                <div className="glass-card rounded-2xl p-8 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-7 h-7 text-secondary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Instant Delivery</h3>
                  <p className="text-muted-foreground">Receive your {brandData.name} gift card code within minutes. No waiting, no delays — instant digital delivery.</p>
                </div>
                <div className="glass-card rounded-2xl p-8 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Best Discounted Rates</h3>
                  <p className="text-muted-foreground">Save up to 15% compared to face value. gXchange offers the most competitive {brandData.name} gift card prices online.</p>
                </div>
              </div>
            </div>
          </section>

          {/* How to Buy */}
          <section className="py-16">
            <div className="container mx-auto max-w-3xl">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground text-center mb-12">
                How to Buy {brandData.name} Gift Cards Online
              </h2>
              <div className="space-y-6">
                {[
                  { step: "1", title: "Create Your Free Account", desc: `Sign up on gXchange in under 2 minutes. It's free and takes just an email address.` },
                  { step: "2", title: `Select ${brandData.name} Gift Card`, desc: `Choose ${brandData.name} from our catalog, pick your denomination, and select your country.` },
                  { step: "3", title: "Complete Secure Checkout", desc: "Pay securely through our checkout. We accept multiple payment methods for your convenience." },
                  { step: "4", title: "Receive Your Card Code", desc: `Your ${brandData.name} gift card code is delivered instantly to your dashboard. Use it right away!` },
                ].map((item) => (
                  <div key={item.step} className="flex gap-6 items-start">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">{item.title}</h3>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto max-w-3xl">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground text-center mb-12">
                Frequently Asked Questions About Buying {brandData.name} Gift Cards
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {buyFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <script type="application/ld+json">
                {JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: buyFaqs.map((faq) => ({
                    "@type": "Question",
                    name: faq.question,
                    acceptedAnswer: { "@type": "Answer", text: faq.answer },
                  })),
                })}
              </script>
            </div>
          </section>

          {/* Internal Links */}
          <section className="py-16">
            <div className="container mx-auto text-center">
              <h2 className="text-2xl font-bold text-foreground mb-8">Explore More Gift Cards</h2>
              <div className="flex flex-wrap justify-center gap-3">
                {brandSEOData.filter((b) => b.slug !== brandData.slug).slice(0, 8).map((b) => (
                  <Link
                    key={b.slug}
                    to={`/buy-${b.slug}-gift-card`}
                    className="px-4 py-2 rounded-full bg-muted hover:bg-accent text-sm font-medium text-foreground transition-colors"
                  >
                    Buy {b.name} Gift Cards
                  </Link>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link to="/sell-gift-cards" className="text-primary hover:underline font-medium">
                  Sell Gift Cards for Instant Payout →
                </Link>
                <Link to="/gift-cards" className="text-primary hover:underline font-medium">
                  Browse All Gift Card Brands →
                </Link>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default BrandBuy;
