import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Clock,
  CheckCircle,
  ArrowRight,
  CreditCard,
  LogOut,
} from "lucide-react";

// Mock data - will be replaced with real data from backend
const mockStats = {
  totalTransactions: 12,
  sellPending: 2,
  sellPaid: 5,
  buyPending: 1,
  buyCompleted: 4,
  totalSold: 850,
  totalBought: 425,
};

const mockTransactions = [
  {
    id: "TXN001",
    type: "sell",
    card: "Amazon",
    amount: 100,
    payout: 47,
    status: "paid",
    date: "2024-01-15",
  },
  {
    id: "TXN002",
    type: "buy",
    card: "Steam",
    amount: 50,
    price: 42.5,
    status: "completed",
    date: "2024-01-14",
  },
  {
    id: "TXN003",
    type: "sell",
    card: "Apple",
    amount: 200,
    payout: 94,
    status: "pending",
    date: "2024-01-13",
  },
  {
    id: "TXN004",
    type: "buy",
    card: "Netflix",
    amount: 25,
    price: 21.25,
    status: "pending",
    date: "2024-01-12",
  },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<"all" | "sell" | "buy">("all");

  const filteredTransactions = mockTransactions.filter(
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
      case "completed":
        return (
          <Badge variant="secondary" className="bg-status-completed/10 text-status-completed border-0">
            <CheckCircle className="w-3 h-3 mr-1" />
            {status === "paid" ? "Paid" : "Completed"}
          </Badge>
        );
      default:
        return null;
    }
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
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Welcome back!</h1>
                <p className="text-muted-foreground">Here's your transaction overview</p>
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
                <p className="text-2xl font-bold text-foreground">{mockStats.totalTransactions}</p>
                <p className="text-sm text-muted-foreground">Total Transactions</p>
              </div>

              <div className="glass-card rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">${mockStats.totalSold}</p>
                <p className="text-sm text-muted-foreground">Total Sold</p>
              </div>

              <div className="glass-card rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-secondary" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">${mockStats.totalBought}</p>
                <p className="text-sm text-muted-foreground">Total Bought</p>
              </div>

              <div className="glass-card rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-status-pending/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-status-pending" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {mockStats.sellPending + mockStats.buyPending}
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-status-pending/10 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-status-pending">{mockStats.sellPending}</p>
                    <p className="text-sm text-muted-foreground">Pending</p>
                  </div>
                  <div className="bg-status-paid/10 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-status-paid">{mockStats.sellPaid}</p>
                    <p className="text-sm text-muted-foreground">Paid</p>
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
                    <p className="text-2xl font-bold text-status-pending">{mockStats.buyPending}</p>
                    <p className="text-sm text-muted-foreground">Pending</p>
                  </div>
                  <div className="bg-status-completed/10 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-status-completed">{mockStats.buyCompleted}</p>
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
              <div className="space-y-3">
                {filteredTransactions.map((txn) => (
                  <div
                    key={txn.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors"
                  >
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
                          {txn.type === "sell" ? "Sold" : "Bought"} {txn.card} Card
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {txn.id} • {txn.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 sm:gap-8">
                      <div className="text-right">
                        <p className="font-medium text-foreground">${txn.amount}</p>
                        <p className="text-sm text-muted-foreground">
                          {txn.type === "sell" ? `→ $${txn.payout}` : `Paid $${txn.price}`}
                        </p>
                      </div>
                      {getStatusBadge(txn.status)}
                    </div>
                  </div>
                ))}
              </div>

              {filteredTransactions.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No transactions found</p>
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
