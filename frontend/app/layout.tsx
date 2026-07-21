"use client";
import "@/index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { VersionProvider } from "@/hooks/useVersion";
import { AuthProvider } from "@/lib/auth";
import { useState } from "react";

export default function RootLayout({ children }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <VersionProvider>
              <Toaster position="top-center" richColors />
              {children}
            </VersionProvider>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
