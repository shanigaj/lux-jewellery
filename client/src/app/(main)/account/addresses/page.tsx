"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, MapPin, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([
    {
      id: "1",
      type: "Home",
      isDefault: true,
      name: "Priya Sharma",
      address: "42 Diamond Heights, Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      postalCode: "400050",
      phone: "+91 9876543210",
    },
    {
      id: "2",
      type: "Work",
      isDefault: false,
      name: "Priya Sharma",
      address: "Tech Park, Tower B, 5th Floor, Andheri East",
      city: "Mumbai",
      state: "Maharashtra",
      postalCode: "400093",
      phone: "+91 9876543210",
    },
  ]);

  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl mb-2">Saved Addresses</h1>
          <p className="text-muted-foreground text-sm">
            Manage your shipping and billing addresses for a faster checkout.
          </p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-onyx dark:bg-gold text-white dark:text-onyx text-xs uppercase tracking-widest font-medium hover:bg-gold dark:hover:bg-white hover:text-onyx transition-colors rounded-lg w-fit"
        >
          <Plus size={16} /> Add New Address
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {addresses.map((addr) => (
            <motion.div
              key={addr.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="border border-border rounded-xl p-6 relative group hover:border-gold/50 transition-colors"
            >
              {addr.isDefault && (
                <div className="absolute top-0 right-0 bg-gold text-onyx text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl flex items-center gap-1">
                  <Check size={12} /> Default
                </div>
              )}
              
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={18} className="text-gold" />
                <h3 className="font-medium">{addr.type}</h3>
              </div>
              
              <div className="space-y-1 text-sm text-muted-foreground mb-6">
                <p className="text-foreground font-medium">{addr.name}</p>
                <p>{addr.address}</p>
                <p>{addr.city}, {addr.state} {addr.postalCode}</p>
                <p className="pt-2">{addr.phone}</p>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-border">
                <button className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                  <Edit2 size={14} /> Edit
                </button>
                <button className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl p-6 max-w-lg w-full shadow-luxury-lg">
            <h2 className="font-heading text-xl mb-6">Add New Address</h2>
            {/* Form placeholder */}
            <p className="text-sm text-muted-foreground mb-6">
              Address form fields go here...
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsAdding(false)}
                className="px-6 py-2 border border-border rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsAdding(false)}
                className="px-6 py-2 bg-onyx dark:bg-gold text-white dark:text-onyx rounded-lg text-sm"
              >
                Save Address
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
