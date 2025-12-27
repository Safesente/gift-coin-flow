import { useState } from "react";
import { format } from "date-fns";
import { ChevronDown, ChevronUp, Eye, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserProfile, UserRole, AdminTransaction } from "@/hooks/useAdmin";

interface UsersTableProps {
  profiles: UserProfile[];
  roles: UserRole[];
  transactions: AdminTransaction[];
}

export function UsersTable({ profiles, roles, transactions }: UsersTableProps) {
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"created_at" | "email">("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const getRolesForUser = (userId: string) => {
    return roles.filter((r) => r.user_id === userId).map((r) => r.role);
  };

  const getTransactionsForUser = (userId: string) => {
    return transactions.filter((t) => t.user_id === userId);
  };

  const sortedProfiles = [...profiles].sort((a, b) => {
    if (sortBy === "created_at") {
      return sortOrder === "desc"
        ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        : new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
    const aVal = a.email || "";
    const bVal = b.email || "";
    return sortOrder === "desc" ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
  });

  const handleSort = (column: "created_at" | "email") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const handleViewUser = (profile: UserProfile) => {
    setSelectedUser(profile);
    setDialogOpen(true);
  };

  const SortIcon = ({ column }: { column: "created_at" | "email" }) => {
    if (sortBy !== column) return null;
    return sortOrder === "desc" ? (
      <ChevronDown className="h-4 w-4 inline ml-1" />
    ) : (
      <ChevronUp className="h-4 w-4 inline ml-1" />
    );
  };

  const selectedUserTransactions = selectedUser 
    ? getTransactionsForUser(selectedUser.user_id) 
    : [];
  const selectedUserRoles = selectedUser 
    ? getRolesForUser(selectedUser.user_id) 
    : [];

  return (
    <>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort("email")}
              >
                User <SortIcon column="email" />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Transactions</TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort("created_at")}
              >
                Joined <SortIcon column="created_at" />
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedProfiles.map((profile) => {
              const userRoles = getRolesForUser(profile.user_id);
              const userTransactions = getTransactionsForUser(profile.user_id);
              
              return (
                <TableRow key={profile.id}>
                  <TableCell>
                    <span className="font-medium">{profile.email || "No email"}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {profile.full_name || "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {userRoles.length > 0 ? (
                        userRoles.map((role) => (
                          <Badge 
                            key={role} 
                            variant={role === "admin" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {role}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-sm">No roles</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {userTransactions.length} order{userTransactions.length !== 1 ? "s" : ""}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {format(new Date(profile.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleViewUser(profile)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              View user information and transaction history.
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedUser.email || "No email"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{selectedUser.full_name || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Joined</p>
                  <p className="font-medium">
                    {format(new Date(selectedUser.created_at), "MMMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Roles</p>
                  <div className="flex gap-1 mt-1">
                    {selectedUserRoles.length > 0 ? (
                      selectedUserRoles.map((role) => (
                        <Badge key={role} variant={role === "admin" ? "default" : "secondary"}>
                          {role}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground">No roles assigned</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Transaction History */}
              <div>
                <h3 className="font-semibold mb-3">Transaction History ({selectedUserTransactions.length})</h3>
                {selectedUserTransactions.length > 0 ? (
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Card</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedUserTransactions.map((t) => (
                          <TableRow key={t.id}>
                            <TableCell className="text-sm">
                              {format(new Date(t.created_at), "MMM d, yyyy")}
                            </TableCell>
                            <TableCell>
                              <Badge variant={t.type === "buy" ? "default" : "secondary"}>
                                {t.type}
                              </Badge>
                            </TableCell>
                            <TableCell>{t.card_name}</TableCell>
                            <TableCell>${Number(t.amount).toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{t.status}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm py-4 text-center border rounded-lg">
                    No transactions yet
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
