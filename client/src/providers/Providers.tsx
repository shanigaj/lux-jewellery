"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import { TooltipProvider } from "@/components/ui/tooltip";

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * The storefront is locked to the light "Blanc Vert" theme, defined on
 * :root in globals.css — so no theme provider / anti-flash script is needed.
 *
 * NOTE: we deliberately do NOT gate the tree behind redux-persist's
 * <PersistGate>. Gating renders nothing on the server until client-side
 * rehydration, which would keep all page content AND the JSON-LD structured
 * data out of the initial HTML (bad for SEO and a blank first paint).
 * Persistence still runs — `persistStore` is created in `@/store` — so the
 * cart/wishlist rehydrate in the background after mount, while the page and
 * its structured data are server-rendered normally.
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <TooltipProvider>{children}</TooltipProvider>
    </Provider>
  );
}
