/* Inspiration: https://dev.to/jh3y/circular-text-with-css-57jf */

import { CSSProperties } from "react";

import styles from "./TextRing.module.scss";

interface ITextRingProps {
  characterWidth?: number;
  fontSize?: number;
  rotateRingDeg?: number;
  text: string;
}

const TextRing = ({
  characterWidth = 1,
  fontSize = 1,
  rotateRingDeg = 0,
  text,
}: ITextRingProps) => {
  const characters = text.split("");
  const totalCharacters = characters.length;

  return (
    <span
      className={styles.textRing}
      style={
        {
          "--character-width": characterWidth,
          "--font-size": fontSize,
          "--total": totalCharacters,
          "--rotate-ring-deg": rotateRingDeg,
        } as CSSProperties
      }
    >
      {characters.map((char, index) => (
        <span
          className={styles.character}
          key={index}
          style={{ "--index": index } as CSSProperties}
        >
          {char}
        </span>
      ))}
    </span>
  );
};

export default TextRing;
