import { 
  ShoppingCart, 
  DollarSign, 
  Users, 
  CreditCard,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { 
  useAllTransactions, 
  useAllProfiles, 
  useGiftCards 
} from "@/hooks/useAdmin";
import { Loader2 } from "lucide-react";

export default function AdminOverview() {
  const { data: transactions = [], isLoading: loadingTransactions } = useAllTransactions();
  const { data: profiles = [], isLoading: loadingProfiles } = useAllProfiles();
  const { data: giftCards = [] } = useGiftCards(true);

  const profilesMap = profiles.reduce((acc, p) => {
    acc[p.user_id] = { email: p.email, full_name: p.full_name };
    return acc;
  }, {} as Record<string, { email: string | null; full_name: string | null }>);

  const stats = {
    totalTransactions: transactions.length,
    pendingOrders: transactions.filter((t) => t.status === "pending").length,
    completedOrders: transactions.filter((t) => t.status === "completed").length,
    cancelledOrders: transactions.filter((t) => t.status === "cancelled").length,
    totalRevenue: transactions
      .filter((t) => t.type === "buy" && t.status === "completed")
      .reduce((sum, t) => sum + Number(t.amount), 0),
    totalUsers: profiles.length,
    activeCards: giftCards.filter((c) => c.is_active).length,
    totalCards: giftCards.length,
  };

  const isLoading = loadingTransactions || loadingProfiles;

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground">Monitor your platform's performance and manage orders.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">From completed buy orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingOrders}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">Registered accounts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gift Card Types</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeCards}/{stats.totalCards}</div>
              <p className="text-xs text-muted-foreground">Active card types</p>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completedOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.cancelledOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTransactions}</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Pending Orders */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Recent Pending Orders</h2>
          <OrdersTable 
            transactions={transactions.slice(0, 10)} 
            profiles={profilesMap} 
            filter="pending" 
          />
        </div>
      </div>
    </AdminLayout>
  );
}
