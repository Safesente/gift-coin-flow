import { AdminLayout } from "@/components/admin/AdminLayout";
import { GiftCardsManager } from "@/components/admin/GiftCardsManager";

export default function AdminCards() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Gift Card Management</h1>
          <p className="text-muted-foreground">
            Manage gift card types available for buying and selling.
          </p>
        </div>

        <GiftCardsManager />
      </div>
    </AdminLayout>
  );
}
