import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { useGiftCards } from "@/hooks/useAdmin";
import {
  useCountryRates,
  useCreateCountryRate,
  useUpdateCountryRate,
  useDeleteCountryRate,
  GiftCardCountryRate,
} from "@/hooks/useCountryRates";
import { countries, getCountryByCode } from "@/data/countries";

export function CountryRatesManager() {
  const [selectedCardId, setSelectedCardId] = useState<string>("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<GiftCardCountryRate | null>(null);
  
  const [newCountryCode, setNewCountryCode] = useState("");
  const [newBuyRate, setNewBuyRate] = useState("85");
  const [newSellRate, setNewSellRate] = useState("47");
  
  const [editBuyRate, setEditBuyRate] = useState("");
  const [editSellRate, setEditSellRate] = useState("");

  const { data: giftCards, isLoading: cardsLoading } = useGiftCards(true);
  const { data: countryRates, isLoading: ratesLoading } = useCountryRates(selectedCardId || undefined);
  const createRate = useCreateCountryRate();
  const updateRate = useUpdateCountryRate();
  const deleteRate = useDeleteCountryRate();

  const selectedCard = giftCards?.find(c => c.id === selectedCardId);
  const filteredRates = selectedCardId 
    ? countryRates?.filter(r => r.gift_card_id === selectedCardId) 
    : countryRates;

  // Get countries that don't have rates yet for this card
  const availableCountries = countries.filter(
    c => !filteredRates?.some(r => r.country_code === c.code)
  );

  const handleAdd = async () => {
    if (!selectedCardId || !newCountryCode) {
      toast.error("Please select a gift card and country");
      return;
    }

    const country = getCountryByCode(newCountryCode);
    if (!country) return;

    try {
      await createRate.mutateAsync({
        gift_card_id: selectedCardId,
        country_code: country.code,
        country_name: country.name,
        currency_code: country.currency_code,
        currency_symbol: country.currency_symbol,
        buy_rate: parseFloat(newBuyRate) || 85,
        sell_rate: parseFloat(newSellRate) || 47,
      });
      toast.success("Country rate added successfully");
      setIsAddDialogOpen(false);
      setNewCountryCode("");
      setNewBuyRate("85");
      setNewSellRate("47");
    } catch (error) {
      toast.error("Failed to add country rate");
    }
  };

  const handleEdit = (rate: GiftCardCountryRate) => {
    setEditingRate(rate);
    setEditBuyRate(rate.buy_rate.toString());
    setEditSellRate(rate.sell_rate.toString());
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingRate) return;

    try {
      await updateRate.mutateAsync({
        id: editingRate.id,
        buy_rate: parseFloat(editBuyRate) || editingRate.buy_rate,
        sell_rate: parseFloat(editSellRate) || editingRate.sell_rate,
      });
      toast.success("Rate updated successfully");
      setIsEditDialogOpen(false);
      setEditingRate(null);
    } catch (error) {
      toast.error("Failed to update rate");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this country rate?")) return;

    try {
      await deleteRate.mutateAsync(id);
      toast.success("Country rate deleted");
    } catch (error) {
      toast.error("Failed to delete country rate");
    }
  };

  if (cardsLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="w-full sm:w-72">
          <Label className="mb-2 block">Select Gift Card</Label>
          <Select value={selectedCardId} onValueChange={setSelectedCardId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a gift card..." />
            </SelectTrigger>
            <SelectContent>
              {giftCards?.map((card) => (
                <SelectItem key={card.id} value={card.id}>
                  {card.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedCardId && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={availableCountries.length === 0}>
                <Plus className="h-4 w-4 mr-2" />
                Add Country Rate
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Country Rate for {selectedCard?.name}</DialogTitle>
                <DialogDescription>
                  Set custom buy and sell rates for a specific country.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label>Country</Label>
                  <Select value={newCountryCode} onValueChange={setNewCountryCode}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select country..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCountries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name} ({country.currency_symbol} {country.currency_code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Buy Rate (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={newBuyRate}
                      onChange={(e) => setNewBuyRate(e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>Sell Rate (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={newSellRate}
                      onChange={(e) => setNewSellRate(e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                </div>
                <Button onClick={handleAdd} disabled={createRate.isPending} className="w-full">
                  {createRate.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Add Rate
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {!selectedCardId ? (
        <div className="text-center py-12 text-muted-foreground">
          Select a gift card above to manage its country-specific rates.
        </div>
      ) : ratesLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredRates && filteredRates.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Country</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead className="text-right">Buy Rate</TableHead>
                <TableHead className="text-right">Sell Rate</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRates.map((rate) => (
                <TableRow key={rate.id}>
                  <TableCell className="font-medium">{rate.country_name}</TableCell>
                  <TableCell>
                    {rate.currency_symbol} {rate.currency_code}
                  </TableCell>
                  <TableCell className="text-right">{rate.buy_rate}%</TableCell>
                  <TableCell className="text-right">{rate.sell_rate}%</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(rate)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(rate.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          No country rates set for {selectedCard?.name}. Add one to get started.
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Rate for {editingRate?.country_name}</DialogTitle>
            <DialogDescription>
              Update the buy and sell rates for this country.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Buy Rate (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={editBuyRate}
                  onChange={(e) => setEditBuyRate(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Sell Rate (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={editSellRate}
                  onChange={(e) => setEditSellRate(e.target.value)}
                  className="mt-1.5"
                />
              </div>
            </div>
            <Button onClick={handleUpdate} disabled={updateRate.isPending} className="w-full">
              {updateRate.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Update Rate
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
