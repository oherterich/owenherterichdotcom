"use client";

import { useEffect } from "react";
import styles from "./RotatingLogo.module.scss";
import TextRing from "@/components/TextRing/TextRing";
import { useLogoAnimation } from "./index.hooks";

const RotatingLogo = () => {
  const { containerRef, logoRef, onMouseMove } = useLogoAnimation();

  useEffect(() => {
    console.log("It's all CSS, if you're wondering :)");
  }, []);

  const handleThemeToggle = () => {
    const root = document.documentElement;
    const currentTheme = root.getAttribute("data-theme");
    root.setAttribute(
      "data-theme",
      currentTheme === "inverted" ? "" : "inverted",
    );
  };

  const handleMouseMove = (evt: React.MouseEvent) => {
    const lastMousePos = { x: evt.clientX, y: evt.clientY };

    onMouseMove(lastMousePos);
  };

  return (
    <div
      ref={containerRef}
      className={styles.container}
      onMouseMove={handleMouseMove}
    >
      <button ref={logoRef} className={styles.logo} onClick={handleThemeToggle}>
        <div className={styles.sphere} aria-hidden="true">
          <div className={styles.inner} />
          <div className={styles.text}>
            OH
            <span className={styles.exclamation}>!</span>
          </div>
        </div>
        <div className={styles.srInfo}>
          <h1>Owen Herterich</h1>
          <a tabIndex={-1} href="mailto:hi@owenherterich.com">
            hi@owenherterich.com
          </a>
        </div>
        <TextRing
          text="hi@owenherterich.com ★ hi@owenherterich.com ★ "
          fontSize={3.6}
          characterWidth={2.1}
          rotateRingDeg={104}
        />
      </button>
    </div>
  );
};

export default RotatingLogo;
