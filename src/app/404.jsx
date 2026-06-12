import Link from "next/link";

export default function Custom404() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "48px 24px",
      }}
    >
      <section
        style={{
          maxWidth: "560px",
          textAlign: "center",
          display: "grid",
          gap: "20px",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "14px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#666",
          }}
        >
          404
        </p>
        <h1 style={{ margin: 0, fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: 1.05 }}>
          Map not found
        </h1>
        <p style={{ margin: 0, fontSize: "18px", lineHeight: 1.6, color: "#555" }}>
          The page or map you were looking for could not be found.
        </p>
        <div>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "44px",
              padding: "0 20px",
              borderRadius: "999px",
              background: "#111",
              color: "#fff",
            }}
          >
            Return home
          </Link>
        </div>
      </section>
    </main>
  );
}