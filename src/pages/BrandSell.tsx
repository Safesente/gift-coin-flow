import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, DollarSign, Shield, Zap, CheckCircle } from "lucide-react";
import { brandSEOData, getBrandBySlug } from "@/data/brandSEO";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const BrandSell = () => {
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

  const title = `Sell ${brandData.name} Gift Cards for Cash | Instant Payout | gXchange`;
  const description = `Sell your ${brandData.name} gift cards online for instant cash. Get paid via PayPal or Binance Pay within 1 hour. Best rates for ${brandData.name} gift cards on gXchange.`;

  const sellFaqs = [
    {
      question: `How do I sell my ${brandData.name} gift card on gXchange?`,
      answer: `Selling your ${brandData.name} gift card is easy: 1) Create a free account or log in, 2) Go to the Sell Gift Cards page and select ${brandData.name}, 3) Enter your card details, code, and amount, 4) Choose your payment method (PayPal or Binance Pay), 5) Submit and get paid within 1 hour.`,
    },
    {
      question: `How much is my ${brandData.name} gift card worth?`,
      answer: `${brandData.name} gift card values depend on the card denomination, country, and current market rates. Use our sell calculator to see your exact payout before submitting. We offer competitive rates that are updated regularly.`,
    },
    {
      question: `How fast will I get paid for my ${brandData.name} gift card?`,
      answer: `Most ${brandData.name} gift card payments are processed within 1 hour. After our team verifies your card code, payment is sent directly to your chosen payment method — PayPal or Binance Pay.`,
    },
    {
      question: `Is it safe to sell ${brandData.name} gift cards on gXchange?`,
      answer: `Absolutely. gXchange uses 256-bit SSL encryption and advanced fraud protection to keep your transactions secure. We've processed over 50,000 transactions safely. Your card details and payment information are fully protected.`,
    },
    {
      question: `What payment methods are available when selling ${brandData.name} gift cards?`,
      answer: `We currently support PayPal and Binance Pay for payouts. Choose your preferred payment method during the sell process. Both options provide fast, reliable payouts.`,
    },
  ];

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={`sell ${brandData.name.toLowerCase()} gift card, ${brandData.name.toLowerCase()} gift card for cash, sell ${brandData.name.toLowerCase()} gift card online, ${brandData.name.toLowerCase()} gift card exchange`} />
        <link rel="canonical" href={`https://gxchange.cards/sell-${brandData.slug}-gift-card`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: `Sell ${brandData.name} Gift Cards`,
            description: description,
            provider: { "@type": "Organization", name: "gXchange", url: "https://gxchange.cards" },
            serviceType: "Gift Card Exchange",
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-24 pb-16">
          {/* Hero Section */}
          <section className="bg-gradient-hero py-16 md:py-24">
            <div className="container mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <DollarSign className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Instant Cash Payout</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                Sell {brandData.name} Gift Cards{" "}
                <span className="text-gradient-primary">for Instant Cash</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                Turn your unused {brandData.name} gift cards into cash. Get paid via PayPal or Binance Pay
                within 1 hour. Competitive rates, secure transactions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/sell">
                  <Button variant="hero" size="xl" className="gap-2">
                    <DollarSign className="w-5 h-5" />
                    Sell {brandData.name} Gift Card Now
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to={`/buy-${brandData.slug}-gift-card`}>
                  <Button variant="outline" size="xl">
                    Buy {brandData.name} Gift Cards Instead
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Trust Signals */}
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground text-center mb-12">
                Why Sell {brandData.name} Gift Cards on gXchange?
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="glass-card rounded-2xl p-8 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Instant Payout</h3>
                  <p className="text-muted-foreground">Get paid within 1 hour of verification. No waiting days for your money — we process {brandData.name} gift card sales fast.</p>
                </div>
                <div className="glass-card rounded-2xl p-8 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-7 h-7 text-secondary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Secure & Trusted</h3>
                  <p className="text-muted-foreground">256-bit SSL encryption protects every transaction. Trusted by 50,000+ users worldwide for safe gift card trading.</p>
                </div>
                <div className="glass-card rounded-2xl p-8 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Best Rates Guaranteed</h3>
                  <p className="text-muted-foreground">We offer competitive exchange rates on {brandData.name} gift cards. See your exact payout before you sell.</p>
                </div>
              </div>
            </div>
          </section>

          {/* How to Sell */}
          <section className="py-16">
            <div className="container mx-auto max-w-3xl">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground text-center mb-12">
                How to Sell {brandData.name} Gift Cards Online for Cash
              </h2>
              <div className="space-y-6">
                {[
                  { step: "1", title: "Create Your Free Account", desc: "Sign up on gXchange in under 2 minutes. Free registration with just your email." },
                  { step: "2", title: `Enter ${brandData.name} Card Details`, desc: `Select ${brandData.name}, enter the card amount, gift card code, and upload a screenshot for verification.` },
                  { step: "3", title: "Choose Your Payout Method", desc: "Select PayPal or Binance Pay. Enter your payment details to receive your cash." },
                  { step: "4", title: "Get Paid Within 1 Hour", desc: `Our team verifies your ${brandData.name} gift card and sends payment directly to you. Most payouts complete in under 1 hour.` },
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
                Frequently Asked Questions About Selling {brandData.name} Gift Cards
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
          <section className="py-16">
            <div className="container mx-auto text-center">
              <h2 className="text-2xl font-bold text-foreground mb-8">Sell Other Gift Card Brands</h2>
              <div className="flex flex-wrap justify-center gap-3">
                {brandSEOData.filter((b) => b.slug !== brandData.slug).slice(0, 8).map((b) => (
                  <Link
                    key={b.slug}
                    to={`/sell-${b.slug}-gift-card`}
                    className="px-4 py-2 rounded-full bg-muted hover:bg-accent text-sm font-medium text-foreground transition-colors"
                  >
                    Sell {b.name} Gift Cards
                  </Link>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link to="/buy-gift-cards" className="text-primary hover:underline font-medium">
                  Buy Discounted Gift Cards →
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

export default BrandSell;
