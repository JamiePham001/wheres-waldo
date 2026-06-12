import styles from "./style.module.css";
import Link from "next/link";

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href="/">
        <h1 style={{ display: "flex", gap: "10px" }}>
          <div style={{ color: "blue" }}>Where's</div>
          <div style={{ color: "red" }}>Waldo?</div>
          <div style={{ color: "white" }}>Online</div>
        </h1>
      </Link>

      <Link href="/map-creation">Create Map</Link>
    </header>
  );
}
