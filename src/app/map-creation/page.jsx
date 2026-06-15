import styles from "./style.module.css";
import MapCreationForm from "./MapCreationForm";

// forceully evaluate map gate at run time so production can return a 404
export const dynamic = "force-dynamic";

export default function MapCreationPage() {
  return (
    <div className="page">
      <main className={styles.main}>
        <MapCreationForm />
      </main>
    </div>
  );
}
