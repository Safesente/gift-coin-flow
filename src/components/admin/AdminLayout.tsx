import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  CreditCard, 
  Users, 
  ArrowLeft,
  Shield,
  Mail,
  Globe,
  MessageCircle,
  Inbox,
  Menu,
  X,
  FileText,
  BarChart3,
  MousePointer2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Overview" },
  { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/admin/heatmaps", icon: MousePointer2, label: "Heatmaps" },
  { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
  { href: "/admin/cards", icon: CreditCard, label: "Gift Cards" },
  { href: "/admin/categories", icon: Globe, label: "Categories" },
  { href: "/admin/country-rates", icon: Globe, label: "Country Rates" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/email-marketing", icon: Mail, label: "Email Marketing" },
  { href: "/admin/p2p-trades", icon: Users, label: "P2P Trades" },
  { href: "/admin/blog", icon: FileText, label: "Blog" },
  { href: "/admin/support", icon: MessageCircle, label: "Support Chat" },
  { href: "/admin/contacts", icon: Inbox, label: "Contact Forms" },
];

function NavContent({ onItemClick }: { onItemClick?: () => void }) {
  const location = useLocation();

  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.href}
            to={item.href}
            onClick={onItemClick}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 md:h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 md:gap-4">
            {/* Mobile menu button */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="flex items-center gap-2 p-4 border-b">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Admin Panel</span>
                </div>
                <div className="p-4">
                  <NavContent onItemClick={() => setMobileOpen(false)} />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
                  <Link
                    to="/"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to site
                  </Link>
                </div>
              </SheetContent>
            </Sheet>

            <Link to="/" className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back to site</span>
            </Link>
            <div className="hidden md:block h-6 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-semibold text-base md:text-lg">Admin Panel</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block sticky top-14 md:top-16 h-[calc(100vh-3.5rem)] md:h-[calc(100vh-4rem)] w-64 border-r bg-muted/30 p-4 overflow-y-auto">
          <NavContent />
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 min-w-0 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
