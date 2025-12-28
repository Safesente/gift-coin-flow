import { AdminLayout } from "@/components/admin/AdminLayout";
import { CountryRatesManager } from "@/components/admin/CountryRatesManager";

export default function AdminCountryRates() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Country Rates</h1>
          <p className="text-muted-foreground mt-2">
            Manage buy and sell rates for each gift card by country. Set different rates and currencies for each region.
          </p>
        </div>
        <CountryRatesManager />
      </div>
    </AdminLayout>
  );
}
