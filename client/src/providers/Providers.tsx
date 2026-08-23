"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GlobalLoader } from "@/components/shared/GlobalLoader";

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * The storefront is locked to the light "Blanc Vert" theme, defined on
 * :root in globals.css — so no theme provider / anti-flash script is needed.
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={<GlobalLoader />} persistor={persistor}>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </PersistGate>
    </Provider>
  );
}
