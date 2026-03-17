"use client";

import styles from "./style.module.css";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

import Image from "next/image";
import handleImageClick from "@/lib/game/handleClick";
import CharIconContainer from "@/components/features/misc/CharIconContainer";
import Leaderboard from "@/components/features/leaderboard/leaderboard";
import checkClick from "@/lib/game/checkClick";

export default function MapLevel() {
  const paramsId = useParams();
  const [mapData, setMapData] = useState(null);
  const [map, setMap] = useState(null);
  const [imageCoordinates, setImageCoordinates] = useState("");
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    if (!paramsId?.slug) {
      return;
    }

    const fetchMap = async () => {
      try {
        const response = await fetch(`/api/image/${paramsId.slug}`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        if (!payload?.data) {
          return;
        }

        setMapData(payload.data);
        const parsedMap = JSON.parse(payload.data.data);
        setMap(parsedMap);
        const filteredCharacters = [
          { waldo: payload.data.waldo, found: false },
          { odlaw: payload.data.odlaw, found: false },
          { wizard: payload.data.wizard, found: false },
          { wenda: payload.data.wenda, found: false },
        ].filter((char) => Object.values(char)[0] !== null);
        setCharacters(filteredCharacters);
      } catch (error) {
        console.error("Error fetching map data:", error);
      }
    };

    fetchMap();
  }, [paramsId?.slug]);

  // This effect runs whenever the user clicks on the image (i.e., when imageCoordinates changes).
  useEffect(() => {
    if (!imageCoordinates) {
      return;
    }

    // Update found flags immutably so React re-renders icon styles.
    setCharacters((prevCharacters) =>
      prevCharacters.map((character) => {
        const characterName = Object.keys(character)[0];

        if (!characterName || character.found) {
          return character;
        }

        const isClicked = checkClick(
          imageCoordinates,
          character[characterName],
        );

        if (!isClicked) {
          return character;
        }

        console.log(`${characterName} found!`);
        return { ...character, found: true };
      }),
    );
  }, [imageCoordinates]);

  // check if all characters are found to trigger win condition. This runs after the character states update from a click.
  useEffect(() => {
    if (characters.every((char) => char.found)) {
      console.log("All characters found! You win!");
    }
  }, [characters]);

  return (
    <div className="page">
      <main className={styles.main}>
        {characters.length > 0 && (
          <div style={{ padding: "30px 0" }}>
            <CharIconContainer
              imageData={characters}
              size={50}
            ></CharIconContainer>
          </div>
        )}

        {map?.url ? (
          <div className={styles.mapImageWrapper}>
            <Image
              src={map.url}
              alt="Selected map preview"
              fill
              sizes="(max-width: 1200px) 100vw, 1200px"
              loading="eager"
              unoptimized
              onClick={(event) => handleImageClick(event, setImageCoordinates)}
              style={{
                objectFit: "cover",
                cursor: "crosshair",
              }}
            />
          </div>
        ) : (
          "... Loading map"
        )}

        <section
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "5rem",
          }}
        >
          {mapData && <Leaderboard mapData={mapData} />}
        </section>
      </main>
    </div>
  );
}
