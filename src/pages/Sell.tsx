import { useState, useMemo, useRef } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cardAmounts, paymentMethods, countries, cardFormats } from "@/data/giftCards";
import { ArrowRight, DollarSign, CreditCard, Calculator, CheckCircle, Loader2, Upload, X, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useGiftCards } from "@/hooks/useAdmin";

const Sell = () => {
  const [searchParams] = useSearchParams();
  const preselectedCard = searchParams.get("card") || "";
  const navigate = useNavigate();
  
  const { data: giftCards = [], isLoading: cardsLoading } = useGiftCards(false);
  
  const [selectedCard, setSelectedCard] = useState(preselectedCard);
  const [country, setCountry] = useState("");
  const [cardFormat, setCardFormat] = useState("");
  const [cardAmount, setCardAmount] = useState<number | "">("");
  const [quantity, setQuantity] = useState(1);
  const [giftCardCode, setGiftCardCode] = useState("");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentDetails, setPaymentDetails] = useState("");
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const selectedCardData = giftCards.find((c) => c.id === selectedCard);
  const sellRate = selectedCardData?.sell_rate ? selectedCardData.sell_rate / 100 : 0.47;

  const calculation = useMemo(() => {
    if (!cardAmount || !quantity) return null;
    const totalValue = Number(cardAmount) * quantity;
    const payout = totalValue * sellRate;
    return { totalValue, payout };
  }, [cardAmount, quantity, sellRate]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Screenshot must be less than 5MB.",
          variant: "destructive",
        });
        return;
      }
      setScreenshotFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeScreenshot = () => {
    setScreenshotFile(null);
    setScreenshotPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!selectedCard || !cardAmount || !paymentMethod || !paymentDetails || !giftCardCode || !country || !cardFormat) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields including gift card code, country, and card format.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to sell gift cards.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setIsSubmitting(true);

    try {
      let screenshotUrl = null;

      // Upload screenshot if provided
      if (screenshotFile) {
        const fileExt = screenshotFile.name.split(".").pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("transaction-screenshots")
          .upload(fileName, screenshotFile);

        if (uploadError) {
          console.error("Screenshot upload error:", uploadError);
          toast({
            title: "Upload Failed",
            description: "Failed to upload screenshot. Proceeding without it.",
            variant: "destructive",
          });
        } else {
          screenshotUrl = uploadData?.path;
        }
      }

      const { data, error } = await supabase.functions.invoke("create-sell-order", {
        body: {
          cardName: selectedCardData?.name,
          amount: Number(cardAmount),
          quantity,
          paymentMethod,
          paymentDetails,
          giftCardCode,
          country,
          cardFormat,
          screenshotUrl,
        },
      });

      if (error) throw error;

      toast({
        title: "Order Submitted!",
        description: "Please wait up to 1 hour for processing.",
      });
      setStep(4);
    } catch (error) {
      console.error("Sell order error:", error);
      toast({
        title: "Submission Failed",
        description: "Unable to submit order. Please try again.",
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
        <title>Sell Gift Cards - gXchange | Get Paid Instantly</title>
        <meta
          name="description"
          content="Sell your gift cards on gXchange. Fast payout via PayPal, Skrill, Google Pay, or Binance."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-hero">
        <Header />

        <main className="pt-24 pb-16">
          <div className="container mx-auto max-w-3xl">
            {/* Page Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <DollarSign className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Sell Your Cards</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Sell Your Gift Cards
              </h1>
              <p className="text-muted-foreground">
                Get paid quickly via your preferred payment method
              </p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-2 mb-10">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      step >= s
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                  </div>
                  {s < 3 && (
                    <div className={`w-16 h-1 rounded ${step > s ? "bg-primary" : "bg-muted"}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Step 4: Success */}
            {step === 4 && (
              <div className="glass-card rounded-2xl p-8 text-center animate-scale-in">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Order Submitted!</h2>
                <p className="text-muted-foreground mb-6">
                  Please wait up to 1 hour for processing. You'll receive an email once your payment is sent.
                </p>
                <div className="glass-card rounded-xl p-4 mb-6 text-left">
                  <p className="text-sm text-muted-foreground mb-1">Expected Payout</p>
                  <p className="text-2xl font-bold text-primary">${calculation?.payout.toFixed(2)}</p>
                </div>
                <Link to="/dashboard">
                  <Button className="w-full gap-2">
                    Go to Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            )}

            {/* Step 1: Select Card & Enter Details */}
            {step === 1 && (
              <div className="glass-card rounded-2xl p-8 animate-fade-up">
                <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Gift Card Details
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
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
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

                  <div className="space-y-2">
                    <Label>Gift Card Code *</Label>
                    <Input
                      placeholder="Enter your gift card code"
                      value={giftCardCode}
                      onChange={(e) => setGiftCardCode(e.target.value)}
                      className="h-12 font-mono"
                    />
                    <p className="text-xs text-muted-foreground">
                      This code will be verified by our team before payout.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Card Screenshot (Optional)</Label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept="image/*"
                      className="hidden"
                    />
                    {screenshotPreview ? (
                      <div className="relative rounded-xl border border-border overflow-hidden">
                        <img
                          src={screenshotPreview}
                          alt="Screenshot preview"
                          className="w-full h-48 object-cover"
                        />
                        <button
                          onClick={removeScreenshot}
                          className="absolute top-2 right-2 p-1 rounded-full bg-background/80 hover:bg-background transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-32 rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-2"
                      >
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <Upload className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Click to upload screenshot (max 5MB)
                        </p>
                      </button>
                    )}
                  </div>

                  {/* Calculation Preview */}
                  {calculation && selectedCardData && (
                    <div className="bg-accent rounded-xl p-4 border border-primary/20">
                      <div className="flex items-center gap-2 mb-3">
                        <Calculator className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">Payout Estimate</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Card Value:</span>
                          <span className="font-medium">${calculation.totalValue}</span>
                        </div>
                        <div className="border-t border-border pt-2 flex justify-between">
                          <span className="font-medium text-foreground">You Receive:</span>
                          <span className="font-bold text-primary text-lg">
                            ${calculation.payout.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={() => setStep(2)}
                    disabled={!selectedCard || !cardAmount || !giftCardCode || !country || !cardFormat}
                    className="w-full gap-2"
                    size="lg"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Payment Details */}
            {step === 2 && (
              <div className="glass-card rounded-2xl p-8 animate-fade-up">
                <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  Payment Details
                </h2>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {paymentMethods.map((method) => (
                        <button
                          key={method.id}
                          onClick={() => setPaymentMethod(method.id)}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            paymentMethod === method.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-2">
                            <span className="font-bold text-foreground">{method.icon}</span>
                          </div>
                          <p className="font-medium text-foreground">{method.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>
                      {paymentMethod === "binance"
                        ? "Binance ID"
                        : paymentMethod
                        ? `${paymentMethods.find((p) => p.id === paymentMethod)?.name} Email/ID`
                        : "Account Email/ID"}
                    </Label>
                    <Input
                      placeholder={
                        paymentMethod === "binance"
                          ? "Enter your Binance ID"
                          : "Enter your email or account ID"
                      }
                      value={paymentDetails}
                      onChange={(e) => setPaymentDetails(e.target.value)}
                      className="h-12"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                      Back
                    </Button>
                    <Button
                      onClick={() => setStep(3)}
                      disabled={!paymentMethod || !paymentDetails}
                      className="flex-1 gap-2"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Review & Submit */}
            {step === 3 && (
              <div className="glass-card rounded-2xl p-8 animate-fade-up">
                <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  Review Order
                </h2>

                {!user && (
                  <div className="bg-status-pending/10 border border-status-pending/20 rounded-xl p-4 mb-6">
                    <p className="text-sm text-foreground">
                      <strong>Note:</strong> You need to{" "}
                      <Link to="/login" className="text-primary hover:underline">
                        log in
                      </Link>{" "}
                      to submit a sell order.
                    </p>
                  </div>
                )}

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
                    <span className="text-muted-foreground">Total Value</span>
                    <span className="font-medium">${calculation?.totalValue}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Gift Card Code</span>
                    <code className="font-mono bg-muted px-2 py-1 rounded text-sm">
                      {giftCardCode}
                    </code>
                  </div>
                  {screenshotPreview && (
                    <div className="py-3 border-b border-border">
                      <span className="text-muted-foreground block mb-2">Screenshot</span>
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">Screenshot attached</span>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Payment Method</span>
                    <span className="font-medium">
                      {paymentMethods.find((p) => p.id === paymentMethod)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="font-semibold text-foreground">You Receive</span>
                    <span className="font-bold text-primary text-xl">
                      ${calculation?.payout.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !user}
                    className="flex-1 gap-2"
                    variant="gold"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Order"}
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

export default Sell;