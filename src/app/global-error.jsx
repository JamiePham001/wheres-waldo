"use client";

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body>
        <main
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            padding: "48px 24px",
            textAlign: "center",
          }}
        >
          <section style={{ maxWidth: "560px", display: "grid", gap: "20px" }}>
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#666",
              }}
            >
              Error
            </p>
            <h1
              style={{
                margin: 0,
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                lineHeight: 1.05,
              }}
            >
              Something went wrong
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: "18px",
                lineHeight: 1.6,
                color: "#555",
              }}
            >
              The app hit an unexpected error while building this page.
            </p>
            <pre
              style={{
                margin: 0,
                padding: "16px",
                background: "#f5f5f5",
                borderRadius: "12px",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                textAlign: "left",
                color: "#b00020",
              }}
            >
              {error?.message || "Unknown error"}
            </pre>
            <div>
              <button
                type="button"
                onClick={() => reset()}
                style={{
                  minHeight: "44px",
                  padding: "0 20px",
                  borderRadius: "999px",
                  border: "none",
                  background: "#111",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Try again
              </button>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
