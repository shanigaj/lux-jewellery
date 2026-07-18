"use client";

import { Layout, Image as ImageIcon, Type, Save, Edit, Trash2 } from "lucide-react";

export default function AdminCMSPage() {
  const homepageSections = [
    { id: 1, name: "Hero Banner (Video)", type: "Media", status: "Published", lastEdited: "2 days ago" },
    { id: 2, name: "Featured Collections", type: "Grid", status: "Published", lastEdited: "1 week ago" },
    { id: 3, name: "Brand Story", type: "Text & Image", status: "Published", lastEdited: "1 month ago" },
    { id: 4, name: "Summer Campaign Promotion", type: "Banner", status: "Draft", lastEdited: "2 hours ago" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-2xl">Content Management (CMS)</h1>
          <p className="text-sm text-muted-foreground">
            Manage your storefront layout, banners, and static pages.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Homepage Layout */}
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/10">
              <h2 className="font-heading text-lg flex items-center gap-2">
                <Layout size={18} className="text-gold" /> Homepage Sections
              </h2>
              <button className="text-xs uppercase tracking-wider font-medium text-gold hover:underline">
                Add Section
              </button>
            </div>
            
            <div className="divide-y divide-border">
              {homepageSections.map((section) => (
                <div key={section.id} className="p-4 flex items-center justify-between hover:bg-muted/10 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-muted flex items-center justify-center text-muted-foreground">
                      {section.type === "Media" ? <ImageIcon size={18} /> : 
                       section.type === "Text & Image" ? <Type size={18} /> : 
                       <Layout size={18} />}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{section.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold ${
                          section.status === 'Published' ? 'bg-green-500/10 text-green-600' : 'bg-orange-500/10 text-orange-600'
                        }`}>
                          {section.status}
                        </span>
                        <span className="text-xs text-muted-foreground">• Edited {section.lastEdited}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-background rounded border border-border transition-colors">
                      <Edit size={14} />
                    </button>
                    <button className="p-2 text-muted-foreground hover:text-destructive hover:bg-background rounded border border-border transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Global Settings */}
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/10">
              <h2 className="font-heading text-lg">Global Content</h2>
            </div>
            <div className="p-4 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-medium text-muted-foreground">Announcement Bar Text</label>
                <textarea 
                  className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:border-gold outline-none resize-none" 
                  rows={2}
                  defaultValue="Complimentary worldwide shipping on orders above ₹50,000"
                />
              </div>
              <button className="w-full flex items-center justify-center gap-2 bg-onyx dark:bg-gold text-white dark:text-onyx py-2 rounded-lg text-sm font-medium hover:bg-gold dark:hover:bg-white transition-colors">
                <Save size={16} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
