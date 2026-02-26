import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, DollarSign, Shield, Zap, CheckCircle, TrendingUp } from "lucide-react";
import { brandSEOData } from "@/data/brandSEO";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const sellFaqs = [
  {
    question: "How do I sell gift cards online for cash on gXchange?",
    answer: "Sign up for free, go to the Sell Gift Cards page, select your card brand, enter the card code and amount, choose PayPal or Binance Pay for payout, and submit. You'll get paid within 1 hour.",
  },
  {
    question: "How fast do I get paid after selling a gift card?",
    answer: "Most payouts are processed within 1 hour. After our team verifies your gift card code, payment is sent directly to your PayPal or Binance Pay account.",
  },
  {
    question: "What gift cards can I sell on gXchange?",
    answer: "We accept 100+ gift card brands including Amazon, Apple, Google Play, Steam, Netflix, PlayStation, Xbox, Visa, Starbucks, and many more. Check our gift cards page for the full list.",
  },
  {
    question: "What payment methods are available for selling gift cards?",
    answer: "We currently offer PayPal and Binance Pay for payouts. Both are fast, reliable payment methods that get your cash to you quickly.",
  },
  {
    question: "Are gXchange gift card exchange rates competitive?",
    answer: "Yes! We offer some of the best rates in the gift card exchange market. Rates vary by brand, denomination, and country. Use our sell calculator to see your exact payout before submitting.",
  },
];

const SellGiftCards = () => {
  return (
    <>
      <Helmet>
        <title>Sell Gift Cards Online for Instant Cash | Best Rates | gXchange</title>
        <meta
          name="description"
          content="Sell gift cards online for instant cash on gXchange. Get paid via PayPal or Binance Pay within 1 hour. Best rates for Amazon, Apple, Steam, and 100+ brands."
        />
        <meta
          name="keywords"
          content="sell gift cards, sell gift cards online, gift card exchange, instant payout gift cards, sell gift cards for cash, gift card marketplace"
        />
        <link rel="canonical" href="https://gxchange.cards/sell-gift-cards" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Sell Gift Cards Online for Instant Cash",
            description: "Sell your unused gift cards for instant cash via PayPal or Binance Pay.",
            url: "https://gxchange.cards/sell-gift-cards",
            provider: { "@type": "Organization", name: "gXchange" },
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-24 pb-16">
          <section className="bg-gradient-hero py-16 md:py-24">
            <div className="container mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Get Paid Within 1 Hour</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                Sell Gift Cards Online{" "}
                <span className="text-gradient-primary">for Instant Cash</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
                Turn unused gift cards into cash. Sell Amazon, Apple, Steam, and 100+ brands 
                with instant payout via PayPal or Binance Pay. Trusted by 50,000+ users.
              </p>
              <Link to="/sell">
                <Button variant="hero" size="xl" className="gap-2">
                  <DollarSign className="w-5 h-5" />
                  Sell Your Gift Cards Now
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </section>

          {/* Benefits */}
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground text-center mb-12">
                Why Sell Gift Cards on gXchange?
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="glass-card rounded-2xl p-8 text-center">
                  <Zap className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Instant Payout</h3>
                  <p className="text-muted-foreground">Get paid within 1 hour via PayPal or Binance Pay. No waiting days for your money.</p>
                </div>
                <div className="glass-card rounded-2xl p-8 text-center">
                  <Shield className="w-10 h-10 text-secondary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Secure Transactions</h3>
                  <p className="text-muted-foreground">256-bit SSL encryption. Trusted by 50,000+ users. Your data is always protected.</p>
                </div>
                <div className="glass-card rounded-2xl p-8 text-center">
                  <CheckCircle className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Best Exchange Rates</h3>
                  <p className="text-muted-foreground">Competitive rates updated regularly. See your exact payout before selling.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Brand Grid */}
          <section className="py-16">
            <div className="container mx-auto">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground text-center mb-12">
                Popular Gift Cards You Can Sell for Cash
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {brandSEOData.map((brand) => (
                  <Link
                    key={brand.slug}
                    to={`/sell-${brand.slug}-gift-card`}
                    className="glass-card rounded-xl p-6 text-center group transition-all duration-300 hover:shadow-medium hover:-translate-y-1"
                  >
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{brand.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{brand.category}</p>
                    <p className="text-sm text-primary font-medium mt-2">Sell Now →</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto max-w-3xl">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground text-center mb-12">
                Frequently Asked Questions About Selling Gift Cards
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {sellFaqs.map((faq, index) => (
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
                  mainEntity: sellFaqs.map((faq) => ({
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
                <Link to="/buy-gift-cards" className="text-primary hover:underline font-medium">
                  Buy Discounted Gift Cards →
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

export default SellGiftCards;
