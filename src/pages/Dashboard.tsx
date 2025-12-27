import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Clock,
  CheckCircle,
  CreditCard,
  LogOut,
  Eye,
  EyeOff,
  Copy,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTransactions, useTransactionStats, Transaction } from "@/hooks/useTransactions";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<"all" | "sell" | "buy">("all");
  const [revealedCodes, setRevealedCodes] = useState<Set<string>>(new Set());
  const { user, profile, signOut } = useAuth();
  const { data: transactions = [], isLoading } = useTransactions();
  const stats = useTransactionStats();
  const { toast } = useToast();

  const toggleCodeReveal = (txnId: string) => {
    setRevealedCodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(txnId)) {
        newSet.delete(txnId);
      } else {
        newSet.add(txnId);
      }
      return newSet;
    });
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: "Gift card code copied to clipboard.",
    });
  };

  const filteredTransactions = transactions.filter(
    (t) => activeTab === "all" || t.type === activeTab
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-status-pending/10 text-status-pending border-0">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "paid":
        return (
          <Badge variant="secondary" className="bg-status-paid/10 text-status-paid border-0">
            <CheckCircle className="w-3 h-3 mr-1" />
            Paid
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="secondary" className="bg-status-completed/10 text-status-completed border-0">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="secondary" className="bg-destructive/10 text-destructive border-0">
            Cancelled
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      <Helmet>
        <title>Dashboard - gXchange | Your Transactions</title>
        <meta name="description" content="View your gift card transactions, orders, and account activity on gXchange." />
      </Helmet>

      <div className="min-h-screen bg-gradient-hero">
        <Header />

        <main className="pt-24 pb-16">
          <div className="container mx-auto">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Welcome back{profile?.full_name ? `, ${profile.full_name}` : ""}!
                </h1>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
              <div className="flex gap-3">
                <Link to="/sell">
                  <Button variant="outline" className="gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Sell Cards
                  </Button>
                </Link>
                <Link to="/buy">
                  <Button className="gap-2">
                    <TrendingDown className="w-4 h-4" />
                    Buy Cards
                  </Button>
                </Link>
                <Button variant="ghost" onClick={handleSignOut} className="gap-2">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="glass-card rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">{stats.totalTransactions}</p>
                <p className="text-sm text-muted-foreground">Total Transactions</p>
              </div>

              <div className="glass-card rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">${stats.totalSold.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Total Sold</p>
              </div>

              <div className="glass-card rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-secondary" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">${stats.totalBought.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Total Bought</p>
              </div>

              <div className="glass-card rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-status-pending/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-status-pending" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {stats.sellPending + stats.buyPending}
                </p>
                <p className="text-sm text-muted-foreground">Pending Orders</p>
              </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="glass-card rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Sell Orders
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-status-pending/10 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-status-pending">{stats.sellPending}</p>
                    <p className="text-sm text-muted-foreground">Pending</p>
                  </div>
                  <div className="bg-status-paid/10 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-status-paid">{stats.sellPaid}</p>
                    <p className="text-sm text-muted-foreground">Paid</p>
                  </div>
                  <div className="bg-status-completed/10 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-status-completed">{stats.sellCompleted}</p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-secondary" />
                  Buy Orders
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-status-pending/10 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-status-pending">{stats.buyPending}</p>
                    <p className="text-sm text-muted-foreground">Pending</p>
                  </div>
                  <div className="bg-status-completed/10 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-status-completed">{stats.buyCompleted}</p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction History */}
            <div className="glass-card rounded-xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className="font-semibold text-foreground">Transaction History</h3>
                <div className="flex gap-2">
                  {(["all", "sell", "buy"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                        activeTab === tab
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transactions List */}
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTransactions.map((txn: Transaction) => (
                    <div
                      key={txn.id}
                      className="p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              txn.type === "sell" ? "bg-primary/10" : "bg-secondary/10"
                            }`}
                          >
                            {txn.type === "sell" ? (
                              <TrendingUp className="w-5 h-5 text-primary" />
                            ) : (
                              <TrendingDown className="w-5 h-5 text-secondary" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {txn.type === "sell" ? "Sold" : "Bought"} {txn.card_name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {txn.id.slice(0, 8)} • {format(new Date(txn.created_at), "MMM d, yyyy")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 sm:gap-8">
                          <div className="text-right">
                            <p className="font-medium text-foreground">${Number(txn.amount).toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">
                              Qty: {txn.quantity}
                            </p>
                          </div>
                          {getStatusBadge(txn.status)}
                        </div>
                      </div>
                      
                      {/* Show code for completed buy orders */}
                      {txn.type === "buy" && txn.status === "completed" && txn.code && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex-1">
                              <p className="text-xs text-muted-foreground mb-1">Gift Card Code</p>
                              <div className="flex items-center gap-2">
                                <code className="font-mono bg-background px-3 py-2 rounded-lg text-sm flex-1">
                                  {revealedCodes.has(txn.id) ? txn.code : "••••••••••••••••"}
                                </code>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => toggleCodeReveal(txn.id)}
                                >
                                  {revealedCodes.has(txn.id) ? (
                                    <EyeOff className="w-4 h-4" />
                                  ) : (
                                    <Eye className="w-4 h-4" />
                                  )}
                                </Button>
                                {revealedCodes.has(txn.id) && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => copyCode(txn.code!)}
                                  >
                                    <Copy className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Show pending message for buy orders */}
                      {txn.type === "buy" && txn.status === "pending" && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <p className="text-sm text-muted-foreground">
                            Your gift card code will appear here once the order is completed.
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {!isLoading && filteredTransactions.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No transactions found</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Start by <Link to="/buy" className="text-primary hover:underline">buying</Link> or{" "}
                    <Link to="/sell" className="text-primary hover:underline">selling</Link> gift cards
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
