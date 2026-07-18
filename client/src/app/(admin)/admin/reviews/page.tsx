"use client";

import { useState } from "react";
import { Search, Filter, Check, X as XIcon, MessageSquare, Star } from "lucide-react";

const mockReviews = [
  {
    id: "REV-001",
    productName: "Celestial Solitaire Ring",
    customerName: "Priya Sharma",
    rating: 5,
    comment: "Absolutely stunning ring! The diamond clarity is exceptional. Will definitely purchase again.",
    date: "2026-07-16",
    status: "pending"
  },
  {
    id: "REV-002",
    productName: "Eternal Grace Necklace",
    customerName: "Rahul Verma",
    rating: 4,
    comment: "Beautiful necklace, but the chain could have been a bit thicker.",
    date: "2026-07-14",
    status: "approved"
  },
  {
    id: "REV-003",
    productName: "Aurora Diamond Earrings",
    customerName: "Anjali Gupta",
    rating: 1,
    comment: "The clasp is too loose. I'm afraid I'll lose them.",
    date: "2026-07-10",
    status: "rejected"
  }
];

export default function AdminReviewsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredReviews = mockReviews.filter(r => {
    const matchesSearch = r.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-2xl">Product Reviews</h1>
          <p className="text-sm text-muted-foreground">
            Moderate customer reviews before they appear on the storefront.
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/10">
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search products or customers..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm outline-none focus:border-gold transition-colors"
            />
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto bg-background border border-border rounded-lg px-4 py-2 text-sm outline-none focus:border-gold"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending Moderation</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-muted/30">
              <tr>
                <th className="px-6 py-4 font-medium min-w-[200px]">Product / Customer</th>
                <th className="px-6 py-4 font-medium min-w-[300px]">Review Content</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredReviews.map((review) => (
                <tr key={review.id} className="hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-foreground">{review.productName}</p>
                    <p className="text-xs text-muted-foreground mt-1">by {review.customerName}</p>
                    <p className="text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString("en-IN")}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex text-gold mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i >= review.rating ? "text-muted" : ""} />
                      ))}
                    </div>
                    <p className="text-foreground line-clamp-2">"{review.comment}"</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold
                      ${review.status === 'approved' ? 'bg-green-500/10 text-green-600' : ''}
                      ${review.status === 'rejected' ? 'bg-red-500/10 text-red-500' : ''}
                      ${review.status === 'pending' ? 'bg-orange-500/10 text-orange-600' : ''}
                    `}>
                      {review.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {review.status !== 'approved' && (
                        <button className="p-1.5 text-green-600 hover:bg-green-500/10 rounded border border-transparent hover:border-green-500/30 transition-colors" title="Approve">
                          <Check size={16} />
                        </button>
                      )}
                      {review.status !== 'rejected' && (
                        <button className="p-1.5 text-red-500 hover:bg-red-500/10 rounded border border-transparent hover:border-red-500/30 transition-colors" title="Reject">
                          <XIcon size={16} />
                        </button>
                      )}
                      <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded border border-transparent transition-colors" title="View Details">
                        <MessageSquare size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground bg-muted/10">
          <p>Showing {filteredReviews.length} of {mockReviews.length} reviews</p>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-border rounded disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 bg-gold text-onyx font-medium rounded">1</button>
            <button className="px-3 py-1 border border-border rounded disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
