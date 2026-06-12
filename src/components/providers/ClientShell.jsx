"use client";

import AuthGate from "@/components/layout/authModal/AuthGate";

export default function ClientShell({ children }) {
  return (
    <>
      <AuthGate />
      {children}
    </>
  );
}
