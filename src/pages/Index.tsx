import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import PopularCategories from "@/components/home/PopularCategories";
import GiftCardShowcase from "@/components/home/GiftCardShowcase";
import Features from "@/components/home/Features";
import CTA from "@/components/home/CTA";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>gXchange - Sell Gift Cards Online for Instant Cash | Buy Discounted Gift Cards</title>
        <meta
          name="description"
          content="Sell gift cards online for instant payout via PayPal or Binance Pay. Buy discounted gift cards at up to 15% off. Amazon, Apple, Steam & 100+ brands. Trusted by 50,000+ users."
        />
        <meta
          name="keywords"
          content="sell gift cards online, buy discounted gift cards, gift card exchange, instant payout gift cards, gift card marketplace, sell gift cards for cash, buy gift cards online"
        />
        <link rel="canonical" href="https://gxchange.cards/" />
        <meta property="og:title" content="gXchange - Sell Gift Cards for Instant Cash | Buy Discounted Gift Cards" />
        <meta property="og:description" content="The #1 gift card exchange marketplace. Sell gift cards for instant payout or buy at up to 15% off. 100+ brands supported." />
        <meta property="og:url" content="https://gxchange.cards/" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "gXchange",
            url: "https://gxchange.cards",
            description: "Buy and sell gift cards online with instant payout. The trusted gift card exchange marketplace.",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://gxchange.cards/gift-cards?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "gXchange",
            url: "https://gxchange.cards",
            logo: "https://gxchange.cards/favicon.png",
            sameAs: [],
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "customer service",
              url: "https://gxchange.cards/contact",
            },
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Hero />
          <PopularCategories />
          <HowItWorks />
          <GiftCardShowcase />
          <Features />
          <CTA />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
