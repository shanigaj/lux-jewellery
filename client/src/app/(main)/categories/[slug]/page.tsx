import type { Metadata } from "next";
import { getCategoryMeta } from "@/config/categories";
import { siteConfig } from "@/config/site";
import { CategoryView } from "./CategoryView";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const meta = getCategoryMeta(slug);
  if (!meta) {
    return { title: "Not Found", robots: { index: false, follow: false } };
  }
  const url = `/categories/${slug}`;
  const title = meta.title;
  return {
    title,
    description: meta.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description: meta.description,
      url,
      type: "website",
    },
    twitter: {
      title: `${title} | ${siteConfig.name}`,
      description: meta.description,
    },
  };
}

export default async function CategoryPage({ params }: Params) {
  const { slug } = await params;
  const meta = getCategoryMeta(slug);

  // Structured data: a CollectionPage for the listing + a breadcrumb trail.
  const graph: object[] = [];
  if (meta) {
    const url = `${siteConfig.url}/categories/${slug}`;

    graph.push({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `${meta.title} | ${siteConfig.name}`,
      description: meta.description,
      url,
      isPartOf: { "@type": "WebSite", "@id": `${siteConfig.url}#website` },
    });

    // Home › [parent category] › category
    const crumbs: Array<{ name: string; url: string }> = [
      { name: "Home", url: siteConfig.url },
    ];
    if (meta.parent) {
      const parent = getCategoryMeta(meta.parent);
      if (parent) {
        crumbs.push({
          name: parent.title,
          url: `${siteConfig.url}/categories/${parent.slug}`,
        });
      }
    }
    crumbs.push({ name: meta.title, url });

    graph.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.name,
        item: c.url,
      })),
    });

    // FAQPage — only when this category has genuine, visible FAQs.
    if (meta.faqs && meta.faqs.length > 0) {
      graph.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: meta.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      });
    }
  }

  return (
    <>
      {graph.map((node, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(node).replace(/</g, "\\u003c"),
          }}
        />
      ))}
      <CategoryView slug={slug} />
    </>
  );
}
