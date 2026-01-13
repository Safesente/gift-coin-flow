import { Helmet } from "react-helmet-async";
import { HelpCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const faqItems = [
  {
    question: "How do I sell my gift card on gXchange?",
    answer: "To sell your gift card, simply create an account or log in, navigate to the 'Sell Gift Cards' page, select the gift card type and country, enter the card details including the amount, upload a screenshot of the card, choose your preferred payment method (PayPal or Binance), and submit your order. Our team will verify your card and process the payment within 24 hours."
  },
  {
    question: "How long does it take to receive payment after selling a gift card?",
    answer: "Most payments are processed within 1-24 hours after your gift card has been verified. The exact time depends on the payment method you choose. PayPal payments are typically faster, while Binance transfers may take slightly longer during high-traffic periods. You'll receive an email notification once your payment has been sent."
  },
  {
    question: "What gift cards does gXchange accept?",
    answer: "We accept a wide variety of popular gift cards including Amazon, Apple/iTunes, Google Play, Steam, PlayStation, Xbox, Netflix, Spotify, Starbucks, and many more. The available gift cards and their rates may vary by country. Check our Gift Cards page to see the full list of supported cards and current exchange rates."
  },
  {
    question: "How are the exchange rates determined?",
    answer: "Our exchange rates are competitive and based on current market conditions, card popularity, and country-specific demand. Rates may vary depending on the gift card type, denomination, and your selected country. We update our rates regularly to ensure you get the best possible value for your gift cards."
  },
  {
    question: "Is my personal and payment information secure?",
    answer: "Absolutely! We take security very seriously. All data transmissions are encrypted using 256-bit SSL encryption. We never store your complete payment information on our servers. Our platform uses industry-standard security practices and undergoes regular security audits to protect your information."
  },
  {
    question: "What should I do if I have a problem with my transaction?",
    answer: "If you encounter any issues with your transaction, please visit our Help Center to chat directly with our support team, or use the Contact Us page to submit a detailed inquiry. Make sure to include your order ID and a description of the problem. Our support team is available 24/7 and typically responds within a few hours."
  }
];

const FAQ = () => {
  return (
    <>
      <Helmet>
        <title>Frequently Asked Questions - gXchange</title>
        <meta name="description" content="Find answers to commonly asked questions about buying and selling gift cards on gXchange." />
      </Helmet>

      <Header />

      <main className="min-h-screen pt-20 pb-16 bg-muted/30">
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked <span className="text-primary">Questions</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Find quick answers to common questions about using gXchange.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Common Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">
              Still have questions? We're here to help!
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/help">
                <Button variant="outline">Chat with Support</Button>
              </Link>
              <Link to="/contact">
                <Button>Contact Us</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default FAQ;
