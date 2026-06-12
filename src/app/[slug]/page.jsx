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

  const [aspectRatio, setAspectRatio] = useState(1);

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
    const mapId = Number(paramsId?.slug);

    console.log("Fetching map with ID:", mapId);

    if (!Number.isInteger(mapId) || mapId <= 0) {
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
        handleStart(isRunning, setIsRunning, intervalRef, setTime);
        scoreIdRef.current = payload.data.id;
      } catch (error) {
        console.error("Error creating score:", error);
      }
    };

    const fetchMap = async () => {
      try {
        const response = await fetch(`/api/image/${mapId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
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
        console.log("Parsed map data:", parsedMap);

        setMap(parsedMap.secure_url);

        const img = document.createElement("img");
        img.onload = () => {
          setAspectRatio(img.height / img.width);
        };
        img.src = parsedMap.secure_url;

        console.log("Payload data:", payload.data);
        const filteredCharacters = [
          { waldo: payload.data.waldo, found: false, time: null },
          { odlaw: payload.data.odlaw, found: false, time: null },
          { wizard: payload.data.wizard, found: false, time: null },
          { wenda: payload.data.wenda, found: false, time: null },
        ].filter((char) => Object.values(char)[0] !== "");
        setCharacters(filteredCharacters);

        if (user?.id) {
          await createScore(payload.data.id);
        }
      } catch (error) {
        console.error("Error fetching map data:", error);
      }
    };

    fetchMap();
  }, [isRunning, paramsId?.slug, user?.id]);

  // This effect runs whenever the user clicks on the image (i.e., when imageCoordinates changes).
  useEffect(() => {
    if (!imageCoordinates) {
      return;
    }

    // Update found flags immutably so React re-renders icon styles.
    setCharacters((prevCharacters) =>
      prevCharacters.map((character) => {
        const characterName = Object.keys(character)[0];

        // If character is already found or click doesn't correspond to this character, return unchanged.
        if (!characterName || character.found) {
          return character;
        }

        // checkClick returns true if the click coordinates match the character's coordinates in the database, false otherwise.
        const isClicked = checkClick(
          imageCoordinates,
          character[characterName],
        );

        // If click doesn't match this character, return unchanged. If it does match, update found to true and set the time for this character.
        if (!isClicked) {
          return character;
        }

        // Trigger confetti at click location when a character is found
        if (isClicked && lastClickRef.current) {
          makeConfetti(lastClickRef.current);
          console.log(`Time on click: ${time}`);
        }

        return {
          ...character,
          found: true,
          time: handleSplit(isRunning, time),
        };
      }),
    );
  }, [imageCoordinates, isRunning, time]);

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
          body: JSON.stringify({ scoreId }),
        });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        const payload = await response.json();
        const finalTime = Math.floor(
          new Date(payload.data.finishAt).getTime() / 1000 -
            new Date(payload.data.startedAt).getTime() / 1000,
        );
        clearTimer(intervalRef);
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
    };

    if (
      characters.length > 0 &&
      characters.every((char) => char.found) &&
      scoreIdRef.current
    ) {
      completeLevel();
    }
  }, [characters, paramsId.slug]);

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

        {map ? (
          <div
            className={styles.mapImageWrapper}
            style={{
              paddingTop: `${aspectRatio * 100}%`, // dynamic height
            }}
          >
            <Image
              src={map}
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
                objectFit: "contain",
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
