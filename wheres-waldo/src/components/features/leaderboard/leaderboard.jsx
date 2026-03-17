import styles from "./style.module.css";

export default function Leaderboard({ mapData }) {
  return (
    <div
      className={styles.leaderboard}
      style={{
        width: "600px",
        padding: "20px",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2 style={{ paddingBottom: "1rem" }}>{mapData?.name} Leaderboard</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Rank</th>
            <th className={styles.th}>Player</th>
            <th className={styles.th}>Time</th>
            <th className={styles.th}>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={styles.td}>1</td>
            <td className={styles.td}>lol</td>
            <td className={styles.td}>3.0s</td>
            <td className={styles.td}>26/07/2026</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
