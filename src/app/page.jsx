"use client";

import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import ImageCard from "@/components/features/image-card/ImageCard";

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/image/fetchAll", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        setData(Array.isArray(payload?.data) ? payload.data : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    console.log("Fetched maps:", data);
    if (data.length > 0) {
      console.log(JSON.parse(data[0].data));
    }
  }, [data]);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {data.map((card) => {
          return (
            <ImageCard key={card.id} cardData={card} className={styles.card} />
          );
        })}
      </main>
    </div>
  );
}
