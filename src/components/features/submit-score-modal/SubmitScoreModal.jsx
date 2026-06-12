"use client";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import styles from "./submitModal.module.css";
import { useAuth } from "@/components/features/auth/AuthProvider";
import { useRouter } from "next/navigation";

export default function SubmitScoreModal({
  isOpen,
  onClose,
  children,
  scoreData,
}) {
  const { user, login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { time, rank, scoreId, mapId } = scoreData || {};

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen && user) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, scoreId, user]);

  const findNextLevel = async () => {
    try {
      const response = await fetch("/api/image/fetchOrdered");
      if (!response.ok) {
        throw new Error("Failed to fetch levels");
      }
      const data = await response.json();
      const levelsArray = data.data;

      const currentLevelIndex = levelsArray.findIndex(
        (level) => level.id === Number(mapId),
      );

      if (currentLevelIndex === -1) {
        router.push("/");
        return;
      }

      const nextLevel = levelsArray[currentLevelIndex + 1]?.id;

      if (!nextLevel) {
        router.push("/");
        return;
      }

      router.push(`/${nextLevel}`);
    } catch (error) {
      console.error("Error fetching levels:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/game/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scoreId: scoreId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to submit score");
      }

      await findNextLevel();

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
          <form onSubmit={handleSubmit} className={styles.form}>
            <h2 style={{ color: "white" }}>
              Level completed in {time}s and you scored a rank of {rank}
            </h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className={styles.submitRow}>
              <button
                type="submit"
                disabled={loading}
                className={styles.submitBtn}
              >
                {loading ? "Creating..." : "Submit and Play Next Level"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}
