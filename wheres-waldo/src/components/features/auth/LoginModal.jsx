"use client";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import styles from "./loginmodal.module.css";
import { useAuth } from "@/components/features/auth/AuthProvider";

export default function LoginModal({ isOpen, onClose, children }) {
  const { user, login } = useAuth();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen && !user) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/image/user/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: username }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to create user");
      }

      const data = await response.json();
      login(data.data.token, data.data.user);
      setUsername("");
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {children || (
          <form onSubmit={handleSubmit}>
            <h2>Enter a username to continue</h2>
            <input
              type="text"
              value={username}
              placeholder="username"
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
            />
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Play"}
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}
