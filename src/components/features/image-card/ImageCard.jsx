import CharIconContainer from "../misc/CharIconContainer";
import style from "./style.module.css";
import Link from "next/link";
import Image from "next/image";

export default function ImageCard({ cardData }) {
  const parsedData = JSON.parse(cardData.data);
  const characters = [
    { waldo: cardData.waldo, found: false },
    { odlaw: cardData.odlaw, found: false },
    { wizard: cardData.wizard, found: false },
    { wenda: cardData.wenda, found: false },
  ].filter((char) => Object.values(char)[0] !== null);

  return (
    <Link className={style.imageCard} href={`/${cardData.id}`}>
      <div className={style.imageWrapper}>
        <Image
          src={parsedData.url}
          alt={cardData.name + " image"}
          className={style.image}
          fill
          sizes="(max-width: 768px) 100vw, 330px"
        />
      </div>
      <section
        className={style.section}
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <div className="title" style={{ fontSize: "20px", fontWeight: "500" }}>
          {cardData.name}
        </div>
        <CharIconContainer imageData={characters} />
      </section>
    </Link>
  );
}
