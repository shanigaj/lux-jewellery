"use client";

import { useState } from "react";
import { Plus, Search, Filter, Edit, Trash2 } from "lucide-react";

const mockBlogs = [
  {
    id: 1,
    title: "The Ultimate Guide to Diamond Clarity",
    author: "Priya Sharma",
    date: "2026-07-10",
    status: "Published",
    views: 1240
  },
  {
    id: 2,
    title: "Trending Engagement Ring Styles for 2027",
    author: "Rahul Verma",
    date: "2026-07-05",
    status: "Draft",
    views: 0
  },
  {
    id: 3,
    title: "How to Care for Your Luxury Timepieces",
    author: "Anjali Gupta",
    date: "2026-06-28",
    status: "Published",
    views: 3450
  }
];

export default function AdminBlogsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBlogs = mockBlogs.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-2xl">Journal & Blogs</h1>
          <p className="text-sm text-muted-foreground">
            Manage your articles, guides, and brand journal.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-onyx dark:bg-gold text-white dark:text-onyx px-4 py-2 rounded-lg text-sm font-medium hover:bg-gold dark:hover:bg-white transition-colors">
          <Plus size={16} /> Write Article
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/10">
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search articles..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm outline-none focus:border-gold transition-colors"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
            <Filter size={16} /> Filter
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-muted/30">
              <tr>
                <th className="px-6 py-4 font-medium min-w-[300px]">Title</th>
                <th className="px-6 py-4 font-medium">Author</th>
                <th className="px-6 py-4 font-medium">Publish Date</th>
                <th className="px-6 py-4 font-medium text-right">Views</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredBlogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-muted/10 transition-colors group">
                  <td className="px-6 py-4 font-medium text-foreground">{blog.title}</td>
                  <td className="px-6 py-4">{blog.author}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {new Date(blog.date).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-6 py-4 text-right font-medium">{blog.views.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold
                      ${blog.status === 'Published' ? 'bg-green-500/10 text-green-600' : 'bg-muted text-muted-foreground'}
                    `}>
                      {blog.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-muted-foreground hover:text-foreground bg-background rounded border border-border">
                        <Edit size={14} />
                      </button>
                      <button className="p-1.5 text-muted-foreground hover:text-destructive bg-background rounded border border-border">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
