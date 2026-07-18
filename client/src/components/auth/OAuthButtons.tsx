"use client";

import { useState } from "react";
import { toast } from "sonner";

export function OAuthButtons() {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleOAuth = (provider: "google" | "apple") => {
    setIsLoading(provider);
    
    // Simulate OAuth redirect
    setTimeout(() => {
      toast.info(`Redirecting to ${provider} authentication...`);
      setIsLoading(null);
    }, 1000);
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => handleOAuth("google")}
        disabled={!!isLoading}
        className="w-full flex items-center justify-center gap-3 py-3 border border-border hover:border-gold hover:bg-muted/50 transition-colors rounded-sm text-sm"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
          <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
            <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
            <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
            <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
            <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
          </g>
        </svg>
        {isLoading === "google" ? "Connecting..." : "Continue with Google"}
      </button>

      <button
        type="button"
        onClick={() => handleOAuth("apple")}
        disabled={!!isLoading}
        className="w-full flex items-center justify-center gap-3 py-3 border border-border hover:border-gold hover:bg-muted/50 transition-colors rounded-sm text-sm"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg" className="fill-current">
          <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM15.5398 16.1418C14.7505 17.2625 13.9102 18.3739 12.6377 18.4049C11.3653 18.4358 10.9701 17.6521 9.47962 17.6521C7.98918 17.6521 7.54228 18.3739 6.3217 18.4358C5.07005 18.4976 4.10301 17.211 3.29851 16.0371C1.65773 13.6338 0.407986 9.54483 2.08051 6.74108C2.91572 5.34444 4.35414 4.45494 5.9287 4.424C7.15967 4.39305 8.32832 5.23447 9.08375 5.23447C9.83918 5.23447 11.2655 4.22804 12.7214 4.38273C13.313 4.40336 14.9749 4.61994 16.0465 6.18765C15.9554 6.24953 13.5674 7.64192 13.6083 10.4576C13.6492 13.82 16.634 14.9648 16.6644 14.9751C16.634 15.068 16.1772 16.6265 15.5398 16.1418ZM11.1121 3.1966C11.7584 2.41285 12.193 1.34026 12.0735 0.26767C11.1611 0.308922 10.024 0.886477 9.35702 1.66014C8.76106 2.34088 8.24436 3.44439 8.38446 4.49635C9.40698 4.57886 10.4566 3.98064 11.1121 3.1966Z" />
        </svg>
        {isLoading === "apple" ? "Connecting..." : "Continue with Apple"}
      </button>
    </div>
  );
}
