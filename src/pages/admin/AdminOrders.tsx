import { useState } from "react";
import { Loader2, Filter } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { useAllTransactions, useAllProfiles } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export default function AdminOrders() {
  const { data: transactions = [], isLoading: loadingTransactions } = useAllTransactions();
  const { data: profiles = [], isLoading: loadingProfiles } = useAllProfiles();
  
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "buy" | "sell">("all");

  const profilesMap = profiles.reduce((acc, p) => {
    acc[p.user_id] = { email: p.email, full_name: p.full_name };
    return acc;
  }, {} as Record<string, { email: string | null; full_name: string | null }>);

  const isLoading = loadingTransactions || loadingProfiles;

  const pendingCount = transactions.filter((t) => t.status === "pending").length;
  const buyCount = transactions.filter((t) => t.type === "buy").length;
  const sellCount = transactions.filter((t) => t.type === "sell").length;

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Orders Management</h1>
            <p className="text-muted-foreground">
              View and manage all buy and sell orders.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-sm">
              {transactions.length} total
            </Badge>
            {pendingCount > 0 && (
              <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">
                {pendingCount} pending
              </Badge>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Status: {statusFilter === "all" ? "All" : statusFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
                <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="pending">Pending</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="completed">Completed</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Type: {typeFilter === "all" ? "All" : typeFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={typeFilter} onValueChange={(v) => setTypeFilter(v as typeof typeFilter)}>
                <DropdownMenuRadioItem value="all">All ({transactions.length})</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="buy">Buy ({buyCount})</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="sell">Sell ({sellCount})</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Orders Table */}
        <OrdersTable 
          transactions={transactions} 
          profiles={profilesMap}
          filter={statusFilter}
          type={typeFilter}
        />
      </div>
    </AdminLayout>
  );
}
