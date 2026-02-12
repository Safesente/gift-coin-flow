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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowRight, Plus, ShoppingCart, Upload, X, Loader2,
  Search, Users, Clock, CheckCircle, AlertCircle, Eye, EyeOff, Copy
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { usePublicGiftCards, usePublicCategories } from "@/hooks/useAdmin";
import {
  useP2PListings, useMyListings, useMyTrades,
  useCreateListing, useCreateTrade, useUpdateTrade, useUpdateListing
} from "@/hooks/useP2P";
import { countries } from "@/data/countries";

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  sold: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  paid: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  disputed: "bg-red-500/10 text-red-600 border-red-500/20",
};

const P2PMarketplace = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: listings = [], isLoading: listingsLoading } = useP2PListings();
  const { data: myListings = [] } = useMyListings();
  const { data: myTrades = [] } = useMyTrades();
  const { data: giftCards = [] } = usePublicGiftCards();
  const { data: categories = [] } = usePublicCategories();
  const createListing = useCreateListing();
  const createTrade = useCreateTrade();
  const updateTrade = useUpdateTrade();
  const updateListing = useUpdateListing();

  const [searchQuery, setSearchQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [proofUploading, setProofUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [revealedCodes, setRevealedCodes] = useState<Set<string>>(new Set());

  // Create listing form
  const [newListing, setNewListing] = useState({
    card_name: "",
    amount: "",
    price: "",
    currency: "USD",
    country: "",
    card_format: "digital",
    description: "",
  });

  // Buy form
  const [paymentMethod, setPaymentMethod] = useState("");

  const filteredListings = listings.filter((l) =>
    l.card_name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    l.seller_id !== user?.id
  );

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
      // Mark listing as sold
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

      await updateTrade.mutateAsync({
        id: tradeId,
        payment_proof_url: fileName,
        status: "paid",
      });
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

  return (
    <>
      <Helmet>
        <title>P2P Marketplace - gXchange | Trade Gift Cards Directly</title>
        <meta name="description" content="Trade gift cards directly with other users on gXchange P2P marketplace." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto max-w-6xl">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">P2P Marketplace</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Trade Gift Cards Peer-to-Peer</h1>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Buy and sell gift cards directly with other users. Safe trades verified by our admin team.
              </p>
            </div>

            <Tabs defaultValue="marketplace" className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <TabsList>
                  <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
                  <TabsTrigger value="my-listings">My Listings</TabsTrigger>
                  <TabsTrigger value="my-trades">My Trades</TabsTrigger>
                </TabsList>

                <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="w-4 h-4" />
                      Create Listing
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Create P2P Listing</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Gift Card Name *</Label>
                        <Input
                          placeholder="e.g. Amazon, Apple, Steam"
                          value={newListing.card_name}
                          onChange={(e) => setNewListing({ ...newListing, card_name: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Card Value *</Label>
                          <Input
                            type="number"
                            placeholder="100"
                            value={newListing.amount}
                            onChange={(e) => setNewListing({ ...newListing, amount: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Your Price *</Label>
                          <Input
                            type="number"
                            placeholder="85"
                            value={newListing.price}
                            onChange={(e) => setNewListing({ ...newListing, price: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Currency</Label>
                          <Select value={newListing.currency} onValueChange={(v) => setNewListing({ ...newListing, currency: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                              <SelectItem value="GBP">GBP</SelectItem>
                              <SelectItem value="NGN">NGN</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Format</Label>
                          <Select value={newListing.card_format} onValueChange={(v) => setNewListing({ ...newListing, card_format: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="digital">Digital</SelectItem>
                              <SelectItem value="physical">Physical</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Country (Optional)</Label>
                        <Select value={newListing.country} onValueChange={(v) => setNewListing({ ...newListing, country: v })}>
                          <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                          <SelectContent>
                            {countries.map((c) => (
                              <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Description (Optional)</Label>
                        <Textarea
                          placeholder="Any additional details..."
                          value={newListing.description}
                          onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                        />
                      </div>
                      <Button className="w-full" onClick={handleCreateListing} disabled={createListing.isPending}>
                        {createListing.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Create Listing
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Marketplace Tab */}
              <TabsContent value="marketplace" className="space-y-4">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search gift cards..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {listingsLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="h-48 rounded-2xl" />
                    ))}
                  </div>
                ) : filteredListings.length === 0 ? (
                  <div className="text-center py-16">
                    <ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-1">No listings found</h3>
                    <p className="text-muted-foreground text-sm">Be the first to list a gift card!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredListings.map((listing) => (
                      <div key={listing.id} className="glass-card rounded-2xl p-5 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-lg">{listing.card_name}</h3>
                            <Badge variant="outline" className={statusColors[listing.status]}>
                              {listing.status}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground mb-4">
                            <div className="flex justify-between">
                              <span>Card Value:</span>
                              <span className="font-medium text-foreground">{listing.currency} {listing.amount}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Asking Price:</span>
                              <span className="font-bold text-primary">{listing.currency} {listing.price}</span>
                            </div>
                            {listing.card_format && (
                              <div className="flex justify-between">
                                <span>Format:</span>
                                <span className="capitalize">{listing.card_format}</span>
                              </div>
                            )}
                            {listing.country && (
                              <div className="flex justify-between">
                                <span>Country:</span>
                                <span>{listing.country}</span>
                              </div>
                            )}
                          </div>
                          {listing.description && (
                            <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{listing.description}</p>
                          )}
                        </div>
                        <Button
                          className="w-full gap-2"
                          onClick={() => {
                            setSelectedListing(listing);
                            setBuyDialogOpen(true);
                          }}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Buy Now
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* My Listings Tab */}
              <TabsContent value="my-listings" className="space-y-4">
                {!user ? (
                  <div className="text-center py-16">
                    <p className="text-muted-foreground mb-4">Please log in to see your listings.</p>
                    <Link to="/login"><Button>Log In</Button></Link>
                  </div>
                ) : myListings.length === 0 ? (
                  <div className="text-center py-16">
                    <Plus className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-1">No listings yet</h3>
                    <p className="text-muted-foreground text-sm mb-4">Create your first listing to start trading.</p>
                    <Button onClick={() => setCreateOpen(true)} className="gap-2">
                      <Plus className="w-4 h-4" /> Create Listing
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {myListings.map((listing) => (
                      <div key={listing.id} className="glass-card rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold">{listing.card_name}</h3>
                          <Badge variant="outline" className={statusColors[listing.status]}>
                            {listing.status}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex justify-between">
                            <span>Value:</span>
                            <span>{listing.currency} {listing.amount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Price:</span>
                            <span className="font-bold text-primary">{listing.currency} {listing.price}</span>
                          </div>
                        </div>
                        {listing.status === "active" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-4"
                            onClick={async () => {
                              await updateListing.mutateAsync({ id: listing.id, status: "cancelled" });
                              toast({ title: "Listing cancelled" });
                            }}
                          >
                            Cancel Listing
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* My Trades Tab */}
              <TabsContent value="my-trades" className="space-y-4">
                {!user ? (
                  <div className="text-center py-16">
                    <p className="text-muted-foreground mb-4">Please log in to see your trades.</p>
                    <Link to="/login"><Button>Log In</Button></Link>
                  </div>
                ) : myTrades.length === 0 ? (
                  <div className="text-center py-16">
                    <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-1">No trades yet</h3>
                    <p className="text-muted-foreground text-sm">Browse the marketplace to start trading.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myTrades.map((trade) => {
                      const isBuyer = trade.buyer_id === user.id;
                      return (
                        <div key={trade.id} className="glass-card rounded-2xl p-5">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className={isBuyer ? "bg-blue-500/10 text-blue-600 border-blue-500/20" : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"}>
                                {isBuyer ? "Buying" : "Selling"}
                              </Badge>
                              <Badge variant="outline" className={statusColors[trade.status]}>
                                {trade.status}
                              </Badge>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {new Date(trade.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                            <div>
                              <span className="text-muted-foreground">Amount:</span>
                              <p className="font-medium">${trade.amount}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Price:</span>
                              <p className="font-bold text-primary">${trade.price}</p>
                            </div>
                          </div>

                          {/* Buyer: upload proof if pending */}
                          {isBuyer && trade.status === "pending" && (
                            <div className="space-y-2">
                              <p className="text-sm text-muted-foreground">Upload payment proof to proceed:</p>
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
                                className="w-full gap-2"
                                disabled={proofUploading}
                                onClick={() => fileInputRef.current?.click()}
                              >
                                {proofUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                Upload Payment Proof
                              </Button>
                            </div>
                          )}

                          {/* Show card code when trade is completed */}
                          {isBuyer && trade.status === "completed" && trade.card_code && (
                            <div className="bg-accent rounded-lg p-3 mt-2">
                              <p className="text-xs text-muted-foreground mb-1">Gift Card Code:</p>
                              <div className="flex items-center gap-2">
                                <code className="flex-1 font-mono text-sm">
                                  {revealedCodes.has(trade.id) ? trade.card_code : "••••••••••••"}
                                </code>
                                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => toggleReveal(trade.id)}>
                                  {revealedCodes.has(trade.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </Button>
                                {revealedCodes.has(trade.id) && (
                                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => {
                                    navigator.clipboard.writeText(trade.card_code!);
                                    toast({ title: "Copied!" });
                                  }}>
                                    <Copy className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}

                          {trade.status === "paid" && (
                            <div className="flex items-center gap-2 text-sm text-yellow-600 mt-2">
                              <Clock className="w-4 h-4" />
                              Waiting for admin verification
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
        <Footer />
      </div>

      {/* Buy Dialog */}
      <Dialog open={buyDialogOpen} onOpenChange={setBuyDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Buy Gift Card</DialogTitle>
          </DialogHeader>
          {selectedListing && (
            <div className="space-y-4">
              <div className="bg-muted rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Card:</span>
                  <span className="font-semibold">{selectedListing.card_name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Card Value:</span>
                  <span>{selectedListing.currency} {selectedListing.amount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-bold text-primary">{selectedListing.currency} {selectedListing.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">You save:</span>
                  <span className="text-emerald-600 font-medium">
                    {selectedListing.currency} {(selectedListing.amount - selectedListing.price).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Payment Method *</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger><SelectValue placeholder="Select payment method" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="binance">Binance Pay</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-xs text-muted-foreground">
                After initiating the trade, you'll need to upload payment proof for admin verification.
              </p>
              <Button className="w-full gap-2" onClick={handleBuy} disabled={createTrade.isPending}>
                {createTrade.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
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
