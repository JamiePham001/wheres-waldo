import Image from "next/image";
import style from "./style.module.css";

export default function CharIconContainer({ imageData, size = 30 }) {
  return (
    <div className="character-icons" style={{ display: "flex", gap: "1rem" }}>
      {imageData.map((char, index) => {
        const charName = Object.keys(char)[0];
        return (
          <div
            key={index}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div className={style.iconStack}>
              <Image
                src={`/assets/icons/tick.svg`}
                alt="tick icon"
                loading="eager"
                unoptimized
                width={20}
                height={20}
                className={`${style.tick} ${char.found ? style.tickVisible : ""}`}
              />
              <Image
                src={`/assets/icons/${charName}.png`}
                alt={`${charName} icon`}
                id={charName}
                loading="eager"
                unoptimized
                width={size}
                height={size}
                className={char.found ? style.found : ""}
              />
            </div>
            <div
              style={{ height: "1.2rem", paddingTop: "0.2rem", color: "green" }}
            >
              <div
                style={{ fontSize: "0.8rem" }}
                className={`${style.time} ${char.time ? style.timeVisible : ""}`}
              >{`${char.time}`}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
