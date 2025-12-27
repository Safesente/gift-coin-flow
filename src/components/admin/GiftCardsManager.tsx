import { useState } from "react";
import { Plus, Trash2, Loader2, ToggleLeft, ToggleRight } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  GiftCard, 
  useGiftCards, 
  useToggleGiftCard, 
  useCreateGiftCard, 
  useDeleteGiftCard 
} from "@/hooks/useAdmin";

export function GiftCardsManager() {
  const { toast } = useToast();
  const { data: giftCards = [], isLoading } = useGiftCards(true);
  const toggleGiftCard = useToggleGiftCard();
  const createGiftCard = useCreateGiftCard();
  const deleteGiftCard = useDeleteGiftCard();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newCard, setNewCard] = useState({
    name: "",
    description: "",
    image_url: "",
  });

  const handleToggle = async (card: GiftCard) => {
    try {
      await toggleGiftCard.mutateAsync({ id: card.id, is_active: !card.is_active });
      toast({
        title: card.is_active ? "Card deactivated" : "Card activated",
        description: `${card.name} has been ${card.is_active ? "deactivated" : "activated"}.`,
      });
    } catch {
      toast({ title: "Error", description: "Failed to update card status.", variant: "destructive" });
    }
  };

  const handleCreate = async () => {
    if (!newCard.name.trim()) {
      toast({ title: "Error", description: "Card name is required.", variant: "destructive" });
      return;
    }
    
    try {
      await createGiftCard.mutateAsync({
        name: newCard.name.trim(),
        description: newCard.description.trim() || undefined,
        image_url: newCard.image_url.trim() || undefined,
        is_active: true,
      });
      toast({ title: "Card created", description: `${newCard.name} has been added.` });
      setNewCard({ name: "", description: "", image_url: "" });
      setDialogOpen(false);
    } catch {
      toast({ title: "Error", description: "Failed to create card.", variant: "destructive" });
    }
  };

  const handleDelete = async (card: GiftCard) => {
    try {
      await deleteGiftCard.mutateAsync(card.id);
      toast({ title: "Card deleted", description: `${card.name} has been removed.` });
    } catch {
      toast({ title: "Error", description: "Failed to delete card.", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Gift Card Types</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Card Type
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Gift Card Type</DialogTitle>
              <DialogDescription>
                Add a new gift card type that users can buy or sell.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Amazon, iTunes"
                  value={newCard.name}
                  onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Brief description..."
                  value={newCard.description}
                  onChange={(e) => setNewCard({ ...newCard, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  placeholder="https://..."
                  value={newCard.image_url}
                  onChange={(e) => setNewCard({ ...newCard, image_url: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={createGiftCard.isPending}>
                {createGiftCard.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {giftCards.map((card) => (
              <TableRow key={card.id}>
                <TableCell>
                  {card.image_url ? (
                    <img
                      src={card.image_url}
                      alt={card.name}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">No img</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{card.name}</TableCell>
                <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">
                  {card.description || "—"}
                </TableCell>
                <TableCell>
                  <Badge variant={card.is_active ? "default" : "secondary"}>
                    {card.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleToggle(card)}
                      disabled={toggleGiftCard.isPending}
                      title={card.is_active ? "Deactivate" : "Activate"}
                    >
                      {card.is_active ? (
                        <ToggleRight className="h-4 w-4 text-green-600" />
                      ) : (
                        <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete {card.name}?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this gift card type.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => handleDelete(card)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
