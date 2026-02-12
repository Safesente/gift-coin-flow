import { AdminLayout } from "@/components/admin/AdminLayout";
import { CategoriesManager } from "@/components/admin/CategoriesManager";

export default function AdminCategories() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Category Management</h1>
          <p className="text-muted-foreground">
            Manage gift card categories displayed on the homepage.
          </p>
        </div>
        <CategoriesManager />
      </div>
    </AdminLayout>
  );
}
