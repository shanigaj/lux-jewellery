"use client";

import { Save, Store, Mail, CreditCard, Shield, Globe } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-2xl">Store Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage global store configurations and integrations.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-onyx dark:bg-gold text-white dark:text-onyx px-6 py-2 rounded-lg text-sm font-medium hover:bg-gold dark:hover:bg-white transition-colors">
          <Save size={16} /> Save Settings
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Settings Navigation Sidebar (internal to settings) */}
        <div className="md:col-span-1 space-y-1">
          {[
            { name: "General", icon: Store, active: true },
            { name: "Email Notifications", icon: Mail, active: false },
            { name: "Payment Gateways", icon: CreditCard, active: false },
            { name: "Security & Privacy", icon: Shield, active: false },
            { name: "Taxes & Shipping", icon: Globe, active: false },
          ].map((item, idx) => (
            <button 
              key={idx}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                item.active ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
            >
              <item.icon size={16} />
              {item.name}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="md:col-span-3 space-y-6">
          <div className="bg-card border border-border rounded-xl shadow-sm p-6">
            <h2 className="font-heading text-lg mb-6 border-b border-border pb-4">General Settings</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider font-medium text-muted-foreground">Store Name</label>
                  <input 
                    type="text" 
                    defaultValue="Lux Diamonds"
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-gold outline-none transition-colors" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider font-medium text-muted-foreground">Support Email</label>
                  <input 
                    type="email" 
                    defaultValue="support@luxdiamonds.com"
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-gold outline-none transition-colors" 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-medium text-muted-foreground">Store Address</label>
                <textarea 
                  defaultValue="42 Diamond Heights, Bandra West, Mumbai, Maharashtra 400050"
                  rows={3}
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:border-gold outline-none transition-colors resize-none" 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-border">
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider font-medium text-muted-foreground">Currency</label>
                  <select className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-gold outline-none transition-colors">
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider font-medium text-muted-foreground">Timezone</label>
                  <select className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-gold outline-none transition-colors">
                    <option value="IST">Asia/Kolkata (IST)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
