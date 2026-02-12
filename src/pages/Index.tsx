import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import GiftCardShowcase from "@/components/home/GiftCardShowcase";
import CTA from "@/components/home/CTA";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>gXchange - Buy & Sell Gift Cards Instantly | Best Rates</title>
        <meta
          name="description"
          content="Trade gift cards instantly on gXchange. Get competitive rates on all major brands. Fast, secure transactions with PayPal, Skrill, Google Pay & Binance Pay."
        />
        <meta
          name="keywords"
          content="gift cards, sell gift cards, buy gift cards, amazon gift card, apple gift card, steam gift card, gift card exchange"
        />
        <link rel="canonical" href="https://gxchange.cards/" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FinancialService",
            name: "gXchange",
            description: "Buy and sell gift cards instantly with the best rates",
            url: "https://gxchange.com",
            serviceType: "Gift Card Exchange",
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Hero />
          <HowItWorks />
          <GiftCardShowcase />
          <CTA />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
