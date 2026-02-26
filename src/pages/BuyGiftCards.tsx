import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingCart, Shield, Zap, CheckCircle, Star } from "lucide-react";
import { brandSEOData } from "@/data/brandSEO";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const buyFaqs = [
  {
    question: "How do I buy discounted gift cards on gXchange?",
    answer: "Create a free account, browse our gift card catalog, select your card and denomination, complete payment through our secure checkout, and receive your gift card code instantly in your dashboard.",
  },
  {
    question: "Are the gift cards on gXchange legitimate?",
    answer: "Yes, all gift cards sold on gXchange are 100% legitimate and verified. Every card is checked before delivery, and your purchase is backed by our buyer protection guarantee.",
  },
  {
    question: "How much can I save buying gift cards on gXchange?",
    answer: "You can save up to 15% off face value on popular gift card brands including Amazon, Apple, Steam, and more. Discount rates vary by brand and denomination.",
  },
  {
    question: "How fast do I receive my gift card after purchase?",
    answer: "Most gift card orders are delivered within 1 hour. Once verified, your code appears instantly in your gXchange dashboard and you'll receive an email notification.",
  },
  {
    question: "What payment methods do you accept for buying gift cards?",
    answer: "We accept secure online payments through our checkout system. Multiple payment options are available during the purchase process.",
  },
];

const BuyGiftCards = () => {
  return (
    <>
      <Helmet>
        <title>Buy Discounted Gift Cards Online | Up to 15% Off | gXchange</title>
        <meta
          name="description"
          content="Buy discounted gift cards online at gXchange. Save up to 15% on Amazon, Apple, Steam, Netflix, and 100+ brands. Instant delivery, secure checkout, best rates."
        />
        <meta
          name="keywords"
          content="buy gift cards, buy discounted gift cards, cheap gift cards online, gift card marketplace, buy gift cards online"
        />
        <link rel="canonical" href="https://gxchange.cards/buy-gift-cards" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Buy Discounted Gift Cards Online",
            description: "Buy gift cards at discounted prices from 100+ major brands.",
            url: "https://gxchange.cards/buy-gift-cards",
            provider: { "@type": "Organization", name: "gXchange" },
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-24 pb-16">
          <section className="bg-gradient-hero py-16 md:py-24">
            <div className="container mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 mb-6">
                <Star className="w-4 h-4 text-secondary" />
                <span className="text-sm font-medium text-foreground">Save Up to 15% on All Cards</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                Buy Discounted Gift Cards{" "}
                <span className="text-gradient-primary">Online</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
                Shop 100+ gift card brands at below face value. Amazon, Apple, Steam, Netflix, and more — 
                delivered instantly to your dashboard with secure checkout.
              </p>
              <Link to="/buy">
                <Button variant="gold" size="xl" className="gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Start Shopping Gift Cards
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </section>

          {/* Benefits */}
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground text-center mb-12">
                Why Buy Gift Cards on gXchange?
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="glass-card rounded-2xl p-8 text-center">
                  <Shield className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Verified & Secure</h3>
                  <p className="text-muted-foreground">Every gift card is verified. 256-bit encryption protects your payment data.</p>
                </div>
                <div className="glass-card rounded-2xl p-8 text-center">
                  <Zap className="w-10 h-10 text-secondary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Instant Digital Delivery</h3>
                  <p className="text-muted-foreground">Get your gift card codes within minutes. No shipping, no waiting.</p>
                </div>
                <div className="glass-card rounded-2xl p-8 text-center">
                  <CheckCircle className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Best Prices Online</h3>
                  <p className="text-muted-foreground">Save up to 15% compared to retail. The best discounted gift card rates.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Brand Grid */}
          <section className="py-16">
            <div className="container mx-auto">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground text-center mb-12">
                Popular Gift Cards to Buy at a Discount
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {brandSEOData.map((brand) => (
                  <Link
                    key={brand.slug}
                    to={`/buy-${brand.slug}-gift-card`}
                    className="glass-card rounded-xl p-6 text-center group transition-all duration-300 hover:shadow-medium hover:-translate-y-1"
                  >
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{brand.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{brand.category}</p>
                    <p className="text-sm text-primary font-medium mt-2">Buy Now →</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto max-w-3xl">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground text-center mb-12">
                Frequently Asked Questions About Buying Gift Cards
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
          <section className="py-12">
            <div className="container mx-auto text-center">
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/sell-gift-cards" className="text-primary hover:underline font-medium">
                  Sell Gift Cards for Instant Cash →
                </Link>
                <Link to="/gift-cards" className="text-primary hover:underline font-medium">
                  Browse All Gift Card Brands →
                </Link>
                <Link to="/faq" className="text-primary hover:underline font-medium">
                  Read Our Full FAQ →
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

export default BuyGiftCards;
