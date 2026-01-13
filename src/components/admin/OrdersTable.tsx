import { useState } from "react";
import { format } from "date-fns";
import { Check, X, Key, Eye, EyeOff, Loader2, Image as ImageIcon, Globe, CreditCard, Wallet } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { AdminTransaction, useUpdateTransaction } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import { countries, cardFormats } from "@/data/giftCards";

interface OrdersTableProps {
  transactions: AdminTransaction[];
  profiles: Record<string, { email: string | null; full_name: string | null }>;
  filter?: "all" | "pending" | "completed";
  type?: "all" | "buy" | "sell";
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30",
  paid: "bg-blue-500/20 text-blue-600 border-blue-500/30",
  completed: "bg-green-500/20 text-green-600 border-green-500/30",
  cancelled: "bg-red-500/20 text-red-600 border-red-500/30",
};

export function OrdersTable({ transactions, profiles, filter = "all", type = "all" }: OrdersTableProps) {
  const { toast } = useToast();
  const updateTransaction = useUpdateTransaction();
  const [codeDialogOpen, setCodeDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<AdminTransaction | null>(null);
  const [newCode, setNewCode] = useState("");
  const [revealedCodes, setRevealedCodes] = useState<Set<string>>(new Set());
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);

  const filteredTransactions = transactions.filter((t) => {
    if (filter !== "all" && filter === "pending" && t.status !== "pending") return false;
    if (filter !== "all" && filter === "completed" && t.status !== "completed") return false;
    if (type !== "all" && t.type !== type) return false;
    return true;
  });

  const handleApprove = async (transaction: AdminTransaction) => {
    const profile = profiles[transaction.user_id];
    try {
      await updateTransaction.mutateAsync({ id: transaction.id, status: "completed" });
      
      if (profile?.email) {
        supabase.functions.invoke("send-order-notification", {
          body: {
            email: profile.email,
            fullName: profile.full_name || "Customer",
            orderType: transaction.type,
            cardName: transaction.card_name,
            amount: transaction.amount,
            quantity: transaction.quantity,
            status: "completed",
            giftCardCode: transaction.code,
          },
        }).catch(console.error);
      }
      
      toast({ title: "Order approved", description: "The order has been marked as completed." });
    } catch {
      toast({ title: "Error", description: "Failed to approve order.", variant: "destructive" });
    }
  };

  const handleReject = async (transaction: AdminTransaction) => {
    const profile = profiles[transaction.user_id];
    try {
      await updateTransaction.mutateAsync({ id: transaction.id, status: "cancelled" });
      
      if (profile?.email) {
        supabase.functions.invoke("send-order-notification", {
          body: {
            email: profile.email,
            fullName: profile.full_name || "Customer",
            orderType: transaction.type,
            cardName: transaction.card_name,
            amount: transaction.amount,
            quantity: transaction.quantity,
            status: "cancelled",
          },
        }).catch(console.error);
      }
      
      toast({ title: "Order rejected", description: "The order has been cancelled." });
    } catch {
      toast({ title: "Error", description: "Failed to reject order.", variant: "destructive" });
    }
  };

  const handleAddCode = (transaction: AdminTransaction) => {
    setSelectedTransaction(transaction);
    setNewCode(transaction.code || "");
    setCodeDialogOpen(true);
  };

  const handleSaveCode = async () => {
    if (!selectedTransaction) return;
    try {
      await updateTransaction.mutateAsync({ id: selectedTransaction.id, code: newCode });
      toast({ title: "Code saved", description: "The gift card code has been saved." });
      setCodeDialogOpen(false);
    } catch {
      toast({ title: "Error", description: "Failed to save code.", variant: "destructive" });
    }
  };

  const toggleRevealCode = (id: string) => {
    setRevealedCodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleViewScreenshot = async (transaction: AdminTransaction) => {
    if (!transaction.screenshot_url) return;
    
    try {
      const { data } = await supabase.storage
        .from("transaction-screenshots")
        .createSignedUrl(transaction.screenshot_url, 3600);
      
      if (data?.signedUrl) {
        setScreenshotUrl(data.signedUrl);
        setSelectedTransaction(transaction);
        setImageDialogOpen(true);
      }
    } catch (error) {
      console.error("Error fetching screenshot:", error);
      toast({ title: "Error", description: "Failed to load screenshot.", variant: "destructive" });
    }
  };

  const getCountryName = (code: string | null) => {
    if (!code) return "-";
    return countries.find((c) => c.code === code)?.name || code;
  };

  const getFormatName = (formatCode: string | null) => {
    if (!formatCode) return "-";
    return cardFormats.find((f) => f.id === formatCode)?.name || formatCode;
  };

  if (filteredTransactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">No orders found</p>
      </div>
    );
  }

  // Mobile Card View
  const MobileOrderCard = ({ transaction }: { transaction: AdminTransaction }) => {
    const profile = profiles[transaction.user_id];
    const isCodeRevealed = revealedCodes.has(transaction.id);

    return (
      <Card className="mb-3">
        <CardContent className="p-4 space-y-3">
          {/* Header: User & Date */}
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm truncate">
                {profile?.full_name || "Unknown"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {profile?.email || "No email"}
              </p>
            </div>
            <Badge className={statusColors[transaction.status]} variant="outline">
              {transaction.status}
            </Badge>
          </div>

          {/* Card Details */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Card</p>
              <p className="font-medium">{transaction.card_name}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Type</p>
              <Badge variant={transaction.type === "buy" ? "default" : "secondary"} className="mt-0.5">
                {transaction.type}
              </Badge>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Amount</p>
              <p className="font-medium">${Number(transaction.amount).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Qty</p>
              <p className="font-medium">{transaction.quantity}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Country</p>
              <p className="text-sm">{getCountryName(transaction.country)}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Format</p>
              <p className="text-sm">{getFormatName(transaction.card_format)}</p>
            </div>
          </div>

          {/* Payment Info */}
          {transaction.type === "sell" && transaction.payment_method && (
            <div className="pt-2 border-t">
              <p className="text-muted-foreground text-xs mb-1">Payment</p>
              <div className="flex items-center gap-2">
                <Wallet className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm font-medium capitalize">{transaction.payment_method}</span>
                {transaction.payment_details && (
                  <span className="text-xs text-muted-foreground truncate flex-1">
                    {transaction.payment_details}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Code */}
          {transaction.code && (
            <div className="pt-2 border-t">
              <p className="text-muted-foreground text-xs mb-1">Code</p>
              <div className="flex items-center gap-2">
                <code className="text-xs bg-muted px-2 py-1 rounded font-mono flex-1 truncate">
                  {isCodeRevealed ? transaction.code : "••••••••"}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => toggleRevealCode(transaction.id)}
                >
                  {isCodeRevealed ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </Button>
              </div>
            </div>
          )}

          {/* Date & Actions */}
          <div className="flex items-center justify-between pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              {format(new Date(transaction.created_at), "MMM d, yyyy HH:mm")}
            </p>
            <div className="flex items-center gap-1">
              {transaction.screenshot_url && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleViewScreenshot(transaction)}
                >
                  <ImageIcon className="h-4 w-4 text-primary" />
                </Button>
              )}
              {transaction.type === "buy" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleAddCode(transaction)}
                >
                  <Key className="h-4 w-4" />
                </Button>
              )}
              {transaction.status === "pending" && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                    onClick={() => handleApprove(transaction)}
                    disabled={updateTransaction.isPending}
                  >
                    {updateTransaction.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleReject(transaction)}
                    disabled={updateTransaction.isPending}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      {/* Mobile View */}
      <div className="md:hidden space-y-3">
        {filteredTransactions.map((transaction) => (
          <MobileOrderCard key={transaction.id} transaction={transaction} />
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-lg border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Date</TableHead>
              <TableHead className="whitespace-nowrap">User</TableHead>
              <TableHead className="whitespace-nowrap">Type</TableHead>
              <TableHead className="whitespace-nowrap">Card</TableHead>
              <TableHead className="whitespace-nowrap">Country</TableHead>
              <TableHead className="whitespace-nowrap">Format</TableHead>
              <TableHead className="whitespace-nowrap">Amount</TableHead>
              <TableHead className="whitespace-nowrap">Qty</TableHead>
              <TableHead className="whitespace-nowrap">Payment</TableHead>
              <TableHead className="whitespace-nowrap">Status</TableHead>
              <TableHead className="whitespace-nowrap">Code</TableHead>
              <TableHead className="whitespace-nowrap">Screenshot</TableHead>
              <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((transaction) => {
              const profile = profiles[transaction.user_id];
              const isCodeRevealed = revealedCodes.has(transaction.id);
              
              return (
                <TableRow key={transaction.id}>
                  <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                    {format(new Date(transaction.created_at), "MMM d, yyyy HH:mm")}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">
                        {profile?.full_name || "Unknown"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {profile?.email || "No email"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={transaction.type === "buy" ? "default" : "secondary"}>
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{transaction.card_name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Globe className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{getCountryName(transaction.country)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <CreditCard className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{getFormatName(transaction.card_format)}</span>
                    </div>
                  </TableCell>
                  <TableCell>${Number(transaction.amount).toFixed(2)}</TableCell>
                  <TableCell>{transaction.quantity}</TableCell>
                  <TableCell>
                    {transaction.type === "sell" && transaction.payment_method ? (
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1">
                          <Wallet className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs font-medium capitalize">{transaction.payment_method}</span>
                        </div>
                        {transaction.payment_details && (
                          <span className="text-xs text-muted-foreground truncate max-w-[120px]" title={transaction.payment_details}>
                            {transaction.payment_details}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[transaction.status]}>
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {transaction.code ? (
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-muted px-2 py-1 rounded font-mono max-w-[100px] truncate">
                          {isCodeRevealed ? transaction.code : "••••••••"}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => toggleRevealCode(transaction.id)}
                        >
                          {isCodeRevealed ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs">No code</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {transaction.screenshot_url ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleViewScreenshot(transaction)}
                        title="View Screenshot"
                      >
                        <ImageIcon className="h-4 w-4 text-primary" />
                      </Button>
                    ) : (
                      <span className="text-muted-foreground text-xs">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {transaction.type === "buy" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleAddCode(transaction)}
                          title="Add/Edit Code"
                        >
                          <Key className="h-4 w-4" />
                        </Button>
                      )}
                      {transaction.status === "pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => handleApprove(transaction)}
                            disabled={updateTransaction.isPending}
                          >
                            {updateTransaction.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleReject(transaction)}
                            disabled={updateTransaction.isPending}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Code Dialog */}
      <Dialog open={codeDialogOpen} onOpenChange={setCodeDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Gift Card Code</DialogTitle>
            <DialogDescription>
              Enter the gift card code for this buy order. The buyer will be able to see this code once the order is completed.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter gift card code..."
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
            />
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setCodeDialogOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleSaveCode} disabled={updateTransaction.isPending} className="w-full sm:w-auto">
              {updateTransaction.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Screenshot Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Gift Card Screenshot</DialogTitle>
            <DialogDescription>
              Screenshot provided by the seller for order verification.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {screenshotUrl && (
              <img
                src={screenshotUrl}
                alt="Gift card screenshot"
                className="w-full rounded-lg border"
              />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImageDialogOpen(false)} className="w-full sm:w-auto">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
