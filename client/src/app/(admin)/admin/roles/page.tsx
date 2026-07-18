"use client";

import { Shield, Plus, Edit, Trash2 } from "lucide-react";

export default function AdminRolesPage() {
  const roles = [
    { id: 1, name: "Super Admin", users: 2, description: "Full access to all modules and settings." },
    { id: 2, name: "Store Manager", users: 5, description: "Access to products, orders, inventory, and customers." },
    { id: 3, name: "Content Editor", users: 3, description: "Access to CMS, blogs, and marketing assets." },
    { id: 4, name: "Customer Support", users: 12, description: "Access to orders, customers, and reviews (read-only settings)." },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-2xl">Roles & Permissions</h1>
          <p className="text-sm text-muted-foreground">
            Manage admin users and configure role-based access control (RBAC).
          </p>
        </div>
        <button className="flex items-center gap-2 bg-onyx dark:bg-gold text-white dark:text-onyx px-4 py-2 rounded-lg text-sm font-medium hover:bg-gold dark:hover:bg-white transition-colors">
          <Plus size={16} /> Add Role
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.map((role) => (
          <div key={role.id} className="bg-card border border-border rounded-xl p-6 shadow-sm hover:border-gold/50 transition-colors group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center">
                  <Shield size={18} />
                </div>
                <h3 className="font-heading text-lg">{role.name}</h3>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 text-muted-foreground hover:text-foreground bg-background rounded border border-border">
                  <Edit size={14} />
                </button>
                <button className="p-1.5 text-muted-foreground hover:text-destructive bg-background rounded border border-border">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-6">
              {role.description}
            </p>
            
            <div className="flex items-center justify-between pt-4 border-t border-border text-sm">
              <span className="text-muted-foreground font-medium">{role.users} Active Users</span>
              <button className="text-gold hover:underline font-medium">Manage Users</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
