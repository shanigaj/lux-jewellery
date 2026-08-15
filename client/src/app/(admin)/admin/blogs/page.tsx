"use client";

import { useMemo, useState, useRef } from "react";
import Image from "next/image";
import { Plus, Search, Trash2, X, Eye, Pencil, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  useGetBlogsQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  type IBlog,
} from "@/store/api/blogApi";
import { useUploadImageMutation } from "@/store/api/mediaApi";

const emptyForm = {
  title: "",
  excerpt: "",
  content: "",
  coverImage: "",
  author: "Sparenza & Co.",
  status: "draft" as "draft" | "published",
};

export default function AdminBlogsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const fileRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useGetBlogsQuery();
  const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation();
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();
  const [deleteBlog] = useDeleteBlogMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();

  const saving = isCreating || isUpdating;

  const blogs = useMemo(
    () => (data?.data ?? []).filter((b) => b.title.toLowerCase().includes(searchTerm.toLowerCase())),
    [data, searchTerm]
  );

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (b: IBlog) => {
    setEditingId(b._id);
    setForm({
      title: b.title,
      excerpt: b.excerpt ?? "",
      content: b.content,
      coverImage: b.coverImage ?? "",
      author: b.author,
      status: b.status,
    });
    setShowForm(true);
  };

  const handleUpload = async (file: File) => {
    const fd = new FormData();
    fd.append("image", file);
    try {
      const res = await uploadImage(fd).unwrap();
      setForm((f) => ({ ...f, coverImage: res.data.url }));
      toast.success("Cover uploaded");
    } catch {
      toast.error("Upload failed");
    }
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Title and content are required");
      return;
    }
    try {
      if (editingId) {
        await updateBlog({ id: editingId, body: form }).unwrap();
        toast.success("Article updated");
      } else {
        await createBlog(form).unwrap();
        toast.success("Article created");
      }
      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
    } catch (e) {
      toast.error((e as { data?: { message?: string } })?.data?.message || "Save failed");
    }
  };

  const togglePublish = async (id: string, current: string) => {
    try {
      await updateBlog({ id, body: { status: current === "published" ? "draft" : "published" } }).unwrap();
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    try {
      await deleteBlog(id).unwrap();
      toast.success(`Deleted "${title}"`);
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-2xl">Journal & Blogs</h1>
          <p className="text-sm text-muted-foreground">Manage your articles, guides, and brand journal.</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-onyx dark:bg-gold text-white dark:text-onyx px-4 py-2 rounded-lg text-sm font-medium hover:bg-gold dark:hover:bg-white transition-colors">
          <Plus size={16} /> Write Article
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/10">
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="text" placeholder="Search articles..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm outline-none focus:border-gold transition-colors" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-muted/30">
              <tr>
                <th className="px-6 py-4 font-medium min-w-[300px]">Article</th>
                <th className="px-6 py-4 font-medium">Author</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Views</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">Loading articles…</td></tr>
              ) : blogs.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">No articles yet — write your first one.</td></tr>
              ) : (
                blogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-muted/10 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-10 shrink-0 rounded overflow-hidden bg-muted">
                          {blog.coverImage && (
                            <Image src={blog.coverImage} alt="" fill sizes="56px" className="object-cover" />
                          )}
                        </div>
                        <span className="font-medium text-foreground">{blog.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{blog.author}</td>
                    <td className="px-6 py-4 text-muted-foreground">{blog.createdAt ? new Date(blog.createdAt).toLocaleDateString("en-IN") : "—"}</td>
                    <td className="px-6 py-4 text-right font-medium">{blog.views.toLocaleString()}</td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => togglePublish(blog._id, blog.status)} className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold cursor-pointer
                        ${blog.status === "published" ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground"}`} title="Toggle publish">
                        {blog.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(blog)} className="p-1.5 text-muted-foreground hover:text-gold bg-background rounded border border-border" title="Edit">
                          <Pencil size={14} />
                        </button>
                        <a href={`/journal/${blog.slug}`} target="_blank" rel="noreferrer" className="p-1.5 text-muted-foreground hover:text-foreground bg-background rounded border border-border" title="View">
                          <Eye size={14} />
                        </a>
                        <button onClick={() => handleDelete(blog._id, blog.title)} className="p-1.5 text-muted-foreground hover:text-destructive bg-background rounded border border-border" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-card border border-border rounded-xl shadow-luxury-lg w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-xl">{editingId ? "Edit Article" : "Write Article"}</h2>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-muted rounded" aria-label="Close"><X size={18} /></button>
            </div>

            {/* Cover image */}
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground">Cover image</label>
              <div className="mt-1 flex items-center gap-3">
                <div className="relative w-28 h-20 shrink-0 rounded-lg overflow-hidden bg-muted border border-border">
                  {form.coverImage ? (
                    <Image src={form.coverImage} alt="cover" fill sizes="112px" className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground">No cover</div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} />
                  <button onClick={() => fileRef.current?.click()} disabled={isUploading} className="inline-flex items-center gap-2 px-3 py-1.5 border border-border rounded-lg text-xs font-medium hover:bg-muted transition-colors disabled:opacity-50">
                    {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    {isUploading ? "Uploading…" : "Upload"}
                  </button>
                  {form.coverImage && (
                    <button onClick={() => setForm({ ...form, coverImage: "" })} className="text-xs text-muted-foreground hover:text-destructive text-left">Remove</button>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground">Title</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="The Ultimate Guide to Diamond Clarity" className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm outline-none focus:border-gold" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground">Excerpt</label>
              <input value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Short summary shown in listings" className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm outline-none focus:border-gold" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground">Content</label>
              <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={6} placeholder="Write your article…" className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm outline-none focus:border-gold resize-y" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground">Author</label>
                <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm outline-none focus:border-gold" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "draft" | "published" })} className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm outline-none focus:border-gold">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2 bg-onyx dark:bg-gold text-white dark:text-onyx rounded-lg text-sm font-medium hover:bg-gold dark:hover:bg-white transition-colors disabled:opacity-50">
                {saving ? "Saving…" : editingId ? "Save changes" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
