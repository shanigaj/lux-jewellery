"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "@/store/api/productApi";
import { ProductImageUploader } from "@/components/admin/ProductImageUploader";

const isRemote = (url: unknown): url is string =>
  typeof url === "string" && /^https?:\/\//i.test(url);

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading: isLoadingProduct } = useGetProductByIdQuery(id);
  const [updateProduct, { isLoading: isSaving }] = useUpdateProductMutation();

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    price: "",
    discountPrice: "",
    stock: "10",
    category: "rings",
    metalType: "gold",
    metalPurity: "",
    gemstone: "",
    weight: "",
    caratWeight: "",
    dimensions: "",
  });

  // Final Cloudinary image URLs (existing + newly uploaded/AI-polished).
  const [images, setImages] = useState<string[]>([]);

  // Hydrate the form once the product loads.
  useEffect(() => {
    const p = data?.data;
    if (!p) return;
    setFormData({
      name: p.name ?? "",
      sku: p.sku ?? "",
      description: p.description ?? "",
      price: p.basePrice != null ? String(p.basePrice) : "",
      discountPrice: p.salePrice != null ? String(p.salePrice) : "",
      stock: p.stockQuantity != null ? String(p.stockQuantity) : "0",
      category:
        (typeof p.category === "string" ? p.category : p.category?.slug) || "rings",
      metalType: p.metalType || "gold",
      metalPurity: (p as { metalPurity?: string }).metalPurity ?? "",
      gemstone: (p as { gemstone?: string }).gemstone ?? "",
      weight: (p as { weight?: number }).weight != null ? String((p as { weight?: number }).weight) : "",
      caratWeight:
        (p as { caratWeight?: number }).caratWeight != null
          ? String((p as { caratWeight?: number }).caratWeight)
          : "",
      dimensions: (p as { dimensions?: string }).dimensions ?? "",
    });
    setImages(
      (Array.isArray(p.images) ? p.images.map((img) => img.url) : []).filter(isRemote)
    );
  }, [data]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error("Please keep or add at least one image");
      return;
    }

    try {
      const payload = {
        name: formData.name,
        sku: formData.sku,
        description: formData.description,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
        stock: Number(formData.stock),
        category: formData.category,
        metalType: formData.metalType,
        metalPurity: formData.metalPurity || undefined,
        gemstone: formData.gemstone,
        weight: formData.weight ? Number(formData.weight) : undefined,
        caratWeight: formData.caratWeight ? Number(formData.caratWeight) : undefined,
        dimensions: formData.dimensions || undefined,
        images,
      };

      await updateProduct({ id, body: payload }).unwrap();
      toast.success("Product updated successfully!");
      router.push("/admin/products");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to update product");
    }
  };

  if (isLoadingProduct) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="animate-spin text-gold" size={28} />
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="py-24 text-center">
        <p className="text-muted-foreground">Product not found.</p>
        <Link href="/admin/products" className="text-gold text-sm mt-2 inline-block">
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/products"
          className="p-2 border border-border rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="font-heading text-2xl">Edit Product</h1>
          <p className="text-sm text-muted-foreground">
            Update details and manage photography for this piece.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm">
              <h2 className="font-heading text-lg border-b border-border pb-2 mb-4">Basic Information</h2>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-medium text-muted-foreground">Product Name *</label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gold transition-colors" placeholder="e.g. Diamond Eternity Ring" />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-medium text-muted-foreground">Description *</label>
                <textarea required name="description" value={formData.description} onChange={handleInputChange} rows={4} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gold transition-colors" placeholder="Product description..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider font-medium text-muted-foreground">SKU *</label>
                  <input required type="text" name="sku" value={formData.sku} onChange={handleInputChange} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gold transition-colors" placeholder="e.g. LUX-RNG-001" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider font-medium text-muted-foreground">Stock *</label>
                  <input required type="number" min="0" name="stock" value={formData.stock} onChange={handleInputChange} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gold transition-colors" />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm">
              <h2 className="font-heading text-lg border-b border-border pb-2 mb-4">Media (Cloudinary)</h2>
              <ProductImageUploader value={images} onChange={setImages} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm">
              <h2 className="font-heading text-lg border-b border-border pb-2 mb-4">Pricing</h2>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-medium text-muted-foreground">Price (₹) *</label>
                <input required type="number" min="0" name="price" value={formData.price} onChange={handleInputChange} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gold transition-colors" />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-medium text-muted-foreground">Discount Price (₹)</label>
                <input type="number" min="0" name="discountPrice" value={formData.discountPrice} onChange={handleInputChange} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gold transition-colors" placeholder="Optional" />
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm">
              <h2 className="font-heading text-lg border-b border-border pb-2 mb-4">Organization</h2>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-medium text-muted-foreground">Category *</label>
                <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gold transition-colors">
                  <option value="rings">Rings</option>
                  <option value="necklaces">Necklaces</option>
                  <option value="earrings">Earrings</option>
                  <option value="bracelets">Bracelets</option>
                  <option value="watches">Watches</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-medium text-muted-foreground">Metal Type *</label>
                <select name="metalType" value={formData.metalType} onChange={handleInputChange} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gold transition-colors">
                  <option value="gold">Yellow Gold</option>
                  <option value="white_gold">White Gold</option>
                  <option value="rose_gold">Rose Gold</option>
                  <option value="platinum">Platinum</option>
                  <option value="silver">Silver</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-medium text-muted-foreground">Gemstone</label>
                <input type="text" name="gemstone" value={formData.gemstone} onChange={handleInputChange} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gold transition-colors" placeholder="e.g. Diamond, Emerald" />
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm">
              <h2 className="font-heading text-lg border-b border-border pb-2 mb-4">Specifications</h2>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-medium text-muted-foreground">Metal Purity</label>
                <input type="text" name="metalPurity" value={formData.metalPurity} onChange={handleInputChange} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gold transition-colors" placeholder="e.g. 18K, 22K, PT950, 925" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider font-medium text-muted-foreground">Weight (g)</label>
                  <input type="number" min="0" step="0.01" name="weight" value={formData.weight} onChange={handleInputChange} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gold transition-colors" placeholder="e.g. 4.2" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider font-medium text-muted-foreground">Carat (ct)</label>
                  <input type="number" min="0" step="0.01" name="caratWeight" value={formData.caratWeight} onChange={handleInputChange} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gold transition-colors" placeholder="e.g. 1.5" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-medium text-muted-foreground">Dimensions</label>
                <input type="text" name="dimensions" value={formData.dimensions} onChange={handleInputChange} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gold transition-colors" placeholder="e.g. Ring size 14 · 2.3 mm band" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-border">
          <Link href="/admin/products" className="px-6 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 bg-onyx dark:bg-gold text-white dark:text-onyx px-6 py-2 rounded-lg text-sm font-medium hover:bg-gold dark:hover:bg-white transition-colors disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : null}
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
