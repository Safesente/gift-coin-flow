import { useState } from "react";
import { Loader2, Filter, Eye, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAllP2PTrades, useAllP2PListings, useUpdateTrade } from "@/hooks/useP2P";
import { useAllProfiles } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuLabel,
  DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  paid: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
  disputed: "bg-orange-500/10 text-orange-600 border-orange-500/20",
};

export default function AdminP2PTrades() {
  const { data: trades = [], isLoading: tradesLoading } = useAllP2PTrades();
  const { data: listings = [] } = useAllP2PListings();
  const { data: profiles = [], isLoading: profilesLoading } = useAllProfiles();
  const updateTrade = useUpdateTrade();
  const { toast } = useToast();

  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTrade, setSelectedTrade] = useState<any>(null);
  const [cardCode, setCardCode] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  const profilesMap = profiles.reduce((acc, p) => {
    acc[p.user_id] = { email: p.email, full_name: p.full_name };
    return acc;
  }, {} as Record<string, { email: string | null; full_name: string | null }>);

  const listingsMap = listings.reduce((acc, l) => {
    acc[l.id] = l;
    return acc;
  }, {} as Record<string, any>);

  const isLoading = tradesLoading || profilesLoading;

  const filtered = statusFilter === "all"
    ? trades
    : trades.filter((t) => t.status === statusFilter);

  const pendingCount = trades.filter((t) => t.status === "paid").length;

  const handleAction = async (tradeId: string, status: string) => {
    try {
      const updates: any = { id: tradeId, status };
      if (status === "completed" && cardCode) updates.card_code = cardCode;
      if (adminNotes) updates.admin_notes = adminNotes;
      await updateTrade.mutateAsync(updates);
      toast({ title: `Trade ${status}` });
      setSelectedTrade(null);
      setCardCode("");
      setAdminNotes("");
    } catch {
      toast({ title: "Error", description: "Failed to update trade.", variant: "destructive" });
    }
  };

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
            <h1 className="text-2xl font-bold">P2P Trades</h1>
            <p className="text-muted-foreground">Verify and manage peer-to-peer trades.</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{trades.length} total</Badge>
            {pendingCount > 0 && (
              <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">
                {pendingCount} awaiting verification
              </Badge>
            )}
          </div>
        </div>

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
            <DropdownMenuRadioGroup value={statusFilter} onValueChange={setStatusFilter}>
              <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="pending">Pending</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="paid">Paid (Awaiting Verification)</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="completed">Completed</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="cancelled">Cancelled</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="disputed">Disputed</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="rounded-xl border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Card</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    No trades found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((trade) => {
                  const listing = listingsMap[trade.listing_id];
                  const buyer = profilesMap[trade.buyer_id];
                  const seller = profilesMap[trade.seller_id];
                  return (
                    <TableRow key={trade.id}>
                      <TableCell className="text-sm">
                        {new Date(trade.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium">
                        {listing?.card_name || "—"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {buyer?.full_name || buyer?.email || trade.buyer_id.slice(0, 8)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {seller?.full_name || seller?.email || trade.seller_id.slice(0, 8)}
                      </TableCell>
                      <TableCell>${trade.amount}</TableCell>
                      <TableCell className="font-semibold text-primary">${trade.price}</TableCell>
                      <TableCell className="text-sm">{trade.payment_method || "—"}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColors[trade.status]}>
                          {trade.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedTrade(trade);
                            setCardCode(trade.card_code || "");
                            setAdminNotes(trade.admin_notes || "");
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Trade Detail Dialog */}
      <Dialog open={!!selectedTrade} onOpenChange={(open) => !open && setSelectedTrade(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Trade Details</DialogTitle>
          </DialogHeader>
          {selectedTrade && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Buyer:</span>
                  <p className="font-medium">{profilesMap[selectedTrade.buyer_id]?.email || selectedTrade.buyer_id.slice(0, 8)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Seller:</span>
                  <p className="font-medium">{profilesMap[selectedTrade.seller_id]?.email || selectedTrade.seller_id.slice(0, 8)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Amount:</span>
                  <p className="font-medium">${selectedTrade.amount}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Price:</span>
                  <p className="font-bold text-primary">${selectedTrade.price}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Payment Method:</span>
                  <p className="font-medium">{selectedTrade.payment_method || "—"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="outline" className={statusColors[selectedTrade.status]}>
                    {selectedTrade.status}
                  </Badge>
                </div>
              </div>

              {selectedTrade.payment_proof_url && (
                <div>
                  <Label className="text-muted-foreground">Payment Proof:</Label>
                  <p className="text-sm font-mono bg-muted rounded p-2 mt-1 break-all">{selectedTrade.payment_proof_url}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label>Gift Card Code (for completion)</Label>
                <Input
                  value={cardCode}
                  onChange={(e) => setCardCode(e.target.value)}
                  placeholder="Enter gift card code"
                  className="font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label>Admin Notes</Label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Internal notes..."
                />
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1 gap-2"
                  onClick={() => handleAction(selectedTrade.id, "completed")}
                  disabled={updateTrade.isPending}
                >
                  <CheckCircle className="w-4 h-4" />
                  Complete
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={() => handleAction(selectedTrade.id, "disputed")}
                  disabled={updateTrade.isPending}
                >
                  <AlertTriangle className="w-4 h-4" />
                  Dispute
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1 gap-2"
                  onClick={() => handleAction(selectedTrade.id, "cancelled")}
                  disabled={updateTrade.isPending}
                >
                  <XCircle className="w-4 h-4" />
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
