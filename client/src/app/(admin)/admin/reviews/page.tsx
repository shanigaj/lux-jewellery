"use client";

import { useMemo, useState } from "react";
import { Search, Check, X as XIcon, MessageSquare, Star } from "lucide-react";
import { toast } from "sonner";
import {
  useGetAllReviewsQuery,
  useUpdateReviewStatusMutation,
} from "@/store/api/reviewApi";
import { Modal } from "@/components/admin/Modal";

interface ReviewRow {
  id: string;
  productName: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  status: string;
}

export default function AdminReviewsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewing, setViewing] = useState<ReviewRow | null>(null);

  const { data, isLoading } = useGetAllReviewsQuery();
  const [updateStatus] = useUpdateReviewStatusMutation();

  const reviews = useMemo(
    () =>
      (data?.data ?? []).map((r) => ({
        id: r._id,
        productName: r.product?.name ?? "—",
        customerName: r.user?.firstName ?? r.user?.email ?? "Anonymous",
        rating: r.rating,
        comment: r.comment,
        date: r.createdAt,
        status: r.isApproved === true ? "approved" : r.isApproved === false ? "rejected" : "pending",
      })),
    [data]
  );

  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const moderate = async (id: string, approve: boolean) => {
    try {
      await updateStatus({ id, isApproved: approve }).unwrap();
      toast.success(approve ? "Review approved" : "Review rejected");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update review");
    }
  };

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
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground">
                    Loading reviews…
                  </td>
                </tr>
              ) : filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground">
                    No reviews yet.
                  </td>
                </tr>
              ) : (
                filteredReviews.map((review) => (
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
                      <p className="text-foreground line-clamp-2">&ldquo;{review.comment}&rdquo;</p>
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
                          <button onClick={() => moderate(review.id, true)} className="p-1.5 text-green-600 hover:bg-green-500/10 rounded border border-transparent hover:border-green-500/30 transition-colors" title="Approve">
                            <Check size={16} />
                          </button>
                        )}
                        {review.status !== 'rejected' && (
                          <button onClick={() => moderate(review.id, false)} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded border border-transparent hover:border-red-500/30 transition-colors" title="Reject">
                            <XIcon size={16} />
                          </button>
                        )}
                        <button onClick={() => setViewing(review)} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded border border-transparent transition-colors" title="View Details">
                          <MessageSquare size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        <div className="p-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground bg-muted/10">
          <p>Showing {filteredReviews.length} of {reviews.length} reviews</p>
        </div>
      </div>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Review details">
        {viewing && (
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-medium text-base">{viewing.productName}</p>
              <p className="text-muted-foreground">by {viewing.customerName} · {new Date(viewing.date).toLocaleDateString("en-IN")}</p>
            </div>
            <div className="flex text-gold">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} fill={i < viewing.rating ? "currentColor" : "none"} className={i >= viewing.rating ? "text-muted" : ""} />
              ))}
            </div>
            <p className="text-foreground leading-relaxed whitespace-pre-line">&ldquo;{viewing.comment}&rdquo;</p>
            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <button onClick={() => { moderate(viewing.id, false); setViewing(null); }} className="flex items-center gap-1.5 px-4 py-2 border border-border rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"><XIcon size={14} /> Reject</button>
              <button onClick={() => { moderate(viewing.id, true); setViewing(null); }} className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"><Check size={14} /> Approve</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
