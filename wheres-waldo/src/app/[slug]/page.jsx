"use client";

import styles from "./style.module.css";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/features/auth/AuthProvider";

import Image from "next/image";
import handleImageClick from "@/lib/game/handleClick";
import CharIconContainer from "@/components/features/misc/CharIconContainer";
import Leaderboard from "@/components/features/leaderboard/leaderboard";
import checkClick from "@/lib/game/checkClick";
import makeConfetti from "@/lib/misc/confetti";
import {
  handleStart,
  handleStop,
  handleReset,
  handleSplit,
  clearTimer,
} from "@/lib/game/timer";
import SubmitScoreModal from "@/components/features/submit-score-modal/SubmitScoreModal";

export default function MapLevel() {
  const paramsId = useParams();
  const [mapData, setMapData] = useState(null);
  const [map, setMap] = useState(null);
  const [imageCoordinates, setImageCoordinates] = useState("");
  const [characters, setCharacters] = useState([]);
  const lastClickRef = useRef(null);

  // timer
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  // score submission modal
  const [isOpen, setIsOpen] = useState(false);
  const [scoreData, setScoreData] = useState(null);

  const scoreIdRef = useRef(null);

  const { user } = useAuth();

  useEffect(() => {
    if (!paramsId?.slug) {
      return;
    }

    const createScore = async (imageId) => {
      try {
        const response = await fetch("/api/game/start", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user?.id, imageId }),
        });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        const payload = await response.json();
        scoreIdRef.current = payload.data.id;
        console.log("Score created:", payload);
      } catch (error) {
        console.error("Error creating score:", error);
      }
    };

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
          { waldo: payload.data.waldo, found: false, time: null },
          { odlaw: payload.data.odlaw, found: false, time: null },
          { wizard: payload.data.wizard, found: false, time: null },
          { wenda: payload.data.wenda, found: false, time: null },
        ].filter((char) => Object.values(char)[0] !== null);
        setCharacters(filteredCharacters);

        if (user?.id) {
          await createScore(payload.data.id);
        }
      } catch (error) {
        console.error("Error fetching map data:", error);
      }
    };

    handleStart(isRunning, setIsRunning, intervalRef, setTime);
    fetchMap();

    return () => {
      clearTimer(intervalRef);
    };
  }, [paramsId.slug]);

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

        if (lastClickRef.current) {
          makeConfetti(lastClickRef.current);
          const split = handleSplit(isRunning, time);
          console.log(split);
        }

        console.log(`${characterName} found!`);
        return {
          ...character,
          found: true,
          time: handleSplit(isRunning, time),
        };
      }),
    );
  }, [imageCoordinates]);

  // check if all characters are found to trigger win condition. This runs after the character states update from a click.
  useEffect(() => {
    const getScoreRank = async (scoreId) => {
      try {
        const response = await fetch(`/api/game/rank/${scoreId}`, {
          method: "GET",
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to fetch rank");
        }

        const data = await response.json();
        return data.rank;
      } catch (error) {
        console.error(error);
        return null;
      }
    };

    const finishScore = async (scoreId) => {
      try {
        const response = await fetch("/api/game/end", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ gameId: scoreId }),
        });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        const payload = await response.json();
        const finalTime = Math.floor(
          new Date(payload.data.finishAt).getTime() / 1000 -
            new Date(payload.data.startedAt).getTime() / 1000,
        );
        return finalTime;
      } catch (error) {
        console.error("Error finishing score:", error);
        return null;
      }
    };

    const completeLevel = async () => {
      const scoreId = scoreIdRef.current;

      if (!scoreId) {
        return;
      }

      const finalTime = await finishScore(scoreId);

      if (finalTime === null) {
        return;
      }

      const scoreRank = await getScoreRank(scoreId);

      setScoreData({
        time: finalTime,
        rank: scoreRank,
        scoreId,
        mapId: paramsId.slug,
      });
      setIsOpen(true);
      console.log("Score finished:", finalTime);
    };

    if (
      characters.length > 0 &&
      characters.every((char) => char.found) &&
      scoreIdRef.current
    ) {
      console.log("All characters found! You win!");
      completeLevel();
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
              id="waldo-image"
              fill
              sizes="(max-width: 1200px) 100vw, 1200px"
              loading="eager"
              unoptimized
              onClick={(event) => {
                lastClickRef.current = {
                  clientX: event.clientX,
                  clientY: event.clientY,
                };
                handleImageClick(event, setImageCoordinates);
              }}
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
      <SubmitScoreModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        scoreData={scoreData}
      />
    </div>
  );
}
