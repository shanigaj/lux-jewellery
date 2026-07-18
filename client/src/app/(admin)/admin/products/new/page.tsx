"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, UploadCloud, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useCreateProductMutation } from "@/store/api/productApi";
import { useUploadMultipleImagesMutation } from "@/store/api/mediaApi";

export default function NewProductPage() {
  const router = useRouter();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [uploadImages, { isLoading: isUploading }] = useUploadMultipleImagesMutation();

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    price: "",
    discountPrice: "",
    stock: "10",
    category: "rings",
    metalType: "gold",
    gemstone: "",
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);
      
      const newPreviewUrls = filesArray.map(file => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    try {
      // 1. Upload Images to Cloudinary
      const imageFormData = new FormData();
      selectedFiles.forEach(file => {
        imageFormData.append("images", file);
      });

      const uploadResult = await uploadImages(imageFormData).unwrap();
      const imageUrls = uploadResult.data.map(img => img.url);

      // 2. Create Product
      const productPayload = {
        name: formData.name,
        sku: formData.sku,
        description: formData.description,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
        stock: Number(formData.stock),
        category: formData.category as any,
        metalType: formData.metalType as any,
        gemstone: formData.gemstone,
        images: imageUrls, // Store Cloudinary URLs
      };

      await createProduct(productPayload).unwrap();
      toast.success("Product created successfully!");
      router.push("/admin/products");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to create product");
    }
  };

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
          <h1 className="font-heading text-2xl">Add New Product</h1>
          <p className="text-sm text-muted-foreground">Create a new piece of jewellery for your store.</p>
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
              
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-muted/5 hover:bg-muted/10 transition-colors relative">
                <input 
                  type="file" 
                  multiple 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <UploadCloud className="mx-auto text-muted-foreground mb-4" size={32} />
                <p className="text-sm font-medium mb-1">Click or drag images to upload</p>
                <p className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 5MB</p>
              </div>

              {previewUrls.length > 0 && (
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative aspect-square border border-border rounded-lg overflow-hidden group">
                      <Image src={url} alt="Preview" fill className="object-cover" />
                      <button 
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-border">
          <Link href="/admin/products" className="px-6 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
            Cancel
          </Link>
          <button 
            type="submit" 
            disabled={isCreating || isUploading}
            className="flex items-center gap-2 bg-onyx dark:bg-gold text-white dark:text-onyx px-6 py-2 rounded-lg text-sm font-medium hover:bg-gold dark:hover:bg-white transition-colors disabled:opacity-50"
          >
            {(isCreating || isUploading) ? <Loader2 size={16} className="animate-spin" /> : null}
            {isUploading ? "Uploading..." : isCreating ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
