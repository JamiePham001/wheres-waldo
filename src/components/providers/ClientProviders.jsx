"use client";

import AuthProvider from "@/components/features/auth/AuthProvider";

export default function ClientProviders({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
