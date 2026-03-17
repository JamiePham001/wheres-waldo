import Image from "next/image";
import style from "./style.module.css";

export default function CharIconContainer({ imageData, size = 30 }) {
  return (
    <div className="character-icons" style={{ display: "flex", gap: "1rem" }}>
      {imageData.map((char, index) => {
        const charName = Object.keys(char)[0];
        return (
          <Image
            src={`/assets/icons/${charName}.png`}
            alt={`${charName} icon`}
            id={charName}
            loading="eager"
            unoptimized
            width={size}
            height={size}
            className={char.found ? style.found : ""}
            key={index}
          />
        );
      })}
    </div>
  );
}
