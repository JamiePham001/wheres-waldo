import styles from "./style.module.css";
import { useState, useEffect } from "react";

export default function Leaderboard({ mapData }) {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch(`/api/game/scoreboard/${mapData.id}`);
        const data = await response.json();
        if (data.success) {
          setScores(data.scores);
        }
      } catch (error) {}
    };
    fetchScores();
  }, [mapData.id]);

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
          {scores.map((score, index) => (
            <tr key={score.id}>
              <td className={styles.td}>{index + 1}</td>
              <td className={styles.td}>{score.name}</td>
              <td className={styles.td}>
                {(
                  (new Date(score.finishAt) - new Date(score.startedAt)) /
                  1000
                ).toFixed(1)}
                s
              </td>
              <td className={styles.td}>
                {new Date(score.startedAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
