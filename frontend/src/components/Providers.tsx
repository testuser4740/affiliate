"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { VersionProvider } from "@/hooks/useVersion";
import { AuthProvider } from "@/lib/auth";
import { useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <VersionProvider>
          <Toaster position="top-center" richColors />
          {children}
        </VersionProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
