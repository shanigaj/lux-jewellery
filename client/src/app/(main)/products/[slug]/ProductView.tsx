"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductConfigurator } from "@/components/product/ProductConfigurator";
import { DiamondSpecs } from "@/components/product/DiamondSpecs";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { RecentlyViewed } from "@/components/product/RecentlyViewed";
import { addRecentlyViewed } from "@/lib/recently-viewed";
import { Rating } from "@/components/shared/Rating";
import { WhatsAppInquiryButton } from "@/components/shared/WhatsAppInquiryButton";
import { EmailInquiryButton } from "@/components/shared/EmailInquiryButton";
import { NotifyMeButton } from "@/components/shared/NotifyMeButton";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { GlobalLoader } from "@/components/shared/GlobalLoader";
import { useGetProductByIdQuery, useGetProductsQuery } from "@/store/api/productApi";
import { Heart, Truck, ShieldCheck, ArrowRightLeft } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { toggleWishlist } from "@/store/slices/productSlice";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export function ProductView({ slug }: { slug: string }) {
  const { data: productData, isLoading, isError } = useGetProductByIdQuery(slug);
  const product = productData?.data;

  const categorySlug = product?.category?.slug;
  const { data: relatedData } = useGetProductsQuery(
    { category: categorySlug },
    { skip: !categorySlug }
  );

  const relatedProducts = relatedData?.data?.filter((x) => x._id !== product?._id) || [];
  const [selection, setSelection] = useState<{ metal: string; size: string }>({ metal: "", size: "" });

  // All hooks must run on every render — keep them above the early returns
  // below, otherwise the hook order changes once the product loads.
  const dispatch = useAppDispatch();
  const wishlist = useAppSelector((state) => state.product.wishlist);

  useEffect(() => {
    if (product) addRecentlyViewed(product);
  }, [product]);

  if (isError) {
    notFound();
  }

  if (isLoading || !product) {
    return <GlobalLoader />;
  }

  const isWishlisted = wishlist.some((p) => p._id === product._id);
  const inStock = !product.trackInventory || product.stockQuantity > 0;

  return (
    <div className="bg-background">
      <div className="container-luxury py-8">
        <Breadcrumb
          items={[
            { label: "Jewellery", href: "/products" },
            { label: product.category?.name || "Rings", href: `/products?category=${product.category?.slug}` },
            { label: product.name },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mt-8">
          {/* Left: Gallery */}
          <AnimatedSection animation="fadeRight">
            <ProductGallery images={product.images} videos={product.videos} video={product.video} />
          </AnimatedSection>

          {/* Right: Info */}
          <AnimatedSection animation="fadeLeft" delay={0.2}>
            <div className="flex flex-col">
              {/* Badges */}
              <div className="flex items-center gap-2 mb-4">
                {product.isNewArrival && <span className="badge-new text-[10px]">New Arrival</span>}
                {product.isBestseller && <span className="badge-gold text-[10px]">Bestseller</span>}
                {!inStock && (
                  <span className="text-[10px] uppercase tracking-wider font-medium px-2.5 py-1 border border-destructive text-destructive rounded-full">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Title & SKU */}
              <h1 className="font-heading text-3xl md:text-4xl mb-2">{product.name}</h1>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-6">SKU: {product.sku}</p>

              {/* Rating */}
              <div className="flex items-center mb-8 pb-8 border-b border-border">
                <Rating value={product.avgRating} count={product.reviewCount} showCount />
              </div>

              {/* Short Description */}
              <p className="text-muted-foreground font-light leading-relaxed mb-8">
                {product.shortDescription}
              </p>

              {/* Key specifications — mirrors the Product structured data. */}
              <dl className="mb-8 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                {product.metalType && (
                  <div className="flex justify-between border-b border-border/60 pb-2">
                    <dt className="text-muted-foreground">Metal</dt>
                    <dd className="font-medium capitalize">{product.metalType.replace(/_/g, " ")}</dd>
                  </div>
                )}
                {product.metalPurity && (
                  <div className="flex justify-between border-b border-border/60 pb-2">
                    <dt className="text-muted-foreground">Purity</dt>
                    <dd className="font-medium">{product.metalPurity}</dd>
                  </div>
                )}
                {typeof product.weight === "number" && product.weight > 0 && (
                  <div className="flex justify-between border-b border-border/60 pb-2">
                    <dt className="text-muted-foreground">Weight</dt>
                    <dd className="font-medium">{product.weight} g</dd>
                  </div>
                )}
                {(product as { diamondCarat?: number }).diamondCarat ? (
                  <div className="flex justify-between border-b border-border/60 pb-2">
                    <dt className="text-muted-foreground">Total Carat</dt>
                    <dd className="font-medium">{(product as { diamondCarat?: number }).diamondCarat} ct</dd>
                  </div>
                ) : null}
                {(product as { gemstone?: string }).gemstone && (
                  <div className="flex justify-between border-b border-border/60 pb-2">
                    <dt className="text-muted-foreground">Gemstone</dt>
                    <dd className="font-medium">{(product as { gemstone?: string }).gemstone}</dd>
                  </div>
                )}
                {(product as { dimensions?: string }).dimensions && (
                  <div className="flex justify-between border-b border-border/60 pb-2">
                    <dt className="text-muted-foreground">Dimensions</dt>
                    <dd className="font-medium">{(product as { dimensions?: string }).dimensions}</dd>
                  </div>
                )}
              </dl>

              {/* Configurator (Metal, Size) */}
              <ProductConfigurator
                basePrice={product.salePrice || product.basePrice}
                variants={product.variants}
                defaultMetal={product.metalType}
                onPriceChange={() => {}}
                onSelectionChange={setSelection}
                category={product.category?.slug}
              />

              {/* Action Buttons */}
              <div className="flex gap-4 mb-3">
                {inStock ? (
                  <WhatsAppInquiryButton
                    className="flex-1"
                    label="Enquire on WhatsApp"
                    inquiry={{
                      name: product.name,
                      sku: product.sku,
                      id: product._id,
                      category: product.category?.name,
                      metal: selection.metal || undefined,
                      size: selection.size || undefined,
                      specs: product.diamondSpecs
                        ? `${product.diamondSpecs.caratWeight}ct • ${product.diamondSpecs.shape} • ${product.diamondSpecs.color} • ${product.diamondSpecs.clarity}`
                        : undefined,
                      url: typeof window !== "undefined" ? window.location.href : undefined,
                    }}
                  />
                ) : (
                  <NotifyMeButton
                    className="flex-1"
                    inquiry={{
                      name: product.name,
                      sku: product.sku,
                      id: product._id,
                      metal: selection.metal || undefined,
                      size: selection.size || undefined,
                      url: typeof window !== "undefined" ? window.location.href : undefined,
                    }}
                  />
                )}
                <button
                  onClick={() => dispatch(toggleWishlist(product))}
                  className="w-14 h-14 shrink-0 flex items-center justify-center border border-border hover:border-gold transition-colors"
                >
                  <Heart size={20} className={cn("transition-colors", isWishlisted ? "fill-gold text-gold" : "text-foreground")} />
                </button>
              </div>

              {/* Email enquiry — a phone-free alternative to WhatsApp (esp. for international customers) */}
              <EmailInquiryButton
                className="w-full mb-10"
                inquiry={{
                  name: product.name,
                  sku: product.sku,
                  id: product._id,
                  category: product.category?.name,
                  metal: selection.metal || undefined,
                  size: selection.size || undefined,
                  url: typeof window !== "undefined" ? window.location.href : undefined,
                }}
              />

              {/* Trust Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-y border-border mb-10">
                <div className="flex flex-col items-center justify-center text-center gap-2 p-4 bg-muted/30">
                  <Truck size={24} className="text-gold" />
                  <span className="text-[10px] uppercase tracking-wider">Free Global Delivery</span>
                </div>
                <div className="flex flex-col items-center justify-center text-center gap-2 p-4 bg-muted/30">
                  <ShieldCheck size={24} className="text-gold" />
                  <span className="text-[10px] uppercase tracking-wider">Lifetime Warranty</span>
                </div>
                <div className="flex flex-col items-center justify-center text-center gap-2 p-4 bg-muted/30">
                  <ArrowRightLeft size={24} className="text-gold" />
                  <span className="text-[10px] uppercase tracking-wider">30-Day Returns</span>
                </div>
              </div>

              {/* Accordions (Details, Shipping) */}
              <Accordion className="w-full">
                <AccordionItem value="details" className="border-border">
                  <AccordionTrigger className="text-sm uppercase tracking-wider font-semibold">Product Details</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground font-light leading-relaxed">
                    {product.description}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="shipping" className="border-border">
                  <AccordionTrigger className="text-sm uppercase tracking-wider font-semibold">Delivery & Returns</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground font-light leading-relaxed">
                    Complimentary express shipping on all orders. Each piece is meticulously handcrafted to order; please allow 2-3 weeks for delivery. We accept returns within 30 days of receipt, provided the item is in its original condition with all tags and certification attached.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </AnimatedSection>
        </div>

        {/* Diamond Specs Section */}
        {product.diamondSpecs && (
          <div className="mt-20">
            <AnimatedSection animation="fadeUp">
              <DiamondSpecs specs={product.diamondSpecs} />
            </AnimatedSection>
          </div>
        )}

        {/* Related Products */}
        <div className="mt-20">
          <RelatedProducts products={relatedProducts} />
        </div>

        {/* Recently Viewed */}
        <RecentlyViewed excludeId={product._id} />
      </div>
    </div>
  );
}
