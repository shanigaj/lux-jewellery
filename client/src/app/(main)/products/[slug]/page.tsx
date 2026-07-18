"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductConfigurator } from "@/components/product/ProductConfigurator";
import { DiamondSpecs } from "@/components/product/DiamondSpecs";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { Rating } from "@/components/shared/Rating";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { useGetProductByIdQuery, useGetProductsQuery } from "@/store/api/productApi";
import { Heart, Truck, ShieldCheck, ArrowRightLeft, ShoppingBag } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { toggleWishlist } from "@/store/slices/productSlice";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { IProduct } from "@/types/product.types";
import { cn } from "@/lib/utils";

export default function ProductDetailsPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const { data: productData, isLoading, isError } = useGetProductByIdQuery(slug);
  const product = productData?.data;

  const categorySlug = product?.category?.slug;
  const { data: relatedData } = useGetProductsQuery(
    { category: categorySlug },
    { skip: !categorySlug }
  );
  
  const relatedProducts = relatedData?.data?.filter((x) => x._id !== product?._id) || [];
  const [currentPrice, setCurrentPrice] = useState(0);

  useEffect(() => {
    if (product) {
      setCurrentPrice(product.salePrice || product.basePrice);
    }
  }, [product]);

  if (isError) {
    notFound();
  }

  if (isLoading || !product) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const dispatch = useAppDispatch();
  const wishlist = useAppSelector((state) => state.product.wishlist);
  const isWishlisted = wishlist.some((p) => p._id === product._id);

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
            <ProductGallery images={product.images} video={product.video} />
          </AnimatedSection>

          {/* Right: Info */}
          <AnimatedSection animation="fadeLeft" delay={0.2}>
            <div className="flex flex-col">
              {/* Badges */}
              <div className="flex items-center gap-2 mb-4">
                {product.isNewArrival && <span className="badge-new text-[10px]">New Arrival</span>}
                {product.isBestseller && <span className="badge-gold text-[10px]">Bestseller</span>}
              </div>

              {/* Title & SKU */}
              <h1 className="font-heading text-3xl md:text-4xl mb-2">{product.name}</h1>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-6">SKU: {product.sku}</p>

              {/* Price & Rating */}
              <div className="flex items-center justify-between mb-8 pb-8 border-b border-border">
                <PriceDisplay basePrice={currentPrice} salePrice={product.salePrice ? currentPrice : undefined} size="lg" />
                <Rating value={product.avgRating} count={product.reviewCount} showCount />
              </div>

              {/* Short Description */}
              <p className="text-muted-foreground font-light leading-relaxed mb-8">
                {product.shortDescription}
              </p>

              {/* Configurator (Metal, Size) */}
              <ProductConfigurator 
                basePrice={product.salePrice || product.basePrice}
                variants={product.variants}
                defaultMetal={product.metalType}
                onPriceChange={setCurrentPrice}
              />

              {/* Action Buttons */}
              <div className="flex gap-4 mb-10">
                <button className="flex-1 bg-onyx dark:bg-gold text-white dark:text-onyx py-4 px-8 flex items-center justify-center gap-2 text-sm font-medium uppercase tracking-wider hover:bg-gold dark:hover:bg-white hover:text-onyx transition-colors">
                  <ShoppingBag size={18} />
                  Add to Cart
                </button>
                <button 
                  onClick={() => dispatch(toggleWishlist(product))}
                  className="w-14 h-14 shrink-0 flex items-center justify-center border border-border hover:border-gold transition-colors"
                >
                  <Heart size={20} className={cn("transition-colors", isWishlisted ? "fill-gold text-gold" : "text-foreground")} />
                </button>
              </div>

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
      </div>
    </div>
  );
}
