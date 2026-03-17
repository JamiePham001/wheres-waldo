"use client";

import { useState } from "react";
import { useAuth } from "@/components/features/auth/AuthProvider";
import LoginModal from "@/components/features/auth/LoginModal";

export default function AuthGate() {
  const { user, loading } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  if (loading) return null;

  const shouldShow = !user && !dismissed;

  console.log("User:", user);

  return <LoginModal isOpen={shouldShow} onClose={() => setDismissed(true)} />;
}
