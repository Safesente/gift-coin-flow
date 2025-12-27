import { useState, useRef } from "react";
import { Plus, Trash2, Loader2, ToggleLeft, ToggleRight, Upload, Pencil } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";
import { 
  GiftCard, 
  useGiftCards, 
  useToggleGiftCard, 
  useCreateGiftCard, 
  useDeleteGiftCard,
  useUpdateGiftCard 
} from "@/hooks/useAdmin";

export function GiftCardsManager() {
  const { toast } = useToast();
  const { data: giftCards = [], isLoading } = useGiftCards(true);
  const toggleGiftCard = useToggleGiftCard();
  const createGiftCard = useCreateGiftCard();
  const deleteGiftCard = useDeleteGiftCard();
  const updateGiftCard = useUpdateGiftCard();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<GiftCard | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  
  const [newCard, setNewCard] = useState({
    name: "",
    description: "",
    rate: 47,
    logo_url: "",
  });

  const handleLogoUpload = async (file: File, cardId?: string): Promise<string | null> => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${cardId || Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('gift-card-logos')
        .upload(fileName, file);
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('gift-card-logos')
        .getPublicUrl(fileName);
      
      return publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      toast({ title: "Upload failed", description: "Failed to upload logo.", variant: "destructive" });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await handleLogoUpload(file);
      if (url) {
        setNewCard({ ...newCard, logo_url: url });
      }
    }
  };

  const handleEditFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingCard) {
      const url = await handleLogoUpload(file, editingCard.id);
      if (url) {
        setEditingCard({ ...editingCard, logo_url: url });
      }
    }
  };

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
        logo_url: newCard.logo_url || undefined,
        rate: newCard.rate,
        is_active: true,
      });
      toast({ title: "Card created", description: `${newCard.name} has been added.` });
      setNewCard({ name: "", description: "", rate: 47, logo_url: "" });
      setDialogOpen(false);
    } catch {
      toast({ title: "Error", description: "Failed to create card.", variant: "destructive" });
    }
  };

  const handleEdit = (card: GiftCard) => {
    setEditingCard(card);
    setEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingCard) return;
    
    try {
      await updateGiftCard.mutateAsync({
        id: editingCard.id,
        name: editingCard.name,
        description: editingCard.description || undefined,
        logo_url: editingCard.logo_url || undefined,
        rate: editingCard.rate,
      });
      toast({ title: "Card updated", description: `${editingCard.name} has been updated.` });
      setEditDialogOpen(false);
      setEditingCard(null);
    } catch {
      toast({ title: "Error", description: "Failed to update card.", variant: "destructive" });
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
                <Label htmlFor="rate">Rate (%)</Label>
                <Input
                  id="rate"
                  type="number"
                  min="1"
                  max="100"
                  placeholder="47"
                  value={newCard.rate}
                  onChange={(e) => setNewCard({ ...newCard, rate: Number(e.target.value) })}
                />
                <p className="text-xs text-muted-foreground">
                  Percentage of card value for sellers / buyers
                </p>
              </div>
              <div className="space-y-2">
                <Label>Logo</Label>
                <div className="flex items-center gap-4">
                  {newCard.logo_url && (
                    <img src={newCard.logo_url} alt="Logo preview" className="h-12 w-12 rounded-lg object-contain border" />
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                    Upload Logo
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={createGiftCard.isPending || uploading}>
                {createGiftCard.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Gift Card</DialogTitle>
            <DialogDescription>
              Update the gift card details.
            </DialogDescription>
          </DialogHeader>
          {editingCard && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name *</Label>
                <Input
                  id="edit-name"
                  value={editingCard.name}
                  onChange={(e) => setEditingCard({ ...editingCard, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  value={editingCard.description || ""}
                  onChange={(e) => setEditingCard({ ...editingCard, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-rate">Rate (%)</Label>
                <Input
                  id="edit-rate"
                  type="number"
                  min="1"
                  max="100"
                  value={editingCard.rate}
                  onChange={(e) => setEditingCard({ ...editingCard, rate: Number(e.target.value) })}
                />
                <p className="text-xs text-muted-foreground">
                  Percentage of card value for sellers / buyers
                </p>
              </div>
              <div className="space-y-2">
                <Label>Logo</Label>
                <div className="flex items-center gap-4">
                  {editingCard.logo_url && (
                    <img src={editingCard.logo_url} alt="Logo preview" className="h-12 w-12 rounded-lg object-contain border" />
                  )}
                  <input
                    type="file"
                    ref={editFileInputRef}
                    onChange={handleEditFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => editFileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                    {editingCard.logo_url ? "Change Logo" : "Upload Logo"}
                  </Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={updateGiftCard.isPending || uploading}>
              {updateGiftCard.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Logo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {giftCards.map((card) => (
              <TableRow key={card.id}>
                <TableCell>
                  {card.logo_url ? (
                    <img
                      src={card.logo_url}
                      alt={card.name}
                      className="h-10 w-10 rounded-md object-contain"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                      <span className="text-lg font-bold text-muted-foreground">{card.name.charAt(0)}</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{card.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{card.rate}%</Badge>
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
                      onClick={() => handleEdit(card)}
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
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