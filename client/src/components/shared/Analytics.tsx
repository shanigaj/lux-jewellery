import Script from "next/script";

/**
 * Google Analytics 4 (gtag.js), loaded via next/script.
 *
 * Renders NOTHING unless `NEXT_PUBLIC_GA_ID` is set (e.g. "G-XXXXXXXXXX"),
 * so it is a safe no-op in local dev and any environment without the ID.
 * Set the value in Vercel → Settings → Environment Variables, then redeploy
 * (NEXT_PUBLIC_* vars are inlined at build time).
 *
 * Note: the gtag scripts load from https://www.googletagmanager.com — that
 * origin is allow-listed in the production CSP (`next.config.ts`).
 */
export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) return null;

  return (
    <>
      <Script
        id="ga4-src"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script
        id="ga4-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', { anonymize_ip: true });
          `,
        }}
      />
    </>
  );
}
