"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Calculator,
  Package,
  ShoppingCart,
  Users,
  Tags,
  MessageSquare,
  FileText,
  Image as ImageIcon,
  BarChart,
  Shield,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  ChevronRight,
  ClipboardList
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/Logo";

const adminSidebarLinks = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  
  { section: "E-Commerce" },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Inventory", href: "/admin/inventory", icon: ClipboardList },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Coupons", href: "/admin/coupons", icon: Tags },
  { name: "Reviews", href: "/admin/reviews", icon: MessageSquare },
  { name: "Pricing Calculator", href: "/admin/pricing", icon: Calculator },

  { section: "Content" },
  { name: "CMS & Pages", href: "/admin/cms", icon: ImageIcon },
  { name: "Blogs", href: "/admin/blogs", icon: FileText },

  { section: "System" },
  { name: "Reports", href: "/admin/reports", icon: BarChart },
  { name: "Roles & Users", href: "/admin/roles", icon: Shield },
  { name: "Audit Logs", href: "/admin/audit-logs", icon: FileText },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Responsive sidebar handling
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    handleResize(); // Init
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar on mobile when navigating
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (window.innerWidth < 1024) setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row overflow-hidden font-sans">
      
      {/* 1. Sidebar */}
      <AnimatePresence mode="wait">
        {(isSidebarOpen || typeof window === "undefined" || window.innerWidth >= 1024) && (
          <>
            {/* Mobile Backdrop */}
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
              />
            )}

            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed lg:static top-0 left-0 h-screen w-[280px] bg-card border-r border-border z-50 flex flex-col shadow-xl lg:shadow-none"
            >
              <div className="h-16 flex items-center justify-between px-6 border-b border-border">
                <Logo size="sm" />
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-2 -mr-2 text-muted-foreground hover:text-foreground"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-6 custom-scrollbar">
                <div className="px-4 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border/50">
                    <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-heading font-medium">
                      AS
                    </div>
                    <div>
                      <p className="text-sm font-medium">Admin User</p>
                      <p className="text-xs text-muted-foreground">Super Admin</p>
                    </div>
                  </div>
                </div>

                <nav className="px-3 space-y-1">
                  {adminSidebarLinks.map((link, idx) => {
                    if (link.section) {
                      return (
                        <div key={`sec-${idx}`} className="pt-6 pb-2 px-3">
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
                            {link.section}
                          </p>
                        </div>
                      );
                    }

                    const isActive = link.exact
                      ? pathname === link.href
                      : pathname.startsWith(link.href as string);

                    return (
                      <Link
                        key={link.name}
                        href={link.href as string}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
                          isActive
                            ? "bg-gold text-onyx shadow-sm"
                            : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                        )}
                      >
                        {link.icon && (
                          <link.icon 
                            size={18} 
                            className={isActive ? "text-onyx" : "text-muted-foreground group-hover:text-foreground transition-colors"} 
                          />
                        )}
                        {link.name}
                        {isActive && (
                          <ChevronRight size={16} className="ml-auto text-onyx/70" />
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="p-4 border-t border-border">
                <Link
                  href="/"
                  className="flex items-center justify-center gap-2 w-full py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg mb-2"
                >
                  Storefront
                </Link>
                <button className="flex items-center justify-center gap-2 w-full py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors rounded-lg font-medium">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-4 lg:px-8 border-b border-border bg-card/80 backdrop-blur-md z-30 shrink-0">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button 
                onClick={() => setSidebarOpen(true)}
                className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
              >
                <Menu size={20} />
              </button>
            )}
            
            {/* Search Bar */}
            <div className="hidden md:flex items-center relative group">
              <Search size={16} className="absolute left-3 text-muted-foreground group-focus-within:text-gold transition-colors" />
              <input 
                type="text" 
                placeholder="Search orders, customers, or products..." 
                className="w-80 pl-10 pr-4 py-2 bg-muted/50 border border-transparent focus:border-gold rounded-lg text-sm outline-none transition-all focus:bg-background"
              />
              <div className="absolute right-3 flex gap-1">
                <kbd className="px-1.5 py-0.5 text-[10px] bg-background border border-border rounded shadow-sm text-muted-foreground font-sans">
                  Ctrl
                </kbd>
                <kbd className="px-1.5 py-0.5 text-[10px] bg-background border border-border rounded shadow-sm text-muted-foreground font-sans">
                  K
                </kbd>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border-2 border-card" />
            </button>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto bg-muted/20 p-4 lg:p-8">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
