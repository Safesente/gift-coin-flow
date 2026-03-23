import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import PopularCategories from "@/components/home/PopularCategories";
import GiftCardShowcase from "@/components/home/GiftCardShowcase";
import CTA from "@/components/home/CTA";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>gXchange - Buy & Sell Gift Cards Instantly | Best Rates</title>
        <meta
          name="description"
          content="Trade gift cards instantly on gXchange. Get competitive rates on Amazon, Apple, Steam & 100+ brands. Fast payouts via PayPal, Binance & bank transfer. Trusted by 50,000+ users."
        />
        <meta
          name="keywords"
          content="sell gift cards, buy gift cards, gift card exchange, amazon gift card, apple gift card, steam gift card, google play gift card, best gift card rates, gift card to naira, sell gift cards online"
        />
        <link rel="canonical" href="https://gxchange.cards/" />
        <meta property="og:title" content="gXchange - Buy & Sell Gift Cards Instantly | Best Rates" />
        <meta property="og:description" content="Trade gift cards instantly on gXchange. Get competitive rates on Amazon, Apple, Steam & 100+ brands. Fast payouts via PayPal, Binance & bank transfer." />
        <meta property="og:url" content="https://gxchange.cards/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://gxchange.cards/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="gXchange - Buy & Sell Gift Cards Instantly" />
        <meta name="twitter:description" content="Trade gift cards instantly with competitive rates on 100+ brands." />
        <meta name="twitter:image" content="https://gxchange.cards/og-image.png" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "gXchange",
            url: "https://gxchange.cards",
            description: "Buy and sell gift cards instantly with the best rates",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://gxchange.cards/gift-cards?search={search_term_string}",
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
              availableLanguage: "English",
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
          <CTA />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
