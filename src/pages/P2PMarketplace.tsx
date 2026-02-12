import { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight, Plus, ShoppingCart, Upload, Loader2,
  Search, Users, Clock, CheckCircle, Eye, EyeOff, Copy,
  ArrowUpDown, Shield, Zap, TrendingUp, ChevronRight,
  Filter, RefreshCw, CircleDot, Wallet
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { usePublicGiftCards, usePublicCategories } from "@/hooks/useAdmin";
import {
  useP2PListings, useMyListings, useMyTrades,
  useCreateListing, useCreateTrade, useUpdateTrade, useUpdateListing,
  type P2PListing, type P2PTrade
} from "@/hooks/useP2P";
import { countries } from "@/data/countries";

type TabType = "buy" | "my-listings" | "my-trades";

const P2PMarketplace = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: listings = [], isLoading: listingsLoading } = useP2PListings();
  const { data: myListings = [] } = useMyListings();
  const { data: myTrades = [] } = useMyTrades();
  const { data: giftCards = [] } = usePublicGiftCards();
  const createListing = useCreateListing();
  const createTrade = useCreateTrade();
  const updateTrade = useUpdateTrade();
  const updateListing = useUpdateListing();

  const [activeTab, setActiveTab] = useState<TabType>("buy");
  const [searchQuery, setSearchQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<P2PListing | null>(null);
  const [proofUploading, setProofUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [revealedCodes, setRevealedCodes] = useState<Set<string>>(new Set());
  const [currencyFilter, setCurrencyFilter] = useState("all");

  const [newListing, setNewListing] = useState({
    card_name: "",
    amount: "",
    price: "",
    currency: "USD",
    country: "",
    card_format: "digital",
    description: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("");

  const filteredListings = listings.filter((l) => {
    const matchesSearch = l.card_name.toLowerCase().includes(searchQuery.toLowerCase());
    const notOwn = l.seller_id !== user?.id;
    const matchesCurrency = currencyFilter === "all" || l.currency === currencyFilter;
    return matchesSearch && notOwn && matchesCurrency;
  });

  const activeListingsCount = listings.length;
  const completedTradesCount = myTrades.filter(t => t.status === "completed").length;

  // All handler functions stay the same
  const handleCreateListing = async () => {
    if (!user) {
      toast({ title: "Login Required", description: "Please log in to create a listing.", variant: "destructive" });
      navigate("/login");
      return;
    }
    if (!newListing.card_name || !newListing.amount || !newListing.price) {
      toast({ title: "Missing Fields", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    try {
      await createListing.mutateAsync({
        card_name: newListing.card_name,
        amount: Number(newListing.amount),
        price: Number(newListing.price),
        currency: newListing.currency,
        country: newListing.country || undefined,
        card_format: newListing.card_format,
        description: newListing.description || undefined,
      });
      toast({ title: "Listing Created!", description: "Your gift card is now listed on the marketplace." });
      setCreateOpen(false);
      setNewListing({ card_name: "", amount: "", price: "", currency: "USD", country: "", card_format: "digital", description: "" });
    } catch {
      toast({ title: "Error", description: "Failed to create listing.", variant: "destructive" });
    }
  };

  const handleBuy = async () => {
    if (!user) {
      toast({ title: "Login Required", description: "Please log in to buy.", variant: "destructive" });
      navigate("/login");
      return;
    }
    if (!selectedListing || !paymentMethod) {
      toast({ title: "Missing Info", description: "Please select a payment method.", variant: "destructive" });
      return;
    }
    try {
      await createTrade.mutateAsync({
        listing_id: selectedListing.id,
        seller_id: selectedListing.seller_id,
        amount: selectedListing.amount,
        price: selectedListing.price,
        payment_method: paymentMethod,
      });
      await updateListing.mutateAsync({ id: selectedListing.id, status: "sold" });
      toast({ title: "Trade Initiated!", description: "Upload payment proof to proceed." });
      setBuyDialogOpen(false);
      setSelectedListing(null);
      setPaymentMethod("");
    } catch {
      toast({ title: "Error", description: "Failed to initiate trade.", variant: "destructive" });
    }
  };

  const handleUploadProof = async (tradeId: string, file: File) => {
    if (!user) return;
    setProofUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("payment-proofs")
        .upload(fileName, file);
      if (uploadError) throw uploadError;
      await updateTrade.mutateAsync({ id: tradeId, payment_proof_url: fileName, status: "paid" });
      toast({ title: "Proof Uploaded!", description: "Admin will verify your payment." });
    } catch {
      toast({ title: "Upload Failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setProofUploading(false);
    }
  };

  const toggleReveal = (id: string) => {
    setRevealedCodes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const discount = (listing: P2PListing) => {
    if (listing.amount <= 0) return 0;
    return Math.round(((listing.amount - listing.price) / listing.amount) * 100);
  };

  return (
    <>
      <Helmet>
        <title>P2P Marketplace - gXchange | Trade Gift Cards Directly</title>
        <meta name="description" content="Trade gift cards directly with other users on gXchange P2P marketplace. Best rates, secure escrow, instant trades." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-20 pb-16">
          {/* Hero Banner */}
          <div className="relative overflow-hidden border-b border-border/50">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
            
            <div className="container mx-auto max-w-7xl px-4 py-10 md:py-14 relative">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center">
                      <ArrowUpDown className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">P2P Trading</span>
                  </div>
                  <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">
                    Trade Gift Cards <span className="text-gradient-primary">Peer-to-Peer</span>
                  </h1>
                  <p className="text-muted-foreground text-sm md:text-base">
                    Buy & sell gift cards directly. Zero platform fees. Admin-verified for security.
                  </p>
                </div>

                {/* Stats Pills */}
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border/50 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs text-muted-foreground">Active Listings</span>
                    <span className="text-sm font-bold">{activeListingsCount}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border/50 shadow-sm">
                    <Shield className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs text-muted-foreground">Verified</span>
                    <span className="text-sm font-bold">{completedTradesCount}</span>
                  </div>
                </div>
              </div>

              {/* Trust Bar */}
              <div className="flex flex-wrap items-center gap-4 md:gap-8 mt-6 pt-6 border-t border-border/30">
                {[
                  { icon: Shield, label: "Admin Verified Trades" },
                  { icon: Zap, label: "Instant Listings" },
                  { icon: Wallet, label: "Multiple Payment Methods" },
                  { icon: TrendingUp, label: "Best Rates" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <item.icon className="w-3.5 h-3.5 text-primary/70" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="container mx-auto max-w-7xl px-4 mt-6">
            {/* Tab Navigation - Binance Style */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/50 border border-border/50">
                {([
                  { key: "buy" as TabType, label: "Marketplace", icon: ShoppingCart },
                  { key: "my-listings" as TabType, label: "My Listings", icon: CircleDot },
                  { key: "my-trades" as TabType, label: "My Trades", icon: ArrowUpDown },
                ]).map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.key
                        ? "bg-card text-foreground shadow-sm border border-border/50"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>

              <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                    <Plus className="w-4 h-4" />
                    Post Ad
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Plus className="w-5 h-5 text-primary" />
                      Create P2P Listing
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-wider text-muted-foreground">Gift Card Name</Label>
                      <Input
                        placeholder="e.g. Amazon, Apple, Steam"
                        value={newListing.card_name}
                        onChange={(e) => setNewListing({ ...newListing, card_name: e.target.value })}
                        className="h-11"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Card Value</Label>
                        <Input
                          type="number"
                          placeholder="100"
                          value={newListing.amount}
                          onChange={(e) => setNewListing({ ...newListing, amount: e.target.value })}
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Your Price</Label>
                        <Input
                          type="number"
                          placeholder="85"
                          value={newListing.price}
                          onChange={(e) => setNewListing({ ...newListing, price: e.target.value })}
                          className="h-11"
                        />
                      </div>
                    </div>
                    {newListing.amount && newListing.price && Number(newListing.amount) > 0 && (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent text-accent-foreground text-sm">
                        <TrendingUp className="w-4 h-4" />
                        <span>Buyer saves <strong>{Math.round(((Number(newListing.amount) - Number(newListing.price)) / Number(newListing.amount)) * 100)}%</strong></span>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Currency</Label>
                        <Select value={newListing.currency} onValueChange={(v) => setNewListing({ ...newListing, currency: v })}>
                          <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD ($)</SelectItem>
                            <SelectItem value="EUR">EUR (€)</SelectItem>
                            <SelectItem value="GBP">GBP (£)</SelectItem>
                            <SelectItem value="NGN">NGN (₦)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Format</Label>
                        <Select value={newListing.card_format} onValueChange={(v) => setNewListing({ ...newListing, card_format: v })}>
                          <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="digital">Digital</SelectItem>
                            <SelectItem value="physical">Physical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-wider text-muted-foreground">Country (Optional)</Label>
                      <Select value={newListing.country} onValueChange={(v) => setNewListing({ ...newListing, country: v })}>
                        <SelectTrigger className="h-11"><SelectValue placeholder="Select country" /></SelectTrigger>
                        <SelectContent>
                          {countries.map((c) => (
                            <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-wider text-muted-foreground">Description</Label>
                      <Textarea
                        placeholder="Any additional details about this card..."
                        value={newListing.description}
                        onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                        className="resize-none"
                        rows={3}
                      />
                    </div>
                    <Button className="w-full h-11 rounded-xl" onClick={handleCreateListing} disabled={createListing.isPending}>
                      {createListing.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Publish Listing
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* ======================== MARKETPLACE TAB ======================== */}
            {activeTab === "buy" && (
              <div className="animate-fade-in">
                {/* Filters Row */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by card name..."
                      className="pl-10 h-11 rounded-xl bg-muted/30 border-border/50"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    {["all", "USD", "EUR", "GBP", "NGN"].map((c) => (
                      <button
                        key={c}
                        onClick={() => setCurrencyFilter(c)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          currencyFilter === c
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        {c === "all" ? "All" : c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Listings Table / Cards */}
                {listingsLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-20 rounded-xl" />
                    ))}
                  </div>
                ) : filteredListings.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                      <ShoppingCart className="w-7 h-7 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">No listings available</h3>
                    <p className="text-muted-foreground text-sm mb-6">Be the first to list a gift card on the marketplace!</p>
                    <Button onClick={() => setCreateOpen(true)} className="gap-2 rounded-xl">
                      <Plus className="w-4 h-4" /> Post Ad
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block rounded-xl border border-border/50 overflow-hidden bg-card/50">
                      {/* Table Header */}
                      <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_120px] px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground border-b border-border/50 bg-muted/20">
                        <span>Gift Card</span>
                        <span>Value</span>
                        <span>Price</span>
                        <span>Discount</span>
                        <span>Format</span>
                        <span className="text-right">Action</span>
                      </div>
                      {/* Table Rows */}
                      {filteredListings.map((listing, i) => (
                        <div
                          key={listing.id}
                          className={`grid grid-cols-[2fr_1fr_1fr_1fr_1fr_120px] px-5 py-4 items-center transition-colors hover:bg-muted/30 ${
                            i < filteredListings.length - 1 ? "border-b border-border/30" : ""
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 flex items-center justify-center shrink-0">
                              <span className="text-sm font-bold text-primary">
                                {listing.card_name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-sm">{listing.card_name}</p>
                              {listing.country && (
                                <p className="text-xs text-muted-foreground">{listing.country}</p>
                              )}
                            </div>
                          </div>
                          <span className="text-sm font-medium">{listing.currency} {listing.amount}</span>
                          <span className="text-sm font-bold text-primary">{listing.currency} {listing.price}</span>
                          <div>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-accent text-accent-foreground">
                              {discount(listing)}% off
                            </span>
                          </div>
                          <span className="text-sm capitalize text-muted-foreground">{listing.card_format || "—"}</span>
                          <div className="text-right">
                            <Button
                              size="sm"
                              className="rounded-lg h-9 px-5 gap-1.5"
                              onClick={() => {
                                setSelectedListing(listing);
                                setBuyDialogOpen(true);
                              }}
                            >
                              Buy
                              <ChevronRight className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-3">
                      {filteredListings.map((listing) => (
                        <div
                          key={listing.id}
                          className="rounded-xl border border-border/50 bg-card/80 p-4 transition-all hover:border-primary/20 hover:shadow-sm"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 flex items-center justify-center shrink-0">
                                <span className="text-sm font-bold text-primary">
                                  {listing.card_name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <p className="font-semibold text-sm">{listing.card_name}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-xs text-muted-foreground capitalize">{listing.card_format || "digital"}</span>
                                  {listing.country && (
                                    <>
                                      <span className="text-xs text-muted-foreground">•</span>
                                      <span className="text-xs text-muted-foreground">{listing.country}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-accent text-accent-foreground">
                              {discount(listing)}% off
                            </span>
                          </div>
                          <div className="flex items-end justify-between">
                            <div className="flex items-baseline gap-4">
                              <div>
                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Value</p>
                                <p className="text-sm font-medium">{listing.currency} {listing.amount}</p>
                              </div>
                              <div>
                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Price</p>
                                <p className="text-sm font-bold text-primary">{listing.currency} {listing.price}</p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              className="rounded-lg h-9 px-5 gap-1"
                              onClick={() => {
                                setSelectedListing(listing);
                                setBuyDialogOpen(true);
                              }}
                            >
                              Buy <ChevronRight className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ======================== MY LISTINGS TAB ======================== */}
            {activeTab === "my-listings" && (
              <div className="animate-fade-in">
                {!user ? (
                  <div className="text-center py-20">
                    <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                      <Users className="w-7 h-7 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground mb-4">Log in to manage your listings</p>
                    <Link to="/login"><Button className="rounded-xl">Log In</Button></Link>
                  </div>
                ) : myListings.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                      <Plus className="w-7 h-7 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">No active listings</h3>
                    <p className="text-muted-foreground text-sm mb-6">Create your first listing to start trading on the marketplace.</p>
                    <Button onClick={() => setCreateOpen(true)} className="gap-2 rounded-xl">
                      <Plus className="w-4 h-4" /> Post Your First Ad
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myListings.map((listing) => {
                      const statusStyle: Record<string, string> = {
                        active: "bg-accent text-accent-foreground",
                        sold: "bg-primary/10 text-primary",
                        cancelled: "bg-destructive/10 text-destructive",
                        expired: "bg-muted text-muted-foreground",
                      };
                      return (
                        <div key={listing.id} className="rounded-xl border border-border/50 bg-card/80 p-4 md:p-5">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 flex items-center justify-center shrink-0">
                                <span className="text-sm font-bold text-primary">{listing.card_name.charAt(0)}</span>
                              </div>
                              <div>
                                <p className="font-semibold text-sm">{listing.card_name}</p>
                                <div className="flex items-center gap-3 mt-0.5">
                                  <span className="text-xs text-muted-foreground">Value: {listing.currency} {listing.amount}</span>
                                  <span className="text-xs font-semibold text-primary">Price: {listing.currency} {listing.price}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize ${statusStyle[listing.status] || "bg-muted text-muted-foreground"}`}>
                                {listing.status}
                              </span>
                              {listing.status === "active" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="rounded-lg text-xs"
                                  onClick={async () => {
                                    await updateListing.mutateAsync({ id: listing.id, status: "cancelled" });
                                    toast({ title: "Listing cancelled" });
                                  }}
                                >
                                  Cancel
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ======================== MY TRADES TAB ======================== */}
            {activeTab === "my-trades" && (
              <div className="animate-fade-in">
                {!user ? (
                  <div className="text-center py-20">
                    <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                      <ArrowUpDown className="w-7 h-7 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground mb-4">Log in to view your trades</p>
                    <Link to="/login"><Button className="rounded-xl">Log In</Button></Link>
                  </div>
                ) : myTrades.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-7 h-7 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">No trades yet</h3>
                    <p className="text-muted-foreground text-sm">Browse the marketplace to initiate your first trade.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myTrades.map((trade) => {
                      const isBuyer = trade.buyer_id === user.id;
                      const tradeStatusStyle: Record<string, string> = {
                        pending: "bg-secondary/10 text-secondary",
                        paid: "bg-primary/10 text-primary",
                        completed: "bg-accent text-accent-foreground",
                        cancelled: "bg-destructive/10 text-destructive",
                        disputed: "bg-destructive/10 text-destructive",
                      };
                      return (
                        <div key={trade.id} className="rounded-xl border border-border/50 bg-card/80 overflow-hidden">
                          {/* Trade Header */}
                          <div className="flex items-center justify-between px-4 md:px-5 py-3 bg-muted/20 border-b border-border/30">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                isBuyer ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
                              }`}>
                                {isBuyer ? "Buy" : "Sell"}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-medium capitalize ${tradeStatusStyle[trade.status] || ""}`}>
                                {trade.status}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(trade.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                          </div>

                          <div className="p-4 md:p-5">
                            <div className="flex items-baseline gap-6 mb-4">
                              <div>
                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Amount</p>
                                <p className="text-lg font-bold">${trade.amount}</p>
                              </div>
                              <div>
                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Price Paid</p>
                                <p className="text-lg font-bold text-primary">${trade.price}</p>
                              </div>
                              {trade.payment_method && (
                                <div>
                                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Via</p>
                                  <p className="text-sm font-medium capitalize">{trade.payment_method.replace("_", " ")}</p>
                                </div>
                              )}
                            </div>

                            {/* Pending: Upload proof */}
                            {isBuyer && trade.status === "pending" && (
                              <div className="rounded-lg border border-dashed border-primary/30 bg-primary/5 p-4">
                                <p className="text-sm font-medium mb-2 flex items-center gap-2">
                                  <Upload className="w-4 h-4 text-primary" />
                                  Upload Payment Proof
                                </p>
                                <p className="text-xs text-muted-foreground mb-3">Send payment via your selected method, then upload a screenshot as proof.</p>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  ref={fileInputRef}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleUploadProof(trade.id, file);
                                  }}
                                />
                                <Button
                                  variant="outline"
                                  className="w-full gap-2 rounded-lg"
                                  disabled={proofUploading}
                                  onClick={() => fileInputRef.current?.click()}
                                >
                                  {proofUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                  {proofUploading ? "Uploading..." : "Select File"}
                                </Button>
                              </div>
                            )}

                            {/* Paid: Waiting */}
                            {trade.status === "paid" && (
                              <div className="flex items-center gap-3 rounded-lg bg-secondary/5 border border-secondary/20 p-3">
                                <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                                  <Clock className="w-4 h-4 text-secondary" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Awaiting Verification</p>
                                  <p className="text-xs text-muted-foreground">Admin is verifying your payment proof.</p>
                                </div>
                              </div>
                            )}

                            {/* Completed: Show code */}
                            {isBuyer && trade.status === "completed" && trade.card_code && (
                              <div className="rounded-lg bg-accent border border-primary/10 p-4">
                                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                                  <CheckCircle className="w-3.5 h-3.5 text-primary" />
                                  Gift Card Code
                                </p>
                                <div className="flex items-center gap-2 bg-card rounded-lg p-3 border border-border/50">
                                  <code className="flex-1 font-mono text-sm tracking-wider">
                                    {revealedCodes.has(trade.id) ? trade.card_code : "••••  ••••  ••••  ••••"}
                                  </code>
                                  <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0" onClick={() => toggleReveal(trade.id)}>
                                    {revealedCodes.has(trade.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                  </Button>
                                  {revealedCodes.has(trade.id) && (
                                    <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0" onClick={() => {
                                      navigator.clipboard.writeText(trade.card_code!);
                                      toast({ title: "Copied to clipboard!" });
                                    }}>
                                      <Copy className="w-4 h-4" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Completed: Seller view */}
                            {!isBuyer && trade.status === "completed" && (
                              <div className="flex items-center gap-3 rounded-lg bg-accent border border-primary/10 p-3">
                                <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                                <p className="text-sm font-medium">Trade completed successfully</p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>

      {/* Buy Dialog */}
      <Dialog open={buyDialogOpen} onOpenChange={setBuyDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-primary" />
              Buy Gift Card
            </DialogTitle>
          </DialogHeader>
          {selectedListing && (
            <div className="space-y-4">
              <div className="rounded-xl bg-muted/30 border border-border/50 p-4 space-y-3">
                <div className="flex items-center gap-3 pb-3 border-b border-border/30">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{selectedListing.card_name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-semibold">{selectedListing.card_name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{selectedListing.card_format || "digital"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Value</p>
                    <p className="text-sm font-semibold">{selectedListing.currency} {selectedListing.amount}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Price</p>
                    <p className="text-sm font-bold text-primary">{selectedListing.currency} {selectedListing.price}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">You Save</p>
                    <p className="text-sm font-semibold text-accent-foreground">
                      {discount(selectedListing)}%
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Payment Method</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "binance", label: "Binance Pay" },
                    { value: "paypal", label: "PayPal" },
                    { value: "bank_transfer", label: "Bank Transfer" },
                  ].map((method) => (
                    <button
                      key={method.value}
                      onClick={() => setPaymentMethod(method.value)}
                      className={`p-3 rounded-lg border-2 text-xs font-medium transition-all ${
                        paymentMethod === method.value
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border/50 hover:border-primary/30 text-muted-foreground"
                      }`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-secondary/5 border border-secondary/20">
                <Shield className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground">
                  After initiating the trade, upload payment proof. An admin will verify before releasing the card code.
                </p>
              </div>
              <Button className="w-full h-11 rounded-xl gap-2" onClick={handleBuy} disabled={createTrade.isPending || !paymentMethod}>
                {createTrade.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                Initiate Trade
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default P2PMarketplace;
