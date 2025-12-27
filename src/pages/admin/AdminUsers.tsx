import { Loader2, Search } from "lucide-react";
import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { UsersTable } from "@/components/admin/UsersTable";
import { useAllProfiles, useAllUserRoles, useAllTransactions } from "@/hooks/useAdmin";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function AdminUsers() {
  const { data: profiles = [], isLoading: loadingProfiles } = useAllProfiles();
  const { data: roles = [], isLoading: loadingRoles } = useAllUserRoles();
  const { data: transactions = [], isLoading: loadingTransactions } = useAllTransactions();
  const [search, setSearch] = useState("");

  const isLoading = loadingProfiles || loadingRoles || loadingTransactions;

  const filteredProfiles = profiles.filter((p) => {
    const searchLower = search.toLowerCase();
    return (
      (p.email?.toLowerCase().includes(searchLower) || false) ||
      (p.full_name?.toLowerCase().includes(searchLower) || false)
    );
  });

  const adminCount = roles.filter((r) => r.role === "admin").length;

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
            <h1 className="text-2xl font-bold">User Management</h1>
            <p className="text-muted-foreground">
              View all registered users and their transaction history.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{profiles.length} users</Badge>
            <Badge variant="default">{adminCount} admins</Badge>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by email or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Users Table */}
        <UsersTable 
          profiles={filteredProfiles} 
          roles={roles} 
          transactions={transactions} 
        />
      </div>
    </AdminLayout>
  );
}
