import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cardAmounts, countries, cardFormats } from "@/data/giftCards";
import { ArrowRight, ShoppingCart, CreditCard, Calculator, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useGiftCards } from "@/hooks/useAdmin";

const Buy = () => {
  const [searchParams] = useSearchParams();
  const preselectedCard = searchParams.get("card") || "";
  const isSuccess = searchParams.get("success") === "true";
  const isCanceled = searchParams.get("canceled") === "true";
  const successAmount = searchParams.get("amount");
  const successQuantity = searchParams.get("quantity");
  const successCard = searchParams.get("card");
  
  const { data: giftCards = [], isLoading: cardsLoading } = useGiftCards(false);
  
  const [selectedCard, setSelectedCard] = useState(preselectedCard);
  const [country, setCountry] = useState("");
  const [cardFormat, setCardFormat] = useState("");
  const [cardAmount, setCardAmount] = useState<number | "">("");
  const [quantity, setQuantity] = useState(1);
  const [step, setStep] = useState(isSuccess ? 3 : 1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Handle success/canceled states from Stripe redirect
  useEffect(() => {
    if (isSuccess) {
      setStep(3);
      if (successAmount) setCardAmount(Number(successAmount));
      if (successQuantity) setQuantity(Number(successQuantity));
      if (successCard) setSelectedCard(successCard);
    }
    if (isCanceled) {
      toast({
        title: "Payment Canceled",
        description: "Your payment was canceled. You can try again.",
        variant: "destructive",
      });
    }
  }, [isSuccess, isCanceled, successAmount, successQuantity, successCard, toast]);

  const selectedCardData = giftCards.find((c) => c.id === selectedCard);
  const buyRate = selectedCardData?.buy_rate ? selectedCardData.buy_rate / 100 : 0.85;

  const calculation = useMemo(() => {
    if (!cardAmount || !quantity) return null;
    const totalValue = Number(cardAmount) * quantity;
    const price = totalValue * buyRate;
    return { totalValue, price, savings: totalValue - price };
  }, [cardAmount, quantity, buyRate]);

  const handleSubmit = async () => {
    if (!selectedCard || !cardAmount || !selectedCardData || !country || !cardFormat) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields including country and card format.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          amount: Number(cardAmount),
          cardName: selectedCardData.name,
          quantity,
          country,
          cardFormat,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout Failed",
        description: "Unable to start checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cardsLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Buy Gift Cards - gXchange | Get 15% Off All Cards</title>
        <meta
          name="description"
          content="Buy gift cards at 85% of face value on gXchange. Amazon, Apple, Steam, Netflix and 50+ more brands available."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-hero">
        <Header />

        <main className="pt-24 pb-16">
          <div className="container mx-auto max-w-3xl">
            {/* Page Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 mb-4">
                <ShoppingCart className="w-4 h-4 text-secondary" />
                <span className="text-sm font-medium text-foreground">Save on All Cards</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Buy Gift Cards
              </h1>
              <p className="text-muted-foreground">
                Get gift cards at discounted rates
              </p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-2 mb-10">
              {[1, 2].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      step >= s
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                  </div>
                  {s < 2 && (
                    <div className={`w-16 h-1 rounded ${step > s ? "bg-secondary" : "bg-muted"}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Step 3: Success */}
            {step === 3 && (
              <div className="glass-card rounded-2xl p-8 text-center animate-scale-in">
                <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-secondary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Order Submitted!</h2>
                <p className="text-muted-foreground mb-6">
                  Your order is pending approval. Once approved, the gift card codes will be revealed in your dashboard.
                </p>
                <div className="glass-card rounded-xl p-4 mb-6 text-left">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Card Value:</span>
                    <span className="font-medium">${calculation?.totalValue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">You Paid:</span>
                    <span className="font-bold text-secondary">${calculation?.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mt-2 pt-2 border-t border-border">
                    <span className="text-sm text-muted-foreground">You Saved:</span>
                    <span className="font-bold text-primary">${calculation?.savings.toFixed(2)}</span>
                  </div>
                </div>
                <Link to="/dashboard">
                  <Button variant="gold" className="w-full gap-2">
                    Go to Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            )}

            {/* Step 1: Select Card */}
            {step === 1 && (
              <div className="glass-card rounded-2xl p-8 animate-fade-up">
                <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-secondary" />
                  Select Gift Card
                </h2>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label>Gift Card Type</Label>
                    <Select value={selectedCard} onValueChange={setSelectedCard}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select a gift card" />
                      </SelectTrigger>
                      <SelectContent>
                        {giftCards.map((card) => (
                          <SelectItem key={card.id} value={card.id}>
                            {card.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((c) => (
                          <SelectItem key={c.code} value={c.code}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Card Format</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {cardFormats.map((format) => (
                        <button
                          key={format.id}
                          onClick={() => setCardFormat(format.id)}
                          className={`p-4 rounded-xl border-2 transition-all text-center ${
                            cardFormat === format.id
                              ? "border-secondary bg-secondary/5"
                              : "border-border hover:border-secondary/50"
                          }`}
                        >
                          <p className="font-medium text-foreground">{format.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Card Amount ($)</Label>
                    <Select
                      value={cardAmount?.toString()}
                      onValueChange={(v) => setCardAmount(Number(v))}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select amount" />
                      </SelectTrigger>
                      <SelectContent>
                        {cardAmounts.map((amount) => (
                          <SelectItem key={amount} value={amount.toString()}>
                            ${amount}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Number of Cards</Label>
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="h-12"
                    />
                  </div>

                  {/* Calculation Preview */}
                  {calculation && selectedCardData && (
                    <div className="bg-accent rounded-xl p-4 border border-secondary/20">
                      <div className="flex items-center gap-2 mb-3">
                        <Calculator className="w-4 h-4 text-secondary" />
                        <span className="text-sm font-medium text-foreground">Price Summary</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Card Value:</span>
                          <span className="font-medium">${calculation.totalValue}</span>
                        </div>
                        <div className="flex justify-between text-primary">
                          <span>You Save:</span>
                          <span className="font-medium">${calculation.savings.toFixed(2)}</span>
                        </div>
                        <div className="border-t border-border pt-2 flex justify-between">
                          <span className="font-medium text-foreground">You Pay:</span>
                          <span className="font-bold text-secondary text-lg">
                            ${calculation.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={() => setStep(2)}
                    disabled={!selectedCard || !cardAmount || !country || !cardFormat}
                    className="w-full gap-2"
                    size="lg"
                    variant="gold"
                  >
                    Continue to Payment
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Review & Pay */}
            {step === 2 && (
              <div className="glass-card rounded-2xl p-8 animate-fade-up">
                <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-secondary" />
                  Review & Pay
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Gift Card</span>
                    <span className="font-medium">{selectedCardData?.name}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Country</span>
                    <span className="font-medium">
                      {countries.find((c) => c.code === country)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Card Format</span>
                    <span className="font-medium">
                      {cardFormats.find((f) => f.id === cardFormat)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Card Amount</span>
                    <span className="font-medium">${cardAmount} x {quantity}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Card Value</span>
                    <span className="font-medium">${calculation?.totalValue}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border text-primary">
                    <span>Your Savings</span>
                    <span className="font-medium">${calculation?.savings.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="font-semibold text-foreground">Total to Pay</span>
                    <span className="font-bold text-secondary text-xl">
                      ${calculation?.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="bg-muted rounded-xl p-4 mb-6">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> After payment, your order will be pending until approved by admin. 
                    Once approved, the gift card codes will be revealed in your dashboard.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 gap-2"
                    variant="gold"
                  >
                    {isSubmitting ? "Redirecting to Stripe..." : "Pay with Stripe"}
                    {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Buy;